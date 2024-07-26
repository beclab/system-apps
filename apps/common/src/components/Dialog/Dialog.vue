<template>
	<q-dialog
		v-model="visible"
		class=""
		persistent
		full-width
		full-height
		@update:model-value="change"
		v-bind="$attrs"
	>
		<div class="container bg-background-1">
			<Header :title="title"></Header>
			<bt-scroll-area style="height: calc(100% - 32px)" class="q-pa-lg">
				<div class="absolute-full">
					<slot></slot>
				</div>
			</bt-scroll-area>
		</div>
	</q-dialog>
</template>

<script setup lang="ts">
import { ref, withDefaults, watch } from 'vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import Header from './Header.vue';

interface Props {
	title?: string;
	modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const visible = ref();
const emits = defineEmits(['update:modelValue']);
const show = () => {
	visible.value = true;
};

watch(
	() => props.modelValue,
	(newValue, oldValue) => {
		if (newValue != visible.value) {
			visible.value = props.modelValue;
		}
	},
	{
		immediate: true
	}
);

const close = () => {
	visible.value = false;
};

const change = () => {
	emits('update:modelValue', visible.value);
};

defineExpose({
	show,
	close
});
</script>
<style lang="scss" scoped>
.container {
	height: calc(100% - 32px);
	border-radius: 12px;
}
</style>
