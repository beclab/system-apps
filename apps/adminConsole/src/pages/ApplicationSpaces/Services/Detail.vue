<template>
	<div class="absolute-position">
		<MyContentPage>
			<template #extra>
				<div class="col-auto">
					<QButtonStyle v-permission>
						<q-btn dense flat icon="sym_r_edit_square" @click="clickHandler">
							<q-tooltip>
								<div style="white-space: nowrap">
									{{ $t('EDIT_YAML') }}
								</div>
							</q-tooltip>
						</q-btn>
					</QButtonStyle>
					<QButtonStyle v-permission>
						<q-btn dense flat icon="sym_r_edit_square" @click="clickHandler2">
							<q-tooltip>
								<div style="white-space: nowrap">
									{{ $t('EDIT_EXTERNAL_ACCESS') }}
								</div>
							</q-tooltip>
						</q-btn>
					</QButtonStyle>
				</div>
			</template>
			<MyPage>
				<MyCard square flat animated :title="t('ATTRIBUTES')">
					<DetailPage :data="statusList"> </DetailPage>
				</MyCard>
				<MyCard no-content-gap square flat animated :title="t('WORKLOAD_PL')">
					<WorkloadPanel
						:selector="selector"
						@update="workloadUpdateHandler"
					></WorkloadPanel>
				</MyCard>
				<MyCard no-content-gap square flat animated :title="t('Ports')">
					<Ports v-if="detail" :ports="detail.ports"></Ports>
				</MyCard>
				<MyCard no-content-gap square flat :title="t('PODS')">
					<template #extra>
						<QButtonStyle>
							<q-btn
								flat
								icon="refresh"
								dense
								@click="() => PodContainerRef.refresh()"
							/>
						</QButtonStyle>
					</template>
					<PodContainer
						:detail="detail"
						ref="PodContainerRef"
						@podChange="init"
						:routePushFunction="routePushHandler"
						@update="podUpdateHandler"
						scroll
					></PodContainer>
				</MyCard>
				<Metadata
					v-if="detail && detail._originData"
					:data="detail._originData.metadata"
				></Metadata>
				<MyCard no-content-gap square flat animated :title="t('EVENT_PL')">
					<Event v-if="detail" :detail="detail"></Event>
				</MyCard>
				<q-inner-loading :showing="loading"> </q-inner-loading>
			</MyPage>
			<Yaml ref="yamlRef" :title="t('EDIT_YAML')" module="services"></Yaml>
		</MyContentPage>
		<RouterViewTransition></RouterViewTransition>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {
	onMounted,
	ref,
	withDefaults,
	defineProps,
	watch,
	computed
} from 'vue';
import { getEndpoints, getNamespacesDetail } from 'src/network';
import { get, isEmpty } from 'lodash';
import { t } from 'src/boot/i18n';
import { getLocalTime, joinSelector } from 'src/utils';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { ObjectMapper } from 'src/utils/object.mapper';
import Event from 'src/containers/Event.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import Ports from '@packages/ui/src/containers/Ports.vue';
import { getServicesData, putServicesData } from '@packages/ui/src/network';
import Metadata from '@packages/ui/src/containers/Metadata.vue';
import ExternalAccess from './ExternalAccess.vue';
import { useQuasar } from 'quasar';
import PodContainer from '@packages/ui/src/containers/PodsList/PodContainer.vue';
import WorkloadPanel from '@packages/ui/src/containers/WorkloadPanel.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import Yaml from 'src/pages/NamespacePods/Yaml3.vue';
import RouterViewTransition from '@packages/ui/src/components/RouterViewTransition.vue';
import { componentName } from 'src/router/const';

const $q = useQuasar();
let loading = ref(false);
const statusList = ref();
const route = useRoute();
const router = useRouter();
const endpoints = ref([]);
const detail = ref();
const PodContainerRef = ref();
const workloads = ref([]);
const pods = ref([]);
const yamlRef = ref();

interface Props {
	node: string;
}
const props = withDefaults(defineProps<Props>(), {});

const selector = computed(() => {
	return detail.value ? joinSelector(detail.value.selector) : '';
});

const fetchList = () => {
	const { namespace, name }: any = route.params;

	const params1 = {
		namespace,
		name
	};
	loading.value = true;
	Promise.all([
		getEndpoints(params1),
		getNamespacesDetail(namespace)
		// getWorkloads(),
	])
		.then(([res1, res2]) => {
			endpoints.value = res1.data.subsets.map(ObjectMapper.endpoints);
		})
		.finally(() => {
			loading.value = false;
		});
};

