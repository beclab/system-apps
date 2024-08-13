import { RouteRecordRaw } from 'vue-router';
import { componentName } from './const';

export const podRoute = (pre: string) => ({
	path: `${pre}/pods/:node?/:name?`,
	component: () => import('src/pages/NamespacePods/IndexPage.vue'),
	children: [
		{
			path: `${pre}/pods/overview/:node/:namespace/:name/:createTime?`,
			component: () => import('src/pages/Pods/Overview2.vue')
		},
		{
			path: `${pre}/pods/metadata/:node/:namespace/:name`,
			component: () => import('src/pages/Pods/Metadata.vue')
		},
		{
			path: `${pre}/pods/containers/overview/:node/:namespace/:name/:container?`,
			component: () => import('src/pages/Containers/Overview.vue')
		},
		{
			path: `${pre}/pods/environments/:node/:namespace/:name`,
			component: () => import('src/pages/Pods/Environments.vue')
		},
		{
			path: `${pre}/pods/events/:node/:namespace/:name`,
			component: () => import('src/pages/Pods/Events.vue')
		}
	]
});

const namespaceRoute = {
	path: '/namespace',
	component: () => import('src/pages/Namespace/IndexPage.vue'),
	children: [
		{
			path: '/applications/:namespace/pods',
			name: 'podsList',
			component: () => import('src/pages/Applications/PodList.vue'),
			children: [
				{
					path: '/applications/pods/overview/:node/:namespace/:name/:createTime',
					component: () => import('src/pages/Applications/ContainerList.vue')
				}
			]
		}
	]
};

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		redirect: '/application-spaces',
		children: [
			{ ...namespaceRoute },
			{
				path: '/storages',
				component: () => import('src/pages/Storages/IndexPage.vue')
			},
			{
				path: '/jobs',
				component: () => import('src/pages/Jobs/IndexPage.vue'),
				children: [
					...podRoute('/jobs').children,
					{
						path: '/jobs/job/:namespace/:jobName/:jobUid',
						component: () => import('src/pages/Jobs/JobsDetails.vue'),
						children: [
							{
								path: '/job-inner/:jobName/:jobUid/pods/overview/:node/:namespace/:name/:createTime?',
								component: () => import('src/pages/Jobs/Pods.vue')
							}
						]
					},
					{
						path: '/jobs/cronjob/:namespace/:name/:jobUid',
						component: () => import('src/pages/Jobs/CronJobsDetails.vue'),
						meta: {
							module: 'cronjobs'
						}
					},
					{
						path: '/jobs/workloads/:kind/:namespace/:name/container/:container',
						component: () => import('src/pages/Containers/Overview.vue')
					}
				]
			},
			{
				path: '/nodes',
				component: () => import('src/pages/Nodes/IndexPage.vue'),
				children: [
					...podRoute('/nodes').children,
					{
						path: '/nodes/detail/:node',
						component: () => import('src/pages/Nodes/NodeDetail.vue')
					}
				]
			},
			{
				path: '/root',
				component: () => import('src/pages/Pods/IndexPage.vue'),
				children: [
					{
						path: '/root/pods/overview/:node/:namespace/:name/:createTime?',
						component: () => import('src/pages/Pods/Overview3.vue')
					}
				]
			},
			{
				path: '/application-spaces',
				component: () => import('src/pages/ApplicationSpaces/IndexPage.vue'),
				children: [
					{
						path: 'workloads/:namespace',
						name: 'Workloads',
						component: () =>
							import('src/pages/ApplicationSpaces/Workloads/Workloads.vue'),
						meta: {
							index: 0
						},
						children: [
							{
								path: '/application-spaces/workloads/:kind/:namespace/:pods_name/:pods_uid/:node/:name/:uid/:createTime/pods_overview',
								component: () => import('src/pages/Pods/Overview2.vue'),
								name: componentName.WORKLOAD_PODS
							},
							{
								path: '/application-spaces/workloads/:kind/:namespace/:pods_name/:pods_uid/:createTime?',
								component: () =>
									import('src/pages/ApplicationSpaces/Workloads/Detail.vue'),
								name: 'workload-detail',
								meta: {
									index: 1
								}
							},
							{
								path: '/application-spaces/workloads/:kind/:namespace/:name/container/:container',
								component: () => import('src/pages/Containers/Overview.vue')
							},
							{
								path: '/application-spaces/:kind/:namespace/:name/:pods_uid/services_overview',
								name: componentName.SERVICES,
								component: () =>
									import('src/pages/ApplicationSpaces/Services/Detail.vue'),
								children: [
									{
										path: '/application-spaces/:kind/:namespace/:pods_name/:pods_uid/:node/:name/:uid/:createTime/services_pods_overview',
										component: () => import('src/pages/Pods/Overview4.vue'),
										name: componentName.SERVICES_PODS
									},
									{
										path: '/application-spaces/:kind/:namespace/:pods_name/:pods_uid/:createTime/services_pods_overview2',
										name: componentName.SERVICES_PODS2,
										component: () =>
											import(
												'src/pages/ApplicationSpaces/Services/PodsData.vue'
											)
									}
								]
							},
							{
								path: '/application-spaces/configurations/:kind/:namespace/:name/:pods_uid/secrets_overview',
								name: componentName.SECRETS,
								component: () =>
									import(
										'src/pages/ApplicationSpaces/Configurations/Secrets.vue'
									)
							},
							{
								path: '/application-spaces/configurations/:kind/:namespace/:name/:pods_uid/configmaps_overview',
								name: componentName.CONFIGMAPS,
								component: () =>
									import(
										'src/pages/ApplicationSpaces/Configurations/Configmaps.vue'
									)
							},
							{
								path: '/application-spaces/configurations/:kind/:namespace/:name/:pods_uid/service-accounts_overview',
								name: componentName.SERVICE_ACCOUNTS,
								component: () =>
									import(
										'src/pages/ApplicationSpaces/Configurations/ServiceAccounts.vue'
									)
							}
						]
					}
				]
			},
			{
				path: 'network-policies',
				component: () => import('src/pages/NetworkPolicies/IndexPage.vue'),
				children: [
					{
						path: 'detail/:namespace/:name/:uid',
						component: () =>
							import('src/pages/NetworkPolicies/PoliciesDetail.vue')
					}
				]
			},
			{
				path: 'customresources',
				component: () => import('src/pages/Customresources/IndexPage.vue'),
				children: [
					{
						path: 'detail/:group/:version/:module/:uid',
						component: () => import('src/pages/Customresources/Detail.vue')
					}
				]
			},

			{
				path: 'site-middleware',
				component: () => import('src/pages/Middleware/IndexPage.vue'),
				children: [
					{
						path: '/site-middleware/db/:type',
						component: () => import('src/pages/Middleware/Overview.vue')
					}
				]
			}
		]
	},
	{
		path: '/container/logs/v2/:namespace/:name/:container',
		component: () => import('@packages/ui/src/containers/Logs.vue')
	},
	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue')
	}
];

export default routes;
