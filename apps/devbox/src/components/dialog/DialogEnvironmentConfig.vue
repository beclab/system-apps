<template>
	<q-dialog class="card-dialog" v-model="show" ref="dialogRef">
		<q-card class="card-container" flat>
			<terminus-dialog-bar
				label="添加环境变量"
				icon=""
				titAlign="text-left"
				@close="onDialogCancel"
			/>
			<card-form-item name="键" :required="false" tip="键" :keyWidth="100">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="envConfig.key"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.envConfigKey.placeholder"
					:rules="ruleConfig.envConfigKey.rules"
				>
				</q-input>
			</card-form-item>

			<card-form-item name="值" :required="false" tip="值" :keyWidth="100">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="envConfig.value"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.envConfigValue.placeholder"
					:rules="ruleConfig.envConfigValue.rules"
				>
				</q-input>
			</card-form-item>

			<TerminusFormFooter />
		</q-card>
	</q-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { ruleConfig } from './../../types/config';
import CardFormItem from './../common/CardFormItem.vue';

import TerminusDialogBar from '../common/TerminusDialogBar.vue';
import TerminusFormFooter from '../common/TerminusFormFooter.vue';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const envConfig = reactive({
	key: '',
	value: ''
});

const loading = ref(false);

const show = ref(true);

const submit = () => {
	console.log('submit');
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
