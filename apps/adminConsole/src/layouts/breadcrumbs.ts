import { ref } from 'vue';

export interface Breadcrumb {
	title: string;
	icon?: string;
	img?: string;
}
export const breadcrumbs = ref<Array<Breadcrumb>>([]);

export const updateBreadcrumbs = (data: Breadcrumb, init = false) => {
	if (init) {
		breadcrumbs.value = [];
	}
	breadcrumbs.value.push(data);
};

export const options = [
	{
		key: 'application-spaces',
		label: 'Browse',
		icon: 'sym_r_dvr',
		link: '/application-spaces'
	},
	{
		key: 'namespace',
		label: 'Namespace',
		icon: 'sym_r_markunread_mailbox',
		link: '/namespace'
	},
	{
		key: 'root',
		label: 'Pods',
		icon: 'sym_r_deployed_code',
		link: '/root'
	}
];

export const options2 = [
	// {
	// 	key: 'storages',
	// 	label: 'Storages',
	// 	icon: 'sym_r_hard_drive',
	// 	link: '/storages'
	// },
	{
		key: 'network-policies',
		label: 'Networks',
		icon: 'sym_r_sensors',
		link: '/network-policies'
	},
	// {
	// 	key: 'jobs',
	// 	label: 'Jobs',
	// 	icon: 'sym_r_work',
	// 	link: '/jobs'
	// },
	{
		key: 'customresources',
		label: 'CRDs',
		icon: 'sym_r_package_2',
		link: '/customresources'
	}
];

export const options3 = [
	{
		key: 'Postgres',
		label: 'Postgres',
		icon: 'sym_r_analytics',
		link: '/site-middleware/db/postgres'
	},
	{
		key: 'MongoDB',
		label: 'MongoDB',
		icon: 'sym_r_all_inbox',
		link: '/site-middleware/db/mongodb'
	},
	{
		key: 'Redis',
		label: 'Redis',
		icon: 'sym_r_monitor_heart',
		link: '/site-middleware/db/redis'
	},
	{
		key: 'Zinc',
		label: 'Zinc',
		icon: 'sym_r_newsmode',
		link: '/site-middleware/search/zinc'
	}
];

export const active = ref(options[0].key);
export const currentItem = ref(options[0]);

export const breadcrumbMap = {
	...options
};
