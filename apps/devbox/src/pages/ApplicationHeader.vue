<template>
	<div class="container-header row items-center justify-between">
		<div class="row items-center justify-between">
			<div class="row items-center justify-start">
				<div class="app row items-center justify-center">
					<span class="q-ml-sm text-h6 text-ink-1">{{
						store.current_app?.appName
					}}</span>
				</div>
			</div>
		</div>
		<div class="row items-center justify-end">
			<div
				class="status"
				v-if="
					dockerStore.appStatus && dockerStore.appStatus != APP_STATUS.EMPTY
				"
			>
				<span
					class="color"
					:style="{ background: app_status_style[dockerStore.appStatus].color }"
				></span>
				<span class="text-capitalize q-mr-xs">
					{{ t(`appStatus.${dockerStore.appStatus}`) }}
				</span>
			</div>
			<q-separator
				class="q-mx-md"
				v-if="dockerStore.appStatus"
				vertical
				inset
			/>

			<div
				class="operate-btn q-mr-sm q-px-sm row items-center justify-center"
				@click="onPreview"
				v-if="dockerStore.appStatus === APP_STATUS.DEPLOYED"
			>
				<q-icon name="sym_r_preview" size="16px" />
				<span class="operate-btn-install">{{ t('btn_preview') }}</span>
			</div>

			<div
				class="operate-btn operate-disabled q-mr-sm q-px-sm row items-center justify-center"
				v-if="dockerStore.appStatus === APP_STATUS.UNDEPLOY"
			>
				<q-icon name="sym_r_preview" size="16px" />
				<span class="operate-btn-install">{{ t('btn_preview') }}</span>
			</div>

			<div
				v-if="
					!controlFlag &&
					dockerStore.appStatus &&
					[
						APP_STATUS.DEPLOYED,
						APP_STATUS.UNDEPLOY,
						APP_STATUS.ABNORMAL
					].includes(dockerStore.appStatus)
				"
				class="operate-btn q-mr-sm q-px-sm row items-center justify-center"
				@click="onInstall"
			>
				<q-icon name="sym_r_box_edit" size="16px" />
				<span class="operate-btn-install">{{ t('header_btn.apply') }}</span>
			</div>

			<div
				v-if="
					!controlFlag &&
					dockerStore.appStatus &&
					[APP_STATUS.EMPTY, APP_STATUS.DEPLOYING].includes(
						dockerStore.appStatus
					)
				"
				class="operate-btn operate-disabled q-mr-sm q-px-sm row items-center justify-center"
			>
				<q-icon name="sym_r_box_edit" size="16px" />
				<span class="operate-btn-install">{{ t('header_btn.apply') }}</span>
			</div>

			<div
				v-if="controlFlag"
				class="operate-btn q-mr-sm q-px-sm row items-center justify-center"
				@click="openFiles"
			>
				<q-icon name="sym_r_box_edit" size="16px" />
				<span class="operate-btn-install">{{ t('header_btn.edit') }}</span>
			</div>

			<input
				ref="uploadInput"
				type="file"
				style="display: none"
				accept=".zip,.rar,.7z,.tar,.tgz"
				@change="uploadFile"
			/>

			<div class="operate-more">
				<q-icon name="sym_r_more_vert" color="ink-1" />
				<q-menu class="rounded-borders" flat>
					<q-list dense padding>
						<q-item
							class="row items-center justify-start text-ink-2"
							clickable
							v-ripple
							@click="onUploadChart"
							v-close-popup
						>
							<q-icon class="q-mr-xs" name="sym_r_upload" size="20px" />
							{{ t('btn_upload') }}
						</q-item>

						<q-item
							class="row items-center justify-start text-ink-2"
							clickable
							v-ripple
							@click="onDownload"
							v-close-popup
						>
							<q-icon class="q-mr-xs" name="sym_r_download" size="20px" />
							{{ t('btn_download') }}
						</q-item>

						<q-item
							class="row items-center justify-start text-ink-2"
							clickable
							v-ripple
							v-close-popup
							:disable="
								dockerStore.appStatus === APP_STATUS.DEPLOYED ? false : true
							"
							@click="onUninstall"
						>
							<q-icon class="q-mr-xs" name="sym_r_reset_tv" size="20px" />
							{{ t('btn_uninstall') }}
						</q-item>

						<q-item
							class="row items-center justify-start text-ink-2"
							clickable
							v-ripple
							@click="onDeleteApplication"
							v-close-popup
						>
							<q-icon class="q-mr-xs" name="sym_r_delete" size="20px" />
							{{ t('btn_delete') }}
						</q-item>
					</q-list>
				</q-menu>
			</div>
		</div>
	</div>

	<Notify
		v-if="error_message"
		:status="APP_STATUS.ABNORMAL"
		:message="error_message"
		@close="close"
	/>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { ROUTE_NAME } from '../common/router-name';
