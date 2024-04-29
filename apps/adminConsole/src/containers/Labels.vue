<template>
	<span v-for="(value, key) in data" :key="key">
		<q-chip square>
			<q-avatar
				style="width: auto; padding: 0 8px 0px 12px"
				color="primary"
				text-color="white"
			>
				<div v-if="key">{{ key }}</div>
			</q-avatar>
			{{ value }}
		</q-chip>
	</span>
</template>

<script setup lang="ts">
interface Props {
	data: { [key: string]: string };
	noEmpty: boolean;
}
const props = withDefaults(defineProps<Props>(), {
	noEmpty: false
});
</script>

<style></style>
