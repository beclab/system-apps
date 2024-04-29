import { AppDetailResponse } from '@packages/ui/src/network/network';
import { defineStore } from 'pinia';
import { getAppDetail } from 'src/network';

const globalrole = 'platform-admin';

const initData = {
	clusterRole: '',
	config: {},
	ksConfig: {},
	user: {
		email: '',
		globalrole: '',
		grantedClusters: [],
		lang: '',
		lastLoginTime: '',
		username: '',
		globalRules: {}
	},
	workspaces: []
};
interface AppDetailState {
	data: AppDetailResponse;
}
export const useAppDetailStore = defineStore('appDetail', {
	state: (): AppDetailState => ({
		data: initData
	}),

	getters: {
		user: (state): AppDetailResponse['user'] => state.data.user,
		isAdmin: (state): boolean => state.data.user.globalrole === globalrole
	},
	actions: {
		async init() {
			return getAppDetail().then((res) => {
				this.data = res.data;
			});
		},

		async setData(data: any) {
			this.data = data;
		}
	}
});
