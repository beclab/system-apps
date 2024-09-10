import { getTimeRange } from '@packages/ui/src/containers/PodsList/config';
import { getMetrics, getNamespaces } from '@packages/ui/src/network';
import { get, unionBy, orderBy, last, toLower } from 'lodash';
import {
	fillEmptyMetrics,
	getResult
} from '@packages/ui/src/containers/Monitoring/config';

import {
	getAreaChartOps,
	getSuitableUnit,
	getValueByUnit
} from 'src/utils/monitoring';
import { t } from 'boot/i18n';
const SYSTEM_FRONTEND_DEPLOYMENT = 'system-frontend-deployment';

const MetricTypes = {
	cpu_usage: 'pod_cpu_usage',
	memory_usage: 'pod_memory_usage_wo_cache',
	net_transmitted: 'pod_net_bytes_transmitted',
	net_received: 'pod_net_bytes_received'
};
const NamespaceMetricTypes = {
	cpu_usage: 'namespace_cpu_usage',
	memory_usage: 'namespace_memory_usage_wo_cache',
	net_transmitted: 'namespace_net_bytes_transmitted',
	net_received: 'namespace_net_bytes_received'
};

export const loadingApps = new Array(19).fill({});

export const loadingData: any = {
	cpu_usage: loadingApps,
	memory_usage: loadingApps,
	net_transmitted: loadingApps,
	net_received: loadingApps
};

export const fetchWorkloadsMetrics = async (apps, namespace, sort = 'desc') => {
	const metricsPods = Object.values(MetricTypes);
	const metricsNamespace = Object.values(NamespaceMetricTypes);

	const systemApps = apps.filter((item) => item.isSystem);
	const customApps = apps.filter((item) => !item.isSystem);

	const timeParams = {
		step: '3600s',
		times: 24
	};

	const timeRange = getTimeRange(timeParams);

	const resources_filter_system = systemApps
		.map((item, index) => {
			if (index !== systemApps.length - 1) {
				return `${item.deployment}.*|`;
			} else {
				return `${item.deployment}.*`;
			}
		})
		.join('');

	const resources_filter_custom = customApps
		.map((item) => item.namespace)
		.join('|');
	const param = {
		cluster: 'default',
		metrics_filter: `${metricsPods.join('|')}$`,
		resources_filter: `${resources_filter_system}$`,
		sort_type: 'desc',
		...timeRange,
		...timeParams
	};

	const namespaceParams = {
		metrics_filter: `${metricsNamespace.join('|')}$`,
		resources_filter: `${resources_filter_custom}`,
		sort_type: 'desc',
		...timeRange,
		...timeParams
	};
	const res = await getMetrics(namespace, param);
	const namespaceRes = await getNamespaces(namespaceParams);

	const podResult = getResult(res.data.results);
	const podData = fillEmptyMetrics(param, podResult);

	const namespaceResult = getResult(namespaceRes.data.results);
	const namespaceData = fillEmptyMetrics(namespaceParams, namespaceResult);

	return Promise.resolve(formatResult(podData, namespaceData, apps, sort));
};

const getLastMonitoringData = (data: any) => {
	return parseFloat(get(last(get(data, 'values')), '[1]') || '0');
};

function chartConfigCpu(data: any) {
	return {
		type: 'cpu',
		title: t('CPU_USAGE'),
		unitType: 'cpu',
		legend: [t('CPU')],
		data: [data]
	};
}

function chartConfigMemory(data: any) {
	return {
		type: 'memory',
		title: t('MEMORY_USAGE'),
		unitType: 'memory',
		legend: [t('MEMORY')],
		data: [data]
	};
}

function chartConfigTraffic(data: any) {
	return {
		type: 'bandwidth',
		title: t('OUTBOUND_TRAFFIC'),
		unitType: 'bandwidth',
		legend: [t('OUTBOUND')],
		data: [data]
	};
}

const getTabOptions = (data: any, apps: any[]) => {
	const result = {
		cpu_usage: get(data, `${MetricTypes.cpu_usage}.data.result`, []).map(
			(item: any) => ({
				isSystem: true,
				ownerKind: item.metric.owner_kind,
				name: item.metric.pod.split('-').slice(0, -2).join('-'),
				value: getLastMonitoringData(item),
				chartData: getAreaChartOps(chartConfigCpu(item))
			})
		),
		memory_usage: get(data, `${MetricTypes.memory_usage}.data.result`, []).map(
			(item: any) => ({
				isSystem: true,
				ownerKind: item.metric.owner_kind,
				name: item.metric.pod.split('-').slice(0, -2).join('-'),
				value: getLastMonitoringData(item),
				chartData: getAreaChartOps(chartConfigMemory(item))
			})
		),
		net_transmitted: get(
			data,
			`${MetricTypes.net_transmitted}.data.result`,
			[]
		).map((item: any) => ({
			isSystem: true,
			ownerKind: item.metric.owner_kind,
			name: item.metric.pod.split('-').slice(0, -2).join('-'),
			value: getLastMonitoringData(item),
			chartData: getAreaChartOps(chartConfigTraffic(item))
		})),
		net_received: get(data, `${MetricTypes.net_received}.data.result`, []).map(
			(item: any) => ({
				isSystem: true,
				ownerKind: item.metric.owner_kind,
				name: item.metric.pod.split('-').slice(0, -2).join('-'),
				value: getLastMonitoringData(item),

				chartData: getAreaChartOps(chartConfigTraffic(item))
			})
		)
	};
	for (const key in result) {
		const systemFrontend = result[key].find(
			(item) => item.name === SYSTEM_FRONTEND_DEPLOYMENT
		);
		const systemFrontendApps = apps
			.filter((app) => app.deployment === SYSTEM_FRONTEND_DEPLOYMENT)
			.map((app) => ({ ...systemFrontend, name: app.name }));

		result[key] = result[key].concat(systemFrontendApps);
	}

	return result;
};

