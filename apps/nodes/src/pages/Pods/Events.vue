<template>
	<MyPage>
		<MyCard square flat :title="t('EVENT_PL')">
			<Event
				v-if="usePod.data"
				:detail="ObjectMapper.pods(usePod.data)"
			></Event>
		</MyCard>
	</MyPage>
</template>

<script setup lang="ts">
import Event from '@packages/ui/src/containers/Event.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import { ObjectMapper } from 'src/utils/object.mapper';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { t } from 'src/boot/i18n';

const usePod = UsePod();
</script>
