import { getInstantVector, getRangeVector } from 'src/network/gpu';
import { timeParse } from 'src/utils/gpu';
import { ref, watch, watchEffect } from 'vue';

export const useInstantVector = (
	configs,
	parseQuery = (query) => query,
	times?: any
) => {
	const data = ref(configs);

	const fetchInstantData = async () => {
		const reqs = configs.map(
			async ({ query, totalQuery, percentQuery, cntQuery }, index) => {
				console.log('query', parseQuery(query));
				if (parseQuery(query).includes('undefined')) {
					return;
				}
				if (query) {
					const usedData = await getInstantVector({
						query: parseQuery(query)
					});

					const used = usedData.data.data.length
						? usedData.data.data[0]?.value
						: 0;
					data.value[index].count = used;
					data.value[index].used = used;
				}

				if (totalQuery) {
					const totalData = await getInstantVector({
						query: parseQuery(totalQuery)
					});
					console.log('aaaaaa', totalData.data);
					if (totalData.data.data[0]) {
						data.value[index].total = totalData.data.data[0].value;
					}
				}
				if (data.value[index].total !== 0) {
					data.value[index].percent =
						(data.value[index].used / data.value[index].total) * 100;
				}
				if (percentQuery) {
					console.log('percentQuery', parseQuery(percentQuery));
					const percentData = await getRangeVector({
						query: parseQuery(percentQuery),
						range: {
							start: timeParse(times?.value[0]),
							end: timeParse(times?.value[1]),
							step: '1m'
						}
					});

					const list = percentData.data.data[0]?.values || [];

					data.value[index].data = list.map((item) => [
						item.timestamp,
						item.value
					]);
				}
			}
		);

		Promise.all(reqs);
	};

	const fetchRangeData = async () => {
		const reqs = configs.map(
			async ({ query, totalQuery, percentQuery }, index) => {
				if (parseQuery(query).includes('undefined')) {
					return;
				}

				if (percentQuery) {
					const percentData = await getRangeVector({
						query: parseQuery(percentQuery),
						range: {
							start: timeParse(times.value[0]),
							end: timeParse(times.value[1]),
							step: '1m'
						}
					});
					const list = percentData.data.data[0]?.values || [];

					data.value[index].data = list.map((item) => [
						item.timestamp,
						item.value
					]);
				}
			}
		);

		Promise.all(reqs);
	};

	watchEffect(() => {
		fetchInstantData();
	});

	watch(
		times,
		() => {
			fetchRangeData();
		}
		// { immediate: true },
	);

	return data;
};
