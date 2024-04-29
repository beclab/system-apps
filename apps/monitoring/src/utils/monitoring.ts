import {
	get,
	isEmpty,
	last,
	set,
	isArray,
	flatten,
	isUndefined,
	isNumber,
	isString
} from 'lodash';
import { getLocalTime, _capitalize } from '.';

export const getFormatTime = (ms: string, showDay: boolean) =>
	getLocalTime(Number(ms))
		.format(showDay ? 'MM-DD HH:mm' : 'HH:mm:ss')
		.replace(/(\d+:\d+)(:00)$/g, '$1');

export const getValueByUnit = (
	num: string,
	unit: string | undefined,
	precision = 2
) => {
	let value = num === 'NAN' ? 0 : parseFloat(num);

	switch (unit) {
		default:
			break;
		case '':
		case 'default':
			return value;
		case 'iops':
			return Math.round(value);
		case '%':
			value *= 100;
			break;
		case 'm':
			value *= 1000;
			if (value < 1) return 0;
			break;
		case 'Ki':
			value /= 1024;
			break;
		case 'Mi':
			value /= 1024 ** 2;
			break;
		case 'Gi':
			value /= 1024 ** 3;
			break;
		case 'Ti':
			value /= 1024 ** 4;
			break;
		case 'Bytes':
		case 'B':
		case 'B/s':
			break;
		case 'K':
		case 'KB':
		case 'KB/s':
			value /= 1000;
			break;
		case 'M':
		case 'MB':
		case 'MB/s':
			value /= 1000 ** 2;
			break;
		case 'G':
		case 'GB':
		case 'GB/s':
			value /= 1000 ** 3;
			break;
		case 'T':
		case 'TB':
		case 'TB/s':
			value /= 1000 ** 4;
			break;
		case 'bps':
			value *= 8;
			break;
		case 'Kbps':
			value = (value * 8) / 1024;
			break;
		case 'Mbps':
			value = (value * 8) / 1024 / 1024;
			break;
		case 'ms':
			value *= 1000;
			break;
	}

	return Number(value) === 0 ? 0 : Number(value.toFixed(precision));
};

export const getLastMonitoringData = (data: any, index = 0) => {
	const result = {};

	Object.entries(data).forEach(([key, value]) => {
		const values = get(value, `data.result[${index}].values`, []) || [];
		const _value = isEmpty(values)
			? get(value, `data.result[${index}].value`, []) || []
			: last(values);
		set(result, `[${key}].value`, _value);
	});

	return result;
};

interface Objecttype {
	[key: string]: any;
}

export const getZeroValues = () => {
	const values: any[] = [];
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let time = parseInt(Date.now() / 1000, 10) - 6000;
	for (let i = 0; i < 10; i++) {
		values[i] = [time, 0];
		time += 600;
	}
	return values;
};

const UnitTypes = {
	second: {
		conditions: [0.01, 0],
		units: ['s', 'ms']
	},
	cpu: {
		conditions: [0.1, 0],
		units: ['core', 'm']
	},
	memory: {
		conditions: [1024 ** 4, 1024 ** 3, 1024 ** 2, 1024, 0],
		units: ['Ti', 'Gi', 'Mi', 'Ki', 'Bytes']
	},
	disk: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['TB', 'GB', 'MB', 'KB', 'Bytes']
	},
	throughput: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s']
	},
	traffic: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s']
	},
	bandwidth: {
		conditions: [1024 ** 2 / 8, 1024 / 8, 0],
		units: ['Mbps', 'Kbps', 'bps']
	},
	number: {
		conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
		units: ['T', 'G', 'M', 'K', '']
	}
};

export type UnitKey = keyof typeof UnitTypes;

export const getSuitableUnit = (value: any, unitType: UnitKey) => {
	const config = UnitTypes[unitType];

	if (isEmpty(config)) return '';

	// value can be an array or a single value
	const values = isArray(value) ? value : [[0, Number(value)]];
	let result = last(config.units);
	config.conditions.some((condition, index) => {
		const triggered = values.some(
			(_value) =>
				((isArray(_value) ? get(_value, '[1]') : Number(_value)) || 0) >=
				condition
		);

		if (triggered) {
			result = config.units[index];
		}
		return triggered;
	});
	return result;
};

type ObjTypes = { [key: string]: any };
export const getChartData = ({
	type,
	unit,
	xKey = 'name',
	legend = [],
	valuesData = [],
	dot = 2
}: ObjTypes) => {
	/*
    build a value map => { 1566289260: {...} }
    e.g. { 1566289260: { 'utilisation': 30.2 } }
  */
	let minX = 0;
	let maxX = 0;
	const valueMap: { [key: string]: any } = {};

	const tempData = valuesData.map((values: any, index: number) => {
		return values.map((item: any) => {
			const time = parseInt(get(item, [0], 0), 10);
			const value = get(item, [1]);

			if (!minX || minX > time) minX = time;
			if (!maxX || maxX < time) maxX = time;
			const newValue =
				value === '-1'
					? null
					: getValueByUnit(value, isUndefined(unit) ? type : unit, dot);
			return { name: time, value: newValue };
		});
	});

	const showDay = maxX - minX > 3600 * 24;
	const formatter = (key: any) =>
		xKey === 'name' ? getFormatTime((key * 1000).toString(), showDay) : key;

	const chartData = tempData.map((item: any) =>
		item.map((child: any) => [formatter(child.name), child.value])
	);
	return chartData;
};

export const getAreaChartOps = ({
	type,
	title,
	unitType,
	xKey = 'name',
	legend = [],
	data = [],
	...rest
}: {
	[key: string]: any;
}) => {
	const seriesData = isArray(data) ? data : [];
	const valuesData = seriesData.map((result) => get(result, 'values') || []);

	const unit = unitType
		? getSuitableUnit(flatten(valuesData), unitType)
		: rest.unit;

	const chartData = getChartData({
		type,
		unit,
		xKey,
		legend,
		valuesData,
		dot: rest.dot
	});

	return {
		...rest,
		title,
		unit,
		legend,
		data: chartData
	};
};

export const getSuitableValue = (
	value: string,
	unitType: any = 'default',
	defaultValue: string | number = 0
) => {
	if ((!isNumber(value) && !isString(value)) || isNaN(Number(value))) {
		return defaultValue;
	}

	const unit = getSuitableUnit(value, unitType);
	const unitText = unit ? ` ${_capitalize(unit)}` : '';
	const count = getValueByUnit(value, unit || unitType);
	return `${count}${unitText}`;
};

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
