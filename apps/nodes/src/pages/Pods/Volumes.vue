<template>
	<MyCard square flat :title="t('VOLUMES')">
		<VolumeContainer
			:volumes="volumes"
			:containers="containers"
			:isMultiProject="isMultiProject"
		></VolumeContainer>
	</MyCard>
</template>

<script setup lang="ts">
import { UsePod } from '@packages/ui/src/stores/PodData';
import { t } from 'src/boot/i18n';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import { computed, ref, watchEffect } from 'vue';
import { getWorkloadVolumes } from '@packages/ui/src/utils/workload';
import VolumeContainer from '@packages/ui/src/containers/VolumeContainer.vue';
const usePod = UsePod();
const volumes = ref([]);
const containers = computed(() => usePod?.data?.containers ?? []);
const isMultiProject = computed(() => usePod?.data?.isFedManaged);
watchEffect(async () => {
	volumes.value = await getWorkloadVolumes(usePod?.data ?? {});
});
</script>

<style></style>
