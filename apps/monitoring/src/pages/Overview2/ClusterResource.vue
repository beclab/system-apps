<template>
	<div class="q-gutter-y-xl">
		<InfoCardRadio
			:list="options"
			@change="listchange"
			:loading="loading"
		></InfoCardRadio>
	</div>
</template>

<script setup lang="ts">
import InfoCardRadio from '../../components/InfoCard/InfoCardRadio.vue';
import { InfoCardItemProps } from 'src/components/InfoCard/InfoCardItem.vue';
import { ref, watch, computed } from 'vue';
import { getContentOptions, getTabOptions, MetricTypesFormat } from './config';
import { getAreaChartOps } from 'src/utils/monitoring';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useResourcesStore } from 'src/stores/Resource';
import gpuImg from 'src/assets/gpu.svg';
import networkImg from 'src/assets/network.svg';
import { ROUTE_NAME } from 'src/router/const';
const resourcesStore = useResourcesStore();

const $q = useQuasar();
const { t, locale } = useI18n();
interface Props {
	data: any;
	type: string;
	loading: boolean;
}
const props = withDefaults(defineProps<Props>(), {});

const clusterOptions = ref();

const listchange = (data: InfoCardItemProps, index: number) => {
	resourcesStore.activeIndex = index;
};

const defaultOptions: InfoCardItemProps[] = [
	{
		used: '20',
		total: '100',
		name: t('GPU.GPU'),
		active: false,
		unitType: '',
		unit: '',
		img: gpuImg,
		img_active: '',
		loading: false,
		route: {
			name: ROUTE_NAME.GPU_LIST
		}
	},
	{
		used: '87',
		total: '100',
		name: t('GPU.NETWORK'),
		active: false,
		unitType: '',
		unit: '',
		img: networkImg,
		img_active: '',
		loading: false,
		route: {
			name: ROUTE_NAME.NETWORK_DETAIL
		}
	}
];

const options = computed(() => {
	const data = clusterOptions.value.map((item) => ({
		...item,
		route: {
			name: ROUTE_NAME.PHYSICAL_RESOURCE_DETAIL,
			params: {
				type: item.name
			}
		}
	}));

	return data.concat(defaultOptions);
});

watch(
	[() => props.data, () => $q.dark.isActive, () => locale.value],
	() => {
		const MetricTypes = MetricTypesFormat(props.type);
		clusterOptions.value = getTabOptions(
			props.data,
			MetricTypes,
			0,
			$q.dark.isActive
		);
		resourcesStore.clusterResource = getContentOptions(
			props.data,
			MetricTypes
		).map((item) => getAreaChartOps(item));
	},
	{
		deep: true,
		immediate: true
	}
);
</script>

<style></style>
