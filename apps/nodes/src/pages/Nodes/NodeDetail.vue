<template>
	<MyLoading :showing="loading">
		<my-card flat animated title="Detail">
			<DetailPage :data="statusList"> </DetailPage>
		</my-card>
	</MyLoading>
</template>

<script setup lang="ts">
import RouteBackBar from '@packages/ui/src/components/RouteBackBar.vue';
import { useRoute } from 'vue-router';
import MyCard from '@packages/ui/src/components/MyCard.vue';
import { onMounted, ref, withDefaults, defineProps } from 'vue';
import { getNodeDetail } from 'src/network';
import MyLoading from '@packages/ui/src/components/MyLoading.vue';
import PodsList from '../Pods/IndexPage.vue';
import { get, isEmpty } from 'lodash';
import { getNodeRoles, getNodeStatus } from 'src/utils/node';
import { t } from 'src/boot/i18n';
import { getLocalTime } from 'src/utils';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';

let loading = ref(false);
const data = ref();
const statusList = ref();
const route = useRoute();
const { name }: any = route.params;
interface Props {
	node: string;
}
const props = withDefaults(defineProps<Props>(), {});

const init = () => {
	fetchList();
};

const fetchList = () => {
	loading.value = true;
	getNodeDetail(props.node)
		.then((res) => {
			data.value = res.data;
			statusList.value = getAttrs(data.value.status);
		})
		.finally(() => {
			loading.value = false;
		});
};

const getAttrs = (detail: any) => {
	if (isEmpty(detail)) {
		return;
	}

	const statusStr = getNodeStatus(detail);

	const address = get(detail, 'addresses[0].address', '-');
	console.log('detail', data.value.status.addresses);
	const nodeInfo = detail.nodeInfo || {};

	return [
		{
			name: t('STATUS'),
			value: statusStr
		},
		{
			name: t('IP_ADDRESS'),
			value: address
		},
		{
			name: t('ROLE'),
			value:
				getNodeRoles(detail.labels).indexOf('master') === -1
					? t('WORKER')
					: t('CONTROL_PLANE')
		},
		{
			name: t('OS_VERSION'),
			value: nodeInfo.osImage
		},
		{
			name: t('OS_TYPE'),
			value: t(nodeInfo.operatingSystem.toUpperCase())
		},
		{
			name: t('KERNEL_VERSION'),
			value: nodeInfo.kernelVersion
		},
		{
			name: t('CONTAINER_RUNTIME'),
			value: nodeInfo.containerRuntimeVersion
		},
		{
			name: t('KUBELET_VERSION'),
			value: nodeInfo.kubeletVersion
		},
		{
			name: t('KUBE_PROXY_VERSION'),
			value: nodeInfo.kubeProxyVersion
		},
		{
			name: t('ARCHITECTURE'),
			value: nodeInfo.architecture.toUpperCase()
		},
		{
			name: t('CREATION_TIME_TCAP'),
			value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss')
		}
	];
};

onMounted(() => {
	init();
});
</script>

<style lang="scss" scoped>
.my-scroll-container {
	margin: 8px;
}
</style>
