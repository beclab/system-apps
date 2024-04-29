<template>
	<div class="q-gutter-sm">
		<my-card flat title="Cluster Resource Usage">
			<template #extra>
				<div class="row items-center">
					<DateRangeMonitoring
						:times="selectValueCluster.times"
						:step="selectValueCluster.step"
						@change="selecteChangeCluster"
					/>
					<q-btn
						outline
						padding="4px"
						dense
						:disable="loading[0]"
						color="grey-5"
						style="margin-left: 8px; border-radius: 8px"
						@click="fetchCluster"
					>
						<q-icon name="refresh"></q-icon>
					</q-btn>
				</div>
			</template>
			<MyLoading style="min-height: 127px" :showing="loading[0]">
				<div class="row q-col-gutter-lg">
					<div
						class="col-6"
						v-for="(item, index) in clusterList"
						:key="`md-${index}`"
					>
						<MylineChartMini style="margin-top: 24px" :data="item" />
					</div>
				</div>
			</MyLoading>
		</my-card>

		<q-space />

		<my-card flat title="Application Resource Usage">
			<template #extra>
				<div class="row items-center">
					<DateRangeMonitoring
						:times="selectValueApp.times"
						:step="selectValueApp.step"
						@change="selecteChangeApp"
					/>
					<q-btn
						outline
						padding="4px"
						dense
						:disable="loading[1]"
						color="grey-5"
						style="margin-left: 8px; border-radius: 8px"
						@click="fetchApplication"
					>
						<q-icon name="refresh"></q-icon>
					</q-btn>
				</div>
			</template>
			<MyLoading style="min-height: 381px" :showing="loading[1]">
				<div class="row q-col-gutter-lg">
					<div
						class="col-4"
						v-for="(item, index) in appList"
						:key="`md-${index}`"
					>
						<MylineChartMini style="margin-top: 24px" :data="item" />
					</div>
				</div>
			</MyLoading>
		</my-card>

		<my-card flat title="Projects">
			<MyLoading style="min-height: 134px" :showing="loading[2]">
				<div class="row q-col-gutter-lg">
					<div
						class="col-12"
						v-for="(item, index) in projectList"
						:key="`md-${index}`"
					>
						<MylineChart style="height: 110px" :data="item" />
					</div>
				</div>
			</MyLoading>
		</my-card>
	</div>
</template>

<script setup lang="ts">
import { getClusterMonitoring } from 'src/network';
import { onMounted, ref } from 'vue';
import {
	chartConfigCluster,
	chartConfigProject,
	getMonitoringCfgs,
	chartConfigApp,
	ClusterMetricTypes,
	AppMetricTypes,
	ProjectsMetricTypes
} from './config';
import MylineChart from 'components/Charts/MylineChart.vue';
import MylineChartMini from 'components/Charts/MylineChartMini.vue';
import MyCard from '@packages/ui/src/components/MyCard.vue';
import DateRangeMonitoring, {
	DateRangeItem,
	options
} from '@packages/ui/src/containers/Monitoring/DateRangeMonitoring.vue';
import { date } from 'quasar';
import { getAreaChartOps, getResult } from 'src/utils/monitoring';
import MyLoading from '@packages/ui/src/components/MyLoading.vue';
import { getParams } from '@packages/ui/src/containers/Monitoring/config';

const clusterList = ref();
const appList = ref();
const projectList = ref();
const loading = ref([false, false, false]);
const selectValueCluster = ref({
	times: 24,
	step: '1h'
});
const selectValueApp = ref({
	times: 24,
	step: '1h'
});

const selecteChangeCluster = (value: any) => {
	selectValueCluster.value = value;
	fetchCluster();
};

const selecteChangeApp = (value: any) => {
	selectValueApp.value = value;
	fetchApplication();
};

const fetchCluster = () => {
	const filters: any = {
		metrics: Object.values(ClusterMetricTypes),
		...selectValueCluster.value
	};

	const params = getParams(filters);

	loading.value[0] = true;
	getClusterMonitoring(params)
		.then((res) => {
			const data = getResult(res.data.results);
			clusterList.value = chartConfigCluster(data, getMonitoringCfgs());
		})
		.finally(() => {
			loading.value[0] = false;
		});
};

const fetchApplication = () => {
	const filters: any = {
		metrics: Object.values(AppMetricTypes),
		...selectValueApp.value
	};

	const params = getParams(filters);

	loading.value[1] = true;
	getClusterMonitoring(params)
		.then((res) => {
			const data = getResult(res.data.results);
			appList.value = chartConfigCluster(data, chartConfigApp());
		})
		.finally(() => {
			loading.value[1] = false;
		});
};

const fetchProject = () => {
	const timeRange = {
		step: '3600s',
		times: 100
	};
	const filters: any = {
		metrics: Object.values(ProjectsMetricTypes),
		...timeRange
	};

	const params = getParams(filters);

	loading.value[2] = true;
	getClusterMonitoring(params)
		.then((res) => {
			const data = getResult(res.data.results);
			projectList.value = chartConfigProject(data).map((item) =>
				getAreaChartOps(item)
			);
		})
		.finally(() => {
			loading.value[2] = false;
		});
};

onMounted(() => {
	fetchCluster();
	fetchApplication();
	fetchProject();
});
</script>

<style></style>
