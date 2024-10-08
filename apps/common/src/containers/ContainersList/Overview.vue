<template>
	<div class="q-gutter-y-lg">
		<MyCard bordered square flat animated title="Detail">
			<template #extra>
				<div class="row">
					<!-- <Terminal :data="containerPath">{{ t('TERMINAL') }}</Terminal> -->
					<!-- <q-btn
					class="q-ml-md"
					no-caps
					outline
					color="primary"
					:label="t('CONTAINER_LOGS')"
					@click="() => (visible = true)"
				/> -->
				</div>
			</template>
			<DetailPage :data="detail"> </DetailPage>
		</MyCard>
		<MyCard bordered no-content-gap square flat :title="t('VOLUMES')">
			<VolumeContainer
				:volumes="volumes"
				:containers="containersTarget"
				:isMultiProject="podDetail.isFedManaged"
			></VolumeContainer>
		</MyCard>
		<ContainerMonitoring :container="container"></ContainerMonitoring>
		<MyCard
			bordered
			no-content-gap
			square
			flat
			:title="t('ENVIRONMENT_VARIABLE_PL')"
			outline
		>
			<EnvironmentsLayout :detail="envDetail"></EnvironmentsLayout>
		</MyCard>
		<q-inner-loading :showing="loading"> </q-inner-loading>
		<MyDialog v-model="visible">
			<Log></Log>
		</MyDialog>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import MyCard from '../../components/MyCard2.vue';
import DetailPage from '../DetailPage.vue';
// import Terminal from './TerminalDialog.vue';
import MyPage from '../MyPage.vue';
import { getPodDetail } from 'src/network';
import { useRoute } from 'vue-router';
import { ObjectMapper } from '../../utils/object.mapper';
import { isEmpty, get } from 'lodash';
import Empty from '../../components/Empty.vue';
import MyChipList from '../MyChipList.vue';
import Log from './Logs.vue';
import MyDialog from '../../components/MyQDialog.vue';
import MyExpansion from '../../components/MyExpansion.vue';
import VolumeContainer from '../VolumeContainer.vue';
import { getWorkloadVolumes } from '../../utils/workload.js';
import ContainerMonitoring from '../Monitoring/ContainerMonitoring.vue';
import { fetcEnvList } from '../env';
import EnvironmentsLayout from '../../containers/EnvironmentsLayout.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
interface Props {
	container?: string;
	createTime?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const route = useRoute();
const detail = ref();
const loading = ref(false);
const envDetail = ref();
const visible = ref(false);
const podDetail = ref<any>({});
const volumes = ref([]);

const getResourceInfo = (type: string, detail: any) => {
	const { resources = {} } = detail;
	const resourceType = resources[type];
	console.log('resourceType', resourceType);
	return (
		resourceType &&
		Object.keys(resourceType)
			.map((key) => {
				const isCpu = key === 'cpu';
				const value =
					isCpu && resourceType[key].endsWith('m')
						? parseInt(resourceType[key], 10) / 1000
						: resourceType[key];

				return t(`${key.toUpperCase().replace(/[^A-Z]/g, '_')}_VALUE`, {
					value
				});
			})
			.join('/')
	);
};

const ports = (detail: any) => {
	const { ports = [] } = detail;

	return isEmpty(ports)
		? '-'
		: ports
				.map(
					(port: any) =>
						`${port.name ? `${port.name}:` : ''}${
							port.containerPort || 'None'
						}/${port.protocol}`
				)
				.join(' ');
};
const command = (detail: any) => {
	const { command = [] } = detail;
	return isEmpty(command) ? '-' : command.join(' ');
};

const getAttrs = (detail: any) => {
	// const { cluster, namespace } = this.props.match.params;

	const namespace = detail.namespace;
	const status = detail.state ? Object.keys(detail.state)[0] : '';

	let imagePullPolicy;

	if (detail.imagePullPolicy === 'Always') {
		imagePullPolicy = t('IMAGE_PULL_POLICY_ALWAYS');
	} else if (detail.imagePullPolicy === 'IfNotPresent') {
		imagePullPolicy = t('IMAGE_PULL_POLICY_IFNOTPRESENT');
	} else if (detail.imagePullPolicy === 'Never') {
		imagePullPolicy = t('IMAGE_PULL_POLICY_NEVER');
	} else {
		imagePullPolicy = detail.imagePullPolicy;
	}

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
			name: t('IMAGE'),
			value: detail.image
		},
		{
			name: t('IMAGE_ID'),
			value: detail.imageID
		},
		{
			name: t('PORT'),
			value: ports(detail)
		},
		{
			name: t('COMMAND'),
			value: command(detail)
		},
		{
			name: t('RESOURCE_REQUESTS'),
			value: getResourceInfo('requests', detail)
		},
		{
			name: t('RESOURCE_LIMITS'),
			value: getResourceInfo('limits', detail)
		},
		{
			name: t('IMAGE_PULL_POLICY'),
			value: imagePullPolicy
		},
		{
			name: t('RESTART_PL'),
			value: detail.restartCount
		}
	];
};

const containersTarget = computed(() => {
	const { namespace, container }: { [key: string]: any } = route.params;

	if (podDetail.value && podDetail.value.containers) {
		return podDetail.value.containers.filter(
			(item: any) => item.name === container
		);
	} else {
		return [];
	}
});

const containerPath = computed(() => {
	const {
		namespace,
		name: podName,
		container
	}: Record<string, any> = route.params;

	return {
		namespace,
		podName,
		container
	};
});

async function fetchData() {
	const { namespace, name: podName }: Record<string, any> = route.params;
	const containerName = route.params.container || props.container;
	const params = { namespace, podName };
	loading.value = true;
	getPodDetail(params)
		.then((res) => {
			const pod = ObjectMapper.pods(res.data);
			getWorkloadVolumes(pod).then((workloadRes) => {
				podDetail.value = pod;
				volumes.value = workloadRes;
			});
			envDetail.value = pod;

			const data =
				pod.containers.find((item: any) => item.name === containerName) ||
				pod.initContainers.find((item: any) => item.name === containerName);

			data.createTime = get(pod, 'createTime', '');
			data.app = data.app || pod.app;
			// detail.cluster = cluster
			detail.value = getAttrs(data);
		})
		.finally(() => {
			loading.value = false;
		});
}

watch([() => route.params.name, () => route.params.container], fetchData);

fetchData();
</script>

<style lang="scss" scoped>
.overview-warpper {
	background: $background-6;
}
</style>
