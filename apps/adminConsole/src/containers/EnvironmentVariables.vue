<template>
	<MyPage>
		<MyCard square flat :title="t('DETAILS')">
			<div class="row">
				<div class="q-mr-xl">
					<ReplicaCard
						:detail="detail"
						enableScale
						:module="$route.params.kind"
						@change="replicaChange"
					/>
				</div>
				<div style="flex: 1">
					<slot></slot>
				</div>
			</div>
		</MyCard>
		<MyCard no-content-gap square flat :title="t('PODS')">
			<template #extra>
				<div class="row items-center">
					<QButtonStyle>
						<q-btn
							color="grey-5"
							flat
							dense
							no-caps
							:label="t('REVISION_RECORDS')"
							@click="() => (visible = true)"
						/>
					</QButtonStyle>
					<q-separator vertical inset spaced />
					<Refresh dense @click="() => PodContainerRef.refresh()" />
				</div>
			</template>
			<PodContainer
				:detail="detail"
				ref="PodContainerRef"
				@podChange="updateDetail"
			></PodContainer>
		</MyCard>
		<MyCard no-content-gap square flat animated :title="t('Ports')">
			<PortsTable class="q-px-lg" :ports="ports"></PortsTable>
		</MyCard>
		<MyCard no-content-gap square flat :title="t('ENVIRONMENT_VARIABLE_PL')">
			<div class="q-gutter-y-md">
				<div
					class="environments-wrapper bg-white q-px-lg q-py-md"
					v-for="item in envlist"
					:key="item.name"
				>
					<MyExpansion
						:label="item.name"
						:default-opened="!loading && !item.env"
					>
						<MyChipList
							v-if="envFilter(item.env).length > 0"
							:data="envFilter(item.env)"
							dense-toggle
						>
						</MyChipList>
						<div v-else>
							<Empty></Empty>
						</div>
					</MyExpansion>
				</div>
			</div>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</MyCard>
		<Metadata v-if="detail" :detail="detail" :data="detail"></Metadata>
		<MyCard no-content-gap square flat animated :title="t('EVENT_PL')">
			<template #extra>
				<Refresh @click="refreshEvent" />
			</template>
			<div style="position: relative">
				<Event q-mx-lg :detail="detail" ref="childComponentRef"></Event>
			</div>
		</MyCard>
		<MyQDialog v-model="visible" fullWidth fullHeight>
			<q-card flat class="q-pb-none">
				<q-card-section>
					<RevisionControl
						:detail="detail"
						ref="RevisionControlRef"
					></RevisionControl>
				</q-card-section>
			</q-card>
		</MyQDialog>
	</MyPage>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch, computed, toRef, onBeforeUnmount } from 'vue';
import { getWorkloadsControler, patchWorkloadsControler } from 'src/network';
import { get, has, isEmpty, isNil, uniqBy, flatten } from 'lodash';
import { safeAtob } from '@packages/ui/src/utils/base64';
import axios from 'axios';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { t } from 'src/boot/i18n';
import MyChipList from '@packages/ui/src/containers/MyChipList.vue';
import { joinSelector } from 'src/utils';
import { ObjectMapper } from 'src/utils/object.mapper';
import Event from '@packages/ui/src/containers/Event.vue';
import Metadata from '@packages/ui/src/containers/Metadata.vue';
import ReplicaCard from './ReplicaCard.vue';
import Empty from '@packages/ui/src/components/Empty.vue';
import RevisionControl from './RevisionControl/IndexPage.vue';
import MyQDialog from 'src/components/MyQDialog.vue';
import PodContainer from '@packages/ui/src/containers/PodsList/PodContainer.vue';
import SocketClient from 'src/utils/socket.client';
import PortsTable from '@packages/ui/src/containers/PortsTable.vue';
import MyExpansion from '@packages/ui/src/components/MyExpansion.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import Refresh from '@packages/ui/src/components/Refresh.vue';

interface Props {
	module?: string;
}

const loading = ref(false);
const route = useRoute();
const envDetail = ref();
const detail = ref();
const envlist = ref();
const params = ref();
const variables = ref();
const childComponentRef = ref();
const visible = ref(false);
const PodContainerRef = ref();

const props = withDefaults(defineProps<Props>(), {});

const envFilter = (data: any[]) => {
	const newData = data || [];
	const temp = newData.filter((item) => item.value);
	console.log('bbbbb', data, temp);
	return temp;
};

const getPath = ({ cluster, namespace }: { [key: string]: string } = {}) => {
	let path = '';
	if (cluster) {
		path += `/klusters/${cluster}`;
	}
	if (namespace) {
		path += `/namespaces/${namespace}`;
	}
	return path;
};

