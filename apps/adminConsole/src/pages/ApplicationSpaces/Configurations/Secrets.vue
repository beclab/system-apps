<template>
	<MyContentPage>
		<MyPage>
			<my-card square flat animated :title="t('DETAILS')">
				<DetailPage :data="detail"></DetailPage>
			</my-card>
			<my-card no-content-gap square flat animated>
				<template #title>
					<div>{{ t('DATA') }}</div>
				</template>
				<template #extra>
					<QButtonStyle size="sm">
						<q-btn
							color="grey-5"
							flat
							dense
							no-caps
							size="sm"
							:icon="
								secretValueVisible ? 'sym_r_visibility_off' : 'sym_r_visibility'
							"
							@click="secretValueVisibleHandler"
						>
						</q-btn>
					</QButtonStyle>
				</template>
				<DataDetail :data="secretObj"> </DataDetail>
			</my-card>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</MyPage>
	</MyContentPage>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { getSecretsData } from 'src/network';
import { ObjectMapper } from 'src/utils/object.mapper';
import Detail from './Detail.vue';
import { isEmpty } from 'lodash-es';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { t } from 'src/boot/i18n';
import { getLocalTime } from 'src/utils';
import { SECRET_TYPES } from 'src/utils/constants';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import { safeBtoa } from '@packages/ui/src/utils/base64';
import DataDetail from '@packages/ui/src/containers/DataDetail.vue';

let loading = ref(false);
const secretValueVisible = ref(false);
const detail = ref();
const route = useRoute();
const secretsData = ref<{ [key: string]: string }>({});

const getAttrs = (detail: any) => {
	const { cluster, namespace } = route.params;
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
			name: t('TYPE'),
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			value: t(SECRET_TYPES[detail.type] || detail.type)
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

const secretObj = computed(() => {
	if (!secretValueVisible.value) {
		const obj = {};
		for (const key in secretsData.value) {
			obj[key] = safeBtoa(secretsData.value[key]);
		}
		return obj;
	}
	return secretsData.value;
});

const fetchDetail = () => {
	const { name, namespace }: any = route.params;
	loading.value = true;
	getSecretsData({ name, namespace })
		.then((res) => {
			const result = ObjectMapper.secrets(res.data);
			secretsData.value = result.data;
			detail.value = getAttrs(result);
		})
		.finally(() => {
			loading.value = false;
		});
};

const secretValueVisibleHandler = () => {
	secretValueVisible.value = !secretValueVisible.value;
};

watch(
	() => route.params.name,
	async () => {
		fetchDetail();
	},
	{
		immediate: true
	}
);
</script>
