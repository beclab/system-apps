<template>
	<div class="container-header row items-center justify-between">
		<div class="row items-center justify-between">
			<div class="row items-center justify-start">
				<div class="app row items-center justify-center">
					<img
						v-if="store.cfg && store.cfg.metadata"
						:src="store.cfg.metadata.icon"
					/>
					<span class="q-ml-sm text-h6 text-ink-1">{{ app.appName }}</span>
				</div>
			</div>
		</div>
		<div class="row items-center justify-end">
			<div class="status" v-if="appState">
				<span
					class="color"
					:style="{
						background:
							appState.toLowerCase() === 'running'
								? statusStyle.running.color
								: statusStyle.pending.color
					}"
				></span>
				<span class="text-capitalize q-mr-xs">
					{{
						appState === 'uninstalling' && appOperateType === 'install'
							? 'installing'
							: appState
					}}</span
				>
			</div>
			<q-separator class="q-mx-md" v-if="appState" vertical inset />

			<div
				class="event-btn q-mr-sm"
				v-if="
					appOperateState === '' ||
					(appOperateType === 'uninstall' && appOperateState === 'completed')
				"
				@click="onInstall"
			>
				{{ t('btn_install') }}
			</div>

			<div
				v-if="
					['downloading', 'processing'].includes(appOperateState) &&
					appState !== 'running' &&
					appOperateType === 'install'
				"
				class="event-btn bg-teal-6 text-white q-mr-sm"
				@mouseenter="handleMouseEnter"
				@mouseleave="handleMouseLeave"
				@click="onCancel"
			>
				{{ showCancel ? t('btn_cancel') : t('btn_installing') }}
			</div>

			<div
				v-if="appState === 'running'"
				class="event-btn q-mr-sm"
				@click="onUpgrade"
			>
				{{ t('btn_upgrade') }}
			</div>

			<div
				v-if="appOperateType === 'uninstall' && appState === 'uninstalling'"
				class="event-btn q-mr-sm"
			>
				Uninstalling
			</div>

			<div
				v-if="appOperateState === 'pending'"
				class="event-btn bg-teal-6 q-mr-sm"
			>
				<img class="ani-loading" src="../assets/icon-loading.svg" />
			</div>

			<div
				class="operate-btn q-mr-sm"
				@click="onPreview"
				v-if="appState === 'running'"
			>
				<div class="operate-btn-install">{{ t('btn_preview') }}</div>
			</div>

			<div class="operate-btn operate-disabled q-mr-sm" v-else>
				<div class="operate-btn-install">{{ t('btn_preview') }}</div>
			</div>

			<div class="operate-btn operate-disabled q-mr-sm" @click="onSave">
				<div class="operate-btn-install">Save</div>
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
							:disable="appState === 'running' ? false : true"
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
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useDevelopingApps } from '../stores/app';
import { useMenuStore } from '../stores/menu';
import axios from 'axios';
import { ApplicationInfo } from '@/types/core';
import { statusStyle } from '../types/constants';
import { useI18n } from 'vue-i18n';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';

import DialogConfirm from '../components/dialog/DialogConfirm.vue';

interface Props {
	app: ApplicationInfo;
}
const props = withDefaults(defineProps<Props>(), {});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useDevelopingApps();
const menuStore = useMenuStore();
const $q = useQuasar();

const uploadInput = ref();
const appState = ref();
const appOperateState = ref();
const appOperateType = ref();
const timer = ref();
const downloading = ref(false);
const showCancel = ref(false);

const appid = ref<string | undefined>(undefined);

const emits = defineEmits(['getAppState', 'onSave']);

const onSave = () => {
	emits('onSave');
};

onUnmounted(() => {
	clearInterval(timer.value);
});

async function onPreview() {
	if (window.top == window) {
		window.open('//' + props.app.entrance, '_blank');
	} else {
		await store.openApplication({
			appid: String(props.app.id),
			path: ''
		});
	}
}

async function onInstall() {
	$q.loading.show();
	try {
		await axios.post(store.url + '/api/command/install-app', {
			name: props.app.appName
		});
		BtNotify.show({
			type: NotifyDefinedType.SUCCESS,
			message: t('message.start_installing')
		});
		emits('getAppState');
	} catch (e: any) {
		console.log(e);
	} finally {
		$q.loading.hide();
	}
}

function onCancel() {
	if (showCancel.value) {
		return false;
	}
	$q.dialog({
		component: DialogConfirm,
		componentProps: {
			title: t('cancel'),
			message: t('cancel_installation')
		}
	}).onOk(async () => {
		$q.loading.show();
		try {
			await axios.post(store.url + `/api/apps/${props.app.appName}/cancel`, {});
			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: t('message.successfully')
			});
			emits('getAppState');
		} catch (e: any) {
			console.log(e);
		} finally {
			$q.loading.hide();
		}
	});
}

function onUpgrade() {
	$q.dialog({
		component: DialogConfirm,
		componentProps: {
			title: t('btn_upgrade'),
			message: t('upgrade_app')
		}
	}).onOk(async () => {
		$q.loading.show();
		try {
			await axios.post(store.url + '/api/command/install-app', {
				name: props.app.appName
			});
			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: t('message.start_upgrade')
			});

			emits('getAppState');
		} catch (e: any) {
			console.log(e);
		} finally {
			$q.loading.hide();
		}
	});
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
			await axios.post(
				store.url + `/api/command/uninstall/${props.app.appName}`,
				{}
			);
			BtNotify.show({
				type: NotifyDefinedType.SUCCESS,
				message: t('message.start_uninstalling')
			});
			emits('getAppState');
		} catch (e: any) {
			console.log(e);
		} finally {
			$q.loading.hide();
		}
	});
}

function handleMouseEnter() {
	showCancel.value = true;
}

function handleMouseLeave() {
	showCancel.value = false;
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
			await axios.post(store.url + '/api/command/delete-app', {
				name: props.app.appName
			});
			await store.getApps();
			await store.getMyContainers();
			await menuStore.updateApplications();

			router.push({ path: '/home' });
		} catch (e: any) {
			console.log(e);
		} finally {
			$q.loading.hide();
		}
	});
}

async function onDownload() {
	downloading.value = true;
	window.location.href =
		store.url + '/api/command/download-app-chart?app=' + props.app.appName;
	downloading.value = false;
}

async function onUploadChart() {
	//  $q.notify('not implement');
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
			store.cfg = await store.getAppCfg(props.app.appName);
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
		formData.append('app', props.app.appName);
		await axios.post(store.url + '/api/command/upload-app-chart', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
		return { status: true, message: t('message.successfully') };
	} catch (e: any) {
		console.log(e);
		return { status: false, message: e.message };
	}
}
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
		width: 80px;
		height: 32px;
		line-height: 32px;
		text-align: center;
		display: inline-block;
		border-radius: 8px;
		border: 1px solid $btn-stroke;
		overflow: hidden;
		color: $ink-1;

		span {
			margin-left: 4px;
		}
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
			display: flex;
			align-items: center;
			justify-content: center;

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
