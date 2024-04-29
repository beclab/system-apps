<template>
	<div class="column my-linechart2-container relative-position">
		<div class="row justify-between q-pb-md">
			<div
				v-for="(item, index) in legend"
				:key="item"
				@click="legendHandler(item)"
			>
				<div class="row items-center cursor-pointer">
					<div
						class="legend-symbol"
						:style="{ background: theme.color[index] }"
					></div>
					<span class="q-ml-sm text-body2 text-grey-8">{{ item }}</span>
					<div class="q-ml-md text-subtitle2 text-grey-10">
						<span>{{ lastValue(index) }}</span>
						<span>&nbsp;</span>
						<span>{{ unit[index] }}</span>
					</div>
				</div>
			</div>
		</div>
		<div style="flex: 1" class="full-width full-height">
			<q-skeleton v-if="loading" class="full-width full-height" />
			<v-chart
				v-else
				class="chart"
				:option="option"
				:updateOptions="updateOptions"
				:theme="theme"
				autoresize
				ref="chartRef"
			/>
			<q-resize-observer @resize="onResize" />
		</div>
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
import { provide, computed, ref } from 'vue';
import tinycolor from 'tinycolor2';
import { theme } from '@packages/ui/src/components/Charts/theme';
import { capitalize, get, indexOf, isArray, last } from 'lodash';
import { date } from 'quasar';
import { firstToUpper, firstToUpperWith_ } from 'src/constant';
import { colors } from 'quasar';
import { getValue } from '@packages/ui/src/utils/yaml';
import { chartEntervalOfWidth } from './utils';

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
	legend: []
});

const chartInterval = ref<number | 'auto'>(2);
const chartRef = ref();

const unit = computed(() => props.data?.unit ?? '');

const title = computed(() =>
	!props.data?.title
		? ''
		: unit.value
		? `${firstToUpperWith_(props.data.title)} (${unit.value})`
		: `${firstToUpperWith_(props.data.title)}`
);

const legend = computed(() =>
	isArray(props.data.legend) ? props.data.legend.map(capitalize) : []
);
const legendShow = computed(() => legend.value.length > 0);
const gridTop = computed(() => (title.value || legendShow.value ? 48 : 6));
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
	const yAxisLabelMargin = (dataMax.toString().length + 1) * 12;
	return {
		title: {
			text: title.value,
			left: -6,
			textStyle: {
				color: '#414141',
				fontSize: 12,
				fontWeight: 'normal'
			}
		},
		grid: {
			top: 5,
			left: yAxisLabelMargin,
			right: yAxisLabelMargin,
			bottom: 32,
			containLabel: false
		},
		legend: {
			show: false,
			left: 'left',
			right: 'right',
			padding: 0,
			icon: 'circle',
			itemWidth: 8,
			itemHeight: 8,
			textStyle: {
				color: getPaletteColor('grey-8')
			},
			formatter: function (name: string, data: any) {
				return 'Legend ' + name;
			}
		},
		tooltip: {
			trigger: 'axis',
			formatter: (params: any, ticket: string) => {
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
			},
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
			axisLine: {
				show: true,
				lineStyle: {
					color: '#F1F1F1'
				}
			},
			axisTick: {
				alignWithLabel: true
			},
			axisLabel: {
				show: props.xAxisLabel,
				showMaxLabel: true,
				interval: chartInterval.value,
				align: 'center',
				color: getPaletteColor('grey-5'),
				margin: 20
			},
			data: get(props.data.data, '[0]', []).map((item) => item[0])
		},
		yAxis: [
			{
				type: 'value',
				splitNumber: props.splitNumberY ? props.splitNumberY : 5,
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: getPaletteColor('grey-2')
					}
				},
				axisLabel: {
					show: true,
					margin: yAxisLabelMargin,
					color: getPaletteColor('grey-5'),
					align: 'left'
				}
			},
			{
				type: 'value',
				splitNumber: props.splitNumberY ? props.splitNumberY : 5,
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: getPaletteColor('grey-2')
					}
				},
				axisLabel: {
					show: true,
					margin: yAxisLabelMargin,
					color: getPaletteColor('grey-5'),
					align: 'right'
				}
			}
		],
		// dataset: props.data,
		series: props.data.data.map((item, index) => ({
			type: 'line',
			name: legend.value[index],
			smooth: true,
			symbol: 'none',
			clip: false,
			lineStyle: {
				width: 2
			},
			yAxisIndex: index,
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

const lastValue = (index: number) => {
	return get(last(get(props.data, `data[${index}]`)), '[1]');
};

const legendHandler = (name: string) => {
	chartRef.value.dispatchAction({
		type: 'legendToggleSelect',
		name: name
	});
};

const onResize = (size: { width: number; height: number }) => {
	chartInterval.value = chartEntervalOfWidth(size.width);
};
</script>

<style lang="scss" scoped>
.my-linechart2-container {
	height: 132px;
	.chart {
		height: 100%;
	}
	.legend-symbol {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}
}
</style>
