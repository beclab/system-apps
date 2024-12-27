<template>
	<MyContentPage>
		<template #extra>
			<div class="col-auto">
				<QButtonStyle v-permission>
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
			<Detail
				v-for="item in secrets"
				:key="item.name"
				:secret="item.name"
				yaml
				:serviceAccountName="serviceAccountName"
			></Detail>
			<q-inner-loading :showing="loading"> </q-inner-loading>
		</MyPage>
		<Yaml ref="yamlRef" :title="t('EDIT_YAML')" module="serviceaccounts"></Yaml>
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
import Yaml from 'src/pages/NamespacePods/Yaml3.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';

const loading = ref(false);
const secrets = ref();
const data = ref();
const detail = ref();
const route = useRoute();
const serviceAccountName = ref();
const yamlRef = ref();

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

const clickHandler = () => {
	yamlRef.value.show();
};

watch(
	() => route.params.pods_uid,
	async () => {
		fetchList();
	},
	{
		immediate: true
	}
);
</script>