const getTabOptions2 = (data: any) => {
	const result = {
		cpu_usage: get(
			data,
			`${NamespaceMetricTypes.cpu_usage}.data.result`,
			[]
		).map((item: any) => ({
			name: item.metric.namespace,
			value: getLastMonitoringData(item),
			chartData: getAreaChartOps(chartConfigCpu(item))
		})),
		memory_usage: get(
			data,
			`${NamespaceMetricTypes.memory_usage}.data.result`,
			[]
		).map((item: any) => ({
			name: item.metric.namespace,
			value: getLastMonitoringData(item),
			chartData: getAreaChartOps(chartConfigMemory(item))
		})),
		net_transmitted: get(
			data,
			`${NamespaceMetricTypes.net_transmitted}.data.result`,
			[]
		).map((item: any) => ({
			name: item.metric.namespace,
			value: getLastMonitoringData(item),
			chartData: getAreaChartOps(chartConfigMemory(item))
		})),
		net_received: get(
			data,
			`${NamespaceMetricTypes.net_received}.data.result`,
			[]
		).map((item: any) => ({
			name: item.metric.namespace,
			value: getLastMonitoringData(item),
			chartData: getAreaChartOps(chartConfigMemory(item))
		}))
	};

	return result;
};

const formatResult = (res: any, namespaceRes: any, apps, sort) => {
	const data1 = getTabOptions(res, apps);
	console.log('data1', data1);
	const data2 = getTabOptions2(namespaceRes);
	const cpu_usage_total = data1.cpu_usage
		.concat(data2.cpu_usage)
		.map((item: any) => {
			const app = apps.find((app) =>
				app.isSystem
					? item.isSystem &&
					  (app.deployment === item.name || app.name === item.name)
					: app.namespace === item.name
			);
			if (app) {
				const unit = getSuitableUnit(item.value, 'cpu');
				const used = getValueByUnit(item.value, unit);
				return {
					unit,
					used,
					...item,
					...app
				};
			}
			return false;
		})
		.filter((item: any) => item);
	const cpu_usage = unionBy(
		orderBy(cpu_usage_total, ['value', 'title'], [sort, 'asc']),
		'title'
	);

	const net_transmitted_total = data1.net_transmitted
		.concat(data2.net_transmitted)
		.map((item: any) => {
			const app = apps.find((app) =>
				app.isSystem
					? item.isSystem &&
					  (app.deployment === item.name || app.name === item.name)
					: app.namespace === item.name
			);

			if (app) {
				const unit = getSuitableUnit(item.value, 'bandwidth');
				const used = getValueByUnit(item.value, unit);
				return {
					unit,
					used,
					...item,
					...app
				};
			}
			return false;
		})
		.filter((item: any) => item);
	const net_transmitted = unionBy(
		orderBy(net_transmitted_total, ['value', 'title'], [sort, 'asc']),
		'title'
	);

	const memory_usage_total = data1.memory_usage
		.concat(data2.memory_usage)
		.map((item: any) => {
			const app = apps.find((app) =>
				app.isSystem
					? item.isSystem &&
					  (app.deployment === item.name || app.name === item.name)
					: app.namespace === item.name
			);
			if (app) {
				const unit = getSuitableUnit(item.value, 'memory');
				const used = getValueByUnit(item.value, unit);
				return {
					unit,
					used,
					...item,
					...app
				};
			}
			return false;
		})
		.filter((item: any) => item);
	const memory_usage = unionBy(
		orderBy(memory_usage_total, ['value', 'title'], [sort, 'asc']),
		'title'
	);

	const net_received_total = data1.net_received
		.concat(data2.net_received)
		.map((item: any) => {
			const app = apps.find((app) =>
				app.isSystem
					? item.isSystem &&
					  (app.deployment === item.name || app.name === item.name)
					: app.namespace === item.name
			);
			if (app) {
				const unit = getSuitableUnit(item.value, 'bandwidth');
				const used = getValueByUnit(item.value, unit);
				return {
					unit,
					used,
					...item,
					...app
				};
			}
			return false;
		})
		.filter((item: any) => item);
	const net_received = unionBy(
		orderBy(net_received_total, ['value', 'title'], [sort, 'asc']),
		'title'
	);
	console.log('net_received_total', net_received_total);
	return {
		cpu_usage: cpu_usage,
		memory_usage: memory_usage,
		net_transmitted: net_transmitted,
		net_received: net_received
	};
};
