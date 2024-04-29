<template>
	<MyPage>
		<MyCard square flat>
			<template #title>
				<q-list separator>
					<q-item style="margin-left: -16px">
						<q-item-section>
							<q-item-label>{{ t('DETAILS') }}</q-item-label>
							<!-- <q-item-label caption>{{ name }}</q-item-label> -->
						</q-item-section>
					</q-item>
				</q-list>
			</template>
			<template #extra>
				<Yaml name="">{{ t('VIEW_YAML') }}</Yaml>
			</template>
			<DetailPage v-if="usePod.detail" :data="usePod.detail"></DetailPage>
		</MyCard>
		<q-inner-loading :showing="loading"> </q-inner-loading>
	</MyPage>
</template>

<script setup lang="ts">
import Event from '@packages/ui/src/containers/Event.vue';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import { t } from 'src/boot/i18n';
import Yaml from './Yaml.vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import { computed, ref } from 'vue';
const loading = ref(false);
const usePod = UsePod();
const name = computed(() => usePod.data?.metadata?.name);
</script>

<style></style>
