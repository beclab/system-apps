<template>
	<MyCard flat :title="t('CONTAINERS')">
		<Containers></Containers>
	</MyCard>
</template>

<script setup lang="ts">
import Containers from './Containers.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { t } from 'src/boot/i18n';
</script>

<style></style>
