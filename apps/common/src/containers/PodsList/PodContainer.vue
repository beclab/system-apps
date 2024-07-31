<template>
	<div class="q-gutter-y-md relative-position">
		<PodItem
			v-for="item in podList"
			:key="item.name"
			:data="item"
			:metrics="getPodMetrics(item)"
			:loading="loading3"
			:scroll="scroll"
			bordered
			@click="itemClick"
		></PodItem>
		<q-inner-loading :showing="loading2"> </q-inner-loading>
	</div>
	<Empty v-if="(!podList || podList.length === 0) && !loading2"></Empty>
</template>

<script setup lang="ts">
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router';
import {
	onMounted,
	ref,
	watch,
	computed,
	toRef,
	onBeforeUnmount,
	watchEffect
} from 'vue';
import {
	getMetrics,
	getNameSpacePodsList,
	getWorkloadsControler,
	patchWorkloadsControler
} from 'src/network';
import {
	get,
	has,
	isArray,
	isEmpty,
	isNil,
	set,
	sortBy,
	throttle
} from 'lodash';
import { joinSelector } from 'src/utils';
import { ObjectMapper } from '../../utils/object.mapper';
import PodItem from './PodItem.vue';
import SocketClient from '../../utils/socket.client';
import { MonitoringResponse } from 'src/network/network';
import { usePodList } from '../../stores/podList';
import {
	getParams,
	getPosdList,
	getPosdListFormatter,
	getRefreshResult,
	getTimeRange,
	MetricTypes,
	podMetricsFormat
} from './config';
import Empty from '../../components/Empty.vue';
import axios from 'axios';
import isFunction from 'lodash';

interface Props {
	module?: string;
	detail?: any;
	scroll?: boolean;
	routePrefix?: string;
	path?: string;
	componentName?: string;
	routePushFunction?: (data: any) => void;
}

const PodListData = usePodList();
const CancelToken = axios.CancelToken;
let source = CancelToken.source();

const loading = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const route = useRoute();
const router = useRouter();
const envDetail = ref();
const podList = ref();
const envlist = ref();
const params = ref();
const variables = ref();
const childComponentRef = ref();
const monitoringData = ref();
const shouldExecuteResponseHandler = ref(true);

let locker: any = null;
let autofresh = false;
let createWS: any = undefined;
let websocket: any = undefined;

const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits(['podChange', 'update']);

const fetchEnv = async (showLoading = true) => {
	params.value = getParams(props.detail);

	fetchPods(showLoading);
	wsInit();
};

function updateDetail(data: any) {
	emits('podChange', data);
}

async function fetchPods(showLoading = true) {
	if (showLoading) {
		loading2.value = true;
	}
	try {
		const res = await getPosdList(props.detail, { cancelToken: source.token });
		console.log('aaaa', props.detail);
		podList.value = getPosdListFormatter(res);
		PodListData.updateData(podList.value);
		fetchMetrics();
		loading2.value = false;
		PodListData.updateLoading(false);
		console.log('fffffff');
	} catch (error) {
		loading2.value = false;
	}
}

const refreshPods = () => {
	resetConfig();
	fetchPods();
};

const resetConfig = () => {
	clearLocker();

	autofresh = false;
};

function wsInit() {
	if (createWS) {
		return;
	}
	const selectCluster = '';
	const { namespace, labelSelector }: any = params.value;
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const url = `${protocol}//${window.location.host}/api/v1/watch${
		selectCluster ? `/klusters/${selectCluster}` : ''
	}/namespaces/${namespace}/pods?labelSelector=${labelSelector}`;

	closeWs();
	createWS = new SocketClient(url, {
		onmessage: podWsHandler,
		onclose: onclose,
		onerror: (error: any) => {
			console.log('error1', error);
			closeWs();
		}
	});
}

function onclose() {
	createWS = null;
	if (!shouldExecuteResponseHandler.value) return;
	setTimeout(() => {
		wsInit();
	}, 1000);
}

function closeWs() {
	if (createWS) {
		createWS.close(true);
		createWS = null;
	}
}

function podWsHandler(message: any) {
	const selectCluster = '';
	const fetchPods2 = throttle(fetchPods, 350);
	const updateDetail2 = throttle(updateDetail, 350);

	if (message.object.kind === 'Pod') {
		if (message.type === 'MODIFIED') {
			const data = {
				cluster: selectCluster,
				...ObjectMapper.pods(message.object)
			};
			updateItem(data);
		} else if (message.type === 'DELETED' || message.type === 'ADDED') {
			if (autofresh) {
				fetchPods2(false);
			}
		}
	} else {
		updateDetail2(message.object);
	}
}

function updateItem(item: any) {
	if (item.uid) {
		const index = podList.value.findIndex(
			(_item: any) => _item.uid === item.uid
		);
		if (index >= 0) {
			podList.value[index] = item;
		}
	}
}

