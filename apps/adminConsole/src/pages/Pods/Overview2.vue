<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<MoreSelection :options="options" size="md"></MoreSelection>
			</div>
		</template>
		<MyPage>
			<Overview></Overview>
			<ContainerWrapper></ContainerWrapper>
			<Volumes></Volumes>
			<Metadata></Metadata>
			<Environments></Environments>
			<Events></Events>
			<q-inner-loading :showing="loading"></q-inner-loading>
		</MyPage>
		<Yaml name="" ref="yamlRef"></Yaml>
	</MyContentPage>
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
import MyContentPage from '../../components/MyContentPage.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import Yaml from './Yaml.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import { t } from 'src/boot/i18n';

const options = [
	{
		key: 'edit',
		icon: 'sym_r_preview',
		label: t('VIEW_YAML'),
		action: 'edit',
		onClick: () => {
			yamlRef.value.show();
		}
	}
];

const usePod = UsePod();
const route = useRoute();
const loading = ref(false);
const yamlRef = ref();

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
