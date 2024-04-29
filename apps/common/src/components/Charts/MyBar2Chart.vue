<template>
	<div class="my-linechart2-container relative-position full-height full-width">
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
import { firstToUpper } from 'src/constant';
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

const title = !props.data?.title
	? ''
	: unit.value
	? `${firstToUpper(props.data.title)} (${unit.value})`
	: `${firstToUpper(props.data.title)}`;
const legend = computed(() =>
	isArray(props.data.legend) ? props.data.legend.map(capitalize) : []
);
const legendShow = isArray(props.data?.legend) && props.data?.legend.length > 1;
const gridTop = title || legendShow ? 48 : 6;
const gridBottom = props.xAxisLabel ? 0 : 4;

const updateOptions = {
	notMerge: false
};
const seriesData = computed(() => get(props.data, 'data', []));
const option = computed(() => {
	const dataFlat = props.data.data
		.flat()
		.map((item) => item[1].toString().replace('.', '').length);
	const dataMax = Math.max(...dataFlat);
	const yAxisLabelMargin = (dataMax.toString().length + 1) * 7 + 16;
	return {
		grid: {
			top: gridTop,
			left: yAxisLabelMargin,
			right: 2,
			bottom: 32,
			containLabel: false
		},
		legend: {
			show: legendShow,
			left: 'left',
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
			formatter: (params: any, ticket: string) => {
				console.log('params', params);

				let dom = '';
				let domItem = '';
				params.forEach((item: any) => {
					domItem = `<div>${item.marker}${
						item.seriesName
					} <span style="margin-left: 8px;">${
						seriesData.value[item.seriesIndex][item.dataIndex][1]
					} ${unit.value[item.seriesIndex]}</span></div>`;
					dom += domItem;
				});
				return `<div>${params[0].axisValueLabel}</div>${dom}`;
			}
		},
		xAxis: {
			type: 'category',
			// onZero: false,
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
			}
		},
		yAxis: {
			type: 'value',
			// min: 'dataMin',
			splitNumber: props.splitNumberY ? props.splitNumberY : 5,
			// onZero: false,
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: getPaletteColor('grey-2')
				}
			},
			axisLabel: {
				show: true,
				format: () => '3284032',
				margin: yAxisLabelMargin,
				color: getPaletteColor('grey-5'),
				align: 'left'
			}
		},
		series: props.data.data.map((item, index) => ({
			type: 'bar',
			barGap: 0,
			name: legend.value[index],
			barMaxWidth: 32,
			data: item
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
