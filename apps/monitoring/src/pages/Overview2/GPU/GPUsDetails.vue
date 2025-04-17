<template>
	<FullPageWithBack :title="$t('GPU.GRAPHICS_MANAGEMENT_DETAILS')">
		<template #extra>
			<DatePicker v-model="times"></DatePicker>
		</template>
		<div class="column flex-gap-xl">
			<MyCard>
				<div class="text-h6 text-ink-1 q-pb-xl">
					{{ $t('GPU.DETAILS_INFORMATION') }}
				</div>
				<div class="row q-col-gutter-xl">
					<GPUDetailList :data="details" :columns="columns">
						<template #field-health="{ data }">
							<GPUStatus
								:isExternal="data.isExternal"
								:health="data.health"
							></GPUStatus>
						</template>
						<template #field-mode="{ value, data }">
							{{ data.type?.split('-')[0] === 'NVIDIA' ? value : 'default' }}
						</template>
					</GPUDetailList>
				</div>
			</MyCard>
			<MyCard>
				<div class="row justify-between">
					<div v-for="(item, index) in gaugeConfig" :key="index">
						<div class="column items-center justify-start">
							<MyGaugeChart
								:data="{
									title: item.title,
									unit: item.gaugeUnit,
									data: [[item.percent.toFixed(1)]]
								}"
							></MyGaugeChart>
							<div class="text-body3 text-ink-1 q-mt-sm">
								<span class="">{{
									item.title.includes('使用') ? '使用' : '分配'
								}}</span>
								<span v-if="!item.title.includes('算力')"
									>({{ item.unit }})</span
								>
								:
								<span class="text-subtitle3"
									>{{ item.used.toFixed(1) }}/{{ item.total.toFixed() }}</span
								>
							</div>
						</div>
					</div>
					<div v-for="(item, index) in lineTools" :key="index">
						<MyGaugeChart
							:data="{
								title: item.title,
								unit: item.gaugeUnit,
								data: [[item.percent.toFixed(1)]]
							}"
						></MyGaugeChart>
					</div>
				</div>
			</MyCard>
		</div>
		<div class="q-mt-xl">
			<MyGridLayout col-width="540px" gap="xl">
				<MyCard v-for="item in trendList" :key="item.title">
					<MylineChart
						:data="item"
						:splitNumberY="4"
						:loading="item.loading"
						style="height: 234px"
					>
					</MylineChart>
				</MyCard>
			</MyGridLayout>
		</div>
	</FullPageWithBack>
</template>

<script setup lang="ts">
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack2.vue';
import MyCard from 'components/MyCard.vue';
import {
	getGraphicsDetails,
	getInstantVector,
	getRangeVector
} from 'src/network/gpu';
import { GraphicsDetailsResponse } from 'src/types/gpu';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useInstantVector } from './config';
import { timeParse } from 'src/utils/gpu';
import { useI18n } from 'vue-i18n';
import MyGridLayout from '@packages/ui/src/components/MyGridLayout.vue';
import MyGaugeChart from 'src/components/Charts/MyGaugeChart.vue';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart.vue';
import GPUDetailList from './GPUDetailList.vue';
import GPUStatus from 'src/pages/Overview2/GPU/GPUStatus.vue';
import DatePicker from './DatePicker.vue';

const end = new Date();
const start = new Date();
start.setTime(start.getTime() - 3600 * 1000);

const times = ref([start, end]);
const router = useRoute();
const route = useRoute();
const { t } = useI18n();
const detail1 = ref<GraphicsDetailsResponse>();
const detail2 = ref({});

const columns = [
	{
		label: t('GPU.GRAPHICS_STATUS'),
		field: 'health'
	},
	{
		label: t('GPU.GRAPHICS_ID'),
		field: 'uuid'
	},
	{
		label: t('GPU.AFFILIATED_NODE'),
		field: 'nodeName'
	},
	{
		label: t('GPU.GRAPHICS_MODEL'),
		field: 'type'
	},
	{
		label: t('GPU.DEVICE_NUMBER'),
		field: 'device_no'
	},
	{
		label: t('GPU.DRIVER_VERSION'),
		field: 'driver_version'
	}
];

const details = computed(() => {
	const data = { ...detail2.value, ...detail1.value };
	return data;
});

const fetchDetails = async () => {
	const params = {
		uid: router.params.uuid as string
	};
	const res = await getGraphicsDetails(params);
	detail1.value = res.data;
};

