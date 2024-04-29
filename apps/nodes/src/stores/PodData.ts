import { PodsMapper } from '@packages/ui/src/utils/object.mapper';
import { defineStore } from 'pinia';
import { get, isEmpty, isEqual } from 'lodash';
import { t } from '@packages/ui/src/boot/i18n';
import { getLocalTime } from '@packages/ui/src/utils';

export const UsePod = defineStore('poddata', {
	state: (): { detail: any; data: any } => ({
		detail: undefined,
		data: undefined
	}),
	actions: {
		setDetail(data: any) {
			const detail = PodsMapper(data);
			const statusList = getAttrs(detail);
			this.detail = statusList;
			this.data = detail;
		}
	}
});

function getAttrs(detail: any = {}) {
	//   // const { cluster, namespace } = this.props.match.params;
	const namespace = detail.namespace;
	if (isEmpty(detail)) return null;

	const { status, restarts } = detail.podStatus;

	return [
		// {
		//   name: t('CLUSTER'),
		//   value: cluster,
		// },
		{
			name: t('PROJECT'),
			value: namespace
		},
		{
			name: t('APP'),
			value: detail.app
		},
		{
			name: t('STATUS'),
			value: t(status)
		},
		{
			name: t('POD_IP_ADDRESS'),
			value: detail.podIp
		},
		{
			name: t('NODE_NAME'),
			value: detail.node
		},
		{
			name: t('NODE_IP_ADDRESS'),
			value: detail.nodeIp
		},
		{
			name: t('RESTART_PL'),
			value: restarts
		},
		{
			name: t('QOS_CLASS'),
			value: get(detail, 'status.qosClass')
		},
		{
			name: t('CREATION_TIME_TCAP'),
			value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss')
		},
		{
			name: t('CREATOR'),
			value: detail.creator
		}
	];
}
