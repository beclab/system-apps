<template>
	<q-card class="instance-container" flat>
		<q-card-section class="text-h6 text-ink-1">
			{{ t('image_create') }}
		</q-card-section>

		<q-card-section class="q-py-none">
			<card-form-item
				:name="t('containers_dev_env')"
				:required="true"
				tip="CPU"
			>
				<div class="env-container">
					<q-input
						ref="envRef"
						dense
						borderless
						no-error-icon
						v-model.trim="imageConfig.devEnv"
						class="env-input"
						input-class="env-input-in text-ink-2"
						:rules="ruleConfig.env.rules"
						:placeholder="ruleConfig.env.placeholder"
						:input-style="{ textIndent: '10px' }"
					>
					</q-input>

					<q-select
						dense
						options-dense
						emit-value
						map-options
						borderless
						no-error-icon
						:options="envOptions"
						input-debounce="0"
						hide-dropdown-icon
						class="env-select"
						input-class="env-select-in"
						color="ink-3"
						popup-content-class="options_selected_content"
						@update:model-value="updateEnv"
					>
						<template v-slot:append>
							<div class="select-down">
								<q-icon name="sym_r_keyboard_arrow_down" />
							</div>
						</template>
						<template v-slot:option="{ itemProps, opt }">
							<q-item dense v-bind="itemProps" class="select-item">
								<q-item-section class="select-section text-ink-2">
									<q-item-label>{{ opt.label }}</q-item-label>
								</q-item-section>
							</q-item>
						</template>
					</q-select>
				</div>
			</card-form-item>

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
					v-model="imageConfig.requiredCpu"
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
					v-model="imageConfig.requiredMemory"
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

			<card-form-item
				:name="t('docker.volume_size')"
				:required="true"
				:tip="t('docker.volume_size')"
			>
				<q-input
					ref="volumeRef"
					dense
					borderless
					no-error-icon
					v-model.trim="imageConfig.requiredDisk"
					class="form-item-input"
					input-class="text-ink-2"
					:rules="ruleConfig.volume.rules"
					:placeholder="ruleConfig.volume.placeholder"
				>
					<template v-slot:append>
						<q-select
							dense
							borderless
							v-model="requiredDiskUnit"
							:options="diskOptions"
							dropdown-icon="sym_r_keyboard_arrow_down"
							style="width: 50px"
							@update:model-value="updateDiskUnit"
						/>
					</template>
				</q-input>
			</card-form-item>
		</q-card-section>
	</q-card>
</template>

<script lang="ts" setup>
import { reactive, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ruleConfig } from '@/types/config';
import {
	cpuOptions,
	memoryOptions,
	envOptions,
	diskOptions
} from '@/types/constants';

import CardFormItem from './../common/CardFormItem.vue';

const emits = defineEmits(['updateImage']);

const { t } = useI18n();
const envRef = ref();
const memoryRef = ref();
const cpuRef = ref();
const volumeRef = ref();

const requiredDiskUnit = ref('Mi');
const imageConfig = reactive({
	devEnv: '',
	requiredCpu: '',
	requiredMemory: '',
	requiredDisk: ''
});

const currentCpuOptions = ref(cpuOptions);
const currentMemoryOptions = ref(memoryOptions);

const updateEnv = (value) => {
	imageConfig.devEnv = value;
};

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

const updateImage = () => {
	emits('updateImage', {
		...imageConfig,
		requiredDisk: `${imageConfig.requiredDisk}${requiredDiskUnit.value}`
	});
};

const updateDiskUnit = () => {
	updateImage();
};

watch(
	() => imageConfig,
	() => {
		updateImage();
	},
	{
		deep: true
	}
);

const validate = () => {
	envRef.value.validate();
	memoryRef.value.validate();
	cpuRef.value.validate();
	volumeRef.value.validate();

	if (
		envRef.value.hasError ||
		volumeRef.value.hasError ||
		memoryRef.value.hasError ||
		cpuRef.value.hasError
	) {
		return false;
	}

	return true;
};

defineExpose({
	validate
});
</script>

<style lang="scss" scoped>
.env-container {
	width: 100%;
	height: 42px;
	border: 1px solid $input-stroke;
	border-radius: 8px;
	padding: 0 10px;
	position: relative;
	.env-input {
		width: calc(100% - 40px);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}

	.env-select {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;

		.select-down {
			width: 40px;
			height: 100%;
			background-color: $background-6;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 0 8px 8px 0;
			overflow: hidden;
		}

		::v-deep(.q-field__append) {
			padding: 0 !important;
		}
	}
}

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
