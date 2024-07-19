import { ref } from 'vue';
import { t } from 'src/boot/i18n';
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
		label: t('BROWSE'),
		icon: 'sym_r_dvr',
		link: '/application-spaces'
	},
	{
		key: 'namespace',
		label: t('NAMESPACE'),
		icon: 'sym_r_markunread_mailbox',
		link: '/namespace'
	},
	{
		key: 'root',
		label: t('PODS'),
		icon: 'sym_r_deployed_code',
		link: '/root'
	}
];

export const options2 = [
	{
		key: 'storages',
		label: t('STORAGES'),
		icon: 'sym_r_hard_drive',
		link: '/storages'
	},
	{
		key: 'network-policies',
		label: t('NETWORKS'),
		icon: 'sym_r_sensors',
		link: '/network-policies'
	},
	// {
	// 	key: 'jobs',
	// 	label: t('JOBS'),
	// 	icon: 'sym_r_work',
	// 	link: '/jobs'
	// },
	{
		key: 'customresources',
		label: t('CRD_PL'),
		icon: 'sym_r_package_2',
		link: '/customresources'
	}
];

export const options3 = [
	{
		key: 'Postgres',
		label: t('POSTGRES'),
		icon: 'sym_r_analytics',
		link: '/site-middleware/db/postgres'
	},
	{
		key: 'MongoDB',
		label: t('MONGO_DB'),
		icon: 'sym_r_all_inbox',
		link: '/site-middleware/db/mongodb'
	},
	{
		key: 'Redis',
		label: t('REDIS'),
		icon: 'sym_r_monitor_heart',
		link: '/site-middleware/db/redis'
	}
];

export const active = ref(options[0].key);
export const currentItem = ref(options[0]);

export const breadcrumbMap = {
	...options
};
