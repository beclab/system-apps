<template>
	<MyLoading :showing="loading">
		<my-card flat title="Monitoring" animated>
			<template #extra>
				<div class="row items-center">
					<DateRangeMonitoring
						:step="selectValue.step"
						:times="selectValue.times"
						@change="selecteChange"
					/>
					<q-btn
						outline
						padding="4px"
						dense
						color="grey-5"
						style="margin-left: 8px; border-radius: 8px"
						:disable="loading"
					>
						<q-icon name="refresh" class="refresh-icon" @click="init"></q-icon>
					</q-btn>
				</div>
			</template>
			<div class="row q-col-gutter-lg">
				<div class="col-12" v-for="item in list" :key="`md-${item.title}`">
					<MylineChart :data="item" />
				</div>
			</div>
		</my-card>
	</MyLoading>
</template>

<script setup lang="ts">
import RouteBackBar from 'src/components/RouteBackBar.vue';
import { useRoute } from 'vue-router';
import MylineChart from '../../components/Charts/MylineChart.vue';
import MyCard from '../../components/MyCard2.vue';
import { onMounted, ref } from 'vue';
import { getContainersMonitoring } from 'src/network';
import { date } from 'quasar';
import { chartConfig, getResult, MetricTypes } from './config';
import DateRangeMonitoring, {
	DateRangeItem,
	options
} from './DateRangeMonitoring.vue';
import MyLoading from '../../components/MyLoading.vue';
import { getAreaChartOps } from 'src/utils/monitoring';
import { fillEmptyMetrics, getParams, ParamsFormat } from './config';

interface Props {
	createTime?: string;
	container?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const selectValue = ref({
	step: '600s',
	times: 50
});
let loading = ref(false);
let list: any = ref([]);

const route = useRoute();

const init = () => {
	fetchList();
};

const fetchList = () => {
	const { namespace, name, container }: any = route.params;
	const containerName = container || props.container;
	const filters: any = {
		cluster: 'default',
		namespace,
		container: containerName,
		podName: name,
		metrics: Object.values(MetricTypes),
		...selectValue.value
	};
	const params = getParams(filters);

	const fillZero = true;
	loading.value = true;
	getContainersMonitoring(params)
		.then((res) => {
			const result = getResult(res.data);
			const data = fillZero ? fillEmptyMetrics(params, result) : result;
			list.value = chartConfig(data).map((item) => getAreaChartOps(item));
		})
		.finally(() => {
			loading.value = false;
		});
};

const selecteChange = (value: any) => {
	selectValue.value = value;
	fetchList();
};

onMounted(() => {
	init();
});
</script>

<style lang="scss" scoped>
.my-scroll-container {
	margin: 8px;
}
</style>
