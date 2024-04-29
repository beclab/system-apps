import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';

export interface Service {
	name: string;
	status: boolean;
	url: string;

	///
	iconUrl: string;
}

export type ServiceState = {
	services: Service[];
};

export const useServiceStore = defineStore('service', {
	state: () => {
		return {
			services: []
		} as ServiceState;
	},

	getters: {},

	actions: {
		async get_services(saveData = true) {
			const tokenStore = useTokenStore();
			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/settings/v1alpha1/services',
				{}
			);
			console.log(data);
			const servies: Service[] = [];

			for (let i = 0; i < data.services.length; ++i) {
				servies.push({
					...data.services[i],
					status: data.services[i].status === 'enabled'
				});
			}

			if (saveData) {
				this.services = servies;
			}

			return servies;
		},

		async enable_service(service_name: string) {
			const tokenStore = useTokenStore();
			const data: any = await axios.post(
				tokenStore.$state.url +
					'/bfl/settings/v1alpha1/services/' +
					service_name +
					'/enable',
				{}
			);
			console.log(data);
		},

		async disable_service(service_name: string) {
			const tokenStore = useTokenStore();
			const data: any = await axios.post(
				tokenStore.$state.url +
					'/bfl/settings/v1alpha1/services/' +
					service_name +
					'/disable',
				{}
			);
			console.log(data);
		}
	}
});
