import { defineStore } from 'pinia';
import axios from 'axios';
import { i18n } from '../boot/i18n';
import { CreateWithOneImageConfig } from '@/types/core';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';
import { useDevelopingApps } from './app';
import {
	CreateWithOneDockerConfig,
	APP_STATUS,
	AppState,
	APP_INSTALL_STATE
} from '@/types/core';

const appStore = useDevelopingApps();

export type DockerStore = {
	appStatus: APP_STATUS | undefined;
	appInstallState: APP_INSTALL_STATE | '';
};

export const useDockerStore = defineStore('docker', {
	state() {
		return {
			appStatus: undefined,
			appInstallState: ''
		} as DockerStore;
	},
	actions: {
		async create_name(name: string): Promise<void> {
			await axios.post(appStore.url + '/api/command/apps/create', {
				title: name
			});
		},

		async config_app(config: CreateWithOneDockerConfig): Promise<void> {
			await axios.post(
				appStore.url + `/api/command/apps/${config.name}/create`,
				{
					...config,
					title: appStore.current_app.title
				}
			);
		},

		async create_app(name: string): Promise<void> {
			await axios.post(
				appStore.url + `/api/command/apps/${name}/example/create`,
				{
					title: appStore.current_app.title
				}
			);
		},

		async get_app_status(name: string): Promise<void> {
			const res: { state: APP_STATUS } = await axios.get(
				appStore.url + `/api/apps/${name}/status`
			);

			this.appStatus = res.state;
		},

		async install_app(name: string): Promise<{ namespace: string }> {
			const res: { namespace: string } = await axios.post(
				appStore.url + '/api/command/install-app',
				{
					name,
					title: appStore.current_app.title
				}
			);
			return res;
		},

		async un_install_app(name: string): Promise<void> {
			await axios.post(appStore.url + `/api/command/uninstall/${name}`, {});
			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: i18n.global.t('message.start_uninstalling')
			});
		},

		async delete_app(name: string): Promise<void> {
			await axios.post(appStore.url + '/api/command/delete-app', {
				name
			});
			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: i18n.global.t('message.delete_file_success')
			});
		},

		async get_app_install_state(name: string): Promise<AppState> {
			const res: AppState = await axios.get(
				appStore.url + `/api/app-state?app=${name}`
			);

			return res;
		},

		async create_app_code_in_olares(
			item: CreateWithOneImageConfig
		): Promise<void> {
			await axios.post(
				appStore.url + `/api/command/apps/${item.name}/vscode/create`,
				{
					devEnv: item.devEnv,
					requiredCpu: item.requiredCpu,
					requiredMemory: item.requiredMemory,
					requiredDisk: item.requiredDisk,
					title: appStore.current_app.title
				}
			);
		}
	}
});
