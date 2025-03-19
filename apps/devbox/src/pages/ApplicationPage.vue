<template>
	<!-- <default-app-page @createApp="createApp" /> -->

	<application-header :app="app" @onSave="onSave" />

	<div class="container" v-if="app">
		<EditComponent :app="app" />
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useDevelopingApps } from '../stores/app';
import { ApplicationInfo } from 'src/types/core';

import EditComponent from '../components/EditComponent.vue';
import CreateApp from '../components/dialog/CreateApp.vue';

import ApplicationHeader from './ApplicationHeader.vue';
import { ROUTE_NAME } from 'src/common/router-name';

const route = useRoute();
const router = useRouter();
const store = useDevelopingApps();
const $q = useQuasar();

const appState = ref();
const appOperateState = ref();
const appOperateType = ref();
const timer = ref();

const appid = ref<string | undefined>(undefined);
const app = ref<ApplicationInfo>();

const onSave = () => {
	console.log('in save');
	router.push({
		name: ROUTE_NAME.WORKLOAD,
		params: {
			namespace: 'user-system-yangyongheng'
		}
	});
};
const createApp = () => {
	$q.dialog({
		component: CreateApp
	});
};

async function refreshApplication() {
	appid.value = route.params.id as string;
	app.value = store.apps.find((item) => item.id == appid.value);
}

onUnmounted(() => {
	clearInterval(timer.value);
});

watch(
	() => route.params.id,
	async (newVal) => {
		if (newVal) {
			await refreshApplication();
			await getAppState();
		}
	},
	{
		immediate: true
	}
);

async function getAppState() {
	if (timer.value) clearInterval(timer.value);
	await __getAppState();
	timer.value = setInterval(async () => {
		await __getAppState();
	}, 2000);
}

async function __getAppState() {
	try {
		let appOperateState_temp: string;
		let appState_temp: string;
		let appOperateType_temp: string;

		// operate Status
		const data: any = app.value && (await store.getAppState(app.value.appName));
		console.log('appOperateState_temp', data);
		if (!data) {
			return false;
		}
		appOperateState_temp = data.state;
		appOperateType_temp = data.opType;

		if (
			appOperateState_temp === '' ||
			appOperateState_temp === 'canceled' ||
			appOperateState_temp === 'failed' ||
			appOperateState_temp === 'completed'
		) {
			clearInterval(timer.value);
		}

		// App Status
		const res: any = app.value && (await store.getAppStatus(app.value.appName));
		console.log('appState_temp', res);
		if (!res) {
			return false;
		}
		appState_temp = res.status.state;

		if (
			appOperateState_temp === 'failed' &&
			appOperateType_temp === 'install'
		) {
			appState_temp = '';
		}

		if (
			appOperateState_temp === 'failed' &&
			appOperateType_temp === 'uninstall'
		) {
			appState_temp = 'running';
		}

		appOperateType.value = appOperateType_temp;
		appOperateState.value = appOperateState_temp || '';
		appState.value = appState_temp || '';

		if (appState_temp === 'running') {
			clearInterval(timer.value);
			refreshApplication();
		}

		if (appState_temp === 'suspend') {
			clearInterval(timer.value);
		}
	} catch (e: any) {
		// appState.value = null;
		clearInterval(timer.value);
	}
}
</script>
<style scoped lang="scss">
.container {
	height: calc(100vh - 56px);
}
</style>
