<template>
	<MyCard square flat :title="t('DETAILS')">
		<DetailPage v-if="usePod.detail" :data="usePod.detail"></DetailPage>
	</MyCard>
	<q-inner-loading :showing="loading"> </q-inner-loading>
</template>

<script setup lang="ts">
import Event from '@packages/ui/src/containers/Event.vue';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import { t } from 'src/boot/i18n';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import { computed, ref } from 'vue';
const loading = ref(false);
const usePod = UsePod();
const name = computed(() => usePod.data?.metadata?.name);
</script>

<style></style>
