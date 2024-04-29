<template>
	<QSectionStyle>
		<q-select
			v-model="dateValue[websiteId]"
			:options="dateFilterOption"
			outlined
			dense
			option-label="label"
			option-value="value"
			@update:model-value="change"
		/>
	</QSectionStyle>
</template>

<script setup lang="ts">
import { dateValue, dateFilterOption } from './DatefilterState';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';

interface Props {
	websiteId: string;
}

withDefaults(defineProps<Props>(), {});
const emits = defineEmits(['change']);
const change = () => {
	emits('change');
};
</script>

<style></style>
