<template>
	<q-dialog
		v-model="visible"
		persistent
		full-height
		full-width
		@show="dialogShow"
		@hide="dialogHide"
	>
		<q-card>
			<q-card-section class="row items-center q-pb-sm">
				<div class="text-h6">{{ t('Mappings') }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>
			<q-separator dark color="grey-4" />
			<Yaml
				v-if="aceVisible"
				style="height: calc(100% - 59px)"
				:data="JSON.stringify(data, null, 2)"
				theme="textmate"
				lang="javascript"
			></Yaml>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';
import { ref } from 'vue';
import Yaml from '@packages/ui/src/containers/Yaml.vue';

interface Props {
	data: Record<string, any>;
}

withDefaults(defineProps<Props>(), {});
const visible = ref(false);
const aceVisible = ref(false);

const dialogShow = (evt: Event) => {
	aceVisible.value = true;
};

const dialogHide = (evt: Event) => {
	aceVisible.value = false;
};

function onSubmit() {
	//
}

function onReset() {
	//
}

function show() {
	visible.value = true;
}

defineExpose({ show });
</script>

<style lang="scss" scoped>
.content-wrapper {
	background: $bg-content;
}
</style>
