<template>
	<div class="row q-col-gutter-x-xl">
		<div class="col-6">
			<MyCard>
				<div class="row items-center justify-between q-mb-xl">
					<div class="row items-center">
						<q-img :src="cupIcon" :ratio="1" width="24px" class="q-mr-md" />
						<div class="text-subtitle1 text-grey-10">
							CPU {{ cpuData.unit }}
						</div>
					</div>
					<div class="text-h5 text-grey-10">
						{{ cpuData.used }}/{{ cpuData.total || '-' }}
					</div>
				</div>
				<MylineChart
					:data="chartData[0]"
					:split-number-y="2"
					style="height: 189px"
					:loading="loading"
				/>
			</MyCard>
		</div>
		<div class="col-6">
			<MyCard>
				<div class="row items-center justify-between q-mb-xl">
					<div class="row items-center">
						<q-img :src="memory2Icon" :ratio="1" width="24px" class="q-mr-md" />
						<div class="text-subtitle1 text-grey-10">
							Memory {{ memoryData.unit }}
						</div>
					</div>
					<div class="text-h5 text-grey-10">
						{{ memoryData.used }}/{{ memoryData.total || '-' }}
					</div>
				</div>
				<MylineChart
					:data="chartData[1]"
					:split-number-y="2"
					style="height: 189px"
					:loading="loading"
				/>
			</MyCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { get, last } from 'lodash';
import {
	getAreaChartOps,
	getSuitableUnit,
	getValueByUnit
} from 'src/utils/monitoring';
import { computed } from 'vue';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart3.vue';
import MyCard from 'components/MyCard.vue';
import cupIcon from 'assets/cup.svg';
import memory2Icon from 'assets/memory2.svg';
import {
	getContentOptionsUser,
	getTabOptionsUser,
	MetricTypesUser
} from './config';

interface Props {
	data: any;
	loading: boolean;
	cluster_cpu_total?: string;
	cluster_memory_total?: string;
}
const props = withDefaults(defineProps<Props>(), {
	data: []
});

const chartData = computed(() => {
	return getContentOptionsUser(props.data, MetricTypesUser).map((item) =>
		getAreaChartOps(item)
	);
});
const userResourcesLast = computed(() =>
	getTabOptionsUser(props.data, MetricTypesUser)
);

const cpuData = computed(() => {
	const target: any = userResourcesLast.value[0];
	const totalValue = props.cluster_cpu_total || target.total;
	const _unit = getSuitableUnit(
		totalValue || target.used,
		target.unitType as any
	);
	const _used = getValueByUnit(target.used, _unit);
	const _total = getValueByUnit(totalValue, _unit);
	return {
		unit: _unit,
		used: _used,
		total: _total
	};
});

const memoryData = computed(() => {
	const target: any = userResourcesLast.value[1];
	const totalValue = props.cluster_memory_total || target.total;
	const _unit = getSuitableUnit(
		totalValue || target.used,
		target.unitType as any
	);
	const _used = getValueByUnit(target.used, _unit);
	const _total = getValueByUnit(totalValue, _unit);
	return {
		unit: _unit,
		used: _used,
		total: _total
	};
});
</script>

<style></style>
