<template>
	<q-card class="image-container" flat>
		<q-card-section class="text-h6 text-ink-1">
			{{ t('docker.image_command_title') }}
		</q-card-section>
		<q-card-section class="q-py-none">
			<card-form-item
				:name="t('docker.container_image')"
				:required="true"
				:tip="t('docker.container_image')"
			>
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="containerConfig.image"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.imageName.placeholder"
					:rules="ruleConfig.imageName.rules"
				>
				</q-input>
			</card-form-item>

			<card-form-item
				:name="t('docker.start_command')"
				:required="false"
				:tip="t('docker.start_command')"
			>
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="containerConfig.startCmd"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.startCommand.placeholder"
				>
				</q-input>
			</card-form-item>

			<card-form-item
				:name="t('docker.command_parameters')"
				:required="false"
				:tip="t('docker.command_parameters')"
			>
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="containerConfig.startCmdArgs"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.startCmdArgs.placeholder"
				>
				</q-input>
			</card-form-item>

			<card-form-item
				:name="t('docker.container_port')"
				:required="true"
				:tip="t('docker.container_port')"
			>
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="containerConfig.port"
					lazy-rules
					class="form-item-input"
					input-class="text-ink-2"
					:rules="ruleConfig.websitePort.rules"
					:placeholder="ruleConfig.websitePort.placeholder"
				>
				</q-input>
			</card-form-item>
		</q-card-section>
	</q-card>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ruleConfig } from './../../types/config';
import CardFormItem from './../common/CardFormItem.vue';

const emits = defineEmits(['updateContainer']);

const { t } = useI18n();

const containerConfig = reactive({
	image: '',
	startCmd: '',
	startCmdArgs: '',
	port: 80
});

const updateContainer = () => {
	emits('updateContainer', containerConfig);
};

watch(
	() => containerConfig,
	() => {
		updateContainer();
	},
	{
		deep: true
	}
);
</script>

<style lang="scss" scoped>
.image-container {
	margin: 20px 20px 0 20px;
	padding: 4px;
	border-radius: 12px;
	background-color: $background-1;
}
</style>