import { APP_STATUS, app_status_style } from '../types/core';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';

import { useDevelopingApps } from '../stores/app';
import { useDockerStore } from '../stores/docker';
import { useMenuStore } from '../stores/menu';

import DialogConfirm from '../components/dialog/DialogConfirm.vue';
import Notify from './../components/common/Notify.vue';

import { componentName } from 'src/router/const';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useDevelopingApps();
const dockerStore = useDockerStore();
const menuStore = useMenuStore();
const $q = useQuasar();

const uploadInput = ref();
const downloading = ref(false);
const controlFlag = ref(false);

const timer = ref();
const error_message = ref();

const close = () => {
	error_message.value = null;
};

async function onPreview() {
	if (window.top == window) {
		window.open('//' + store.current_app?.entrance, '_blank');
	} else {
		await store.openApplication({
			appid: String(store.current_app?.id),
			path: ''
		});
	}
}

async function onInstall() {
	if (
		!dockerStore.configEditFlag &&
		dockerStore.appStatus === APP_STATUS.DEPLOYED
	) {
		controlFlag.value = true;
		return openSystem();
	}

	$q.loading.show();
	try {
		let namespace = '';
		if (store.current_app) {
			try {
				const res = await dockerStore.install_app(store.current_app.appName);
				namespace = res.namespace;
				await _getAppState();
				controlFlag.value = true;
				await openSystem(namespace);
			} catch (error) {
				await _getAppState();
				error_message.value = error || t('appStatus.abnormal');
			}
		}
		$q.loading.hide();
	} catch (error) {
		$q.loading.hide();
	}
}

async function openSystem(value?: string) {
	let namespace: string;
	if (value) {
		namespace = value;
	} else {
		const url = window.location.origin;
		// const url = 'https://studio.olaresid.olares.cn/';
		namespace = store.current_app.appName + '-dev-' + url.split('.')[1];
	}

	router.push({
		name: ROUTE_NAME.WORKLOAD,
		params: {
			namespace: namespace,
			id: route.params.id
		}
	});
}

async function openFiles() {
	controlFlag.value = false;
	router.push({ path: menuStore.currentItem });
}

function onUninstall() {
	$q.dialog({
		component: DialogConfirm,
		componentProps: {
			title: t('btn_uninstall'),
			message: t('message.uninstall_app')
		}
	}).onOk(async () => {
		$q.loading.show();
		try {
			store.current_app &&
				(await dockerStore.un_install_app(store.current_app.appName));
			$q.loading.hide();
			_getAppState();
		} catch (error) {
			$q.loading.hide();
		}
	});
}

async function onDeleteApplication() {
	$q.dialog({
		component: DialogConfirm,
		componentProps: {
			title: t('btn_delete'),
			message: t('message.delete_app')
		}
	}).onOk(async () => {
		$q.loading.show();

		try {
			store.current_app &&
				(await dockerStore.delete_app(store.current_app.appName));
			$q.loading.hide();
			await store.getApps();
			await menuStore.updateApplications();
			router.push({ path: '/home' });
		} catch (error) {
			$q.loading.hide();
		}
	});
}

async function onDownload() {
	downloading.value = true;
	window.location.href =
		store.url +
		'/api/command/download-app-chart?app=' +
		store.current_app?.appName;
	downloading.value = false;
}

async function onUploadChart() {
	uploadInput.value.value = null;
	uploadInput.value.click();
}

