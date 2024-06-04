<template>
	<div class="q-gutter-y-xl">
		<InfoCardRadio
			:list="clusterOptions"
			@change="listchange"
			:loading="loading"
		></InfoCardRadio>
		<MyCard>
			<q-responsive
				:ratio="1048 / 556"
				style="max-height: 556px; min-height: 336px"
			>
				<MylineChart
					:data="clusterResource[activeIndex]"
					:split-number-y="7"
					:loading="loading"
				/>
			</q-responsive>
		</MyCard>
	</div>
</template>

<script setup lang="ts">
import InfoCardRadio from '../../components/InfoCard/InfoCardRadio.vue';
import { InfoCardItemProps } from 'src/components/InfoCard/InfoCardItem.vue';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart3.vue';
import { ref, watch } from 'vue';
import { getContentOptions, getTabOptions, MetricTypesFormat } from './config';
import { getAreaChartOps } from 'src/utils/monitoring';
import MyCard from 'components/MyCard.vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();

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
	[() => props.data, () => $q.dark.isActive],
	() => {
		const MetricTypes = MetricTypesFormat(props.type);
		clusterOptions.value = getTabOptions(
			props.data,
			MetricTypes,
			0,
			$q.dark.isActive
		);
		clusterResource.value = getContentOptions(props.data, MetricTypes).map(
			(item) => getAreaChartOps(item)
		);
	},
	{
		deep: true,
		immediate: true
	}
);
</script>

<style></style>
