import { PodItem, ResourcesResponse } from 'types/network';
import { get, isArray, isEmpty, set } from 'lodash';
import { getLastMonitoringData } from 'src/utils/monitoring';
import { _capitalize } from 'src/utils';
import { firstToUpperWith_ } from 'src/constant';
import memory_icon from '../../assets/memory.svg';
import memory_active_icon from '../../assets/memory_active.svg';
import memory_alt_active_icon from '../../assets/memory_alt_active.svg';
import memory_alt_icon from '../../assets/memory_alt.svg';
import hard_drive_active_icon from '../../assets/hard_drive_active.svg';
import hard_drive_icon from '../../assets/hard_drive.svg';
import package_2_active_icon from '../../assets/package_2_active.svg';
import package_2_icon from '../../assets/package_2.svg';

const resourceName_ = 'resource_name';

export const MetricTypesFormat = (type = 'cluster') => ({
	cpu_usage: `${type}_cpu_usage`,
	cpu_total: `${type}_cpu_total`,
	cpu_utilisation: `${type}_cpu_utilisation`,
	memory_usage: `${type}_memory_usage_wo_cache`,
	memory_total: `${type}_memory_total`,
	memory_utilisation: `${type}_memory_utilisation`,
	disk_size_usage: `${type}_disk_size_usage`,
	disk_size_capacity: `${type}_disk_size_capacity`,
	disk_utilisation: `${type}_disk_size_utilisation`,
	pod_count: `${type}_pod_running_count`,
	pod_capacity: `${type}_pod_quota`
});

export const getValue = (data: PodItem) => get(data, 'value[1]', 0);

export const getTabOptions = (
	data: { [key: string]: string },
	MetricTypes: any,
	index = 0
) => {
	const lastData: { [key: string]: any } = getLastMonitoringData(data, index);
	const result = [
		{
			name: 'CPU',
			unitType: 'cpu',
			used: getValue(lastData[MetricTypes.cpu_usage]),
			total: getValue(lastData[MetricTypes.cpu_total]),
			img: memory_icon
		},
		{
			name: 'MEMORY',
			unitType: 'memory',
			used: getValue(lastData[MetricTypes.memory_usage]),
			total: getValue(lastData[MetricTypes.memory_total]),
			img: memory_alt_icon
		},
		{
			name: 'DISK',
			unitType: 'disk',
			used: getValue(lastData[MetricTypes.disk_size_usage]),
			total: getValue(lastData[MetricTypes.disk_size_capacity]),
			img: hard_drive_icon
		},
		{
			name: 'PODS',
			unit: '',
			used: getValue(lastData[MetricTypes.pod_count]),
			total: getValue(lastData[MetricTypes.pod_capacity]),
			img: package_2_icon
		}
	];

	return result;
};

export const getContentOptions = (
	data: ResourcesResponse,
	MetricTypes: any,
	index = 0
) => {
	const result = [
		{
			type: 'utilisation',
			title: 'CPU_USAGE',
			unit: '%',
			legend: ['USAGE'],
			data: [get(data, `${MetricTypes.cpu_utilisation}.data.result[${index}]`)]
		},
		{
			type: 'utilisation',
			title: 'MEMORY_USAGE',
			unit: '%',
			legend: ['USAGE'],
			data: [
				get(data, `${MetricTypes.memory_utilisation}.data.result[${index}]`)
			]
		},
		{
			type: 'utilisation',
			title: 'DISK_USAGE',
			unit: '%',
			legend: ['USAGE'],
			data: [get(data, `${MetricTypes.disk_utilisation}.data.result[${index}]`)]
		},
		{
			title: 'PODS',
			unit: '',
			legend: ['COUNT'],
			data: [get(data, `${MetricTypes.pod_count}.data.result[${index}]`)],
			img: package_2_icon,
			img_active: package_2_active_icon
		}
	];

	return result;
};

