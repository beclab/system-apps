import { defineStore } from 'pinia';
import { Token } from '../global';
import axios from 'axios';
//const domainPing = require("domain-ping");
//import Ping from 'ping.js';

export type RootState = {
	token: Token | null;
	url: string | null;
};

export const useTokenStore = defineStore('token', {
	state: () => {
		return {
			token: null,
			url: null
		} as RootState;
	},
	getters: {
		// getToken: (state) : (string|null) => {
		//   return state.token;
		// }
	},
	actions: {
		loadData() {
			const res = localStorage.getItem('token');
			if (res) {
				this.token = JSON.parse(res);
			}
		},

		async login(username: string, password: string) {
			const data: Token = await axios.post(
				this.url + '/bfl/iam/v1alpha1/login',
				{
					username,
					password
				}
			);

			this.setToken(data);
		},
		async logout() {
			if (this.token?.access_token) {
				try {
					await axios.post(this.url + '/bfl/iam/v1alpha1/logout', {});
				} catch (e) {
					throw e;
				} finally {
					this.setToken(null);
				}
			}
		},
		async refresh_token() {
			try {
				const data: any = await axios.post(
					this.url + '/bfl/iam/v1alpha1/refresh-token',
					{
						token: this.token?.refresh_token
					}
				);
				console.log(data);
				this.setToken(JSON.parse(data));
			} catch (err) {}
		},
		setToken(new_token: Token | null) {
			this.token = new_token;
			if (new_token) {
				localStorage.setItem('token', JSON.stringify(new_token));
			} else {
				localStorage.removeItem('token');
			}
		},
		setUrl(new_url: string | null) {
			this.url = new_url;
			if (new_url) {
				localStorage.setItem('url', new_url);
			}
		}
	}
});
