import { AppListItem } from '@packages/ui/src/network/network';
import { defineStore } from 'pinia';
import { getAppsList } from 'src/network';

interface AppDetailState {
	data: AppListItem[];
}
export const useAppList = defineStore('appList', {
	state: (): AppDetailState => ({
		data: []
	}),
	getters: {},
	actions: {
		async init() {
			return getAppsList().then((res) => {
				this.data = res.data.data.items;
			});
		}
	}
});
