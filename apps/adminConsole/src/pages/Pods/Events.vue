<template>
	<MyCard2 no-content-gap square flat :title="t('EVENT_PL')">
		<Event v-if="usePod.data" :detail="usePod.data"></Event>
	</MyCard2>
</template>

<script setup lang="ts">
import Event from '@packages/ui/src/containers/Event.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import MyCard2 from '@packages/ui/src/components/MyCard2.vue';
import { t } from 'src/boot/i18n';

const usePod = UsePod();
</script>
