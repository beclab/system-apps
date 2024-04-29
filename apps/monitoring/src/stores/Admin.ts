import { defineStore } from 'pinia';
import axios from 'axios';
import { useTokenStore } from './token';
import { UserInfo } from 'src/global';

export type UserSate = {
	user: UserInfo;
};

export const useAdminStore = defineStore('admin', {
	state: () => {
		return {
			user: {}
		} as UserSate;
	},
	getters: {
		userManagerPermission(): boolean {
			return (
				this.user.owner_role != undefined &&
				this.user.owner_role === 'platform-admin'
			);
		}
	},

	actions: {
		saveUserName(userName: string) {
			this.user.name = userName;
		},
		// | 'contain' | 'cover' | 'none' | 'scale-down'
		saveImgContentMode(showType: 'fill') {
			this.user.imgContentMode = showType;
		},
		async get_user_info() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/backend/v1/user-info',
				{}
			);
			data.avatar = 'https://cdn.quasar.dev/img/parallax2.jpg';
			this.user = data;
			// this.user = data;
		},
		async log_out() {
			const tokenStore = useTokenStore();
			// await axios.post(tokenStore.$state.url + '/bfl/iam/v1alpha1/logout', {});
			await tokenStore.logout();
		}
	}
});
