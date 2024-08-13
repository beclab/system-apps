const { isUndefined } = require('lodash');
const get = require('lodash/get');

const cache = {};
const ADMIN_ROLE = 'platform-admin';

const systemNamespaces = [
	'os-system',
	'kubesphere-monitoring-federated',
	'kubesphere-controls-system',
	'kubesphere-system',
	'kubesphere-monitoring-system',
	'kubekey-system',
	'default',
	'kube-system',
	'kube-public',
	'kube-node-lease',
	'gpu-system'
];

const resources_filter = (ctx, query) => {
	const user = getUserInfo(ctx);
	return {
		resources_filter: query.name
			? `.*(?:${user.username}).*?(?:${query.name}).*|.*(?:${query.name}).*?(?:${user.username}).*`
			: `.*${user.username}.*`
	};
};

const pod_filter = (ctx, query) => {
	return {
		limit: -1
	};
};

const namespaceList = [
	{
		pathname: '/kapis/resources.kubesphere.io/v1alpha3/namespaces',
		modify: true,
		resFormat: podListFormat
	},
	{
		pathname: '/kapis/resources.kubesphere.io/v1alpha3/pods',
		modify: true,
		searchParamsFn: pod_filter,
		resFormat: namespaceListFormat
	},
	{
		pathname: '/kapis/monitoring.kubesphere.io/v1alpha3/namespaces',
		modify: false,
		searchParamsFn: resources_filter
	},
	{
		pathname: '/kapis/resources.kubesphere.io/v1alpha3/networkpolicies',
		modify: true,
		resFormat: namespaceListFormat
	},
	{
		pathname: '/kapis/resources.kubesphere.io/v1alpha3/persistentvolumeclaims',
		modify: true,
		resFormat: namespaceListFormat
	},
	{
		pathname: '/kapis/resources.kubesphere.io/v1alpha3/cronjobs',
		modify: true,
		resFormat: namespaceListFormat
	},
	{
		pathname: '/kapis/resources.kubesphere.io/v1alpha3/jobs',
		modify: true,
		resFormat: namespaceListFormat
	},
];

function podListFormat(ctx, data) {
	const user = getUserInfo(ctx);
	console.log('user', user);
	const newData = data.items.filter((item) => {
		const namespace = get(item, 'metadata.name');
		const userTarget = namespace
			.split('-')
			.find((item) => item === user.username);
		const systemTarget = systemNamespaces.find(
			(system_namespace) => namespace === system_namespace
		);
		return user.globalrole === ADMIN_ROLE
			? userTarget || systemTarget
			: userTarget;
	});
	return {
		...data,
		totalItems: newData.length,
		items: newData,
		total: data.totalItems
	};
}

function namespaceFormat(ctx, data) {
	const user = getUserInfo(ctx);
	console.log('user', user);
	const newData = data.items.filter((item) => {
		const namespace = get(item, 'metadata.name');
		const userTarget = namespace
			.split('-')
			.find((item) => item === user.username);
		const systemTarget = systemNamespaces.find(
			(system_namespace) => namespace === system_namespace
		);
		return user.globalrole === ADMIN_ROLE
			? true
			: userTarget;
	});
	return {
		...data,
		totalItems: newData.length,
		items: newData,
		total: data.totalItems
	};
}

function namespaceListFormat(ctx, data) {
	const user = getUserInfo(ctx);
	const newData = data.items.filter((item) => {
		const namespace = get(item, 'metadata.namespace');
		const userTarget = namespace.split('-').includes(user.username);
		const systemTarget = systemNamespaces.find(
			(system_namespace) => namespace === system_namespace
		);
		return user.globalrole === ADMIN_ROLE
			? userTarget || systemTarget
			: userTarget;
	});
	return {
		...data,
		totalItems: newData.length,
		items: newData,
		total: data.totalItems
	};
}

function checkUrl(pathname) {
	return namespaceList.find((item) => item.pathname === pathname);
}

const getUserInfo = (ctx) => {
	const key = ctx.headers['x-bfl-user'];
	if (cache[key]) {
		return cache[key];
	} else {
		return undefined;
	}
};

const setUserInfo = (ctx, data) => {
	const key = ctx.headers['x-bfl-user'];
	cache[key] = data;
};

const isAdmin = (ctx) => {
	return getUserInfo(ctx)?.globalrole === ADMIN_ROLE;
};

const canModify = (ctx, pathname) => {
	return !isAdmin(ctx) && !isUndefined(checkUrl(pathname)?.resFormat);
};

module.exports = {
	setUserInfo,
	getUserInfo,
	ADMIN_ROLE,
	namespaceList,
	systemNamespaces,
	checkUrl,
	isAdmin,
	canModify,
	namespaceFormat
};
