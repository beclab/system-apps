import { RouteRecordRaw } from 'vue-router';
import { ROUTE_NAME } from './const';

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
						path: '/resources/:type',
						component: () => import('src/pages/Overview2/ResourcePage.vue')
					},
					{
						path: '/overview/resources/:type',
						name: ROUTE_NAME.PHYSICAL_RESOURCE_DETAIL,
						component: () => import('src/pages/Overview2/ResourcePage.vue')
					},
					{
						path: '/overview/gpu/list',
						name: ROUTE_NAME.GPU_LIST,
						component: () => import('src/pages/Overview2/GPU/IndexPage.vue'),
						children: [
							{
								path: '/overview/gpu/:uuid/detail',
								name: ROUTE_NAME.GPUS_DETAILS,
								component: () =>
									import('src/pages/Overview2/GPU/GPUsDetails.vue')
							},
							{
								path: '/overview/task/:name/:pod_uid/detail',
								name: ROUTE_NAME.TASKS_DETAILS,
								component: () =>
									import('src/pages/Overview2/GPU/TasksDetails.vue')
							}
						]
					},
					{
						path: '/overview/network/detail',
						name: ROUTE_NAME.NETWORK_DETAIL,
						component: () => import('src/pages/Overview2/Network/IndexPage.vue')
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