let createWS2: any = undefined;
function monitoringWs() {
	if (createWS2) {
		return;
	}
	const {
		namespace,
		kind,
		pods_name: name
	}: Record<string, any> = route.params;
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const url = `${protocol}//${window.location.host}/apis/apps/v1/watch/namespaces/${namespace}/${kind}/${name}`;
	createWS2 = new SocketClient(url, {
		onclose: onclose2,
		onerror: (error: any) => {
			console.log('error2', error);
			closeWs2();
		}
	});
}

function onclose2() {
	createWS2 = null;

	if (!shouldExecuteResponseHandler.value) return;
	setTimeout(() => {
		monitoringWs();
	}, 1000);
}

function closeWs2() {
	if (createWS2) {
		createWS2.close(true);
		createWS2 = null;
	}
}

function replicaChange(value: number) {
	const params = { spec: { replicas: value } };
	const {
		namespace,
		kind,
		pods_name: name
	}: { [key: string]: any } = route.params;
	patchWorkloadsControler(namespace, kind, name, params).finally(() => {
		loading.value = false;
	});
}

function refreshEvent() {
	childComponentRef.value && childComponentRef.value.fetchData();
}

const getPodMetrics = (pod: any) => {
	const data = monitoringData.value;
	return podMetricsFormat(data, pod);
};

const getResult = (result: MonitoringResponse['results']) => {
	const data: any = {};
	const results = isArray(result) ? result : get(result, 'results', []) || [];

	if (isEmpty(results)) {
		const metricName = get(result, 'metric_name');

		if (metricName) {
			data[metricName] = result;
		}
	} else {
		results.forEach((item) => {
			data[item.metric_name] = item;
		});
	}

	return data;
};

function fetchMetrics() {
	const { namespace, kind }: { [key: string]: any } = route.params;
	const podListData = podList.value ?? [];

	const resources = podListData.map((item: any) => item.name);
	const metrics = Object.values(MetricTypes);
	let param = {
		cluster: 'default',
		ownerKind: params.value.ownerKind,
		labelSelector: params.value.labelSelector,
		resources_filter: `${resources.join('|')}$`,
		metrics_filter: `${metrics.join('|')}$`
	};

	let timeParams = {
		step: '60s',
		times: 30
	};

	const timeRange = getTimeRange(timeParams);
	if (!autofresh) {
		param = { ...param, ...timeRange, ...timeParams };
		loading3.value = true;
	}

	getMetrics(namespace, param, { cancelToken: source.token })
		.then((res) => {
			if (autofresh) {
				monitoringData.value = getRefreshResult(
					res.data.results,
					monitoringData.value
				);
			} else {
				autofresh = true;
				monitoringData.value = getResult(res.data.results);
			}
			fetchMetricsAuto();
		})
		.finally(() => {
			loading3.value = false;
		});
}

const fetchMetricsAuto = () => {
	clearLocker();
	locker = setTimeout(() => {
		fetchMetrics();
	}, 3 * 1000);
};

const clearLocker = () => {
	if (locker) {
		clearTimeout(locker);
	}
};

const itemClick = (data: any) => {
	if (props.componentName) {
		router.push({
			name: props.componentName,
			params: {
				...route.params,
				name: data.name,
				uid: data.uid,
				node: data.node,
				createTime: data.createTime
			}
		});
		return;
	}
	if (props.routePushFunction && isFunction(props.routePushFunction)) {
		props.routePushFunction(data);
		return;
	}
	const podTemplateHash = data.labels['pod-template-hash'];
	const name = data.name.split(`-${podTemplateHash}`)[0];
	const path = props.path
		? props.path
		: `/${props.routePrefix || 'application-spaces'}/pods/overview/${
				data.node
		  }/${data.namespace}/${data.name}/${data.createTime}`;
	router.push({
		path,
		query: {
			type: 'pod',
			podName: name,
			uid: props.detail.uid
		}
	});
};

const CancelTokenHandler = () => {
	source.cancel();
};

watchEffect(() => {
	emits('update', podList.value);
});

watch(
	() => props.detail,
	async (newData, oldData) => {
		if (newData) {
			CancelTokenHandler();
			source = CancelToken.source();
			if (newData.uid === oldData?.uid) {
				fetchEnv(false);
			} else {
				closeWs();
				closeWs2();
				resetConfig();
				fetchEnv();
				monitoringWs();
			}
		}
	}
);

onBeforeUnmount(() => {
	CancelTokenHandler();
	shouldExecuteResponseHandler.value = false;
	PodListData.updateData([]);
	closeWs();
	closeWs2();
	resetConfig();
});

defineExpose({ refresh: refreshPods });
</script>
