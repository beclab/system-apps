<template>
	<MetricsTable
		:websiteId="websiteId"
		type="referrer"
		:valueLabel="t('VIEWS')"
		:loading="loading"
	></MetricsTable>
</template>

<script setup lang="ts">
import MetricsTable from './MetricsTable.vue';
import { t } from 'src/boot/i18n';

interface Props {
	websiteId: string;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});
</script>

<style></style>
