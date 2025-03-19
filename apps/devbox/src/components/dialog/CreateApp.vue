<template>
	<q-dialog
		class="create-app"
		position="right"
		full-height
		v-model="show"
		ref="dialogCreateRef"
		tabindex="1"
	>
		<div class="create-container q-pb-lg">
			<div class="row items-center justify-between create-header">
				<span class="text-h6 text-ink-1">使用容器镜像创建应用</span>
				<q-btn
					dense
					flat
					icon="close"
					color="ink-3"
					v-close-popup
					@click="onDialogCancel"
				>
					<q-tooltip>Close</q-tooltip>
				</q-btn>
			</div>
			<div style="height: calc(100% - 64px)">
				<BtScrollArea style="height: 100%; width: 100%">
					<image-deployer />
					<instance-config />
					<environment-config @cancelParent="cancelParent" />
					<memory-address />
				</BtScrollArea>
			</div>
		</div>
	</q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { CreateApplicationConfig } from '@/types/core';

import ImageDeployer from '../config/ImageDeployer.vue';
import InstanceConfig from '../config/InstanceConfig.vue';
import EnvironmentConfig from '../config/EnvironmentConfig.vue';
import MemoryAddress from '../config/MemoryAddress.vue';

const {
	dialogRef: dialogCreateRef,
	onDialogCancel,
	onDialogOK
} = useDialogPluginComponent();

const show = ref(true);

const config = ref<CreateApplicationConfig>({
	name: '',
	type: 'app',
	osVersion: '0.1.0',
	img: 'bytetrade/devbox-app:0.0.1',
	//devEnv: 'beclab/node-ts-dev',
	ports: ['8080'],
	websitePort: '8080',

	systemDB: false,
	redis: false,
	mongodb: false,
	postgreSQL: false,

	systemCall: false,
	ingressRouter: false,
	traefik: false,

	appData: true,
	appCache: true,
	userData: [],

	needGpu: false,
	requiredGpu: '',
	requiredMemory: ''
});

const submit = () => {
	// onDialogOK(checkbox.value);
};

const cancelParent = () => {
	onDialogCancel();
};
</script>

<style lang="scss" scoped>
.create-app {
	padding: 0 !important;
	::v-deep(.q-dialog__inner--minimized) {
		padding: 0;
	}

	.create-container {
		width: calc(100vw * 0.6);
		height: 100vh !important;
		background-color: $background-3;

		.create-header {
			height: 64px;
			background-color: $background-1;
			padding: 0 20px;
		}
	}
}
</style>
