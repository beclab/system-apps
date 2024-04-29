import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { ApplicationInfo } from '../global';

export const useApplicationStore = defineStore('application', {
	state: () => ({
		applications: [] as ApplicationInfo[]
	}),

	getters: {},

	actions: {
		getApplicationById(name: string): ApplicationInfo | undefined {
			return this.applications.find((u) => u.name === name);
		},

		removeApplicationById(name: string) {
			const userIndex = this.applications.findIndex((u) => u.name === name);
			if (userIndex < 0) {
				return;
			}
			this.applications.splice(userIndex, 1);
		},

		async get_applications() {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/app_process/v1alpha1/myapps',
				{}
			);
			console.log('applications ==== ');
			// console.log(data.items)
			this.applications = [];
			for (let i = 0; i < data.items.length; ++i) {
				if (data.items[i].name !== 'settings') {
					this.applications.push(data.items[i]);
				}
			}
		}
	}
});
