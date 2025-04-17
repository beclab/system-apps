import { getInstantVector, getRangeVector } from 'src/network/gpu';
import { timeParse } from 'src/utils/gpu';
import { computed, ref, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

export const TaskStatusOptions = computed(() => {
	const { t } = useI18n();

	return [
		{ value: 'closed', label: t('COMPLETED'), color: 'bg-status-pending' },
		{ value: 'success', label: t('RUNNING'), color: 'bg-positive' },
		{ value: 'failed', label: t('ERROR'), color: 'bg-negative' },
		{ value: 'unknown', label: t('UNKNOWN'), color: 'bg-status-pending' }
	];
});

export const useInstantVector = (
	configs,
	parseQuery = (query) => query,
	times?: any
) => {
	const data = ref(configs);

	const fetchInstantData = async () => {
		const reqs = configs.map(
			async ({ query, totalQuery, percentQuery, cntQuery }, index) => {
				data.value[index].loading = true;

				if (parseQuery(query).includes('undefined')) {
					return;
				}
				try {
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
				} catch (error) {
					data.value[index].loading = false;
				}
				data.value[index].loading = false;
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
				data.value[index].loading = true;

				try {
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
				} catch (error) {
					data.value[index].loading = false;
				}
				data.value[index].loading = false;
			}
		);

		Promise.all(reqs);
	};

	watchEffect(() => {
		fetchInstantData();
	});

	watch(times, () => {
		fetchRangeData();
	});

	return data;
};
