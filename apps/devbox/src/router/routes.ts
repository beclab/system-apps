import { ROUTE_NAME } from '@/common/router-name';
import { RouteRecordRaw } from 'vue-router';
import { componentName } from '@apps/admin_console/src/router/const';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		beforeEnter: (to, _from, next) => {
			if (to.fullPath == '/') {
				return next({ path: '/home' });
			}
			next();
		},
		children: [
			{ path: '/home', component: () => import('pages/HomePage.vue') },
			{
				path: '/create',
				component: () => import('pages/CreatePage.vue')
			},
			{
				path: '/containers',
				component: () => import('pages/ContainerPage.vue')
			},
			{
				path: '/app/workloads/:namespace/overview',
				name: ROUTE_NAME.WORKLOAD,
				component: () =>
					import(
						'@apps/admin_console/src/pages/ApplicationSpaces/Workloads/Workloads.vue'
					),
				children: [
					{
						path: '/app/workloads/:kind/:namespace/:pods_name/:pods_uid/:node/:name/:uid/:createTime/pods_overview',
						component: () =>
							import('@apps/admin_console/src/pages/Pods/Overview2.vue'),
						name: componentName.WORKLOAD_PODS
					},
					{
						path: '/app/workloads/:kind/:namespace/:pods_name/:pods_uid/:createTime?',
						component: () =>
							import(
								'@apps/admin_console/src/pages/ApplicationSpaces/Workloads/Detail.vue'
							),
						name: componentName.WORKLOAD_POD_TOP,
						meta: {
							index: 1
						}
					},
					{
						path: '/app/workloads/:kind/:namespace/:name/container/:container',
						component: () =>
							import('@apps/admin_console/src/pages/Containers/Overview.vue')
					},
					{
						path: '/app/:kind/:namespace/:name/:pods_uid/services_overview',
						name: componentName.SERVICES,
						component: () =>
							import(
								'@apps/admin_console/src/pages/ApplicationSpaces/Services/Detail.vue'
							),
						children: [
							{
								path: '/app/:kind/:namespace/:pods_name/:pods_uid/:node/:name/:uid/:createTime/services_pods_overview',
								component: () =>
									import('@apps/admin_console/src/pages/Pods/Overview4.vue'),
								name: componentName.SERVICES_PODS
							},
							{
								path: '/app/:kind/:namespace/:pods_name/:pods_uid/:createTime/services_pods_overview2',
								name: componentName.SERVICES_PODS2,
								component: () =>
									import(
										'@apps/admin_console/src/pages/ApplicationSpaces/Services/PodsData.vue'
									)
							}
						]
					},
					{
						path: '/app/configurations/:kind/:namespace/:name/:pods_uid/secrets_overview',
						name: componentName.SECRETS,
						component: () =>
							import(
								'@apps/admin_console/src/pages/ApplicationSpaces/Configurations/Secrets.vue'
							)
					},
					{
						path: '/app/configurations/:kind/:namespace/:name/:pods_uid/configmaps_overview',
						name: componentName.CONFIGMAPS,
						component: () =>
							import(
								'@apps/admin_console/src/pages/ApplicationSpaces/Configurations/Configmaps.vue'
							)
					},
					{
						path: '/app/configurations/:kind/:namespace/:name/:pods_uid/service-accounts_overview',
						name: componentName.SERVICE_ACCOUNTS,
						component: () =>
							import(
								'@apps/admin_console/src/pages/ApplicationSpaces/Configurations/ServiceAccounts.vue'
							)
					}
				]
			},
			{
				path: '/app/:id/:path?',
				component: () => import('../pages/ApplicationPage.vue')
			}
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
];

export default routes;
