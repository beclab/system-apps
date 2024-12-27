<template>
	<component :is="drawer ? MyContentPage2 : MyContentPage">
		<template #extra>
			<div class="col-auto">
				<QButtonStyle>
					<q-btn dense flat icon="sym_r_insert_chart" @click="clickHandler">
						<q-tooltip>
							<div style="white-space: nowrap">
								{{ $t('DETAILS') }}
							</div>
						</q-tooltip>
					</q-btn>
				</QButtonStyle>
				<MoreSelection
					:options="options"
					size="md"
					v-permission
				></MoreSelection>
			</div>
		</template>
		<EnvironmentVariables ref="envRef"> </EnvironmentVariables>
		<Yaml
			ref="yamlRef"
			:name="t('EDIT_YAML')"
			name-key="pods_name"
			@change="fetchList"
		></Yaml>
		<Dialog2 :title="$t('DETAILS')" ref="dialog2Ref" full-width full-height>
			<PodsMonitoring></PodsMonitoring>
		</Dialog2>
		<DeleteDialog
			:title="`${$t('STOP_POD')} ${$route.params.pods_name}`"
			:desc="$t('POD')"
			:name="$route.params.pods_name"
			ref="deleteDialogRef"
			@submit="confirmHandler"
		></DeleteDialog>
		<DeleteDialog
			:title="`${$t('RESTART_POD')} ${$route.params.pods_name}`"
			:desc="$t('POD')"
			:name="$route.params.pods_name"
			ref="deleteDialogRef2"
			@submit="confirmHandler2"
		></DeleteDialog>
	</component>
</template>

<script setup lang="ts">
import { ref, withDefaults, computed } from 'vue';
import { t } from 'src/boot/i18n';
import EnvironmentVariables from 'src/containers/EnvironmentVariables.vue';
import Yaml from 'src/pages/NamespacePods/Yaml.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MyContentPage2 from 'src/components/MyContentPage2.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import Dialog2 from '@packages/ui/src/components/Dialog/Dialog.vue';
import PodsMonitoring from './PodsMonitoring/PodsMonitoring.vue';
import MoreSelection from '@packages/ui/src/components/MoreSelection.vue';
import { replicaStatus } from 'src/containers/Replica';
import { restartPods } from 'src/network';
import { useRoute } from 'vue-router';
import { usePodList } from '@packages/ui/src/stores/podList';
import DeleteDialog from '@packages/ui/src/components/DeleteDialog.vue';

const podList = usePodList();
interface Props {
	drawer: boolean;
}
const deleteDialogRef = ref();
const deleteDialogRef2 = ref();
const route = useRoute();
const options = computed(() => [
	{
		label: t('EDIT_YAML'),
		value: 'edit',
		icon: 'sym_r_edit',
		onClick: () => {
			yamlRef.value.show();
		}
	},
	{
		label: t(replicaStatus.value.desire ? 'STOP_POD' : 'START_POD'),
		value: 'edit',
		icon: replicaStatus.value.desire
			? 'sym_r_stop_circle'
			: 'sym_r_play_circle',
		onClick: () => {
			console.log('STOP_POD');
			if (replicaStatus.value.desire) {
				deleteDialogRef.value && deleteDialogRef.value.show();
			} else {
				envRef.value.replicaChange(1);
			}
		}
	},
	{
		label: t('RESTART_POD'),
		value: 'edit',
		icon: 'sym_r_restart_alt',
		disable: !replicaStatus.value.desire,
		onClick: () => {
			deleteDialogRef2.value && deleteDialogRef2.value.show();
		}
	}
]);

const confirmHandler = () => {
	envRef.value.replicaChange(0);
	deleteDialogRef.value && deleteDialogRef.value.hide();
};

const confirmHandler2 = () => {
	Promise.all(
		podList.data.map((item) => restartPods(item.namespace, item.name))
	).then(() => {
		deleteDialogRef2.value && deleteDialogRef2.value.hide();
	});
};

withDefaults(defineProps<Props>(), {
	drawer: false
});
const dialog2Ref = ref();
const yamlRef = ref();
const detaiDatalRef = ref();
const envRef = ref();

const clickHandler = () => {
	dialog2Ref.value.show();
};

const clickHandler2 = () => {
	yamlRef.value.show();
};

const fetchList = () => {
	detaiDatalRef.value && detaiDatalRef.value.update();
};
</script>
