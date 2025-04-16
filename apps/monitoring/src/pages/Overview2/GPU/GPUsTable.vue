<template>
	<QTableStyle2 sticky-first sticky-last>
		<q-table
			style="width: 100%"
			:rows="list"
			:columns="columns"
			row-key="uuid"
			:loading="loading"
			v-model:pagination="pagination"
			@request="fetchData"
			flat
			class="my"
		>
			<template #body-cell-uuid="props">
				<q-td :props="props">
					{{ props.value }}
				</q-td>
			</template>

			<template #body-cell-health="props">
				<q-td :props="props">
					<GPUStatus
						:health="props.row.health"
						:is-external="props.row.isExternal"
					></GPUStatus>
				</q-td>
			</template>
			<template #body-cell-vgpu="props">
				<q-td :props="props">
					{{ props.row.isExternal ? '--' : props.row.vgpuUsed }}/{{
						props.row.isExternal ? '--' : props.row.vgpuTotal
					}}
				</q-td>
			</template>

			<template #body-cell-compute="props">
				<q-td :props="props">
					{{ props.row.isExternal ? '--' : props.row.coreUsed }}/{{
						props.row.coreTotal
					}}
				</q-td>
			</template>

			<template #body-cell-memory="props">
				<q-td :props="props">
					{{
						props.row.isExternal
							? '--'
							: (props.row.memoryUsed / 1024).toFixed(1)
					}}/{{ (props.row.memoryTotal / 1024).toFixed(1) }} GiB
				</q-td>
			</template>

			<template #body-cell-operations="props">
				<q-td :props="props">
					<span
						style="width: 68px"
						class="text-right"
						@click="routeTo(props.row)"
						>{{ $t('VIEW_DETAIL') }}</span
					>
				</q-td>
			</template>
			<template v-slot:no-data>
				<div class="row justify-center full-width q-mt-lg">
					<Empty v-show="!loading"></Empty>
				</div>
			</template>
		</q-table>
	</QTableStyle2>
	<q-inner-loading :showing="loading"> </q-inner-loading>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Graphics, GraphicsListParams } from 'src/types/gpu';
import { getGraphicsList } from 'src/network/gpu';
import QTableStyle2 from '@packages/ui/src/components/QTableStyle2.vue';
import Empty from '@packages/ui/src/components/Empty.vue';
import { useRouter } from 'vue-router';
import { ROUTE_NAME } from 'src/router/const';
import { useI18n } from 'vue-i18n';
import GPUStatus from 'src/pages/Overview2/GPU/GPUStatus.vue';
const router = useRouter();
const { t } = useI18n();

const list = ref<Graphics[]>([]);
const loading = ref(false);
const uid_search = ref();
const pagination = ref({
	sortBy: 'uuid',
	descending: true,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0
});

const columns = [
	{
		name: 'uuid',
		label: t('GPU.TASK_MANAGEMENT'),
		field: 'uuid',
		align: 'left'
	},
	{
		name: 'health',
		label: t('GPU.GRAPHICS_STATUS'),
		field: 'health',
		align: 'left'
	},
	{
		name: 'nodeName',
		label: t('GPU.AFFILIATED_NODE'),
		field: 'nodeName',
		align: 'left'
	},
	{
		name: 'type',
		label: t('GPU.GRAPHICS_MODEL'),
		field: 'type',
		align: 'left'
	},
	{
		name: 'vgpu',
		label: t('GPU.V_GPU'),
		field: 'vgpuUsed',
		align: 'left'
	},
	{
		name: 'compute',
		label: t('GPU.ALLOCATED_POWER'),
		field: 'coreUsed',
		align: 'left'
	},
	{
		name: 'memory',
		label: t('GPU.ALLOCATED_MEMORY'),
		field: 'memoryUsed',
		align: 'left'
	},
	{
		name: 'operations',
		label: t('OPERATIONS'),
		field: 'uuid',
		align: 'right'
	}
];

const fetchData = async (filters: GraphicsListParams['filters'] = {}) => {
	loading.value = true;
	try {
		const uid = uid_search.value;
		const params: GraphicsListParams = {
			filters: {},
			pageRequest: {
				pageSize: pagination.value.rowsPerPage,
				pageNo: pagination.value.page,
				sort: pagination.value.descending ? 'DESC' : 'ASC',
				sortField: 'id'
			}
		};

		const res = await getGraphicsList(params);
		list.value = res.data.list;
		pagination.value.rowsNumber = list.value.length;
	} finally {
		loading.value = false;
	}
};

const routeTo = (data: Graphics) => {
	router.push({
		name: ROUTE_NAME.GPUS_DETAILS,
		params: {
			uuid: data.uuid
		}
	});
};

onMounted(() => {
	fetchData();
});

defineExpose({ search: fetchData });
</script>

<style lang="scss" scoped>
.q-table {
	background: white;
}
</style>