const etchVariables = async (container: any) => {
	const { cluster, namespace, env = [] } = container;
	const requests: any = [];
	const items: any = [];
	env.forEach((item: any) => {
		if ('valueFrom' in item) {
			const { secretKeyRef, configMapKeyRef } = item.valueFrom;

			if (secretKeyRef) {
				items.push({
					name: item.name,
					key: secretKeyRef.key
				});
				requests.push(
					axios.get(
						`api/v1${getPath({ cluster, namespace })}/secrets/${
							secretKeyRef.name
						}`
					)
				);
			}

			if (configMapKeyRef) {
				items.push({
					name: item.name,
					key: configMapKeyRef.key
				});
				requests.push(
					axios.get(
						`api/v1${getPath({ cluster, namespace })}/configmaps/${
							configMapKeyRef.name
						}`
					)
				);
			}
		} else {
			items.push(item);
			requests.push(item.value || '');
		}
	});
	const result = await Promise.all(requests);
	const data = items.map((item: any, index: number) => {
		const value = result[index];

		if (value.kind === 'Secret' && item.key) {
			return {
				name: item.name,
				value: safeAtob(get(value.data, item.key, ''))
			};
		}

		if (value.kind === 'ConfigMap' && item.key) {
			return {
				name: item.name,
				value: get(value.data, item.key, '')
			};
		}

		return { value: '', ...item };
	});

	variables.value = data;

	container.variables = data;
	return container;
};

const containers = computed(() => {
	const data = envDetail.value || {};
	const { spec, containers = [] } = data;

	if (props.module === 'containers') return [data];

	if (!isEmpty(containers)) return containers;
	if (!isEmpty(spec)) return get(spec, 'template.spec.containers', []);

	return [];
});

const initContainers = computed(() => {
	const data = envDetail.value || {};
	const { spec, initContainers: initContainersData = [] } = data;

	if (props.module === 'containers') return [data];

	if (!isEmpty(initContainersData)) return initContainersData;
	if (!isEmpty(spec)) return get(spec, 'template.spec.initContainers', []);

	return [];
});

const fetchList2 = async ({
	cluster,
	namespace,
	containers = [],
	initContainers = []
}: any) => {
	containers = isNil(containers) ? [] : containers;
	initContainers = isNil(initContainers) ? [] : initContainers;

	const mergeContainers = [
		...initContainers.map((item: any) => ({ ...item, type: 'init' })),
		...containers.map((item: any) => ({ ...item, type: 'work' }))
	];

	const data = await Promise.all(
		mergeContainers.map((container) => {
			container.cluster = cluster;
			container.namespace = namespace;
			return etchVariables(container);
		})
	);
	return data;
};

const fetchData = async () => {
	const { namespace, cluster }: { [key: string]: any } = route.params;
	envlist.value = await fetchList2({
		namespace: namespace,
		cluster: cluster,
		containers: containers.value,
		initContainers: initContainers.value
	});
};

const fetchEnv = async () => {
	const { namespace, kind, name }: { [key: string]: any } = route.params;
	loading.value = true;
	const { data } = await getWorkloadsControler(namespace, kind, name);
	updateDetail(data);
	loading.value = false;

	params.value = getParams('default');

	fetchData();
};

function updateDetail(data: any) {
	const { namespace, kind, name }: { [key: string]: any } = route.params;
	envDetail.value = data;
	console.log('updateDetail', data);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	detail.value = ObjectMapper[kind](data);
}

const getParams = (cluster: string) => {
	const {
		name,
		namespace,
		kind: _kind,
		selector,
		_originData
	} = detail.value || {};
	const kind = _kind || get(_originData, 'kind', '');

	let result: any = {};

	result.namespace = namespace;

	switch (kind) {
		case 'PVC':
			result.pvcName = name;
			break;
		case 'Node':
			result.nodeName = name;
			break;
		case 'Namespace':
			result.namespace = name;
			break;
		case 'Service':
		case 'IPPool':
			result.labelSelector = joinSelector(selector);
			break;
		default:
			result.ownerKind = kind === 'Deployment' ? 'ReplicaSet' : kind;
			result.labelSelector = joinSelector(selector);
	}

	if (has(result, 'labelSelector') && isEmpty(selector)) {
		result = {};
	}
	return result;
};

function replicaChange(value: number) {
	const params = { spec: { replicas: value } };
	const { namespace, kind, name }: { [key: string]: any } = route.params;
	patchWorkloadsControler(namespace, kind, name, params).finally(() => {
		loading.value = false;
	});
}

function refreshEvent() {
	childComponentRef.value && childComponentRef.value.fetchData();
}

const ports = computed(() => {
	let containers = get(detail.value, 'containers');
	containers = isNil(containers) ? [] : containers;
	const ports = uniqBy(
		flatten(
			containers.map((container: any) =>
				isEmpty(container.ports) ? [] : container.ports
			)
		),
		'name'
	);
	return ports;
});

watch(
	() => route.params,
	async (newId) => {
		fetchEnv();
	}
);
onMounted(() => {
	fetchEnv();
});
</script>
<style lang="scss" scoped>
.environments-wrapper {
	border-radius: 12px;
}
</style>
