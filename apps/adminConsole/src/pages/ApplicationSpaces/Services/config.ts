import { getNameSpaceServicesList } from '@packages/ui/src/network';
import { PodsParam } from '@packages/ui/src/network/network';
import { t } from '@packages/ui/src/boot/i18n';
import Services from 'src/assets/Services.svg';

const group = {
	label: t('SERVICES'),
	value: 'services'
};
export const ServiceOpeneds = [group.value];

export const getServicesData = (params: PodsParam & { namespace: string }) => {
	return getNameSpaceServicesList(params);
};

export const servicesDataFormatter = (res: any, namespace: string) => {
	let path = '';
	let id = '';
	const data = res.data.items.map((item: any) => {
		path = `/application-spaces/services/${namespace}/detail/${item.metadata.name}`;
		id = `services-${item.metadata.name}`;
		return {
			id,
			title: item.metadata.name,
			img: Services,
			route: {
				path,
				key: item.metadata.name,
				id: item.metadata.name
			}
		};
	});

	const list = data.length
		? [
				{
					title: group.label,
					id: group.value,
					selectable: false,
					children: data
				}
		  ]
		: [];

	return list;
};
