import { defineStore } from 'pinia';
interface State {
	data: any[];
	loading: boolean;
}
export const usePodList = defineStore('podList', {
	state: (): State => ({
		data: [],
		loading: true
	}),

	actions: {
		updateData(data: any) {
			this.data = data;
		},
		updateLoading(loading: boolean) {
			this.loading = loading;
		}
	}
});
