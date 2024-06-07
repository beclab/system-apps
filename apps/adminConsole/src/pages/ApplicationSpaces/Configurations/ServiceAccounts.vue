<template>
	<MyContentPage>
		<MyPage>
			<my-card square flat animated :title="t('DETAILS')">
				<DetailPage :data="detail"></DetailPage>
			</my-card>
			<Detail
				v-for="item in secrets"
				:key="item.name"
				:secret="item.name"
				yaml
				:serviceAccountName="serviceAccountName"
			></Detail>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</MyPage>
	</MyContentPage>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { getServiceaccountsItem } from 'src/network';
import { ObjectMapper } from 'src/utils/object.mapper';
import Detail from './Detail.vue';
import { get, isEmpty } from 'lodash-es';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { t } from 'src/boot/i18n';
import { getLocalTime } from 'src/utils';
import MyCard from '@packages/ui/src/components/MyCard2.vue';
import MyPage from '@packages/ui/src/containers/MyPage.vue';
import MyContentPage from 'src/components/MyContentPage.vue';

const loading = ref(false);
const secrets = ref();
const data = ref();
const detail = ref();
const route = useRoute();
const serviceAccountName = ref();

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
			name: t('ROLE'),
			value: detail.role
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

const fetchList = () => {
	const { namespace, name }: any = route.params;

	getServiceaccountsItem(namespace, name)
		.then((res) => {
			secrets.value = get(res.data, 'secrets', []);

			const result = ObjectMapper.serviceaccounts(res.data);
			data.value = result;
			detail.value = getAttrs(result);
			serviceAccountName.value = result.name;
		})
		.finally(() => {
			loading.value = false;
		});
};

watch(
	() => route.params.name,
	async () => {
		fetchList();
	},
	{
		immediate: true
	}
);
</script>
