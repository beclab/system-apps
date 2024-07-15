<template>
	<MyContentPage>
		<MyPage2>
			<MyCar4 :title="t('Details')">
				<DetailPage :data="attrs" class="q-mt-lg"></DetailPage>
			</MyCar4>
			<MyCar4 :title="t('Custom Resource')">
				<template #extra>
					<div class="row items-center q-col-gutter-x-md">
						<Refresh @click="refreshHandler"></Refresh>
						<QInputStyle>
							<q-input
								v-model="name"
								type="search"
								outlined
								debounce="500"
								:placeholder="t('SEARCH')"
								clearable
								style="width: 240px"
								@update:model-value="fetchData"
							>
								<template v-slot:prepend>
									<q-icon name="search" size="xs" />
								</template>
							</q-input>
						</QInputStyle>
					</div>
				</template>
				<QTableStyle2 sticky-first sticky-last>
					<q-table
						:rows="list"
						:columns="columns"
						flat
						row-key="name"
						v-model:pagination="pagination"
						@request="requestHandler"
						:loading="loading"
						@refresh="fetchData"
						class="my-sticky-column-table"
					>
						<template>
							<div></div>
						</template>
						<template v-slot:body="props">
							<q-tr :props="props">
								<q-td key="name" :props="props">
									<div class="text-subtitle2 text-grey-10">
										{{ props.row.name }}
									</div>
								</q-td>
								<q-td key="namespace" :props="props">
									{{ props.row.namespace || '-' }}
								</q-td>
								<q-td key="createTime" :props="props">
									{{
										date.formatDate(props.row.createTime, 'YYYY-MM-DD HH:mm:ss')
									}}
								</q-td>
								<q-td key="Operations" :props="props" style="width: 80px">
									<MoreSelection
										:options="options"
										@click="(data) => moreHandler(props.row, data)"
									></MoreSelection>
								</q-td>
							</q-tr>
						</template>
						<template #no-data>
							<div class="full-width relative-position" style="height: 480px">
								<Empty3 @click="fetchData" v-show="!loading"></Empty3>
							</div>
						</template>
						<template #loading>
							<MyLoading2> </MyLoading2>
						</template>
					</q-table>
				</QTableStyle2>
			</MyCar4>
		</MyPage2>
	</MyContentPage>
	<Yaml2
		ref="yamlRef"
		:apiVersion="apiVersion"
		:name="currentName"
		:namespace="currentNamespace"
		:originData="currentYamlData._originData"
		@hide="hideHandler"
		@change="fetchData"
	>
	</Yaml2>
	<DeleteDialog
		:title="`${$t('DELETE')} ${$t('CUSTOM_RESOURCE')}`"
		:desc="$t('CUSTOM_RESOURCE_LOW')"
		:name="currentYamlData.name"
		:loading="deleteLoading"
		ref="deleteDialogRef"
		@submit="confirmHandler"
		@hide="hideHandler"
	></DeleteDialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
	deleteCustomResources,
	deleteCustomApplications,
	getCRDItemList,
	getCustomresourcedefinitions
} from 'src/network';
import { DefaultMapper, ObjectMapper } from 'src/utils/object.mapper';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import { date } from 'quasar';
import { get, isEmpty } from 'lodash';
import DetailPage from '@packages/ui/src/containers/DetailPage.vue';
import MyCar4 from '@packages/ui/src/components/MyCard2.vue';
import Refresh from '@packages/ui/src/components/Refresh.vue';
import QInputStyle from '@packages/ui/src/components/QInputStyle.vue';
import Empty3 from '@packages/ui/src/components/Empty3.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import Yaml2 from '../NamespacePods/Yaml2.vue';
import { useQuasar } from 'quasar';
import QTableStyle2 from '@packages/ui/src/components/QTableStyle2.vue';
import DeleteDialog from '@packages/ui/src/components/DeleteDialog.vue';
import MyLoading2 from '@packages/ui/src/components/MyLoading2.vue';
import { useI18n } from 'vue-i18n';
const $q = useQuasar();
const { t } = useI18n();
const options = [
	{
		label: t('EDIT_YAML'),
		value: 'yaml',
		icon: 'sym_r_edit',
		onClick: () => {
			yamlRef.value && yamlRef.value.show();
		}
	},
	{
		label: t('DELETE'),
		value: 'delete',
		icon: 'sym_r_delete',
		onClick: () => {
			deleteDialogRef.value && deleteDialogRef.value.show();
		}
	}
];
const columns: any = computed(() => {
	const route = useRoute();
	const { module } = route.params;
	const data = [
		{
			name: 'name',
			label: t('NAME'),
			align: 'left',
			field: 'name',
			required: true
		},
		{
			name: 'namespace',
			label: t('NAMESPACE'),
			align: 'left',
			field: 'namespace'
		},
		{
			name: 'createTime',
			label: t('CREATED_TIME'),
			align: 'left',
			field: 'createTime'
		},
		{
			name: 'Operations',
			label: t('OPERATIONS'),
			align: 'center',
			field: 'name'
		}
	];
	if (module === 'applications') {
		data.splice(1, 1);
	}
	return data;
});

