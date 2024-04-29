<template>
	<div class="row">
		<MetricCard :value="data.pageviews?.length" label="Views" hideComparison />
		<MetricCard
			:value="data.visitors?.length"
			label="Visitors"
			hideComparison
		/>
		<MetricCard :value="data.events?.length" label="Events" hideComparison />
		<MetricCard
			:value="data.countries?.length"
			label="Countries"
			hideComparison
		/>
	</div>
</template>

<script setup lang="ts">
import MetricCard from './MetricCard.vue';
import { computed, toRefs } from 'vue';
interface Props {
	data: any;
}

const props = withDefaults(defineProps<Props>(), {});
const pageviews = computed(() => props.data.pageviews);
const visitors = computed(() => props.data.visitors);
const events = computed(() => props.data.events);
const countries = computed(() => props.data.countries);

const formatMessage = (value: string) => {
	return value;
};
</script>

<style></style>