export const getTabOptions2 = [
	{
		name: 'API_SERVER',
		title: firstToUpperWith_('REQUEST_LATENCY'),
		icon: 'server'
	},
	{
		name: 'API_SERVER',
		title: firstToUpperWith_('REQUEST_RATE'),
		icon: 'server'
	},
	{
		name: 'SCHEDULER',
		title: firstToUpperWith_('SCHEDULE_ATTEMPTS'),
		icon: 'ring'
	},
	{
		name: 'SCHEDULER',
		title: firstToUpperWith_('SCHEDULING_RATE'),
		icon: 'ring'
	}
];

export function getResult(result: any) {
	const data: any = {};
	const results = isArray(result) ? result : get(result, 'results', []) || [];

	if (isEmpty(results)) {
		const metricName = get(result, 'metric_name');

		if (metricName) {
			data[metricName] = result;
		}
	} else {
		results.forEach((item: any) => {
			data[item.metric_name] = item;
		});
	}

	return data;
}

const getRefreshResult = (newData = {}, origin = {}) => {
	const data = origin;

	if (isEmpty(data)) {
		return newData;
	}

	Object.values(newData).forEach((item) => {
		const key = get(item, 'metric_name');
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const metric = data[key];

		if (metric) {
			const currentResult = get(item, 'data.result') || [];
			const originResult =
				get(metric, 'data.result', get(metric, 'data.results')) || [];

			set(
				metric,
				'data.result',
				getNewRefreshedResult(currentResult, originResult)
			);
		}
	});

	return data;
};

const getNewValues = (origin = [], newValue = []) => {
	const values = isEmpty(origin) ? [] : [...origin];
	const value = newValue || [];

	if (!isEmpty(value)) {
		if (values.length > 10) {
			values.shift();
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		values.push(value);
	}

	return values;
};

const getNewRefreshedResult = (currentResult = [], originResult = []) => {
	const newResult = [...originResult];

	currentResult.forEach((record, index) => {
		const resourceName = get(record, `metric.${resourceName_}`);
		let recordData = undefined;

		if (resourceName) {
			const originRecord = newResult.find(
				(_record) => get(_record, `metric.${resourceName_}`) === resourceName
			);

			if (isEmpty(originRecord)) {
				newResult.push(record);
			} else {
				recordData = originRecord;
			}
		} else {
			recordData = newResult[index];
		}

		if (!isEmpty(recordData) && recordData) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const newValues = getNewValues(recordData.values, record.value);
			set(recordData, 'values', newValues);
		}
	});

	return newResult;
};

export const MetricTypesUser = {
	cpu_usage: 'user_cpu_usage',
	memory_usage: 'user_memory_usage',
	cpu_total: 'user_cpu_total',
	memory_total: 'user_memory_total'
};

export const getTabOptionsUser = (
	data: { [key: string]: string },
	MetricTypes: any
) => {
	const lastData: { [key: string]: any } = getLastMonitoringData(data);
	const result = [
		{
			name: 'CPU',
			unitType: 'cpu',
			used: getValue(lastData[MetricTypes.cpu_usage]),
			total: getValue(lastData[MetricTypes.cpu_total])
		},
		{
			name: 'MEMORY',
			unitType: 'memory',
			used: getValue(lastData[MetricTypes.memory_usage]),
			total: getValue(lastData[MetricTypes.memory_total])
		}
	];

	return result;
};
export const getContentOptionsUser = (
	data: any,
	MetricTypes: any,
	index = 0
) => {
	const result = [
		{
			type: 'utilisation',
			unitType: 'cpu',
			legend: ['USAGE'],
			data: [get(data, `${MetricTypes.cpu_usage}.data.result[${index}]`)]
		},
		{
			type: 'utilisation',
			unitType: 'memory',
			legend: ['USAGE'],
			data: [get(data, `${MetricTypes.memory_usage}.data.result[${index}]`)]
		}
	];

	return result;
};
