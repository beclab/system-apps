<template>
	<q-card class="instance-container" flat>
		<q-card-section class="text-h6 text-ink-1"> 示例规格 </q-card-section>

		<q-card-section class="q-py-none">
			<card-form-item name="CPU" :required="true" tip="CPU">
				<q-select
					dense
					options-dense
					map-options
					borderless
					v-model="instanceConfig.cpu"
					:options="cpuOptions"
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

			<card-form-item name="内存" :required="true" tip="内存">
				<q-select
					dense
					options-dense
					map-options
					borderless
					v-model="instanceConfig.memory"
					:options="memoryOptions"
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

			<card-form-item name="GPU" :required="false" tip="GPU">
				<q-toggle color="teal-6" v-model="instanceConfig.gpu" />
			</card-form-item>

			<card-form-item name="Postgres" :required="false" tip="Postgres">
				<q-toggle color="teal-6" v-model="instanceConfig.postgres" />
			</card-form-item>

			<card-form-item name="Redis" :required="false" tip="Redis">
				<q-toggle color="teal-6" v-model="instanceConfig.redis" />
			</card-form-item>
		</q-card-section>
	</q-card>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { cpuOptions, memoryOptions } from './../../types/constants';
import CardFormItem from './../common/CardFormItem.vue';

const instanceConfig = reactive({
	cpu: '',
	memory: '',
	gpu: false,
	postgres: false,
	redis: false
});
</script>

<style lang="scss" scoped>
.instance-container {
	margin: 20px 20px 0 20px;
	padding: 4px;
	border-radius: 12px;
	background-color: $background-1;
}
::v-deep(.q-toggle__track) {
	height: 0.6em !important;
	width: 1.1em !important;
	border-radius: 0.3em;
	position: absolute;
	top: 0.21em;
	left: 0.16em;
	background: #dbdbdb;
	opacity: 1;
}

::v-deep(.q-toggle__thumb::before) {
	background: none !important;
}
::v-deep(.q-toggle__thumb:after) {
	box-shadow: none;
}
</style>
