<template>
	<q-dialog
		v-bind="$attrs"
		persistent
		class=""
		@hide="emits('hide')"
		@show="emits('show')"
	>
		<q-card class="my-dialog-wrapper">
			<div class="row items-center my-dialog-title bg-grey-1 q-py-sm q-px-md">
				<div class="text-subtitle3 text-grey-10">{{ title }}</div>
				<q-space />
				<QButtonStyle size="sm">
					<q-btn
						icon="close"
						color="grey-5"
						size="sm"
						flat
						dense
						v-close-popup
					/>
				</QButtonStyle>
			</div>

			<div class="q-pa-lg">
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

const emits = defineEmits<{
	(event: 'hide'): void;
	(event: 'show'): void;
}>();
</script>

<style lang="scss" scoped>
.my-dialog-wrapper {
	border-radius: 12px;
}
.my-dialog-title {
}
</style>
