import { AppListItem, AppWS } from '@packages/ui/src/network/network';
import { defineStore } from 'pinia';
import { getAppsList } from 'src/network';

interface AppDetailState {
	apps: AppListItem[] | [];
}
export const useAppList = defineStore<'appList', AppDetailState>('appList', {
	state: (): AppDetailState => ({
		apps: []
	}),
	getters: {},
	actions: {
		async getAppList() {
			return getAppsList().then((res) => {
				this.apps = res.data.data.items;
			});
		}
	}
});
