import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import {
	AccountInfo,
	AccountModifyStatus,
	CreateAccountRequest,
	RestAccountPassword
} from '../global';
import { useAdminStore } from './Admin';

export type AccountState = {
	accounts: AccountInfo[];
	roles: string[];
};

export const useAccountStore = defineStore('account', {
	state: () => {
		return {
			accounts: [],
			roles: []
		} as AccountState;
	},

	getters: {
		currentUserInfo(): AccountInfo | undefined {
			const admin = useAdminStore();
			return this.accounts.find((a) => admin.user.name === a.name);
		}
	},

	actions: {
		async create_account(req: CreateAccountRequest) {
			const tokenStore = useTokenStore();
			const data: any = await axios.post(
				tokenStore.$state.url + '/bfl/iam/v1alpha1/users',
				req
			);
			console.log(data);
		},

		async get_accounts() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/iam/v1alpha1/users',
				{}
			);
			console.log(data);
			this.accounts = [];
			for (let i = 0; i < data.items.length; ++i) {
				data.items[i].avatar = 'https://cdn.quasar.dev/img/parallax2.jpg';
				this.accounts.push(data.items[i]);
			}
		},

		async get_account_roles() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/iam/v1alpha1/roles',
				{}
			);
			this.roles = [];
			for (let i = 0; i < data.items.length; ++i) {
				this.roles.push(data.items[i]);
			}
		},

		getUserByName(name: string) {
			return this.accounts.find((u) => u.name === name);
		},

		async get_account_info(username: string) {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/iam/v1alpha1/users/' + username,
				{}
			);
			data.avatar = 'https://cdn.quasar.dev/img/parallax2.jpg';
			return data;
		},

		async delete_account(username: string) {
			const tokenStore = useTokenStore();
			return await axios.delete(
				tokenStore.$state.url + '/bfl/iam/v1alpha1/users/' + username,
				{}
			);
		},

		async reset_account_password(req: RestAccountPassword) {
			const tokenStore = useTokenStore();
			const data: any = await axios.put(
				tokenStore.$state.url +
					'/bfl/iam/v1alpha1/users/' +
					req.username +
					'/password',
				req
			);
			// console.log(data)
			return data;
		},

		async get_account_status(username: string): Promise<AccountModifyStatus> {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url +
					'/bfl/iam/v1alpha1/users/' +
					username +
					'/status'
			);
			console.log(data);
			return data;
		}
	}
});
