<template>
	<div class="row items-center flex-gap-sm no-wrap">
		<div
			:style="{
				height: '12px',
				width: '12px',
				borderRadius: '50%',
				display: 'inline-block'
			}"
			:class="[enums[status].color]"
		></div>
		<span>{{ enums[status].text }}</span>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

interface Props {
	status: string;
}
const props = withDefaults(defineProps<Props>(), {
	status: 'unknown'
});

const { t } = useI18n();

const enums = {
	closed: { text: t('COMPLETED'), color: 'bg-status-pending' },
	success: { text: t('RUNNING'), color: 'bg-positive' },
	unknown: { text: t('UNKNOWN'), color: 'bg-status-pending' },
	failed: { text: t('ERROR'), color: 'bg-negative' }
};

const target = computed(() => enums[props.status]);
</script>

<style></style>
