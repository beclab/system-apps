<template>
	<FullPageWithBack :title="title">
		<Containers hide-terminal hide-log bordered></Containers>
	</FullPageWithBack>
</template>

<script setup lang="ts">
import Containers from '@packages/ui/src/containers/ContainersList/Containers.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack.vue';

const route = useRoute();
const { namespace, name }: Record<string, any> = route.params;
const title = computed(() => `${namespace}/${name}`);
</script>

<style></style>
