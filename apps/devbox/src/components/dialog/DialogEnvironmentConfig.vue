<template>
	<q-dialog class="card-dialog" v-model="show" ref="dialogRef">
		<q-card class="card-container" flat>
			<terminus-dialog-bar
				:label="t('docker.add_env_variables')"
				icon=""
				titAlign="text-left"
				@close="onDialogCancel"
			/>

			<card-form-item
				:name="t('docker.key')"
				:required="true"
				:tip="t('docker.key')"
				:keyWidth="100"
			>
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="config.key"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.envConfigKey.placeholder"
					:rules="ruleConfig.envConfigKey.rules"
				>
				</q-input>
			</card-form-item>

			<card-form-item
				:name="t('docker.value')"
				:required="true"
				:tip="t('docker.value')"
				:keyWidth="100"
			>
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="config.value"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.envConfigValue.placeholder"
					:rules="ruleConfig.envConfigValue.rules"
				>
				</q-input>
			</card-form-item>

			<TerminusFormFooter @submit="submit" @cancel="onDialogCancel" />
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import { BtNotify, NotifyDefinedType } from '@bytetrade/ui';
import { ruleConfig } from './../../types/config';
import { VariableType } from '@/types/core';
import CardFormItem from './../common/CardFormItem.vue';

import TerminusDialogBar from '../common/TerminusDialogBar.vue';
import TerminusFormFooter from '../common/TerminusFormFooter.vue';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const { t } = useI18n();

const props = defineProps({
	defaultEnv: {
		type: Object as PropType<VariableType>,
		required: false
	},
	envConfig: {
		type: Object as PropType<VariableType[]>,
		required: false
	}
});

const config = reactive({
	key: props.defaultEnv ? props.defaultEnv.key : '',
	value: props.defaultEnv ? props.defaultEnv.value : '',
	id: props.defaultEnv ? props.defaultEnv.id : undefined
});

const show = ref(true);

const submit = () => {
	if (props.envConfig?.find((item) => item.key === config.key)) {
		return BtNotify.show({
			type: NotifyDefinedType.WARNING,
			message: '已存在环境配置'
		});
	}

	onDialogOK(config);
};
</script>

<style lang="scss" scoped>
.card-dialog {
	.card-container {
		width: 560px;
		border-radius: 12px;
		padding: 20px;
		.dialog-content {
			flex: 1;
			padding: 20px 0 32px;
		}
	}
}
</style>
