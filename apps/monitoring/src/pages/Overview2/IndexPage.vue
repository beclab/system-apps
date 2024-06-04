<template>
	<div class="row q-col-gutter-x-xl">
		<q-resize-observer @resize="onResize" />
		<div style="flex: 1">
			<MyCard2
				title="Cluster Physic Resource"
				link="More Details"
				@link-handler="detailsHandler"
			>
				<template #avatar>
					<q-icon name="sym_r_candlestick_chart" size="32px" />
				</template>
				<ClusterResource
					:data="clusterData"
					:type="type.type"
					:loading="loading"
				></ClusterResource>
			</MyCard2>
			<!-- <div class="row justify-between">
    <QSectionStyle>
      <q-select
        v-model="type"
        :options="options"
        outlined
        dense
        style="width: 240px"
        @update:model-value="typeChangeHandler"
      />
    </QSectionStyle>
  </div> -->
		</div>
		<div
			style="align-self: stretch"
			class="side-wrapper"
			v-show="rightSideVisible"
		>
			<UsageRanking vertical></UsageRanking>
		</div>
	</div>
	<div class="row q-col-gutter-x-xl">
		<MyCard2 style="flex: 1" :title="`${appDetail.user.username}’s Resources`">
			<template #avatar>
				<TerminusAvatar
					:info="{ terminusName: `${appDetail.user.username}@myterminus.com` }"
					:size="32"
					class="terminu-avatar-wrapper"
				/>
			</template>
			<UserResource
				:data="userResourcesData"
				:loading="loading"
				:cluster_cpu_total="cluster_cpu_total"
				:cluster_memory_total="cluster_memory_total"
			></UserResource>
		</MyCard2>
		<div style="height: 476px" class="col-12" v-show="!rightSideVisible">
			<UsageRanking></UsageRanking>
		</div>
		<MyCard2
			:class="[!rightSideVisible ? 'col-6' : 'side-wrapper']"
			title="Analytics"
			link="More"
			@link-handler="routeToAnalytics"
		>
			<Analytics></Analytics>
		</MyCard2>
	</div>

	<RouterViewTransition></RouterViewTransition>
</template>

<script setup lang="ts">
import ClusterResource from './ClusterResource.vue';
import RouterViewTransition from '@packages/ui/src/components/RouterViewTransition.vue';

import {
	getContentOptions,
	getTabOptions,
	MetricTypesFormat,
	MetricTypesUser
} from './config';
import { getAreaChartOps, getResult } from 'src/utils/monitoring';
import {
	fillEmptyMetrics,
	getParams
} from '@packages/ui/src/containers/Monitoring/config';
import {
	getClusterMonitoring,
	getNodeMonitoring,
	getNodesList,
	getUserMetric
} from '@packages/ui/src/network';
import { computed, onBeforeUnmount, ref } from 'vue';
import { ResourcesResponse } from '@packages/ui/src/network/network';
import { getRefreshResult } from '@packages/ui/src/containers/PodsList/config';
import MyLoading from '@packages/ui/src/components/MyLoading.vue';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import { useRouter } from 'vue-router';
import MyCard2 from 'components/MyCard2.vue';
import UserResource from './UserResource.vue';
import UsageRanking from './UsageRanking.vue';
import { useAppDetailStore } from 'src/stores/AppDetail';
import ColumnFlex from './components/ColumnFlex.vue';
import Analytics from './Analytics.vue';
import { get, last } from 'lodash';
import { useColor } from '@bytetrade/ui';
const appDetail = useAppDetailStore();

const router = useRouter();
const defaultOptions = [
	{
		label: 'Cluster',
		value: 'cluster',
		type: 'cluster'
	}
];
const clusterData = ref([]);
const userResourcesData = ref([]);
const NodeData = ref([]);
const nodesList = ref<ResourcesResponse['items']>([]);
const loading = ref(false);
const nodes = ref<string[]>([]);
const options = ref(defaultOptions);
const type = ref(defaultOptions[0]);
const rightSideVisible = ref(false);

