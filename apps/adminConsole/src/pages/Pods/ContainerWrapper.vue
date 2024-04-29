<template>
	<MyCard no-content-gap flat :title="t('CONTAINERS')">
		<Containers></Containers>
	</MyCard>
</template>

<script setup lang="ts">
import Containers from '@packages/ui/src/containers/ContainersList/Containers.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { t } from 'src/boot/i18n';
</script>

<style></style>
