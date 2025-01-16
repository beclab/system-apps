import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		redirect: '/overview',
		children: [
			{
				path: '/overview',
				component: () => import('src/pages/Overview2/IndexPage.vue'),
				children: [
					{
						path: '/physical-resources/cluster',
						component: () => import('src/pages/PhysicalResource/IndexPage.vue')
					},
					{
						path: '/physical-resources/:node',
						component: () => import('src/pages/Nodes/NodeMonitoring.vue')
					}
				]
			},
			{
				path: 'nodes',
				component: () => import('src/pages/Nodes/IndexPage.vue')
			},
			{
				path: 'logs/:namespace/:name/:container',
				component: () => import('src/pages/Logs/LogDetail.vue')
			},
			{
				path: 'applications',
				component: () => import('src/pages/Applications2/IndexPage.vue'),
				children: [
					{
						path: '/applications/:namespace/pods',
						name: 'podsList',
						component: () => import('src/pages/Applications/PodList.vue'),
						children: [
							{
								path: '/applications/pods/overview/:node/:namespace/:name/:createTime',
								component: () =>
									import('src/pages/Applications/ContainerList.vue')
							}
						]
					}
				]
			},
			{
				path: '/other',
				component: () => import('src/pages/Other/IndexPage.vue')
			},
			{
				path: '/analytics',
				component: () => import('src/pages/Analytics/IndexPage.vue'),
				children: [
					{
						path: '/analytics/details/:websiteId',
						component: () => import('src/pages/Analytics/WebsiteDetails.vue')
					}
				]
			}
		]
	},
	{
		path: '/container/logs/v2/:namespace/:name/:container',
		component: () => import('@packages/ui/src/containers/Logs.vue')
	},
	{
		path: '/container/logs/:kind/:deployment/:container',
		component: () => import('@packages/ui/src/containers/Logs.vue')
	},
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
];

export default routes;
