<template>
	<MyCard3 :title="$t('PERSISTENT_VOLUME_CLAIM_PL')">
		<template #extra>
			<div class="row items-center q-gutter-x-md">
				<Refresh @click="fetchData"></Refresh>
				<NamespacesSelection
					style="min-width: 200px"
					v-model="selectValue"
					@update:model-value="fetchData"
				></NamespacesSelection>
				<QInputStyle>
					<q-input
						v-model="name"
						type="search"
						outlined
						debounce="500"
						:placeholder="t('SEARCH')"
						clearable
						style="min-width: 200px"
						@update:model-value="fetchData"
					/>
				</QInputStyle>
				<q-separator inset vertical />
				<QButtonStyle>
					<q-btn unelevated color="primary" label="Create" no-caps />
				</QButtonStyle>
			</div>
		</template>
		<QTableStyle2 stickyLast>
			<q-table
				:rows="list"
				:columns="columns"
				row-key="name"
				flat
				:loading="loading"
				v-model:pagination="pagination"
				@request="onRequest"
				:rows-per-page-label="$t('RECORDS_PER_PAGE')"
			>
				<template v-slot:header="props">
					<q-tr :props="props">
						<q-th v-for="col in props.cols" :key="col.name" :props="props">
							<div v-if="col.name === 'accessModes'">
								<div color="indigo">
									{{ $t('ACCESS_MODE_TCAP') }}
									<q-icon name="sym_r_info" />
									<q-tooltip
										anchor="top middle"
										self="bottom middle"
										:offset="[10, 10]"
									>
										<div>{{ t('RWO_DESC') }}</div>
										<div>{{ t('ROX_DESC') }}</div>
										<div>{{ t('RWX_DESC') }}</div>
									</q-tooltip>
								</div>
							</div>
							<span v-else>{{ col.label }}</span>
						</q-th>
					</q-tr>
				</template>
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td key="name" :props="props">
							<q-img
								:src="volumesDataIcon"
								:ratio="1"
								spinner-size="xs"
								width="32px"
							/>
							<span class="q-ml-md">{{ props.row.name }}</span>
						</q-td>
						<q-td key="status" :props="props">
							<div class="row items-center">
								<Status :type="props.row.phase"></Status>
								<span class="q-ml-xs">{{
									$t(`VOLUME_STATUS_${props.row.phase.toUpperCase()}`)
								}}</span>
							</div>
						</q-td>
						<q-td key="accessModes" :props="props">
							{{ mapperAccessMode(props.row.accessModes) }}
						</q-td>
						<q-td key="inUse" :props="props">
							{{ props.row.inUse ? $t('MOUNTED') : $t('NOT_MOUNTED') }}
						</q-td>
						<q-td key="createTime" :props="props">
							{{
								getLocalTime(props.row.createTime).format('YYYY-MM-DD HH:mm')
							}}
						</q-td>
						<q-td key="operations" :props="props" style="width: 80px">
							<MoreSelection
								:options="options"
								@click="(data) => moreHandler(props.row, data)"
							></MoreSelection>
						</q-td>
					</q-tr>
				</template>
				<template #loading>
					<MyLoading2></MyLoading2>
				</template>
				<template #no-data>
					<div class="full-width relative-position" style="height: 480px">
						<Empty3 @click="fetchData" v-if="!loading"></Empty3>
					</div>
				</template>
			</q-table>
		</QTableStyle2>
	</MyCard3>

	<Yaml3
		ref="yamlRef"
		:title="t('EDIT_YAML')"
		:name="currentYamlData.name"
		:namespace="currentYamlData.namespace"
		module="persistentvolumeclaims"
	>
	</Yaml3>
	<DeleteDialog
		:title="`${$t('DELETE')} ${$t('PERSISTENT_VOLUME_CLAIM')}`"
		:desc="$t('PERSISTENT_VOLUME_CLAIM')"
		:name="currentYamlData.name"
		:loading="deleteLoading"
		ref="deleteDialogRef"
		@submit="confirmHandler"
	></DeleteDialog>
</template>

