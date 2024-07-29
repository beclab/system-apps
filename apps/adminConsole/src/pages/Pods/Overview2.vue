<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<QButtonStyle>
					<q-btn dense flat icon="sym_r_preview" @click="clickHandler">
						<q-tooltip>
							<div style="white-space: nowrap">
								{{ $t('VIEW_YAML') }}
							</div>
						</q-tooltip>
					</q-btn>
				</QButtonStyle>
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
		<Yaml :name="name" ref="yamlRef"></Yaml>
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
import { computed, ref, watch } from 'vue';
import MyContentPage from '../../components/MyContentPage.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import Yaml from './Yaml.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import { t } from 'src/boot/i18n';
import { get } from 'lodash';

const usePod = UsePod();
const route = useRoute();
const loading = ref(false);
const yamlRef = ref();
const name = computed(() => get(usePod, 'data.name'));
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
const clickHandler = () => {
	yamlRef.value.show();
};
</script>

<style></style>
