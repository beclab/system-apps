/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

const {
	getCurrentUser,
	getK8sRuntime,
	getClusterRole,
	getGitOpsEngine,
	getMyApps,
	getAllMetric,
	getUserMetric,
	getClusterMetric,
	getUsers,
	getNamespaces
} = require('../services/session');
const {
	setUserInfo,
	getUserInfo,
	checkUrl,
	isAdmin,
	namespaceFormat
} = require('../cache/user.js');

const {
	getServerConfig,
	getManifest,
	getLocaleManifest,
	isValidReferer,
	safeBase64
} = require('../libs/utils');
const { find, cloneDeep } = require('lodash');

const { client: clientConfig } = getServerConfig();

const userDetail = async (ctx) => {
	const clusterRole = await getClusterRole(ctx);

	const [user, runtime, gitopsEngine] = await Promise.all([
		getCurrentUser(ctx, clusterRole, false),
		getK8sRuntime(ctx),
		getGitOpsEngine(ctx)

	]);

	const localeManifest = getLocaleManifest();

	const data = {
		localeManifest,
		user,
		runtime,
		clusterRole,
	};

	ctx.body = data;
};

const appList = async (ctx) => {
	const data = await getMyApps(ctx);
	ctx.body = data;
};

const monitoringDataFormat = (data, splitStr) => {
	return data.results.map((item) => ({
		...item,
		metric_name: item.metric_name.replace(splitStr, 'cluster_')
	}));
};

const monitoringMetric = async (ctx) => {
	const queryParams = ctx.query;
	let params = {
		...queryParams
		// start: 1704418852,
		// end: 1704448852,
		// step: '300s',
		// times: 100,
	};

	const type = ctx.params.type;
	let data = { results: [] };
	let list = [];

	let clusterSplitStr = 'cluster_';
	let userSplitStr = 'user_';

	let cluster_cpu_total_target = {};
	let cluster_memory_total_target = {};
	const user = getUserInfo(ctx);
	const checkAdmin = isAdmin(ctx) && user.username === type;
	console.log('checkAdmin', checkAdmin);
	if (type === 'cluster') {
		params.metrics_filter =
			'cluster_cpu_usage|cluster_cpu_total|cluster_cpu_utilisation|cluster_memory_usage_wo_cache|cluster_memory_total|cluster_memory_utilisation|cluster_disk_size_usage|cluster_disk_size_capacity|cluster_disk_size_utilisation|cluster_pod_running_count|cluster_pod_quota$';
		data = await getAllMetric(ctx, params);
		list = monitoringDataFormat(data, clusterSplitStr);
	} else {
		const clusterParams = {
			...params,
			metrics_filter:
				'cluster_cpu_total|cluster_memory_total|cluster_disk_size_capacity$'
		};
		params.metrics_filter =
			'user_cpu_usage|user_cpu_total|user_cpu_utilisation|user_memory_usage_wo_cache|user_memory_total|user_memory_utilisation|user_disk_size_usage|user_disk_size_capacity|user_disk_size_utilisation|user_pod_running_count|user_pod_count$';

		const isValues = queryParams.start && queryParams.end;
		let valueName = 'values';
		if (!isValues) {
			valueName = 'value';
		}
		const [clusterData, userData] = await Promise.all([
			getClusterMetric(ctx, clusterParams),
			getUserMetric(ctx, params)
		]);

		const clusterDataNew = monitoringDataFormat(clusterData, clusterSplitStr);
		list = monitoringDataFormat(userData, userSplitStr).map((item) => {
			let target = {};
			if (item.metric_name === 'cluster_cpu_total') {
				if (checkAdmin) {
					target = clusterDataNew.find(
						(child) => child.metric_name === 'cluster_cpu_total'
					);
					item.data.result[0][valueName] = target.data.result[0][valueName];
				}
				cluster_cpu_total_target = item.data.result[0][valueName];
			} else if (item.metric_name === 'cluster_memory_total') {
				if (checkAdmin) {
					target = clusterDataNew.find(
						(child) => child.metric_name === 'cluster_memory_total'
					);
					item.data.result[0][valueName] = target.data.result[0][valueName];
				}

				cluster_memory_total_target = item.data.result[0][valueName];
			}
			if (item.metric_name === 'cluster_pod_count') {
				item.metric_name = 'cluster_pod_quota';
			}
			return item;
		});

		const cluster_cpu_utilisation = cloneDeep(
			find(list, {
				metric_name: 'cluster_cpu_usage'
			})
		);

		const cluster_cpu_utilisation_value =
			cluster_cpu_utilisation.data.result[0][valueName];

		cluster_cpu_utilisation.data.result[0][valueName] = isValues
			? cluster_cpu_utilisation_value.map((item, index) => [
				item[0],
				item[1] / cluster_cpu_total_target[index][1]
			])
			: [
				cluster_cpu_utilisation_value[0],
				cluster_cpu_utilisation_value[1] / cluster_cpu_total_target[1]
			];

		const cluster_memory_utilisation = cloneDeep(
			find(list, {
				metric_name: 'cluster_memory_usage_wo_cache'
			})
		);
		const cluster_memory_utilisation_value =
			cluster_memory_utilisation.data.result[0][valueName];
		cluster_memory_utilisation.data.result[0][valueName] = isValues
			? cluster_memory_utilisation_value.map((item, index) => [
				item[0],
				item[1] / cluster_memory_total_target[index][1]
			])
			: [
				cluster_memory_utilisation_value[0],
				cluster_memory_utilisation_value[1] / cluster_memory_total_target[1]
			];

		list = list.concat([
			{ ...cluster_cpu_utilisation, metric_name: 'cluster_cpu_utilisation' },
			{
				...cluster_memory_utilisation,
				metric_name: 'cluster_memory_utilisation'
			}
		]);
	}

	ctx.body = { results: list };
};

