<template>
	<QTableStyle2 sticky-first sticky-last>
		<q-table
			style="width: 100%"
			:rows="GpuStore.taskList"
			:columns="columns"
			row-key="uuid"
			:loading="loading"
			v-model:pagination="pagination"
			@request="() => fetchData()"
			flat
			class="my"
		>
			<template #body-cell-uuid="props">
				<q-td :props="props">
					{{ props.value }}
				</q-td>
			</template>

			<template #body-cell-status="props">
				<q-td :props="props">
					<TaskStatus :status="props.row.status"></TaskStatus>
				</q-td>
			</template>

			<template #body-cell-deviceIds="props">
				<q-td :props="props">
					<div
						class="row inline items-center q-py-xs q-px-md text-light-blue-default bg-light-blue-alpha"
						style="border-radius: 4px"
					>
						{{ $t('GPU.V_GPU_COUNT', { count: props.row.deviceIds.length }) }}
						<q-tooltip>
							<div v-for="id in props.row.deviceIds" :key="id">{{ id }}</div>
						</q-tooltip>
					</div>
				</q-td>
			</template>

			<template #body-cell-allocatedMem="props">
				<q-td :props="props">
					{{ roundToDecimal(props.row.allocatedMem / 1024, 1) }} GiB
				</q-td>
			</template>

			<template #body-cell-createTime="props">
				<q-td :props="props">
					{{ timeParse(props.row.createTime) }}
				</q-td>
			</template>
			<template #body-cell-operations="props">
				<q-td :props="props">
					<span
						style="width: 68px"
						class="text-right text-body2 text-light-blue-default cursor-pointer"
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
import { GraphicsListParams, TaskItem, TaskListParams } from 'src/types/gpu';
import { getTaskList } from 'src/network/gpu';
import QTableStyle2 from '@packages/ui/src/components/QTableStyle2.vue';
import Empty from '@packages/ui/src/components/Empty.vue';
import { roundToDecimal, timeParse } from 'src/utils/gpu';
import { useRouter } from 'vue-router';
import { ROUTE_NAME } from 'src/router/const';
import { useI18n } from 'vue-i18n';
import TaskStatus from './TaskStatus.vue';
import { useGpuStore } from 'src/stores/GpuStore';
const GpuStore = useGpuStore();
const router = useRouter();
const { t } = useI18n();
const loading = ref(false);
const uid_search = ref();
const pagination = ref({
	sortBy: 'uuid',
	descending: true,
	page: 1,
	rowsPerPage: 10,
	rowsNumber: 0
});

const columns: any = [
	{
		name: 'name',
		label: t('GPU.TASK_NAME'),
		field: 'name',
		align: 'left'
	},
	{
		name: 'status',
		label: t('GPU.TASK_STATUS'),
		field: 'status',
		align: 'left'
	},
	{
		name: 'nodeName',
		label: t('GPU.AFFILIATED_NODE'),
		field: 'nodeName',
		align: 'left'
	},
	{
		name: 'deviceIds',
		label: t('GPU.ALLOCATED_V_GPU'),
		field: 'deviceIds',
		align: 'left'
	},
	{
		name: 'allocatedCores',
		label: t('GPU.ALLOCATED_POWER'),
		field: 'allocatedCores',
		align: 'left'
	},
	{
		name: 'allocatedMem',
		label: t('GPU.ALLOCATED_MEMORY'),
		field: 'allocatedMem',
		align: 'left'
	},
	{
		name: 'createTime',
		label: t('GPU.TASK_CREATION_TIME'),
		field: 'createTime',
		align: 'left'
	},
	{
		name: 'operations',
		label: t('OPERATIONS'),
		field: 'name',
		align: 'right'
	}
];

const fetchData = async (filters: TaskListParams['filters'] = {}) => {
	loading.value = true;
	try {
		const params: TaskListParams = {
			filters,
			pageRequest: {
				pageSize: pagination.value.rowsPerPage,
				pageNo: pagination.value.page,
				sort: pagination.value.descending ? 'DESC' : 'ASC',
				sortField: 'id'
			}
		};

		const res = await getTaskList(params);
		const items = res.data.items;
		GpuStore.updateTaskList(items);
		pagination.value.rowsNumber = items.length;
	} finally {
		loading.value = false;
	}
};

const routeTo = (data: TaskItem) => {
	router.push({
		name: ROUTE_NAME.TASKS_DETAILS,
		params: {
			name: data.name,
			pod_uid: data.podUid
		}
	});
};

onMounted(() => {
	fetchData();
	GpuStore.getDeviceIds();
});

defineExpose({ search: fetchData });
</script>

<style lang="scss" scoped>
.q-table {
	background: white;
}
</style>
