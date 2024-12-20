export const chartEntervalOfWidth = (width: number) => {
	let chartInterval: number | 'auto' = 2;
	if (width > 1500) {
		chartInterval = 0;
	} else if (width > 700) {
		chartInterval = 1;
	} else if (width > 550) {
		chartInterval = 2;
	} else if (width > 450) {
		chartInterval = 3;
	} else {
		chartInterval = 'auto';
	}
};

export function formatter(params: any, unit: string) {
	let dom = '';
	let domItem = '';
	params.forEach((item: any) => {
		domItem = `<div class="chart-tooltip-item-name">
			<span>
				${item.marker}
				<span class="chart-tooltip-item-title">${item.seriesName}</span>
			</span>
			<span class="chart-tooltip-unit">${item.data} ${item.unit || unit}</span>
		</div>`;
		dom += domItem;
	});
	return `<div class="chart-tooltip-title">${params[0].axisValueLabel}</div><div class="chart-tooltip-item-container">${dom}</div>`;
}
