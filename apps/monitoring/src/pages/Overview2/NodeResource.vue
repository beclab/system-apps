<template>
	<my-card flat :title="`Node Resource Usage ( ${node} )`" class="col-12">
		<template #extra>
			<q-btn
				flat
				size="sm"
				color="primary"
				no-caps
				:label="t('DETAILS')"
				@click="detailHanlder"
			/>
		</template>
		<MyLoading :showing="loading">
			<div class="row q-gutter-x-lg" style="min-height: 268px">
				<InfoCardRadio
					:list="clusterOptions"
					@change="listchange"
				></InfoCardRadio>
				<MylineChart
					style="flex: 1; height: 268px"
					:data="clusterResource[activeIndex]"
				/>
			</div>
		</MyLoading>
	</my-card>
</template>

<script setup lang="ts">
import MylineChart from '@packages/ui/src/components/Charts/MylineChart.vue';
import MyCard from '@packages/ui/src/components/MyCard.vue';
import { ref, watch } from 'vue';
import MyLoading from '@packages/ui/src/components/MyLoading.vue';
import { getAreaChartOps } from 'src/utils/monitoring';
import InfoCardRadio from 'components/InfoCard/InfoCardRadio.vue';
import { getContentOptions, getTabOptions, MetricTypesFormat } from './config';
import { InfoCardItemProps } from 'src/components/InfoCard/InfoCardItem.vue';
import { t } from '@packages/ui/src/boot/i18n';
import { useRouter } from 'vue-router';

interface Props {
	data: any;
	node: string;
	/**
	 * Metric result data index
	 */
	index: number;
}
const props = withDefaults(defineProps<Props>(), {});
const MetricTypes = MetricTypesFormat('node');

const clusterOptions = ref();
const loading = ref(false);
const clusterResource = ref();
const activeIndex = ref(0);
const router = useRouter();
const listchange = (data: InfoCardItemProps, index: number) => {
	activeIndex.value = index;
};

const detailHanlder = () => {
	router.push({
		path: '/applications',
		query: {
			node: props.node
		}
	});
};

watch(
	() => props.data,
	(data) => {
		clusterOptions.value = getTabOptions(data, MetricTypes, props.index);
		clusterResource.value = getContentOptions(
			data,
			MetricTypes,
			props.index
		).map((item) => getAreaChartOps(item));
	},
	{
		deep: true,
		immediate: true
	}
);
</script>