<script setup lang="ts">
import MyCard3 from '@packages/ui/src/components/MyCard3.vue';
import Refresh from '@packages/ui/src/components/Refresh.vue';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import QInputStyle from '@packages/ui/src/components/QInputStyle.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import QTableStyle2 from '@packages/ui/src/components/QTableStyle2.vue';
import Empty3 from '@packages/ui/src/components/Empty3.vue';
import {
	getPersistentvolumeclaims,
	deletePersistentvolumeclaims
} from 'src/network';
import volumesDataIcon from '@packages/ui/src/assets/volumes-data.svg';
import { t } from 'boot/i18n';
import { onMounted, ref } from 'vue';
import { ObjectMapper } from '@packages/ui/src/utils/object.mapper';
import Status from '@packages/ui/src/components/Status.vue';
import { getLocalTime, map_accessModes } from 'src/utils';
import NamespacesSelection from 'src/containers/NamespacesSelection.vue';
import MyLoading2 from '@packages/ui/src/components/MyLoading2.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import Yaml3 from '../NamespacePods/Yaml3.vue';
import DeleteDialog from '@packages/ui/src/components/DeleteDialog.vue';
import { useQuasar } from 'quasar';
import { API_VERSIONS } from 'src/utils/constants';
const $q = useQuasar();

const columns = [
	{
		name: 'name',
		required: true,
		label: t('NAME'),
		align: 'left',
		field: 'name',
		sortable: true
	},
	{
		name: 'status',
		align: 'left',
		label: t('STATUS'),
		field: 'status'
	},
	{
		name: 'accessModes',
		align: 'left',
		label: t('ACCESS_MODE_TCAP'),
		field: 'accessModes'
	},
	{
		name: 'inUse',
		label: t('MOUNT_STATUS'),
		align: 'left',
		field: 'inUse'
	},
	{
		name: 'createTime',
		label: t('CREATION_TIME_TCAP'),
		align: 'left',
		field: 'createTime',
		sortable: true
	},
	{
		name: 'operations',
		label: t('OPERATIONS'),
		align: 'center',
		field: 'name',
		sortable: true
	}
];

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

const pagination = ref({
	sortBy: 'createTime',
	descending: true,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0
});
const selectValue = ref();
const name = ref();
const list = ref([]);
const loading = ref(false);
const yamlRef = ref();
const deleteDialogRef = ref();
const deleteLoading = ref(false);
const currentYamlData = ref<any>({});

const onRequest = (props) => {
	const { page, rowsPerPage, sortBy, descending } = props.pagination;
	const filter = props.filter;

	pagination.value = {
		...pagination.value,
		page,
		rowsPerPage,
		sortBy,
		descending
	};
	fetchData();
};

const fetchData = async () => {
	loading.value = true;
	try {
		const params = {
			namespace: selectValue.value,
			name: name.value,
			sortBy: pagination.value.sortBy,
			ascending: !pagination.value.descending,
			limit: pagination.value.rowsPerPage,
			page: pagination.value.page
		};
		console.log('fetchData', getPersistentvolumeclaims);

		const {
			data: { items, totalItems }
		} = await getPersistentvolumeclaims(params);

		list.value = items.map((item) => ObjectMapper.volumes(item));
		pagination.value = {
			...pagination.value,
			rowsNumber: totalItems
		};
	} catch (error) {}
	loading.value = false;
};

const mapperAccessMode = (accessModes) => {
	const modes = map_accessModes(accessModes);

	return modes.join(',');
};

const confirmHandler = async (row) => {
	const module = 'persistentvolumeclaims';
	const apiVersion = API_VERSIONS[module];

	const params = {
		apiVersion,
		module,
		name: currentYamlData.value.name,
		namespace: currentYamlData.value.namespace
	};
	deleteLoading.value = true;
	try {
		const res = await deletePersistentvolumeclaims(params);
		$q.notify({
			type: 'positive',
			message: t('DELETED_SUCCESSFULLY')
		});
		fetchData();
		deleteDialogRef.value && deleteDialogRef.value.hide();
	} catch (error) {
		$q.notify({
			type: 'negative',
			message: JSON.stringify(error || '')
		});
	}
	deleteLoading.value = false;
};

const moreHandler = (data: any, item: any) => {
	currentYamlData.value = data;
	console.log('currentYamlData', currentYamlData.value);
};

onMounted(() => {
	fetchData();
});
</script>

<style></style>
