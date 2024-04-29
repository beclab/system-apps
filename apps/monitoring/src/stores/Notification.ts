import axios from 'axios';
import { defineStore } from 'pinia';
import { useTokenStore } from './token';
import { NotificationEmailConfig } from '../global';

export interface Notification {
	name: string;
	type: string;
}

export enum NotificationType {
	Email = 'email'
}

export const useNotificationStore = defineStore('notification', {
	state: () => ({
		notications: [
			{
				name: 'Email',
				type: NotificationType.Email
			}
		] as Notification[]
	}),

	getters: {},

	actions: {
		async get_notification_config(
			type: NotificationType
		): Promise<NotificationEmailConfig> {
			const tokenStore = useTokenStore();

			const data: any = await axios.get(
				tokenStore.$state.url + '/bfl/settings/v1alpha1/notification/config',
				{
					params: {
						type
					}
				}
			);
			console.log(data);
			return data;
		},

		get_notification_info(type: NotificationType) {
			return this.notications.find((n) => n.type === type);
		},

		async config_email(emailConfig: NotificationEmailConfig) {
			const tokenStore = useTokenStore();
			// test
			await axios.post(
				tokenStore.$state.url +
					'/bfl/settings/v1alpha1/notification/config/verify',
				emailConfig
			);
			// add
			await axios.post(
				tokenStore.$state.url + '/bfl/settings/v1alpha1/notification/config',
				emailConfig
			);
		},

		async delete_notification_config(type: NotificationType) {
			console.log('type');
			console.log(type);
			const params = {
				type
			};
			console.log(params);
			const tokenStore = useTokenStore();
			const data: any = await axios.delete(
				tokenStore.$state.url + '/bfl/settings/v1alpha1/notification/config',
				{
					params
				}
			);
			console.log(data);
		}
	}
});