async function uploadFile(event: any) {
	const file = event.target.files[0];
	if (file) {
		const { status, message } = await upload_dev_file(file);
		if (status) {
			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: message
			});
		} else {
			BtNotify.show({
				type: NotifyDefinedType.FAILED,
				message: message
			});
		}
	} else {
		console.log('file selected failure');
	}
}

async function upload_dev_file(
	file: any
): Promise<{ status: boolean; message: string }> {
	try {
		const formData = new FormData();
		formData.append('chart', file);
		store.current_app && formData.append('app', store.current_app.appName);
		await axios.post(store.url + '/api/command/upload-app-chart', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
		return { status: true, message: t('message.successfully') };
	} catch (e: any) {
		console.log(e);
		return { status: false, message: e.message };
	}
}

async function refreshApplication() {
	store.current_app = store.apps.find(
		(item) => item.appName == route.params.id
	);
}

watch(
	() => route.params.id,
	async (newVal) => {
		if (newVal) {
			await refreshApplication();
			await getAppState();

			// if (dockerStore.appStatus === APP_STATUS.DEPLOYED) {
			// 	openSystem();
			// }

			// error_message.value = null;
		}
	},
	{
		immediate: true
	}
);

async function getAppState() {
	if (timer.value) clearInterval(timer.value);
	await _getAppState();
	timer.value = setInterval(async () => {
		await _getAppState();
	}, 5000);
}

const appStatePending = ref(false);

async function _getAppState() {
	if (!route.params.id) {
		return false;
	}

	if (
		dockerStore.appStatus &&
		[APP_STATUS.EMPTY, APP_STATUS.ABNORMAL, APP_STATUS.DEPLOYED].includes(
			dockerStore.appStatus
		)
	) {
		return false;
	}

	if (appStatePending.value) {
		return false;
	}

	appStatePending.value = true;
	try {
		dockerStore.appStatus = await dockerStore.get_app_status(
			route.params.id as string
		);
		appStatePending.value = false;
	} catch (error) {
		appStatePending.value = false;
	}
}

onMounted(() => {
	const flag = Object.values({ ...componentName, ...ROUTE_NAME }).find(
		(item) => item === route.name
	);
	if (flag) {
		controlFlag.value = true;
	} else {
		controlFlag.value = false;
	}
});

onUnmounted(() => {
	clearInterval(timer.value);
});
</script>
<style lang="scss">
.app-container {
	height: 100vh;
}
.rounded-borders {
	border-radius: 12px !important;
	overflow: hidden;
}

.my-active-class {
	height: 52px !important;
}
</style>
<style scoped lang="scss">
.container-header {
	width: 100%;
	height: 56px;
	padding: 0 20px;
	border-bottom: 1px solid $separator;
	.app {
		margin-right: 20px;

		img {
			width: 32px;
			height: 32px;
			border-radius: 8px;
		}
	}

	.event-btn {
		width: 80px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		display: inline-block;
		border-radius: 8px;
		border: 1px solid $btn-stroke;
		overflow: hidden;
		color: $ink-1;
		cursor: pointer;

		&:hover {
			background: $background-hover;
		}
		&.operate-disabled {
			opacity: 0.5;
		}
	}

	.operate-btn {
		height: 32px;
		line-height: 32px;
		text-align: center;
		display: inline-block;
		border-radius: 8px;
		border: 1px solid $btn-stroke;
		overflow: hidden;
		color: $ink-1;

		&:hover {
			background: $background-hover;
		}
		&.operate-disabled {
			opacity: 0.5;
		}

		.operate-btn-install {
			width: 100%;
			height: 100%;
			line-height: 32px;
			padding: 0 8px;
			color: $ink-1;
			font-size: 12px;
			line-height: 100%;
			text-align: center;
			cursor: pointer;

			.ani-loading {
				animation: rotate 1s linear infinite;
			}
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(360deg);
		}
		to {
			transform: rotate(0deg);
		}
	}

	.operate-more {
		width: 32px;
		height: 32px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: 1px solid $btn-stroke;
		cursor: pointer;
		&:hover {
			background: $background-hover;
		}
	}
	.status {
		display: flex;
		align-items: center;
		justify-content: center;
		.color {
			width: 12px;
			height: 12px;
			border-radius: 6px;
			display: inline-block;
			margin-right: 8px;
		}
	}
}
</style>
