<template>
	<q-dialog
		v-bind="$attrs"
		persistent
		full-width
		full-height
		class="my-dialog-wrapper"
	>
		<q-card class="my-dialog-offset" :style="{ margin: margin }">
			<div class="row items-center my-dialog-title">
				<div class="text-h7">{{ title }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</div>

			<div class="my-dialog-content scroll">
				<slot></slot>
			</div>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted } from 'vue';

interface Props {
	title?: string;
	offsetRatio?: number;
}
const props = withDefaults(defineProps<Props>(), {
	offsetRatio: 0
});
const base = 6;
const margin = `${props.offsetRatio * base}px -${props.offsetRatio * base}px -${
	props.offsetRatio * base
}px ${props.offsetRatio * base}px`;
</script>

<style lang="scss">
$dialogPadding: 8px 16px;
.my-dialog-wrapper {
	.my-dialog-title {
		padding: $dialogPadding;
		box-shadow: 0px 1px $separator-color;
		margin-bottom: 1px;
	}
	.my-dialog-content {
		height: calc(100% - 52px);
	}
}
</style>
