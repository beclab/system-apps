<template>
	<q-card class="instance-container" flat>
		<q-card-section class="text-h6 text-ink-1">
			{{ t('docker.instance_specifications') }}
		</q-card-section>

		<q-card-section class="q-py-none">
			<card-form-item name="CPU" :required="true" tip="CPU">
				<q-select
					ref="cpuRef"
					dense
					options-dense
					map-options
					borderless
					use-input
					input-debounce="0"
					no-error-icon
					v-model="instanceConfig.requiredCpu"
					:options="currentCpuOptions"
					dropdown-icon="sym_r_keyboard_arrow_down"
					class="form-item-input q-mt-xs"
					popup-content-class="options_selected_content"
					color="ink-3"
					popup-content-style="padding: 10px;"
					:rules="ruleConfig.cpu.rules"
					@filter="filterCpuFn"
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

			<card-form-item
				:name="t('docker.memory')"
				:required="true"
				:tip="t('docker.memory')"
			>
				<q-select
					ref="memoryRef"
					dense
					options-dense
					map-options
					borderless
					no-error-icon
					use-input
					input-debounce="0"
					v-model="instanceConfig.requiredMemory"
					:options="currentMemoryOptions"
					dropdown-icon="sym_r_keyboard_arrow_down"
					class="form-item-input q-mt-xs"
					popup-content-class="options_selected_content"
					color="ink-3"
					popup-content-style="padding: 10px;"
					:rules="ruleConfig.memory.rules"
					@filter="filterMemoryFn"
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
				<q-toggle color="teal-6" v-model="instanceConfig.requiredGpu" />
			</card-form-item>

			<card-form-item
				v-if="instanceConfig.requiredGpu"
				:name="t('docker.manufacturer')"
				:required="true"
				:tip="t('docker.manufacturer')"
			>
				<div class="q-pa-md q-gutter-sm">
					<q-radio
						class="q-mr-lg text-ink-1 text-body1"
						dense
						v-model="instanceConfig.gpuVendor"
						:val="VENDOR.NVIDIA"
						label="NVIDIA"
						color="teal-default"
					/>
					<q-radio
						class="q-mr-lg text-ink-1 text-body1"
						dense
						v-model="instanceConfig.gpuVendor"
						:val="VENDOR.AMD"
						label="AMD"
						color="teal-default"
					/>
					<q-radio
						class="q-mr-lg text-ink-1 text-body1"
						dense
						v-model="instanceConfig.gpuVendor"
						:val="VENDOR.INTEL"
						label="Intel"
						color="teal-default"
					/>
				</div>
			</card-form-item>

			<card-form-item name="Postgres" :required="false" tip="Postgres">
				<q-toggle color="teal-6" v-model="instanceConfig.needPg" />
			</card-form-item>

			<card-form-item name="Redis" :required="false" tip="Redis">
				<q-toggle color="teal-6" v-model="instanceConfig.needRedis" />
			</card-form-item>
		</q-card-section>
	</q-card>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { VENDOR } from '@/types/core';
import { ruleConfig } from '@/types/config';
import { cpuOptions, memoryOptions } from '@/types/constants';

import CardFormItem from './../common/CardFormItem.vue';

const emits = defineEmits(['updateInstance']);

const { t } = useI18n();
const memoryRef = ref();
const cpuRef = ref();

const instanceConfig = reactive({
	requiredCpu: '',
	requiredMemory: '',
	requiredGpu: false,
	needPg: false,
	needRedis: false,
	gpuVendor: VENDOR.NVIDIA
});

const currentCpuOptions = ref(cpuOptions);
const currentMemoryOptions = ref(memoryOptions);

const filterCpuFn = (val, update) => {
	if (val === '') {
		update(() => {
			currentCpuOptions.value = cpuOptions;
		});
		return;
	}

	update(() => {
		const needle = val.toLowerCase();
		currentCpuOptions.value = cpuOptions.filter(
			(v) => v.toLowerCase().indexOf(needle) > -1
		);
	});
};

const filterMemoryFn = (val, update) => {
	if (val === '') {
		update(() => {
			currentMemoryOptions.value = memoryOptions;
		});
		return;
	}

	update(() => {
		const needle = val.toLowerCase();
		currentMemoryOptions.value = memoryOptions.filter(
			(v) => v.toLowerCase().indexOf(needle) > -1
		);
	});
};

const updateInstance = () => {
	emits('updateInstance', instanceConfig);
};

watch(
	() => instanceConfig,
	() => {
		updateInstance();
	},
	{
		deep: true
	}
);

const validate = () => {
	memoryRef.value.validate();
	cpuRef.value.validate();

	if (memoryRef.value.hasError || cpuRef.value.hasError) {
		return false;
	}

	return true;
};

defineExpose({
	validate
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
