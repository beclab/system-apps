<template>
	<Overview></Overview>
	<ContainerWrapper></ContainerWrapper>
	<Volumes></Volumes>
	<Metadata></Metadata>
	<Environments></Environments>
	<Events class="q-mb-md"></Events>
	<q-inner-loading :showing="loading"> </q-inner-loading>
</template>

<script setup lang="ts">
import Overview from './Overview.vue';
import Metadata from './Metadata.vue';
import Environments from './Environments.vue';
import Events from './Events.vue';
import Volumes from './Volumes.vue';
import ContainerWrapper from './ContainerWrapper.vue';
import { getPodDetail } from 'src/network';
import { useRoute } from 'vue-router';
import { UsePod } from '@packages/ui/src/stores/PodData';
import { ref, watch } from 'vue';

const usePod = UsePod();
const route = useRoute();
const loading = ref(false);

const fetchData = () => {
	const { namespace, name }: any = route.params;
	const params = {
		namespace: namespace,
		podName: name
	};
	loading.value = true;
	getPodDetail(params)
		.then((res) => {
			console.log('getPodDetail', res.data);
			usePod.setDetail(res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

watch(() => route.params, fetchData, { immediate: true });
</script>

<style></style>