const gaugeConfig = useInstantVector(
	[
		{
			title: '算力分配率',
			percent: 0,
			query:
				'avg(sum(hami_container_vcore_allocated{deviceuuid=~"$deviceuuid"}) by (instance))',
			totalQuery:
				'avg(sum(hami_core_size{deviceuuid=~"$deviceuuid"}) by (instance))',
			percentQuery:
				'avg(sum(hami_container_vcore_allocated{deviceuuid=~"$deviceuuid"}) by (instance))/avg(sum(hami_core_size{deviceuuid=~"$deviceuuid"}) by (instance)) *100',
			total: 0,
			used: 0,
			unit: ' ',
			data: [],
			loading: false
		},
		{
			title: '显存分配率',
			percent: 0,
			query:
				'avg(sum(hami_container_vmemory_allocated{deviceuuid=~"$deviceuuid"}) by (instance)) / 1024',
			totalQuery:
				'avg(sum(hami_memory_size{deviceuuid=~"$deviceuuid"}) by (instance)) / 1024',
			percentQuery:
				'(avg(sum(hami_container_vmemory_allocated{deviceuuid=~"$deviceuuid"}) by (instance)) / 1024 )/(avg(sum(hami_memory_size{deviceuuid=~"$deviceuuid"}) by (instance)) / 1024) *100 ',
			total: 0,
			used: 0,
			unit: 'GiB',
			data: [],
			loading: false
		},
		{
			title: '算力使用率',
			percent: 0,
			query:
				'avg(sum(hami_core_util{deviceuuid=~"$deviceuuid"}) by (instance))',
			percentQuery:
				'avg(sum(hami_core_util_avg{deviceuuid=~"$deviceuuid"}) by (instance))',
			total: 100,
			used: 0,
			unit: ' ',
			data: [],
			loading: false
		},
		{
			title: '显存使用率',
			percent: 0,
			query:
				'avg(sum(hami_memory_used{deviceuuid=~"$deviceuuid"}) by (instance)) / 1024',
			totalQuery:
				'avg(sum(hami_memory_size{deviceuuid=~"$deviceuuid"}) by (instance))/1024',
			percentQuery:
				'(avg(sum(hami_memory_used{deviceuuid=~"$deviceuuid"}) by (instance)) / 1024)/(avg(sum(hami_memory_size{deviceuuid=~"$deviceuuid"}) by (instance))/1024)*100',
			total: 0,
			used: 0,
			unit: 'GiB',
			data: [],
			loading: false
		}
	],
	(query) => query.replaceAll('$deviceuuid', route.params.uuid),
	times
);

const trendList = computed(() => [
	{
		title: '资源分配趋势',
		unit: '%',
		legend: ['core', 'memory'],
		data: [gaugeConfig.value[0].data, gaugeConfig.value[1].data],
		loading: gaugeConfig.value[0].loading || gaugeConfig.value[1].loading
	},
	{
		title: '资源使用趋势',
		unit: '%',
		legend: ['core', 'memory'],
		data: [gaugeConfig.value[2].data, gaugeConfig.value[3].data],
		loading: gaugeConfig.value[2].loading || gaugeConfig.value[3].loading
	},
	...lineTools.value.map((item) => ({
		title: item.title,
		unit: item.unit,
		legend: [item.title],
		data: item.data,
		loading: item.loading
	}))
]);

const lineTools = ref([
	{
		title: 'GPU功率',
		query:
			'avg by (device_no,driver_version) (hami_device_power{deviceuuid=~"$deviceuuid"})',
		data: [],
		unit: 'W',
		gaugeUnit: 'W',
		percent: 0,
		total: 0,
		hideInfo: true,
		loading: false
	},
	{
		title: 'GPU 温度',
		query:
			'avg by (device_no,driver_version) (hami_device_temperature{deviceuuid=~"$deviceuuid"})',
		data: [],
		unit: '℃',
		gaugeUnit: '℃',
		percent: 0,
		total: 0,
		hideInfo: true,
		loading: false
	}
]);

const fetchLineData = async () => {
	lineTools.value.map((item, index) => {
		lineTools.value[index].loading = true;

		getRangeVector({
			range: {
				start: timeParse(times.value[0]),
				end: timeParse(times.value[1]),
				step: '1m'
			},
			query: item.query.replaceAll('$deviceuuid', route.params.uuid as string)
		})
			.then((res) => {
				const { device_no, driver_version } = res.data.data[0].metric;
				if (device_no && driver_version) {
					detail2.value = { ...detail2.value, device_no, driver_version };
				}
				const data = res.data.data[0]?.values || [];
				const list = data.map((item) => [item.timestamp, item.value]);
				lineTools.value[index].data = [list];
			})
			.finally(() => {
				lineTools.value[index].loading = false;
			})
			.catch(() => {
				lineTools.value[index].loading = false;
			});

		getInstantVector({
			query: item.query.replaceAll('$deviceuuid', route.params.uuid as string)
		}).then((res) => {
			lineTools.value[index].percent = res.data.data[0]?.value || 0;
		});
	});
};

watch(
	times,
	() => {
		fetchLineData();
	},
	{ immediate: true }
);
onMounted(() => {
	fetchDetails();
});
</script>

<style lang="scss" scoped></style>
