<template>
	<MyQDialog2 v-bind="$attrs" v-model="visible" @before-hide="beforeHide">
		<div style="width: 400px" class="q-gutter-y-md">
			<div class="text-ink-2">
				Enter the <span>{{ lowerCase(desc) }}</span> name
				<span class="text-weight-bold">{{ name }}</span> to confirm that you
				understand the risks of this operation.
			</div>
			<q-input
				v-model="deleteId"
				type="text"
				:placeholder="name"
				outlined
				dense
			/>
		</div>
		<div class="text-right q-gutter-x-md q-mt-lg">
			<q-btn
				outline
				unelevated
				color="background-1"
				no-caps
				v-close-popup
				class="btn-border"
			>
				<span class="text-body3 text-ink-2">Cancel</span>
			</q-btn>
			<q-btn
				unelevated
				color="primary"
				no-caps
				:disabled="disabled"
				:loading="loading"
				@click="confirmHandler"
			>
				<span>Confirm</span>
			</q-btn>
		</div>
	</MyQDialog2>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MyQDialog2 from './MyQDialog2.vue';
import { lowerCase } from 'lodash';

interface Props {
	name: string;
	desc: string;
	loading: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits(['submit']);

const visible = ref(false);
const deleteId = ref();

const disabled = computed(
	() => !props.name || !deleteId.value || props.name !== deleteId.value
);

const dialogShow = () => {
	visible.value = true;
};

const dialogHide = () => {
	visible.value = false;
};

const confirmHandler = () => {
	emits('submit');
};

const beforeHide = () => {
	deleteId.value = undefined;
};

defineExpose({ show: dialogShow, hide: dialogHide });
</script>

<style></style>
