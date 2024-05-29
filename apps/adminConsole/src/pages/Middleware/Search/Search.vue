<template>
	<MyPage2>
		<Empty
			v-if="(!tableData || tableData.length === 0) && !loading"
			center
			size="large"
		></Empty>
		<MyCard no-content-gap flat :title="t('Indexes')">
			<QTableStyle>
				<q-table
					v-model:pagination="pagination"
					:rows="tableData"
					:columns="columns"
					row-key="name"
					flat
					:loading="loading"
					:rows-per-page-options="rowsPerPageOptions"
					@request="onRequest"
				>
					<template v-slot:body-cell-actions="scope">
						<q-td class="text-center">
							<q-btn
								flat
								color="grey-7"
								icon="sym_r_article"
								class="q-px-sm"
								@click="mapHanlder(scope.row)"
							>
								<q-tooltip
									anchor="top middle"
									self="bottom middle"
									:offset="[10, 10]"
									>Mappings</q-tooltip
								>
							</q-btn>
							<q-btn
								flat
								color="grey-7"
								icon="sym_r_search"
								class="q-px-sm"
								@click="searchHanlder(scope.row)"
							>
								<q-tooltip
									anchor="top middle"
									self="bottom middle"
									:offset="[10, 10]"
									>Search</q-tooltip
								>
							</q-btn>
						</q-td>
					</template>
					<template v-slot:no-data>
						<Empty2></Empty2>
					</template>
				</q-table>
			</QTableStyle>
		</MyCard>
	</MyPage2>
	<SearchModal
		ref="SearchModalRef"
		:base64="base64"
		:name="currentRow.name"
	></SearchModal>
	<MappingModal
		ref="MappingModalRef"
		:data="currentRow.actions.mappings"
	></MappingModal>
</template>

<script setup lang="ts">
import { t } from 'src/boot/i18n';
import { ref, watch } from 'vue';
import MyCard from '@packages/ui/src/components/MyCar4.vue';
import { getZincSearchList } from 'src/network/search';
import Empty from '@packages/ui/src/components/Empty.vue';
import Empty2 from '@packages/ui/src/components/Empty2.vue';
import SearchModal from './SearchModal.vue';
import MappingModal from './MappingModal.vue';
import { useMiddlewareSearch } from 'stores/MiddlewareSearch';
import { base64encoded } from './config';
import { useRoute } from 'vue-router';
import { getMiddlewareList } from '@packages/ui/src/network';
import QTableStyle from '@packages/ui/src/components/QTableStyle.vue';
import MyPage2 from '@packages/ui/src/containers/MyPage2.vue';

const middlewareSearch = useMiddlewareSearch();

const route = useRoute();
const selecteIndex = ref(0);
const loading = ref(false);
const SearchModalRef = ref();
const MappingModalRef = ref();
const currentRow = ref<any>({ actions: {} });
const pagination = ref({
	rowsPerPage: 20,
	sortBy: 'name',
	descending: false,
	page: 1,
	rowsNumber: 0
});
const rowsPerPageOptions = ref([5, 10, 20, 50, 100, 500, 1000]);
const base64 = ref('');
const tableData = ref([]);
const columns: any = [
	{
		name: 'name',
		field: (row: Record<string, any>) => row.name,
		label: 'NAME',
		align: 'left',
		sortable: true
	},
	{
		name: 'doc_num',
		field: (row: Record<string, any>) => row.doc_num,
		label: 'DOC_NUM',
		align: 'left',
		sortable: true
	},
	{
		name: 'shard_num',
		field: (row: Record<string, any>) => row.shard_num,
		label: 'SHARD_NUM',
		align: 'left',
		sortable: true
	},
	{
		name: 'storage_size',
		field: (row: Record<string, any>) => row.storage_size,
		label: 'STORAGE_SIZE',
		align: 'left',
		sortable: true
	},
	{
		name: 'storage_type',
		field: (row: Record<string, any>) => row.storage_type,
		label: 'STORAGE_TYPE',
		align: 'left'
	},
	{
		name: 'actions',
		field: (row: Record<string, any>) => row.actions,
		label: 'ACTIONS',
		align: 'center'
	}
];

const searchHanlder = (row: any) => {
	currentRow.value = row;
	SearchModalRef.value.show();
};

const mapHanlder = (row: any) => {
	console.log('mapHanlder', row);
	currentRow.value = row;
	MappingModalRef.value.show();
};

const onRequest = (props: any) => {
	const { page, rowsPerPage, sortBy, descending } = props.pagination;
	pagination.value.page = page;
	pagination.value.rowsPerPage = rowsPerPage;
	pagination.value.sortBy = sortBy;
	pagination.value.descending = descending;
	fetchData();
};
const activeData = ref({
	adminUser: '',
	password: ''
});

const fetchData = () => {
	loading.value = true;
	let page_num = pagination.value.page;
	let page_size = pagination.value.rowsPerPage;
	const params = {
		page_num,
		page_size,
		sort_by: pagination.value.sortBy,
		desc: pagination.value.descending
	};

	const base64 = base64encoded(
		activeData.value.adminUser,
		activeData.value.password
	);
	middlewareSearch.updateAuthorization(base64);
	getZincSearchList(params)
		.then((res) => {
			pagination.value.rowsNumber = res.data.page.total;
			tableData.value = res.data.list.map((data: any) => {
				let storage_size = (data.stats.storage_size / 1024).toFixed(2) + ' KB';
				if (data.stats.storage_size > 1024 * 1024) {
					storage_size =
						(data.stats.storage_size / 1024 / 1024).toFixed(2) + ' MB';
				}
				if (data.stats.storage_size > 1024 * 1024 * 1024) {
					storage_size =
						(data.stats.storage_size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
				}
				return {
					name: data.name,
					doc_num: data.stats.doc_num,
					shard_num: data.shard_num,
					storage_size: storage_size,
					storage_type: data.storage_type,
					wal_size: data.stats.wal_size,
					actions: {
						settings: data.settings,
						mappings: data.mappings
					}
				};
			});
		})
		.finally(() => {
			loading.value = false;
		});
};

const fetchMiddleware = () => {
	loading.value = true;
	const {
		type: middleware,
		name,
		namespace
	}: Record<string, any> = route.params;
	getMiddlewareList(middleware).then((res) => {
		const result = res.data.data;
		const target = result[0];
		if (target) {
			activeData.value = target;
			fetchData();
		}
	});
};

watch(
	() => route.path,
	() => {
		fetchMiddleware();
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.my-menu-link {
	padding: 8px;
}
.my-menu-link-active {
	background-color: rgba(34, 111, 255, 0.12);
}
.form-before {
	width: 88px;
	font-size: 14px;
	color: #484848;
}
</style>
