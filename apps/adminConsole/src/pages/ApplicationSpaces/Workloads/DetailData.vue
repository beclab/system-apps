<template>
	<DetailPage :data="statusList" col-width="160px"> </DetailPage>
	<q-inner-loading :showing="loading"> </q-inner-loading>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import {
	getNamespacesDetail,
	getWorkloadsControler,
	patchWorkloadsControler
} from 'src/network';
import { getLocalTime } from 'src/utils';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import { ObjectMapper } from 'src/utils/object.mapper';
import { isEmpty } from 'lodash';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
let loading = ref(false);
const detail = ref();
const statusList = ref();
const route = useRoute();

const fetchList = () => {
	const { namespace, kind, pods_name: name }: any = route.params;

	loading.value = true;
	getWorkloadsControler(namespace, kind, name)
		.then((res) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			detail.value = ObjectMapper[kind](res.data);
			statusList.value = getAttrs(detail.value);
		})
		.finally(() => {
			loading.value = false;
		});
};

const getAttrs = (detail: any) => {
	if (isEmpty(detail)) {
		return;
	}
	const { cluster, namespace }: any = route.params;
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
			name: t('APP'),
			value: detail.app
		},
		{
			name: t('CREATION_TIME_TCAP'),
			value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss')
		},
		{
			name: t('UPDATE_TIME_TCAP'),
			value: getLocalTime(detail.updateTime).format('YYYY-MM-DD HH:mm:ss')
		},
		{
			name: t('CREATOR'),
			value: detail.creator
		}
	];
};

watch(
	() => route.params.pods_name,
	async (newId) => {
		fetchList();
	}
);
onMounted(() => {
	fetchList();
});

defineExpose({ update: fetchList });
</script>

<style lang="scss" scoped>
.my-scroll-container {
	margin: 8px;
}
</style>
