<template>
	<MyContentPage>
		<MyPage2>
			<template v-for="(item, index) in tabs" :key="index">
				<MyCar4 square flat :title="item.name">
					<QTableStyle2>
						<q-table
							:rows="tableData(detail, item.value)"
							:columns="columns"
							row-key="name"
							hide-pagination
							flat
							:pagination="undefined"
							@refresh="fetchData"
						>
							<template v-slot:header="props">
								<q-tr :props="props">
									<q-th
										v-for="item in columns"
										:key="item.name"
										:props="props"
										>{{ item.label }}</q-th
									>
								</q-tr>
							</template>
							<template v-slot:body-cell-specPodSelector="props">
								<q-td :props="props">
									<span v-if="isEmpty(props.value)">-</span>
									<Labels v-else :data="props.value" no-empty></Labels>
								</q-td>
							</template>
							<template v-slot:body-cell-separator="props">
								<q-td :props="props">
									<span
										class="text-overline text-grey-5 row items-center justify-center"
										>→</span
									>
								</q-td>
							</template>

							<template v-slot:body-cell-namespaceSelector="props">
								<q-td :props="props">
									<div v-if="isEmpty(get(props.row, 'ipBlock'))">
										<div v-if="get(props.value, 'matchLabels')">
											<Labels :data="props.value.matchLabels"></Labels>
										</div>
										<div v-else>
											{{ get(props.row, 'namespace') }}
										</div>
									</div>
								</q-td>
							</template>
							<template v-slot:body-cell-podSelector="props">
								<q-td :props="props">
									<div v-if="isEmpty(get(props.row, 'ipBlock'))">
										<div v-if="get(props.row, 'matchLabels')">
											<Labels :data="props.value.matchLabels"></Labels>
										</div>
										<div v-else>Any</div>
									</div>
								</q-td>
							</template>
							<template v-slot:body-cell-ipBlock="props">
								<q-td :props="props">
									<span v-if="isEmpty(props.value)">-</span>
									<span v-else>{{ renderIpBlock(props.value) }}</span>
								</q-td>
							</template>
							<template v-slot:body-cell-ports="props">
								<q-td :props="props">
									<div v-if="isEmpty(props.value)">Any</div>
									<div v-else>
										<div v-for="(port, index) in props.value" :key="index">
											{{ port.protocol }}: {{ port.port }}
										</div>
									</div>
								</q-td>
							</template>
							<template #no-data>
								<div class="full-width relative-position" style="height: 480px">
									<Empty3 @click="fetchData"></Empty3>
								</div>
							</template>
						</q-table>
					</QTableStyle2>
				</MyCar4>
			</template>
		</MyPage2>
		<MyLoading2 v-show="loading"> </MyLoading2>
	</MyContentPage>
</template>

<script setup lang="ts">
import { get, isEmpty, toPairs } from 'lodash-es';
import { t } from 'src/boot/i18n';
import { getNetworkpoliciesDetail } from 'src/network';
import { NetworkPoliciesMapper } from 'src/utils/object.mapper';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Labels from '@packages/ui/src/containers/Labels.vue';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';
import Empty3 from '@packages/ui/src/components/Empty3.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MyCar4 from '@packages/ui/src/components/MyCar4.vue';
import QTableStyle2 from '@packages/ui/src/components/QTableStyle2.vue';
import MyLoading2 from '@packages/ui/src/components/MyLoading2.vue';
const tabs = [
	{ name: t('INGRESS_RULES'), value: 'ingress' },
	{ name: t('EGRESS_RULES'), value: 'egress' }
];

const detail = ref();
const loading = ref(false);
const route = useRoute();

const tableData = (detail: any, direction: string) => {
	const originData = get(detail, '_originData');
	const namespace = get(originData, 'metadata.namespace');
	const specPodSelectorData = get(originData, 'spec.podSelector');
	const specPodSelector = toPairs(
		get(specPodSelectorData, 'matchLabels', [])
	).map((kv) => ({ [kv[0]]: kv[1] }));
	const directions = get(originData, `spec.${direction}`, []);
	const fromto = direction === 'ingress' ? 'from' : 'to';
	const data: any = [];

	directions.forEach((direction: any) => {
		const ports = get(direction, 'ports', []);
		const rules = get(direction, `${fromto}`, []);
		rules.forEach((rule: any) => {
			data.push({
				namespace,
				specPodSelector,
				ports,
				direction: direction,
				...rule
			});
		});
	});
	return data;
};

const columns: any = [
	{
		name: 'namespace',
		required: true,
		label: t('Target Project'),
		align: 'left',
		field: 'namespace'
	},
	{
		name: 'specPodSelector',
		align: 'left',
		label: t('LABEL'),
		field: 'specPodSelector'
	},
	{
		name: 'separator',
		align: 'left',
		label: '',
		field: 'namespace'
	},
	{
		name: 'namespaceSelector',
		label: t('Destination Project'),
		align: 'left',
		field: 'namespaceSelector'
	},
	{
		name: 'podSelector',
		label: t('LABEL'),
		align: 'left',
		field: 'podSelector'
	},
	{
		name: 'ipBlock',
		label: 'CIDR',
		align: 'left',
		field: 'ipBlock'
	},
	{
		name: 'ports',
		label: t('PORT'),
		align: 'left',
		field: 'ports'
	}
];

const renderIpBlock = (data: any) =>
	toPairs(data)
		.map((kv) => (kv[0] === 'cidr' ? `${kv[1]}` : kv.join(': ')))
		.reduce((acc: any, x: any) => (acc === null ? x : `${acc} ${x}`), null);

const fetchData = () => {
	const { namespace, name }: { [key: string]: any } = route.params;
	const params = {
		namespace,
		name
	};
	loading.value = true;
	getNetworkpoliciesDetail(params)
		.then((res) => {
			detail.value = NetworkPoliciesMapper(res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

watch([() => route.params.namespace, () => route.params.namespace], () => {
	fetchData();
});

onMounted(() => {
	fetchData();
});
</script>

<style></style>
