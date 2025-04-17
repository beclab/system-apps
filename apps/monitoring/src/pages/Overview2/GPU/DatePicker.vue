<template>
	<div class="my-date-picker-container">
		<el-config-provider :locale="lang">
			<el-date-picker
				class="my-date-picker-wrapper"
				v-model="dateValue"
				type="datetimerange"
				unlink-panels
				range-separator="To"
				start-placeholder="Start date"
				end-placeholder="End date"
				:shortcuts="shortcuts"
				:disabled-date="disabledDate"
			/>
		</el-config-provider>
	</div>
</template>

<script lang="ts" setup>
import { ElDatePicker, ElConfigProvider } from 'element-plus';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';
import { useQuasar } from 'quasar';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

const $q = useQuasar();
const { locale } = useI18n();

const lang = computed(() =>
	locale.value.substring(0, 2) === 'zh' ? zhCn : en
);

const props = defineProps<{
	modelValue: [Date, Date] | string;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: [Date, Date] | string];
}>();

const dateValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value)
});

const shortcuts = [
	{
		text: '前 1 小时',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 1);
			return [start, end];
		}
	},
	{
		text: '前 6 小时',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 6);
			return [start, end];
		}
	},
	{
		text: '前 12 小时',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 12);
			return [start, end];
		}
	},
	{
		text: '前 1 天',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24);
			return [start, end];
		}
	},
	{
		text: '前 2 天',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
			return [start, end];
		}
	},
	{
		text: '前 3 天',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
			return [start, end];
		}
	},
	{
		text: '前 1 周',
		value: () => {
			const end = new Date();
			const start = new Date();
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
			return [start, end];
		}
	}
];

const disabledDate = (time: Date) => {
	return time.getTime() >= Date.now();
};

watch(
	() => $q.dark.isActive,
	(newValue) => {
		if (newValue) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	},
	{
		immediate: true
	}
);
</script>

<style scoped lang="scss">
.my-date-picker-container {
	::v-deep(.my-date-picker-wrapper) {
		border-radius: 8px;
		width: 340px;
	}

	::v-deep(.my-date-picker-wrapper.el-input__wrapper) {
		box-shadow: 0 0 0 1px $input-stroke inset;
		background-color: $background-1;
	}

	::v-deep(.my-date-picker-wrapper .el-range-input) {
		color: $ink-2;
		font-size: 12px;
	}

	::v-deep(.my-date-picker-wrapper .el-range-separator) {
		color: $ink-2;
		font-size: 12px;
	}

	::v-deep(.my-date-picker-wrapper .el-input__icon.el-range__icon) {
		color: $ink-3;
		font-size: 12px;
	}

	::v-deep(.my-date-picker-wrapper .el-input__icon .el-range__close-icon) {
		color: $ink-3;
		font-size: 12px;
	}
}
</style>
<style lang="scss"></style>
