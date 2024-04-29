import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		redirect: '/nodes',
		children: [
			{
				path: 'nodes',
				component: () => import('src/pages/Nodes/IndexPage.vue'),
				children: [
					{
						path: 'detail/:namespace',
						component: () => import('src/pages/Nodes/Detail.vue')
					},
					{
						path: 'metadata/:namespace',
						component: () => import('src/pages/Nodes/Metadata.vue')
					},
					{
						path: 'pods/',
						component: () => import('src/pages/Pods/IndexPage.vue'),
						children: [
							{
								path: '/node/pods/overview/:node/:namespace/:name',
								component: () => import('src/pages/Pods/Overview.vue')
							},
							{
								path: '/node/pods/metadata/:node/:namespace/:name',
								component: () => import('src/pages/Pods/Metadata.vue')
							},
							{
								path: '/node/pods/containers/:node/:namespace/:name',
								component: () => import('src/pages/Containers/IndexPage.vue'),
								children: [
									{
										path: '/node/pods/containers/overview/:node/:namespace/:name/:container?',
										component: () => import('src/pages/Containers/Overview.vue')
									},
									{
										path: '/node/pods/containers/environments/:node/:namespace/:name/:container?',
										component: () =>
											import('src/pages/Containers/Environments.vue')
									},
									{
										path: '/node/pods/containers/logs/:node/:namespace/:name/:container?',
										component: () => import('src/pages/Containers/Logs.vue')
									}
								]
							},

							{
								path: '/node/pods/environments/:node/:namespace/:name',
								component: () => import('src/pages/Pods/Environments.vue')
							},
							{
								path: '/node/pods/events/:node/:namespace/:name',
								component: () => import('src/pages/Pods/Events.vue')
							}
						]
					},
					{
						path: 'events/:node/:namespace',
						component: () => import('src/pages/Nodes/Events.vue')
					}
				]
			},
			// {
			//   path: 'nodes/:name',
			//   component: () => import('src/pages/Nodes/NodeDetail.vue'),
			// },
			{
				path: '/container/logs/v2/:namespace/:name/:container',
				component: () => import('@packages/ui/src/containers/Logs.vue')
			},
			{
				path: '/container/logs/:kind/:deployment/:container',
				component: () => import('@packages/ui/src/containers/Logs.vue')
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
