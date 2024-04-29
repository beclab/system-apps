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
				<MyTitleVue>{{ title }}</MyTitleVue>
				<q-space />
				<QButtonStyle size="sm">
					<q-btn icon="close" flat round dense v-close-popup />
				</QButtonStyle>
			</div>

			<div class="my-dialog-content scroll">
				<slot></slot>
			</div>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted } from 'vue';
import MyTitleVue from './MyListItem/MyTitle.vue';
import QButtonStyle from './QButtonStyle.vue';

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

<style lang="scss" scoped>
$dialogPadding: 8px 16px;
.my-dialog-wrapper {
	.my-dialog-title {
		padding: $dialogPadding;
		box-shadow: 0px 1px $separator-color;
	}
	.my-dialog-content {
		// padding: $dialogPadding;
		height: calc(100% - 45px);
	}
}
.my-text-title {
	font-size: 16px;
	font-weight: 400;
}
</style>
