<template>
	<MyPage>
		<MyCard square flat :title="t('EVENT_PL')">
			<Event
				v-if="detail"
				:detail="detail"
				style="max-height: 800px; position: relative"
			>
			</Event>
		</MyCard>
	</MyPage>
</template>

<script setup lang="ts">
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { getNodeDetail } from 'src/network';
import { ref } from 'vue';
import { getNodeRoles, getNodeStatus } from 'src/utils/node';
import { t } from 'src/boot/i18n';
import { getLocalTime } from 'src/utils';
import { get, isEmpty } from 'lodash';
import { useRoute } from 'vue-router';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import Metadata from '@packages/ui/src/containers/Metadata.vue';
import { ObjectMapper } from 'src/utils/object.mapper';
import Event from '@packages/ui/src/containers/NodeEvent.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';

const detail = ref();
let loading = ref(false);

const getAttrs = (detail: any) => {
	if (isEmpty(detail)) {
		return;
	}

	const statusStr = getNodeStatus(detail);

	const address = get(detail, 'addresses[0].address', '-');
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
const route = useRoute();

const fetchList = () => {
	const { node }: Record<string, any> = route.params;
	getNodeDetail(node).then((res) => {
		detail.value = ObjectMapper.nodes(res.data);
		console.log('detail', detail.value);
	});
};

fetchList();
</script>

<style></style>