const nodeMetricShow = computed(() => nodes.value.length > 1);

type Locker = string | number | NodeJS.Timeout | undefined;
let locker: Locker = undefined;
const MetricTypesNode = MetricTypesFormat('node');
const MetricTypesCluster = MetricTypesFormat('cluster');

const cluster_cpu_total = computed((): string | undefined =>
	appDetail.isAdmin
		? last(
				last(
					get(clusterData.value, 'cluster_cpu_total.data.result[0].values', [])
				)
		  )
		: undefined
);

const cluster_memory_total = computed((): string | undefined =>
	appDetail.isAdmin
		? last(
				last(
					get(
						clusterData.value,
						'cluster_memory_total.data.result[0].values',
						[]
					)
				)
		  )
		: undefined
);

const timeRange = {
	step: '5m',
	times: 100
};

const fetchData = async (autofresh = false) => {
	let filters: any = {};
	const filtersNode = {
		resources: [type.value.value],
		metrics: Object.values(MetricTypesNode),
		...timeRange
	};

	const filtersUser: any = {
		metrics: Object.values(MetricTypesUser),
		...timeRange
	};

	const filtersCluster = {
		metrics: Object.values(MetricTypesCluster),
		...timeRange
	};
	let fn = getNodeMonitoring;
	if (type.value.value === 'cluster') {
		filters = filtersCluster;
		fn = getClusterMonitoring;
	} else {
		filters = filtersNode;
		fn = getNodeMonitoring;
	}

	if (autofresh) {
		filters.last = true;
		filtersUser.last = true;
	} else {
		loading.value = true;
	}

	const paramsCluster = getParams(filters);
	const paramsUser = getParams(filtersUser);

	Promise.all([
		fn(paramsCluster),
		getUserMetric(appDetail.user.username, paramsUser)
	])
		.then(([result, resultUser]) => {
			let clusterResultFormat = getResult(result.data.results);
			let userResultFormat = getResult(resultUser.data.results);

			if (autofresh) {
				clusterResultFormat = getRefreshResult(
					clusterResultFormat,
					clusterData.value
				);

				userResultFormat = getRefreshResult(
					userResultFormat,
					userResourcesData.value
				);
			}
			clusterData.value = fillEmptyMetrics(paramsCluster, clusterResultFormat);
			userResourcesData.value = fillEmptyMetrics(paramsUser, userResultFormat);

			loading.value = false;
			refresh();
		})
		.catch(() => {
			refresh();
			loading.value = false;
		});
};

const typeChangeHandler = () => {
	clearLocker();
	fetchData();
};

const clearLocker = () => {
	locker && clearTimeout(locker);
};

const refresh = () => {
	clearLocker();
	locker = setTimeout(() => {
		fetchData(true);
	}, 5000);
};

const getNodes = () => {
	const params = {
		sortBy: 'createTime'
		// labelSelector: '!node-role.kubernetes.io/edge',
	};
	loading.value = true;
	getNodesList(params).then((res) => {
		nodesList.value = res.data.items;
		if (nodesList.value.length > 1) {
			const nodesOptions = nodesList.value.map((item, index) => ({
				label: item.metadata.name,
				value: item.metadata.name,
				type: 'node'
			}));
			options.value = [...defaultOptions, ...nodesOptions];
		}
	});
};

const detailsHandler = () => {
	router.push({
		path: `/physical-resources/${type.value.value}`
	});
};

const routeToAnalytics = () => {
	router.push({
		path: '/analytics'
	});
};

const onResize = (size: { width: number; height: number }) => {
	if (size.width < 1599) {
		rightSideVisible.value = false;
	} else {
		rightSideVisible.value = true;
	}
};
// getNodes();
fetchData();

onBeforeUnmount(() => {
	clearLocker();
});
</script>

<style lang="scss" scoped>
.side-wrapper {
	width: 460px;
}
.terminu-avatar-wrapper {
	border-radius: 50%;
	overflow: hidden;
}
</style>
