<template>
	<div class="q-gutter-y-lg">
		<ContainersItem
			v-for="container in containers"
			:key="container.name"
			:container="container"
			:metrics="getPodMetrics(container)"
			:loading="loading"
			:hide-log="hideLog"
			:hide-terminal="hideTerminal"
		>
		</ContainersItem>
		<ContainersItem
			v-for="container in initContainers"
			:key="container.name"
			:container="container"
			isInit
			:metrics="getPodMetrics(container)"
			:loading="loading"
			:hide-log="hideLog"
			:hide-terminal="hideTerminal"
		>
		</ContainersItem>
	</div>
</template>

<script setup lang="ts">
import { UsePod } from '@packages/ui/src/stores/PodData';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import ContainersItem from './ContainersItem.vue';
import { get, isArray, isEmpty, set } from 'lodash';
import { useRoute } from 'vue-router';
import { getContainersMonitoringOfPod } from '../../network';
import { MonitoringResponse } from '@packages/ui/src/network/network';
import { resourceMetricsSort } from '@packages/ui/src/utils/resource';

interface Props {
	hideTerminal: boolean;
	hideLog: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const route = useRoute();
const usePod = UsePod();
const monitoringData = ref();
const loading = ref(false);
const resourceName = ref('container');
let autofresh = false;
let locker: any = null;
const MetricTypes = {
	cpu: 'container_cpu_usage',
	memory: 'container_memory_usage_wo_cache'
};

const containers = computed(() => {
	const containersList = usePod?.data?.containers ?? [];
	const { sort }: Record<string, any> = route.query;

	if (monitoringData.value && containersList.length > 0) {
		const sortBy =
			sort && monitoringData.value[`container_${sort}`]
				? sort
				: 'memory_usage_wo_cache';
		return resourceMetricsSort(
			monitoringData.value,
			containersList,
			'container',
			sortBy
		);
	} else {
		return containersList;
	}
});
const initContainers = computed(() => {
	const initContainersList = usePod?.data?.initContainers ?? [];
	return initContainersList;
});

const getPodMetrics = (container: any) => {
	const data = monitoringData.value;
	const metrics: any = {};

	Object.entries(MetricTypes).forEach(([key, value]) => {
		const records = get(data, `${value}.data.result`) || [];
		metrics[key] = records.find(
			(item: any) =>
				get(item, `metric.${resourceName.value}`) === container.name
		);
	});
	return metrics;
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

const getNewValues = (origin = [], newValue = []) => {
	const values: any[] = isEmpty(origin) ? [] : [...origin];
	const value = newValue || [];

	if (!isEmpty(value)) {
		if (values.length > 10) {
			values.shift();
		}
		values.push(value);
	}

	return values;
};

const getNewRefreshedResult = (
	currentResult = [],
	originResult: any[] = []
) => {
	const newResult = [...originResult];

	currentResult.forEach((record: any, index) => {
		const newResourceName = get(record, `metric.${resourceName.value}`);
		let recordData: any = null;

		if (newResourceName) {
			const originRecord = newResult.find(
				(_record) =>
					get(_record, `metric.${resourceName.value}`) === newResourceName
			);

			if (isEmpty(originRecord)) {
				newResult.push(record);
			} else {
				recordData = originRecord;
			}
		} else {
			recordData = newResult[index];
		}

		if (!isEmpty(recordData)) {
			const newValues = getNewValues(recordData?.values, record?.value);
			set(recordData, 'values', newValues);
		}
	});

	return newResult;
};

const getRefreshResult = (newData = {}, origin = {}) => {
	const data = origin;
	if (isEmpty(data)) {
		return newData;
	}
	Object.values(newData).forEach((item) => {
		const key = get(item, 'metric_name');
		const metric = data[key!];
		if (metric) {
			const currentResult = get(item, 'data.result') || [];
			const originResult =
				get(metric, 'data.result', get(metric, 'data.results')) || [];

			set(
				metric,
				'data.result',
				getNewRefreshedResult(currentResult, originResult)
			);
		}
	});

	return data;
};

function fetchMetrics() {
	const {
		namespace,
		kind,
		name: podName
	}: { [key: string]: any } = route.params;
	const metrics = Object.values(MetricTypes);

	let param = {
		cluster: 'default',
		metrics_filter: `${metrics.join('|')}$`
	};

	let timeParams = {
		step: '60s',
		times: 30
	};

	const getTimeRange = ({ step = '600s', times = 20 } = {}) => {
		const interval = parseFloat(step) * times;
		const end = Math.floor(Date.now() / 1000);
		const start = Math.floor(end - interval);

		return { start, end };
	};

	const timeRange = getTimeRange(timeParams);
	if (!autofresh) {
		param = { ...param, ...timeRange, ...timeParams };
		loading.value = true;
	}
	getContainersMonitoringOfPod(namespace, podName, param)
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
			loading.value = false;
		});
}

const clearLocker = () => {
	if (locker) {
		clearTimeout(locker);
	}
};

const refreshHandler = () => {
	autofresh = false;
	fetchMetricsAuto();
};
const fetchMetricsAuto = () => {
	clearLocker();
	locker = setTimeout(() => {
		fetchMetrics();
	}, 3 * 1000);
};

watch(
	() => route.params,
	() => {
		autofresh = false;
		fetchMetrics();
		fetchMetricsAuto();
	},
	{
		immediate: true
	}
);

onBeforeUnmount(() => {
	clearLocker();
	autofresh = false;
});
</script>

<style lang="scss" scoped>
.my-containers-badge {
	position: absolute;
	left: 20px;
	bottom: -3px;
}
</style>
