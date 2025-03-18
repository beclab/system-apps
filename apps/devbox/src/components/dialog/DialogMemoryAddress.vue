<template>
	<q-dialog class="card-dialog" v-model="show" ref="dialogRef">
		<q-card class="card-container" flat>
			<terminus-dialog-bar
				label="添加环境变量"
				icon=""
				titAlign="text-left"
				@close="onDialogCancel"
			/>

			<card-form-item
				name="主机路径"
				:required="false"
				tip="主机路径"
				:keyWidth="100"
			>
				<q-select
					dense
					options-dense
					map-options
					borderless
					v-model="memoryConfig.hostPath"
					:options="hostOptions"
					dropdown-icon="sym_r_keyboard_arrow_down"
					class="form-item-input q-mt-xs"
					color="ink-3"
					popup-content-style="padding: 10px;"
				>
					<template v-slot:option="{ itemProps, opt }">
						<q-item
							dense
							v-bind="itemProps"
							style="border-radius: 4px; overflow: hidden"
						>
							<q-item-section class="text-ink-2">
								<q-item-label>{{ opt }}</q-item-label>
							</q-item-section>
						</q-item>
					</template>
				</q-select>
			</card-form-item>

			<card-form-item name="值" :required="false" tip="值" :keyWidth="100">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="memoryConfig.containerPath"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.envConfigValue.placeholder"
					:rules="ruleConfig.envConfigValue.rules"
				>
				</q-input>
			</card-form-item>

			<TerminusFormFooter @cancel="onDialogCancel" />
		</q-card>
	</q-dialog>

	<!-- <bt-custom-dialog
		ref="CustomRef"
		title="添加环境变量"
		:cancel="true"
		:okLoading="loading"
		size="medium"
		:okStyle="{ background: '#00BE9E', color: 'white' }"
		@onSubmit="submit"
	>
		<q-card-section>
			<card-form-item
				name="主机路径"
				:required="false"
				tip="主机路径"
				:keyWidth="100"
			>
				<q-select
					dense
					options-dense
					map-options
					borderless
					v-model="memoryConfig.hostPath"
					:options="hostOptions"
					dropdown-icon="sym_r_keyboard_arrow_down"
					class="form-item-input q-mt-xs"
					color="ink-3"
					popup-content-style="padding: 10px;"
				>
					<template v-slot:option="{ itemProps, opt }">
						<q-item
							dense
							v-bind="itemProps"
							style="border-radius: 4px; overflow: hidden"
						>
							<q-item-section class="text-ink-2">
								<q-item-label>{{ opt }}</q-item-label>
							</q-item-section>
						</q-item>
					</template>
				</q-select>
			</card-form-item>

			<card-form-item name="值" :required="false" tip="值" :keyWidth="100">
				<q-input
					dense
					borderless
					no-error-icon
					v-model.trim="memoryConfig.containerPath"
					class="form-item-input"
					input-class="text-ink-2"
					:placeholder="ruleConfig.envConfigValue.placeholder"
					:rules="ruleConfig.envConfigValue.rules"
				>
				</q-input>
			</card-form-item>
		</q-card-section>
	</bt-custom-dialog> -->
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { ruleConfig } from './../../types/config';
import CardFormItem from './../common/CardFormItem.vue';
import TerminusDialogBar from '../common/TerminusDialogBar.vue';
import TerminusFormFooter from '../common/TerminusFormFooter.vue';

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent();

const memoryConfig = reactive({
	hostPath: '',
	containerPath: ''
});

const show = ref(true);
const loading = ref(false);
const hostOptions = ['/app/data', '/app/cache', 'Home'];

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
