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
