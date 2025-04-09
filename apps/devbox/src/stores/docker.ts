import { defineStore } from 'pinia';
import axios from 'axios';
import { i18n } from '../boot/i18n';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';
import { useDevelopingApps } from './app';
import {
	CreateWithOneDockerConfig,
	APP_STATUS,
	FileItem,
	AppState,
	APP_INSTALL_STATE
} from '@/types/core';

const appStore = useDevelopingApps();

export type DockerStore = {
	appStatus: APP_STATUS | undefined;
	cached: Record<string, FileItem[]>;
	currentFileData: FileItem;
	configEditFlag: boolean;
	appInstallState: APP_INSTALL_STATE | '';
};

export const useDockerStore = defineStore('docker', {
	state() {
		return {
			appStatus: undefined,
			cached: {},
			currentFileData: {},
			configEditFlag: false,
			appInstallState: ''
		} as DockerStore;
	},
	actions: {
		async create_name(name: string): Promise<void> {
			await axios.post(appStore.url + '/api/command/apps/create', {
				name
			});
		},

		async config_app(config: CreateWithOneDockerConfig): Promise<void> {
			await axios.post(
				appStore.url + `/api/command/apps/${config.name}/create`,
				config
			);
		},

		async create_app(name: string): Promise<void> {
			await axios.post(
				appStore.url + `/api/command/apps/${name}/example/create`
			);
		},

		async get_app_status(name: string): Promise<void> {
			const res: { state: APP_STATUS } = await axios.get(
				appStore.url + `/api/apps/${name}/status`
			);

			this.appStatus = res.state;
		},

		async install_app(name: string): Promise<{ namespace: string }> {
			const installRes = await this.get_app_install_status(name);

			if (installRes.name) {
				return BtNotify.show({
					type: NotifyDefinedType.WARNING,
					message: i18n.global.t('task_progress')
				});
			}

			const res: { namespace: string } = await axios.post(
				appStore.url + '/api/command/install-app',
				{
					name
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

		async getFile(path: string): Promise<void> {
			if (path in this.cached) {
				this.currentFileData = this.cached[path];
			} else {
				this.currentFileData = [];
			}

			const res: FileItem = await axios.get(
				appStore.url + '/api/files/' + path
			);

			this.currentFileData = res;
			this.cached[path] = res;
		},

		async putFile(path: string): Promise<void> {
			await axios.put(appStore.url + '/api/files/' + path);

			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: i18n.global.t('message.create_file_success')
			});
		},

		async deleteFile(path: string): Promise<void> {
			await axios.delete(appStore.url + '/api/files/' + path);

			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: i18n.global.t('message.delete_file_success')
			});
		},

		async createFolder(path: string): Promise<void> {
			await axios.post(appStore.url + '/api/files/' + path + '?file_type=dir');

			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: i18n.global.t('message.create_folder_success')
			});
		},

		async pathFile(path: string, params: any, headers: any): Promise<void> {
			await axios.patch(appStore.url + '/api/files/' + path, params, headers);

			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: i18n.global.t('message.rename_folder_success')
			});
		},

		async get_app_install_state(name: string): Promise<AppState> {
			const res: AppState = await axios.get(
				appStore.url + `/api/app-state?app=${name}`
			);

			return res;
		},

		async get_app_install_status(name: string): Promise<AppState> {
			const res: AppState = await axios.get(
				appStore.url + `/api/app-status?app=${name}`
			);

			return res;
		}
	}
});
