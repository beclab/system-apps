<template>
	<FullPageWithBack :title="$t('PHYSICAL_RESOURCE_MONTORING')">
		<template #extra>
			<QInputStyle>
				<q-input
					v-model="name"
					type="search"
					outlined
					debounce="500"
					:placeholder="$t('SEARCH')"
					clearable
					style="width: 240px"
					@update:model-value="searchHandler"
				>
					<template v-slot:prepend>
						<q-icon name="search" color="ink-2" size="xs" />
					</template>
				</q-input>
			</QInputStyle>
			<QButtonStyle>
				<q-btn
					class="q-pa-xs"
					dense
					icon="refresh"
					color="ink-2"
					outline
					style="margin-left: 16px; border-radius: 8px"
					:disable="loading"
					@click="searchHandler"
					narrow-indicator
				>
				</q-btn>
			</QButtonStyle>
		</template>
		<div class="gpu-tabs-wrapper">
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
				<q-tab :ripple="false" :name="2">{{ $t('GPU.TASK_MANAGEMENT') }}</q-tab>
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

const $q = useQuasar();

const list = ref<Graphics[]>([]);
const loading = ref(false);
const name = ref();
const tab = ref(1);
const GPUsTableRef = ref();
const TasksTableRef = ref();

const searchHandler = async () => {
	const filter = {
		uid: name.value
	};
	if (tab.value === 1) {
		GPUsTableRef.value.search(filter);
	} else {
		const filter = {
			name: name.value
		};
		TasksTableRef.value.search(filter);
	}
};

const resetForm = () => [(name.value = undefined)];

const tabChangeHandler = () => {
	resetForm();
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
