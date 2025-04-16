<template>
	<FullPageWithBack :title="$t('PHYSICAL_RESOURCE_MONTORING')">
		<MyCard>gput</MyCard>
	</FullPageWithBack>
</template>

<script setup lang="ts">
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack2.vue';
import MylineChart from '@packages/ui/src/components/Charts/MylineChart3.vue';
import MyCard from 'components/MyCard.vue';
</script>

<style lang="scss" scoped></style>