const currentYamlData = ref<any>({});
const yamlRef = ref();
const deleteDialogRef = ref();
const list = ref();
const loading = ref(false);
const deleteLoading = ref(false);
const details = ref();
const attrs = ref();
const name = ref();
const route = useRoute();
//
const apiVersion = computed(() => {
	if (!details.value) {
		return '';
	}
	const { group, latestVersion } = details.value;
	return `${group}/${latestVersion}`;
});

const currentName = computed(() => get(currentYamlData.value, 'name'));
const currentNamespace = computed(() =>
	get(currentYamlData.value, 'namespace')
);

const pagination = ref({
	sortBy: 'createTime',
	descending: true,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0
});
const continues = ref<any>({});

const getAttrs = (detail: Record<string, any>) => {
	if (isEmpty(detail)) {
		return;
	}

	return [
		{
			name: t('CLUSTER'),
			value: 'cluster'
		},
		{
			name: t('SCOPE_TCAP'),
			value: detail.scope
		},
		{
			name: t('CREATION_TIME_TCAP'),
			value: date.formatDate(detail.createTime, 'YYYY-MM-DD HH:mm:ss')
		},
		{
			name: t('CREATOR'),
			value: detail.creator || '-'
		}
	];
};

const moreHandler = (data: any, item: any) => {
	currentYamlData.value = data;
};

const refreshHandler = () => {
	fetchData();
};

const confirmHandler = async () => {
	const { module, name, namespace } = details.value;

	deleteLoading.value = true;
	let params = {};
	params = {
		apiVersion: apiVersion.value,
		namespaces: currentYamlData.value.namespace,
		module: module,
		name: currentYamlData.value.name
		// cluster: 'default'
	};
	try {
		const res = await deleteCustomResources(params);
		deleteLoading.value = false;
		deleteDialogRef.value && deleteDialogRef.value.hide();
		$q.notify({
			type: 'positive',
			message: t('DELETED_SUCCESSFULLY')
		});
		fetchData();
	} catch (error) {
		deleteLoading.value = false;

		$q.notify({
			type: 'negative',
			message: JSON.stringify(error)
		});
	}
};

const hideHandler = () => {
	currentYamlData.value = {};
};
const requestHandler = (props: {
	pagination: {
		sortBy: string;
		descending: boolean;
		page: number;
		rowsPerPage: number;
	};
	filter?: string | any;
}) => {
	const { sortBy, descending, page, rowsPerPage } = props.pagination;
	const rowsPerPageNew =
		rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;
	pagination.value.descending = descending;
	pagination.value.page = page;
	pagination.value.rowsPerPage = rowsPerPageNew;
	pagination.value.sortBy = sortBy;
	fetchData();
};

const fetchData = () => {
	const { group, version, module }: { [key: string]: any } = route.params;
	const search = name.value ? `metadata.name=${name.value}` : undefined;
	const { page, rowsPerPage } = pagination.value;

	let params: Record<string, any> = {
		limit: rowsPerPage,
		fieldSelector: search
	};

	if (continues.value[page]) {
		params.continue = continues.value[page];
	}

	loading.value = true;
	getCRDItemList(group, version, module, params)
		.then((res) => {
			list.value = res.data.items.map((item: any) => DefaultMapper(item));
			continues.value[Number(page) + 1] = res.data.metadata.continue;

			if (pagination.value.page === 1) {
				pagination.value.rowsNumber =
					list.value.length + (res.data.metadata.remainingItemCount || 0);
			}
		})
		.finally(() => {
			loading.value = false;
		});
};

const fetchDetails = () => {
	const { group, version, module }: { [key: string]: any } = route.params;
	const type = `${module}.${group}`;
	getCustomresourcedefinitions(type).then((res) => {
		const result = ObjectMapper.customresourcedefinitions(res.data);
		details.value = result;
		attrs.value = getAttrs(result);
	});
};

watch([() => route.params], () => {
	fetchDetails();
	fetchData();
});
onMounted(() => {
	fetchDetails();
	fetchData();
});
</script>

<style lang="scss" scoped>
.my-nodes-container {
	padding: 0 16px;
	line-height: 44px;
	.my-tab-wrapper {
		font-family: 'Roboto';
		font-style: normal;
		font-weight: 500;
		font-size: 12px;
		line-height: 16px;
	}
}
</style>
