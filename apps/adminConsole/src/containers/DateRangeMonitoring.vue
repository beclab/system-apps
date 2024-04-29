<template>
	<QSectionStyle>
		<q-select
			v-model="selectValue"
			:options="options"
			dense
			outlined
			@update:model-value="change"
		/>
	</QSectionStyle>
</template>

<script lang="ts">
export interface DateRangeItem {
	label: string;
	value: number;
}

export const options: DateRangeItem[] = [
	{
		label: 'Last 1 hours',
		value: 3600
	},
	{
		label: 'Last 2 hours',
		value: 3600 * 2
	},
	{
		label: 'Last 3 hours',
		value: 3600 * 3
	},
	{
		label: 'Last 5 hours',
		value: 3600 * 5
	},
	{
		label: 'Last 8 hours',
		value: 3600 * 8
	},
	{
		label: 'Last 12 hours',
		value: 3600 * 12
	},
	{
		label: 'Last 1 day',
		value: 3600 * 24
	}
];
</script>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
import QSectionStyle from 'src/components/QSectionStyle.vue';

const selectValue = ref<DateRangeItem>(options[0]);

interface Props {
	defaultValue?: DateRangeItem;
}

const emit = defineEmits<{
	(e: 'change', data: DateRangeItem): void;
}>();

const props = withDefaults(defineProps<Props>(), {});
const { defaultValue } = toRefs(props);
if (defaultValue?.value) {
	selectValue.value = defaultValue.value;
}

const change = (value: DateRangeItem) => {
	emit('change', value);
};
</script>

<style></style>
