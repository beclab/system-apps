<template>
	<div class="fixed-full">
		<FullPageWithBack :title="$t('GPU.GPU_DETAILS')">
			<template #extra>
				<QButtonStyle>
					<q-btn
						class="q-pa-xs"
						dense
						icon="refresh"
						color="ink-2"
						outline
						:disable="loading"
						@click="refreshHandler"
						narrow-indicator
					>
					</q-btn>
				</QButtonStyle>
			</template>

			<div>
				<q-tab-panels
					v-model="tab"
					animated
					swipeable
					vertical
					transition-prev="jump-up"
					transition-next="jump-up"
				>
					<q-tab-panel :name="1" class="q-pa-none">
						<div class="row flex-gap-xl">
							<div class="row items-center">
								<span class="text-body3 text-ink-2"
									>{{ $t('GPU.GRAPHICS_MODEL') }}&nbsp;&nbsp;</span
								>
								<BtSelect
									emit-value
									v-model="gpuType"
									:options="GpuStore.gpuList"
									option-value="type"
									option-label="type"
									:placeholder="$t('GPU.PLEASE_CHOOSE')"
									dense
									outlined
									style="width: 200px"
									@update:model-value="searchGpu"
								/>
							</div>
							<div class="row items-center">
								<span class="text-body3 text-ink-2"
									>{{ $t('GPU.AFFILIATED_NODE') }}&nbsp;&nbsp;</span
								>
								<BtSelect
									emit-value
									v-model="gpuNodeName"
									:options="GpuStore.gpuList"
									option-value="nodeName"
									option-label="nodeName"
									:placeholder="$t('GPU.PLEASE_CHOOSE')"
									dense
									outlined
									style="width: 200px"
									@update:model-value="searchGpu"
								/>
							</div>
							<QInputStyle>
								<div class="row items-center">
									<span class="text-body3 text-ink-2"
										>{{ $t('GPU.GRAPHICS_ID') }}&nbsp;&nbsp;</span
									>
									<q-input
										v-model="gpuUid"
										type="search"
										outlined
										debounce="500"
										:placeholder="$t('GPU.PLEASE_ENTER')"
										clearable
										style="width: 200px"
										@update:model-value="searchGpu"
									>
										<template v-slot:prepend>
											<q-icon name="search" color="ink-2" size="xs" />
										</template>
									</q-input>
								</div>
							</QInputStyle>
						</div>
					</q-tab-panel>
					<q-tab-panel :name="2" class="q-pa-none">
						<div class="row flex-gap-xl">
							<QInputStyle>
								<div class="row items-center">
									<span class="text-body3 text-ink-2"
										>{{ $t('GPU.TASK_NAME') }}&nbsp;&nbsp;</span
									>
									<q-input
										v-model="taskName"
										type="search"
										outlined
										debounce="500"
										:placeholder="$t('GPU.PLEASE_ENTER')"
										clearable
										style="width: 200px"
										@update:model-value="searchTask"
									>
										<template v-slot:prepend>
											<q-icon name="search" color="ink-2" size="xs" />
										</template>
									</q-input>
								</div>
							</QInputStyle>

							<div class="row items-center">
								<span class="text-body3 text-ink-2"
									>{{ $t('GPU.NODE_NAME') }}&nbsp;&nbsp;</span
								>
								<BtSelect
									emit-value
									v-model="taskNodeName"
									:options="GpuStore.taskList"
									option-value="nodeName"
									option-label="nodeName"
									:placeholder="$t('GPU.PLEASE_CHOOSE')"
									dense
									outlined
									style="width: 200px"
									@update:model-value="searchTask"
								/>
							</div>

							<div class="row items-center">
								<span class="text-body3 text-ink-2"
									>{{ $t('GPU.TASK_STATUS') }}&nbsp;&nbsp;</span
								>
								<BtSelect
									v-model="taskStatus"
									:options="TaskStatusOptions"
									:placeholder="$t('GPU.PLEASE_CHOOSE')"
									dense
									outlined
									style="width: 200px"
									@update:model-value="searchTask"
								/>
							</div>
							<div class="row items-center">
								<span class="text-body3 text-ink-2"
									>{{ $t('GPU.GRAPHICS_ID') }}&nbsp;&nbsp;</span
								>
								<BtSelect
									v-model="taskDeviceId"
									:options="GpuStore.deviceIds"
									:placeholder="$t('GPU.PLEASE_CHOOSE')"
									dense
									outlined
									style="width: 200px"
									@update:model-value="searchTask"
								/>
							</div>
						</div>
					</q-tab-panel>
				</q-tab-panels>
			</div>

			<div class="gpu-tabs-wrapper q-pt-md q-mt-md">
				<q-tabs
					v-model="tab"
					align="left"
					content-class="tabs-content-wrapper"
					active-color="primary"
					:breakpoint="0"
					no-caps
					narrow-indicator
					@update:model-value="tabChangeHandler"
				>
					<q-tab :ripple="false" content-class="tabs-content-wrapper" :name="1">
						{{ $t('GPU.GRAPHICS_MANAGEMENT') }}
					</q-tab>
					<q-tab :ripple="false" :name="2">{{
						$t('GPU.TASK_MANAGEMENT')
					}}</q-tab>
				</q-tabs>
				<q-separator />
			</div>

			<div class="q-mt-xl my-tabs-panel-wrapper">
				<q-tab-panels
					v-model="tab"
					animated
					swipeable
					vertical
					transition-prev="jump-up"
					transition-next="jump-up"
				>
					<q-tab-panel :name="1" class="q-pa-none">
						<GPUsTable ref="GPUsTableRef"></GPUsTable>
					</q-tab-panel>
					<q-tab-panel :name="2" class="q-pa-none">
						<TasksTable ref="TasksTableRef"></TasksTable>
					</q-tab-panel>
				</q-tab-panels>
			</div>
		</FullPageWithBack>
		<RouterViewTransition></RouterViewTransition>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Graphics } from 'src/types/gpu';
