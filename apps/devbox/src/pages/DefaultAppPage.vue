<template>
	<div class="empty column items-center justify-center">
		<div class="text-h3 text-ink-1 q-mb-sm">Welcome to DevBox</div>
		<div class="text-subtitle1 text-ink-3">
			An easy way to develop in Olares
		</div>
		<img class="empty-image" src="../assets/empty.svg" />
		<div class="deploy column">
			<div
				class="text-subtitle1 text-teal-pressed deploy-text row items-center justify-start"
				@click="createApp"
			>
				<q-icon class="q-mr-sm" name="sym_r_deployed_code" size="24px" />
				<span>将自己的容器部署到Olares上</span>
			</div>
			<div
				class="text-subtitle1 text-teal-pressed deploy-text row items-center justify-start"
				@click="createEnvConfig"
			>
				<q-icon class="q-mr-sm" name="sym_r_upload_file" size="24px" />
				<span>将第三方的应用移植到Olares上</span>
			</div>
			<div
				class="text-subtitle1 text-teal-pressed deploy-text row items-center justify-start"
			>
				<q-icon class="q-mr-sm" name="sym_r_box_edit" size="24px" />
				<span>在Olares上写程序</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
const emits = defineEmits(['createApp']);
import DialogEnvironmentConfig from './../components/dialog/DialogEnvironmentConfig.vue';

const $q = useQuasar();

const createApp = () => {
	emits('createApp');
};

const createEnvConfig = () => {
	$q.dialog({
		component: DialogEnvironmentConfig
	});
};
</script>
<style lang="scss" scoped>
.empty {
	height: 100vh;
	.empty-image {
		margin: 56px 0 32px;
	}

	.deploy-text {
		margin-bottom: 24px;
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
}
</style>
