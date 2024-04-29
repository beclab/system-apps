import { computed, reactive, ref, watch } from 'vue';
import { parseDateRange } from './date';
import { get } from 'lodash';

export const dateFilterOption = [
	{
		label: 'Today',
		value: '1day',
		unit: 'hour'
	},
	{
		label: 'Last 24 hours',
		value: '24hour',
		unit: 'hour'
	},
	{
		label: 'Yesterday',
		value: '-1day',
		unit: 'hour'
	},
	{
		label: 'This week',
		value: '1week',
		unit: 'day',
		divider: true
	},
	{
		label: 'Last 7 days',
		value: '7day',
		unit: 'day'
	},
	{
		label: 'This month',
		value: '1month',
		unit: 'day',
		divider: true
	},
	{
		label: 'Last 30 days',
		value: '30day',
		unit: 'day'
	},
	{
		label: 'Last 90 days',
		value: '90day',
		unit: 'day'
	},
	{
		label: 'This year',
		value: '1year',
		unit: 'month'
	}
	// {
	//   label: 'All time',
	//   value: 'all',
	//   divider: true,
	// },
	// {
	//   label: 'Custom-range',
	//   value: 'custom',
	//   divider: true,
	// },
];

export const DEFAULT_DATE_OPTIONS_VALUE = dateFilterOption[1].value;

export const dateFormatStr: any = {
	hour: 'hA',
	day: 'MMMD',
	month: 'MMM'
};

export const dateValue = reactive<Record<string, any>>({});

export const websiteDateValue = (websiteId: string) =>
	dateValue[websiteId] || DEFAULT_DATE_OPTIONS_VALUE;

export const dateRange = (websiteId: string) => {
	return parseDateRange(
		get(dateValue, `[${websiteId}].value`) || DEFAULT_DATE_OPTIONS_VALUE
	);
};

export const setWebsiteDateDefault = (websites: any) => {
	websites.forEach((item: any) => {
		if (!dateValue[item.id]) {
			dateValue[item.id] = { ...dateFilterOption[1] };
		}
	});
};
