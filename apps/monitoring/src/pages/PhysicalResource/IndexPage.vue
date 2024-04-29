<template>
	<FullPageWithBack title="Physical Resource Montoring">
		<template #extra>
			<DateRangeMonitoring
				v-model="selectValue2"
				:times="selectValue.times"
				:step="selectValue.step"
				@change="selecteChange"
			/>
			<QButtonStyle>
				<q-btn
					class="q-pa-xs"
					dense
					icon="refresh"
					color="grey-8"
					outline
					style="margin-left: 16px; border-radius: 8px"
					:disable="loading"
					@click="fetchData"
				>
				</q-btn>
			</QButtonStyle>
		</template>
		<MyGridLayout col-width="542px" gap="xl">
			<div
				class="col-12 col-md-6"
				v-for="(item, index) in list"
				:key="`md-${index}`"
			>
				<MyCard>
					<MylineChart :data="item" style="height: 236px" :loading="loading" />
				</MyCard>
			</div>
		</MyGridLayout>
	</FullPageWithBack>
</template>

<script setup lang="ts">
import MylineChart from '@packages/ui/src/components/Charts/MylineChart.vue';
import { getClusterMonitoring } from 'src/network';
import DateRangeMonitoring from '@packages/ui/src/containers/Monitoring/DateRangeMonitoring.vue';
import { computed, ref } from 'vue';
import { getAreaChartOps, getResult } from 'src/utils/monitoring';
import { getMonitoringCfgs, MetricTypes } from './config';
import MyLoading from '@packages/ui/src/components/MyLoading.vue';
import MyCard from 'components/MyCard.vue';
import {
	fillEmptyMetrics,
	getParams
} from '@packages/ui/src/containers/Monitoring/config';
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack2.vue';
import MyGridLayout from '@packages/ui/src/components/MyGridLayout.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import {
	getLastTimeStr,
	getStep,
	getTimeOptions,
	getTimes
} from '@packages/ui/src/containers/Monitoring/utils';
export type DateRangeItem = string;

const defaultdata = getMonitoringCfgs([]).map((item) => getAreaChartOps(item));

const selectValue = ref({
	times: 50,
	step: '2m'
});

const selectValue2 = ref<DateRangeItem>(
	getLastTimeStr(selectValue.value.step, selectValue.value.times)
);

const loading = ref(false);
const list = ref(defaultdata);

const selecteChange = (value: any) => {
	selectValue.value = value;
	fetchData();
};

const fetchData = () => {
	const filters: any = {
		metrics: Object.values(MetricTypes),
		...selectValue.value
	};

	const params = getParams(filters);
	const fillZero = true;
	loading.value = true;
	getClusterMonitoring(params)
		.then((res) => {
			const result = getResult(res.data.results);
			const data = fillZero ? fillEmptyMetrics(params, result) : result;
			list.value = getMonitoringCfgs(data).map((item) => getAreaChartOps(item));
		})
		.finally(() => {
			loading.value = false;
		});
};

fetchData();
</script>

<style lang="scss">
.my-custom-drawer-wrapper {
	&.el-drawer {
		box-shadow: none;
	}
	.my-drawer-title {
		color: #1f1814;
		font-size: 14px;
		font-weight: 500;
		line-height: 20px;
		margin-left: 12px;
	}
	.el-drawer__header {
		margin-bottom: 0;
		padding: 0 18px;
		height: 56px;
	}
}
</style>
