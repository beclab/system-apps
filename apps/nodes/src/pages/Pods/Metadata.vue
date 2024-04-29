<template>
	<MyPage>
		<Metadata v-if="metadata" :data="metadata"></Metadata>
	</MyPage>
</template>

<script setup lang="ts">
import Metadata from '@packages/ui/src/containers/Metadata.vue';
import { UsePod } from '@packages/ui/src/stores/PodData';
import { toRefs, computed } from 'vue';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { t } from 'src/boot/i18n';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import { get } from 'lodash';

const usePod = UsePod();

const metadata = computed(() => get(usePod.data, 'metadata'));
</script>

<style></style>
