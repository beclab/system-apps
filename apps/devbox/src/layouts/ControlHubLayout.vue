<template>
	<div class="app-layout">
		<ApplicationHeader @update-notify="updateNotify"></ApplicationHeader>

		<Notify
			v-if="error_message"
			:status="APP_STATUS.ABNORMAL"
			:message="error_message"
			@close="close"
		/>

		<div class="app-container">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { APP_STATUS } from '../types/core';
import ApplicationHeader from '@/pages/ApplicationHeader.vue';
import Notify from './../components/common/Notify.vue';

const error_message = ref();

const updateNotify = (value) => {
	error_message.value = value;
};

const close = () => {
	error_message.value = null;
};
</script>

<style>
.app-layout {
	height: 100vh;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	flex-direction: column;
}

.app-container {
	flex: 1;
	width: 100%;
	overflow: hidden;
}

.my-menu-before-scroll {
	height: calc(100vh - 76px) !important;
}

.my-menu-after-content {
	padding-bottom: 300px !important;
	.q-scrollarea__content {
		padding-bottom: 60px !important;
	}
}
</style>
