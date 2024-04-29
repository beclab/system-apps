<template>
	<MyCard square flat :title="t('EVENT_PL')">
		<Event
			v-if="detail"
			:detail="detail"
			style="max-height: 800px; position: relative"
		>
		</Event>
	</MyCard>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import Event from '@packages/ui/src/containers/NodeEvent.vue';

interface Props {
	detail: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {});
</script>

<style></style>