import FullPageWithBack from '@packages/ui/src/components/FullPageWithBack2.vue';
import QInputStyle from '@packages/ui/src/components/QInputStyle.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import { useQuasar } from 'quasar';
import GPUsTable from './GPUsTable.vue';
import TasksTable from './TasksTable.vue';
import RouterViewTransition from '@packages/ui/src/components/RouterViewTransition.vue';
import { useGpuStore } from 'src/stores/GpuStore';
import BtSelect from '@packages/ui/src/components/Select.vue';
import { useI18n } from 'vue-i18n';
import { TaskStatusOptions } from './config';

const GpuStore = useGpuStore();
const { t } = useI18n();
const $q = useQuasar();

const list = ref<Graphics[]>([]);
const loading = ref(false);
const gpuUid = ref();
const gpuType = ref();
const gpuNodeName = ref();

const taskName = ref();
const taskNodeName = ref();
const taskStatus = ref();
const taskDeviceId = ref();
const tab = ref(1);
const GPUsTableRef = ref();
const TasksTableRef = ref();

const searchGpu = async () => {
	const uid = gpuUid.value || undefined;
	const nodeName = gpuNodeName.value;
	const type = gpuType.value;
	const filter = {
		uid,
		nodeName,
		type
	};
	GPUsTableRef.value.search(filter);
};

const searchTask = () => {
	const name = taskName.value || undefined;
	const nodeName = taskNodeName.value;
	const status = taskStatus.value?.value;
	const deviceId = taskDeviceId.value?.value;
	const filter = {
		name,
		nodeName,
		status,
		deviceId
	};
	TasksTableRef.value.search(filter);
};

const refreshHandler = () => {
	if (tab.value === 1) {
		searchGpu();
	} else {
		searchTask();
	}
};

const tabChangeHandler = () => {
	//
};
</script>

<style lang="scss" scoped>
.q-table {
	background: white;
}
.gpu-tabs-wrapper {
	position: relative;
	font-size: 16px;
	::v-deep(.tabs-content-wrapper .q-tab__content) {
		padding: 16px 0;
	}

	::v-deep(.tabs-content-wrapper .q-tab) {
		padding: 0 12px;
	}
}
.my-tabs-panel-wrapper {
	::v-deep(.q-table th) {
		font-size: 14px;
	}
}
</style>
