<template>
	<div class="my-linechart2-container relative-position">
		<q-skeleton v-if="loading" style="height: 100%" />
		<v-chart
			v-else
			class="chart"
			:option="option"
			:updateOptions="updateOptions"
			:theme="theme"
			autoresize
		/>
	</div>
</template>
<script lang="ts">
export interface LineProps {
	xAxisLabel?: boolean;
	data: {
		title?: string;
		unit?: string;
		percent?: boolean;
		data: Array<any>;
		legend?: string[];
	};
	/**
	 * yAxis splitNumber
	 */
	splitNumberY?: number;
	loading?: boolean;
}
</script>
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
import { capitalize, indexOf, isArray, get } from 'lodash';
import { date } from 'quasar';
import { firstToUpper, firstToUpperWith_ } from 'src/constant';
import { colors } from 'quasar';

const { getPaletteColor, changeAlpha } = colors;

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

/**
 const chartData = {
  title: 'CPU_USAGE',
  unit: 'm',
  legend: ['USAGE'],
  data: [
    [
      ['03:34:40', 0],
      ['03:44:40', 0],
      ['03:54:40', 0],
      ['04:04:40', 0],
    ],
  ],
}

<MyLineChart :data="chartData" />
 */

const props = withDefaults(defineProps<LineProps>(), {
	xAxisLabel: true,
	unit: '',
	legend: []
});

const unit = computed(() => props.data?.unit ?? '');

const title = computed(() =>
	!props.data?.title
		? ''
		: unit.value
		? `${firstToUpperWith_(props.data.title)} (${unit.value})`
		: `${firstToUpperWith_(props.data.title)}`
);

const legend = isArray(props.data.legend)
	? props.data.legend.map(capitalize)
	: [];
const legendShow = isArray(props.data?.legend) && props.data?.legend.length > 1;
const gridTop = title.value || legendShow ? 50 : 6;
const gridBottom = props.xAxisLabel ? 0 : 4;

const updateOptions = {
	notMerge: false
};

const option = computed(() => {
	const dataFlat = props.data.data
		.flat()
		.map((item) => item[1].toString().replace('.', '').length);
	const dataMax = Math.max(...dataFlat);
	const yAxisLabelMargin = (dataMax.toString().length + 1) * 7 + 16;
	return {
		title: {
			text: title.value,
			left: 0,
			padding: 0,
			textStyle: {
				color: getPaletteColor('grey-10'),
				fontSize: 16,
				fontWeight: 700
			}
		},
		grid: {
			top: gridTop,
			left: yAxisLabelMargin,
			right: 12,
			bottom: 32,
			containLabel: false
		},
		legend: {
			show: legendShow,
			left: 'right',
			padding: 0,
			icon: 'circle',
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: getPaletteColor('grey-8')
			}
		},
		tooltip: {
			trigger: 'axis',
			valueFormatter: (value: any) =>
				`${isNaN(value) ? '-' : value} ${unit.value}`,
			axisPointer: {
				type: 'line',
				label: {
					color: '#414141',
					backgroundColor: '#eee'
				},
				crossStyle: {}
			}
		},
		xAxis: {
			type: 'category',
			onZero: true,
			axisLine: {
				show: true,
				lineStyle: {
					color: '#F1F1F1'
				}
			},
			axisTick: false,
			axisLabel: {
				show: props.xAxisLabel,
				color: getPaletteColor('grey-5'),
				margin: 20
			},
			data: get(props.data.data, '[0]', []).map((item) => item[0])
		},
		yAxis: {
			type: 'value',
			// min: 'dataMin',
			splitNumber: props.splitNumberY ? props.splitNumberY : 5,
			onZero: true,
			splitLine: {
				show: false
			},
			axisLabel: {
				show: true,
				margin: yAxisLabelMargin,
				color: getPaletteColor('grey-5'),
				align: 'left'
			}
		},
		// dataset: props.data,
		series: props.data.data.map((item, index) => ({
			type: 'line',
			name: legend[index],
			smooth: true,
			symbol: 'none',
			clip: false,
			lineStyle: {
				width: 2
			},
			data: item.map((item) => item[1]),
			areaStyle: {
				color: new graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: changeAlpha(theme.color[index], 0.2)
					},
					{
						offset: 1,
						color: changeAlpha(theme.color[index], 0)
					}
				])
			}
		}))
	};
});
</script>

<style lang="scss" scoped>
.my-linechart2-container {
	height: 132px;
	.chart {
		height: 100%;
	}
}
</style>
