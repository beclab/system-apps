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
import { componentName } from 'src/router/const';

const data = [
	{
		label: t('SECRET_PL'),
		value: 'secret',
		icon: Secrets,
		componentName: componentName.SECRETS
	},
	{
		label: t('CONFIGMAP_PL'),
		value: 'configmap',
		icon: Configmaps,
		componentName: componentName.CONFIGMAPS
	},
	{
		label: t('SERVICE_ACCOUNT_PL'),
		value: 'service-account',
		icon: ServiceAccounts,
		componentName: componentName.SERVICE_ACCOUNTS
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
	const dataTemp = data.map((child, index) => ({
		title: child.label,
		id: child.value,
		selectable: false,
		children: res[index].data.items.map((item: any) => {
			return {
				id: item.metadata.uid,
				title: item.metadata.name,
				img: child.icon,
				lazy: false,
				route: {
					name: child.componentName,
					params: {
						kind: child.value,
						namespace,
						name: item.metadata.name,
						pods_uid: item.metadata.uid
					}
				}
			};
		})
	}));

	return dataTemp;
};