const fetchDetail = () => {
	const { namespace, name }: any = route.params;

	getServicesData(namespace, name).then((res) => {
		detail.value = ObjectMapper.services(res.data);
		statusList.value = getAttrs(detail.value);
	});
};

const renderDNS = (service: any) => {
	if (pods.value.length === 0) {
		return `${service.name}.${service.namespace}`;
	} else {
		const podsDns = pods.value.map(
			(pod: any) => `${pod.name}.${service.name}.${service.namespace}`
		);

		return podsDns.join(',');
	}
};

const renderEndpoints = (detail) => {
	const { type } = detail;
	if (type === 'Headless(ExternalName)') {
		return null;
	}

	const data: any = endpoints.value;

	if (data.length === 0) {
		return '-';
	}

	const endpointsData: string[] = [];
	data.forEach((subset) => {
		subset.addresses.forEach((addr) => {
			subset.ports.forEach((port) => {
				if (addr.ip && port.port) {
					endpointsData.push(`${addr.ip}:${port.port}`);
				}
			});
		});
	});
	return endpointsData.map((end, index) => end).join(',');
};

const getAttrs = (detail: any) => {
	if (isEmpty(detail)) {
		return;
	}
	const { namespace, name }: any = route.params;

	let externalIP;
	if (detail.type === 'ExternalName') {
		externalIP = detail.externalName;
	} else if (detail.specType === 'LoadBalancer') {
		externalIP = detail.loadBalancerIngress.join('\r\n');
	} else if (detail.externalIPs) {
		externalIP = detail.externalIPs.join('\r\n');
	}

	const serviceType = get(
		detail,
		'annotations["kubesphere.io/serviceType"]',
		''
	);

	return [
		{
			name: t('CLUSTER'),
			value: 'default'
		},
		{
			name: t('PROJECT'),
			value: namespace
		},
		{
			name: t('TYPE'),
			value: serviceType
				? t(`SERVICE_TYPE_${serviceType.toUpperCase()}`)
				: t('CUSTOM_SERVICE') + `(${t(detail.type)})`
		},
		{
			name: t('APP'),
			value: detail.app
		},
		{
			name: t('VIRTUAL_IP_ADDRESS'),
			value: detail.clusterIP
		},
		{
			name: t('EXTERNAL_IP_ADDRESS'),
			value: externalIP
		},
		{
			name: t('SESSION_AFFINITY'),
			value: detail.sessionAffinity === 'None' ? t('DISABLED') : t('ENABLED')
		},
		{
			name: t('SELECTOR'),
			value: joinSelector(detail.selector)
		},
		{
			name: t('DNS'),
			value: renderDNS(detail)
		},
		{
			name: t('ENDPOINT'),
			value: renderEndpoints(detail)
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
};

const editExternalAccess = () => {
	$q.dialog({
		component: ExternalAccess,

		// props forwarded to your custom component
		componentProps: {
			text: 'test'
			// ...more..props...
		}
	})
		.onOk(() => {
			console.log('OK');
		})
		.onCancel(() => {
			console.log('Cancel');
		})
		.onDismiss(() => {
			console.log('Called on OK or Cancel');
		});
};

const workloadUpdateHandler = (data) => {
	workloads.value = data;
};

const podUpdateHandler = (data) => {
	pods.value = data || [];
};
const init = () => {
	fetchList();
	fetchDetail();
};

const routePushHandler = (data) => {
	router.push({
		name: componentName.SERVICES_PODS,
		params: {
			...route.params,
			pods_name: route.params.name,
			name: data.name,
			uid: data.uid,
			node: data.node,
			createTime: data.createTime
		}
	});
};

const clickHandler = () => {
	yamlRef.value.show();
};

const clickHandler2 = () => {
	$q.dialog({
		component: ExternalAccess,
		componentProps: {
			detail: detail.value
		}
	})
		.onOk((data) => {
			const { namespace, name }: any = route.params;
			putServicesData(namespace, name, data).then(() => {
				init();
			});
		})
		.onCancel(() => {
			console.log('Cancel');
		});
};

watch(
	() => route.params.pods_uid,
	async () => {
		init();
	}
);
onMounted(() => {
	init();
});
</script>

<style lang="scss" scoped>
.my-scroll-container {
	margin: 8px;
}
</style>
