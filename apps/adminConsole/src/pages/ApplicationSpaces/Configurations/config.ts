import { t } from '@packages/ui/src/boot/i18n';
import {
	getConfigmaps,
	getSecrets,
	getServiceaccounts
} from '@packages/ui/src/network';
import { PodsParam } from '@packages/ui/src/network/network';
import { useRoute } from 'vue-router';
import Secrets from 'src/assets/Secrets.svg';
import Configmaps from 'src/assets/Configmaps.svg';
import ServiceAccounts from 'src/assets/ServiceAccounts.svg';

const data = [
	{
		label: t('SECRET_PL'),
		value: 'secret',
		icon: Secrets
	},
	{
		label: t('CONFIGMAP_PL'),
		value: 'configmap',
		icon: Configmaps
	},
	{
		label: t('SERVICE_ACCOUNT_PL'),
		value: 'service-account',
		icon: ServiceAccounts
	}
];

export const configurationsOpeneds = data.map((item) => item.value);

export const getConfigurationsData = (
	params: PodsParam & { namespace: string }
) => {
	return Promise.all([
		getSecrets(params),
		getConfigmaps(params),
		getServiceaccounts(params)
	]);
};

export const configurationsDataFormatter = (res: any, namespace: string) => {
	let path = '';
	let id = '';
	const dataTemp = data.map((child, index) => ({
		title: child.label,
		id: child.value,
		selectable: false,
		children: res[index].data.items.map((item: any) => {
			path = `/application-spaces/configurations/${namespace}/detail/${child.value}/${item.metadata.name}`;
			id = `configurations-${item.metadata.name}`;
			return {
				id,
				title: item.metadata.name,
				img: child.icon,
				route: {
					path,
					key: item.metadata.name,
					id: item.metadata.name
				}
			};
		})
	}));

	return dataTemp;
};
