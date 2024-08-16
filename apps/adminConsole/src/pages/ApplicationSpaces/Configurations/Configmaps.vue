<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<QButtonStyle>
					<q-btn dense flat icon="sym_r_edit_square" @click="clickHandler">
						<q-tooltip>
							<div style="white-space: nowrap">
								{{ $t('EDIT_YAML') }}
							</div>
						</q-tooltip>
					</q-btn>
				</QButtonStyle>
			</div>
		</template>
		<MyPage>
			<my-card square flat animated :title="t('DETAILS')">
				<DetailPage :data="detail"></DetailPage>
			</my-card>
			<my-card no-content-gap square flat animated>
				<template #title>
					<div>{{ t('DATA') }}</div>
				</template>
				<DataDetail :data="configmapsData"> </DataDetail>
			</my-card>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</MyPage>
	</MyContentPage>
	<Yaml ref="yamlRef" :title="t('EDIT_YAML')" module="configmaps"></Yaml>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { getConfigmapsData } from 'src/network';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import Detail from './Detail.vue';
import { isEmpty } from 'lodash-es';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { t } from 'src/boot/i18n';
import { getLocalTime } from 'src/utils';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import DataDetail from '@packages/ui/src/containers/DataDetail.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import Yaml from 'src/pages/NamespacePods/Yaml3.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';

let loading = ref(false);
const detail = ref();
const route = useRoute();
const configmapsData = ref<{ [key: string]: string }>({});
const yamlRef = ref();

const getAttrs = (detail: any) => {
	const { cluster, namespace }: any = route.params;

	if (isEmpty(detail)) {
		return;
	}

	return [
		{
			name: t('CLUSTER'),
			value: cluster
		},
		{
			name: t('PROJECT'),
			value: namespace
		},
		{
			name: t('CREATION_TIME_TCAP'),
			value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss')
		},
		{
			name: t('CREATOR'),
			value: detail.creator
		}
	];
};

const fetchDetail = () => {
	const { namespace, name }: any = route.params;
	loading.value = true;
	getConfigmapsData({ name, namespace })
		.then((res) => {
			const result = ObjectMapper.configmaps(res.data);
			configmapsData.value = result.data;
			detail.value = getAttrs(result);
		})
		.finally(() => {
			loading.value = false;
		});
};

const clickHandler = () => {
	yamlRef.value.show();
};

watch(
	() => route.params.pods_uid,
	async () => {
		fetchDetail();
	},
	{
		immediate: true
	}
);
</script>
