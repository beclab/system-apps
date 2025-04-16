<template>
	<FullPageWithBack :title="$t('PHYSICAL_RESOURCE_MONTORING')">
		<MyCard>
			<MylineChart
				:data="resourcesStore.currentData"
				:split-number-y="7"
				style="height: 446px"
				:loading="resourcesStore.loading"
			/>
		</MyCard>
	</FullPageWithBack>
</template>

<script setup lang="ts">
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack2.vue';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart3.vue';
import MyCard from 'components/MyCard.vue';
import { useResourcesStore } from 'src/stores/Resource';

const resourcesStore = useResourcesStore();
</script>

<style lang="scss" scoped></style>
