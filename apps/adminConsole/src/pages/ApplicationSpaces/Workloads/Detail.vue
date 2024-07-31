<template>
	<component :is="drawer ? MyContentPage2 : MyContentPage">
		<template #extra>
			<div class="col-auto">
				<QButtonStyle>
					<q-btn dense flat icon="sym_r_insert_chart" @click="clickHandler">
						<q-tooltip>
							<div style="white-space: nowrap">
								{{ $t('MONITORING') }}
							</div>
						</q-tooltip>
					</q-btn>
				</QButtonStyle>
				<QButtonStyle>
					<q-btn dense flat icon="sym_r_edit_square" @click="clickHandler2">
						<q-tooltip>
							<div style="white-space: nowrap">
								{{ $t('EDIT_YAML') }}
							</div>
						</q-tooltip>
					</q-btn>
				</QButtonStyle>
			</div>
		</template>
		<EnvironmentVariables>
			<DetailData ref="detaiDatalRef"></DetailData>
		</EnvironmentVariables>
		<Yaml
			ref="yamlRef"
			:name="t('EDIT_YAML')"
			name-key="pods_name"
			@change="fetchList"
		></Yaml>
		<Dialog2
			:title="$route.params.name"
			ref="dialog2Ref"
			full-width
			full-height
		>
			<PodsMonitoring></PodsMonitoring>
		</Dialog2>
	</component>
</template>

<script setup lang="ts">
import { ref, withDefaults } from 'vue';
import { t } from 'src/boot/i18n';
import EnvironmentVariables from 'src/containers/EnvironmentVariables.vue';
import Yaml from 'src/pages/NamespacePods/Yaml.vue';
import MyContentPage from 'src/components/MyContentPage.vue';
import MyContentPage2 from 'src/components/MyContentPage2.vue';
import DetailData from './DetailData.vue';
import QButtonStyle from '@packages/ui/src/components/QButtonStyle.vue';
import Dialog2 from '@packages/ui/src/components/Dialog/Dialog.vue';
import PodsMonitoring from './PodsMonitoring/PodsMonitoring.vue';

interface Props {
	drawer: boolean;
}

withDefaults(defineProps<Props>(), {
	drawer: false
});
const dialog2Ref = ref();
const yamlRef = ref();
const detaiDatalRef = ref();

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
