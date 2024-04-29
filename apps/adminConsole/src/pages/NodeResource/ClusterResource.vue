<template>
	<div class="row no-wrap">
		<InfoCardRadio
			:list="clusterOptions"
			@change="listchange"
			style="min-width: 280px"
			:loading="loading"
		></InfoCardRadio>
		<MyCard
			style="flex: 1; align-self: stretch; border-radius: 12px"
			class="q-ml-lg"
		>
			<MylineChart
				v-if="clusterResource"
				style="height: 100%"
				:data="clusterResource[activeIndex]"
				:loading="loading"
			/>
		</MyCard>
	</div>
</template>

<script setup lang="ts">
import InfoCardRadio from '@apps/monitoring/src/components/InfoCard/InfoCardRadio2.vue';
import { InfoCardItemProps } from '@apps/monitoring/src/components/InfoCard/InfoCardItem.vue';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart.vue';
import { ref, watch } from 'vue';
import {
	getContentOptions,
	getContentOptions3,
	getTabOptions,
	getTabOptions3,
	MetricTypesFormat
} from './config';
import { getAreaChartOps } from '@apps/monitoring/src/utils/monitoring';
import MyCard from '@apps/monitoring/src/components/MyCard.vue';

interface Props {
	data: any;
	type: string;
	loading: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const clusterOptions = ref();
const clusterResource = ref();
const activeIndex = ref(0);

const listchange = (data: InfoCardItemProps, index: number) => {
	activeIndex.value = index;
};

watch(
	() => props.data,
	(data) => {
		const MetricTypes = MetricTypesFormat(props.type);
		clusterOptions.value = getTabOptions(data, MetricTypes);
		clusterResource.value = getContentOptions(data, MetricTypes).map((item) =>
			getAreaChartOps(item)
		);
	},
	{
		deep: true,
		immediate: true
	}
);
</script>

<style></style>
