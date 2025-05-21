export function roundToDecimal(num, decimalPlaces) {
	if (typeof num !== 'number' || typeof decimalPlaces !== 'number') {
		throw new TypeError('参数必须是数字');
	}

	// 判断是否是小数
	if (num % 1 !== 0) {
		// 进行四舍五入
		const factor = Math.pow(10, decimalPlaces);
		return Math.round(num * factor) / factor;
	}

	// 如果不是小数，返回原数字
	return num;
}

export const timeParse = (obj = new Date(), format = 'YYYY-MM-DD HH:mm:ss') => {
	obj = new Date(obj);
	const year = obj.getFullYear();
	const mon =
		obj.getMonth() + 1 < 10 ? '0' + (obj.getMonth() + 1) : obj.getMonth() + 1;
	const day = obj.getDate() < 10 ? '0' + obj.getDate() : obj.getDate();
	const hour = obj.getHours() < 10 ? '0' + obj.getHours() : obj.getHours();
	const min = obj.getMinutes() < 10 ? '0' + obj.getMinutes() : obj.getMinutes();
	const second =
		obj.getSeconds() < 10 ? '0' + obj.getSeconds() : obj.getSeconds();

	format = format
		.replace('YYYY', year + '')
		.replace('MM', mon + '')
		.replace('DD', day + '')
		.replace('HH', hour + '')
		.replace('mm', min + '')
		.replace('ss', second + '');

	return format;
};
