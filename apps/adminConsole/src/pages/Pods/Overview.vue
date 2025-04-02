<template>
	<MyCard square flat :title="isStudio ? $route.params.name : t('DETAILS')">
		<template #title>
			<MyCardHeader
				:title="isStudio ? $route.params.name : t('DETAILS')"
				:img="selectedNodes?.img"
			/>
		</template>
		<template #extra v-if="$slots.extra">
			<slot name="extra"></slot>
		</template>
		<DetailPage v-if="usePod.detail" :data="usePod.detail"></DetailPage>
	</MyCard>
	<q-inner-loading :showing="loading"> </q-inner-loading>
</template>

<script setup lang="ts">
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import { t } from 'src/boot/i18n';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { ref } from 'vue';
import { useIsStudio } from 'src/stores/hook';
import MyCardHeader from 'src/components/MyCardHeader.vue';
import { selectedNodes } from '../ApplicationSpaces/treeStore';
const isStudio = useIsStudio();
const loading = ref(false);
const usePod = UsePod();
</script>

<style></style>
