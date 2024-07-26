<template>
	<ListItem size="lg" :ellipsis="false">
		<template #title>
			<v-chart
				class="chart"
				:option="option"
				:updateOptions="updateOptions"
				:theme="theme"
				autoresize
			/>
		</template>
		<template #subTitle>
			<MySubTitle>
				{{ _capitalize(data.title) }}
				<span>{{ lastValue }}</span>
				{{ unit }}
			</MySubTitle>
		</template>
	</ListItem>
</template>

<script lang="ts" setup>
import { use, graphic } from 'echarts/core';
import {
	GridComponent,
	TitleComponent,
	DatasetComponent,
	LegendComponent,
	TooltipComponent
} from 'echarts/components';
import { LineChart, BarChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';
import { provide, computed } from 'vue';
import tinycolor from 'tinycolor2';
import { theme } from './theme';
import { capitalize, get, isArray, last } from 'lodash';
import { _capitalize } from 'src/utils/index';
import MySubTitle from '../MyListItem/MySubTitle.vue';
import ListItem from '../MyListItem/ListItem.vue';

use([
	GridComponent,
	LineChart,
	BarChart,
	CanvasRenderer,
	UniversalTransition,
	TitleComponent,
	DatasetComponent,
	LegendComponent,
	TooltipComponent
]);

provide(THEME_KEY, theme);

interface Props {
	data: {
		title?: string;
		unit?: string;
		percent?: boolean;
		data: Array<[string, number]>;
		legend?: string[];
	};
}
const props = withDefaults(defineProps<Props>(), {});

const newData = computed(() =>
	props.data.data.map((item) =>
		item.map((child: any) => ({
			name: child[0],
			value: child[1]
		}))
	)
);

const xKey = 'name';
const series = computed(() =>
	Object.keys(newData.value[0][0] || {}).filter((key) => key !== xKey)
);

const lastValue = computed(() => {
	const key = get(series.value, [0], '');
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return last(newData.value[0])?.[key] ?? 0;
});

const unit = computed(() => props.data.unit ?? '');
const legend = isArray(props.data.legend)
	? props.data.legend.map(capitalize)
	: [];

const updateOptions = {
	notMerge: false
};

const option = computed(() => ({
	title: {
		show: false
	},
	grid: {
		top: 2,
		left: 1,
		right: 1,
		bottom: 1,
		containLabel: true
	},
	tooltip: {
		trigger: 'axis',
		valueFormatter: (value: number) => `${value} ${unit.value}`,
		axisPointer: {
			type: 'line',
			label: {
				color: '#414141',
				backgroundColor: '#eee',
				precision: 2,
				formatter: (params: any) => params.seriesData[0].name
			},
			crossStyle: {}
		}
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		axisLine: {
			show: false,
			lineStyle: {
				color: '#F1F1F1'
			}
		},
		axisTick: false,
		axisLabel: {
			show: false
		}
	},
	yAxis: {
		type: 'value',
		// max: 'dataMax',
		// min: 'dataMin',
		splitLine: {
			show: false,
			lineStyle: {
				type: 'dashed',
				color: '#F7F7F7'
			}
		},
		axisLabel: {
			show: false
		}
	},
	series: newData.value.map((item, index) => ({
		type: 'line',
		animation: false,
		name: legend[index],
		smooth: false,
		symbol: 'none',
		clip: false,
		data: item,
		lineStyle: {
			width: 1,
			color: '#3377FF'
		},
		areaStyle: {
			color: new graphic.LinearGradient(0, 0, 0, 1, [
				{
					offset: 0,
					color: tinycolor('#227AFF').setAlpha(0.3).toRgbString()
				},
				{
					offset: 1,
					color: tinycolor('#22AFFF').setAlpha(0).toRgbString()
				}
			])
		}
	}))
}));
</script>

<style lang="scss" scoped>
.chart {
	height: 16px;
}
.mylinechartmini-container {
	// overflow: hidden;
	color: #b2b0af;
	text-overflow: ellipsis;
}
</style>
