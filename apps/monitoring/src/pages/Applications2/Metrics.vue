<template>
	<div>
		<div class="q-pb-lg">
			<div style="height: 188px">
				<MylineChart
					:data="monitoringData"
					:loading="loading"
					class="full-height"
					:split-number-y="2"
				></MylineChart>
			</div>
		</div>
		<div class="row q-col-gutter-x-md items-stretch">
			<div class="col-6">
				<q-card bordered class="q-px-md q-py-lg rounded-borders-md" flat>
					<div class="row items-center justify-between">
						<div class="row items-center">
							<MyImg
								type="circle"
								:src="trafficIcon"
								:loading="loading"
							></MyImg>
							<div class="text-subtitle3 text-ink-2 q-ml-sm">
								{{ $t('TRAFFIC') }}
							</div>
						</div>
						<div>
							<div class="text-subtitle3 text-ink-1">
								<div class="row items-center justify-end">
									<q-skeleton v-if="loading" type="text" width="50px" />
									<span v-else
										>{{ trafficData.inbound
										}}{{ trafficData.inbound_unit }}</span
									>
									<q-icon
										name="sym_r_arrow_upward_alt"
										size="16px"
										color="ink-2"
									/>
								</div>
								<div class="row items-center q-mt-xs justify-end">
									<q-skeleton v-if="loading" type="text" width="50px" />
									<span v-else
										>{{ trafficData.outbound
										}}{{ trafficData.outbound_unit }}</span
									>
									<q-icon
										name="sym_r_arrow_downward_alt"
										size="16px"
										color="ink-2"
									/>
								</div>
							</div>
						</div>
					</div>
				</q-card>
			</div>
			<div class="col-6">
				<q-card
					bordered
					class="q-px-md q-py-lg rounded-borders-md full-height row items-center"
					flat
				>
					<div class="full-width row items-center justify-between">
						<div class="row items-center">
							<MyImg type="circle" :src="pods2Icon" :loading="loading"></MyImg>
							<div class="text-subtitle3 text-ink-2 q-ml-md">
								{{ $t('PODS') }}
							</div>
						</div>
						<q-skeleton v-if="loading" type="text" width="24px" />
						<div v-else class="text-h6 text-ink-1">{{ podCounts }}</div>
					</div>
				</q-card>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { get, last } from 'lodash';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart4.vue';
import { getNameSpacePodsList } from '@packages/ui/src/network';
import MyImg from '@packages/ui/src/components/MyImg.vue';
import trafficIcon from 'assets/traffic.svg';
import pods2Icon from 'assets/pods2.svg';

interface Props {
	namespace: string;
	name: string;
	cpu_usage: any;
	memory_usage: any;
	net_transmitted: any;
	net_received: any;
	loading: boolean;
	ownerKind: string;
}
const props = withDefaults(defineProps<Props>(), {
	cpu_usage: {
		chartData: { legend: [], unit: [], data: [] }
	},
	memory_usage: {
		chartData: { legend: [], unit: [], data: [] }
	}
});

const podCounts = ref(0);

const monitoringData: any = computed(() => {
	if (props.cpu_usage.chartData && props.memory_usage.chartData) {
		return {
			legend: props.cpu_usage.chartData.legend.concat(
				props.memory_usage.chartData.legend
			),
			unit: [props.cpu_usage.chartData.unit, props.memory_usage.chartData.unit],
			data: props.cpu_usage.chartData.data.concat(
				props.memory_usage.chartData.data
			)
		};
	}
	return {
		data: []
	};
});

const fetPods = () => {
	const ownerKind = props.ownerKind;
	const params = {
		namespace: props.namespace,
		name: props.name,
		ownerKind
	};

	getNameSpacePodsList(params).then((res) => {
		podCounts.value = res.data.totalItems;
	});
};

const trafficData = computed(() => {
	return {
		inbound_unit: get(props.net_received, 'unit'),
		outbound_unit: get(props.net_transmitted, 'unit'),
		outbound: get(props.net_transmitted, 'used'),
		inbound: get(props.net_received, 'used')
	};
});

watch(
	() => props,
	() => {
		if (props.namespace) {
			fetPods();
		}
	},
	{
		immediate: true
	}
);
</script>
<style lang="scss" scoped>
.avatar-image {
	transform: translateX(-50%);
}
</style>
