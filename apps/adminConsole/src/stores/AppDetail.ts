import { AppDetailResponse } from '@packages/ui/src/network/network';
import { defineStore } from 'pinia';
import { getAppDetail } from 'src/network';
import { GLOBAL_ROLE } from '@packages/ui/src/constant/user';
import { isArray } from 'lodash';

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
		isAdmin: (state): boolean => state.data.user.globalrole === GLOBAL_ROLE,
		isDemo: (state): boolean =>
			!!process.env.DEMO && !(state.data.user.globalrole === GLOBAL_ROLE)
	},
	actions: {
		async init() {
			return getAppDetail().then((res) => {
				this.data = res.data;
			});
		},

		async setData(data: any) {
			this.data = data;
		},
		hasPermission(data: string | string[]) {
			const value = isArray(data) ? data[0] : data;

			// Some permissions of demo station are higher than ordinary users
			const hasHigherDemoPrivileges = isArray(data) ? data[1] : false;

			if (!value) {
				return !this.isDemo;
			} else {
				return this.isAdmin
					? value.includes(this.data.user.username) || value.includes('system')
					: !!process.env.DEMO && !hasHigherDemoPrivileges
					? false
					: value.includes(this.data.user.username);
			}
		}
	}
});