function endsWith(str, name) {
	const regex = new RegExp(`-${name}$`);
	return regex.test(str);
}

const namespaceGroup = async (ctx) => {
	const namespaces = await getNamespaces(ctx);
	const users = await getUsers(ctx)

	const originalData = namespaceFormat(
		ctx.req,
		namespaces,
	);

	const SYSTEM = 'System'
	const usersData = users.items.map(item => ({ name: item.metadata.name, creation_timestamp: item.metadata.creationTimestamp }));

	let adminUser = usersData.pop();
	usersData.unshift(adminUser);

	const system = {
		name: SYSTEM,
	}
	const list = [...usersData, system]

	const result = list.map(item => {
		if (item.name === SYSTEM) {
			const data = originalData.items.filter(namespace => !usersData.some(str => endsWith(namespace.metadata.name, str.name)))
			return {
				title: item.name,
				data: data,
			}
		} else {
			const data = originalData.items.filter(namespace => endsWith(namespace.metadata.name, item.name))
			return {
				title: item.name,
				data: data,
			}
		}

	});
	const res = result.filter(item => item.data.length > 0)
	ctx.body = res;
}

const cacheUser = async (ctx, next) => {
	const target = checkUrl(ctx.path);
	const user = getUserInfo(ctx);
	console.log('header', ctx.headers['x-bfl-user']);
	if (!user) {
		const clusterRole = await getClusterRole(ctx);
		const [user] = await Promise.all([
			getCurrentUser(ctx, clusterRole)
		]);

		setUserInfo(ctx, user);
	}
	await next();
};

const renderIndex = async (ctx, params) => {
	const manifest = getManifest('main');
	const localeManifest = getLocaleManifest();

	await ctx.render('index', {
		manifest,
		isDev: global.MODE_DEV,
		title: clientConfig.title,
		hostname: ctx.hostname,
		globals: JSON.stringify({
			config: clientConfig,
			localeManifest,
			...params
		})
	});
};

module.exports = {
	userDetail,
	cacheUser,
	appList,
	monitoringMetric,
	namespaceGroup
};
