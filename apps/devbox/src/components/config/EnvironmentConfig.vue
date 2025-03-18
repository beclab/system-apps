<template>
	<q-card class="env-container" flat>
		<q-card-section class="text-h6 text-ink-1 row items-center justify-between">
			<div class="row items-center justify-center">
				<span>环境变量</span>
				<q-icon class="text-ink-3 q-ml-xs" name="sym_r_help" size="16px">
					<q-tooltip> 环境变量 </q-tooltip>
				</q-icon>
			</div>
			<q-btn
				class="text-teal-pressed btn-size-sm"
				:label="t('config.add')"
				outline
				icon="sym_r_add"
				no-caps
				@click="createEnvConfig"
			/>
		</q-card-section>

		<q-card-section class="q-py-none">
			<custom-table :columns="columns" :data="data">
				<template v-slot:body-cell-actions="props">
					<q-icon
						class="text-ink-2 cursor-pointer"
						name="sym_r_edit_square"
						size="24px"
						@click="edit(props)"
					/>
					<q-icon
						class="text-ink-2 q-ml-md cursor-pointer"
						name="sym_r_delete"
						size="24px"
						@click="edit(props)"
					/>
				</template>
			</custom-table>
		</q-card-section>
	</q-card>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import CustomTable from './../common/CustomTable.vue';
import DialogEnvironmentConfig from './../dialog/DialogEnvironmentConfig.vue';

const emits = defineEmits(['cancelParent']);

const $q = useQuasar();

const columns = [
	{
		name: 'key',
		label: '键',
		align: 'left'
	},
	{ name: 'value', label: '值', align: 'left' },
	{ name: 'operate', label: '操作', align: 'right' }
];

const data = [
	{
		key: 'Olares',
		value: '123456789'
	},
	{
		key: 'Olares2',
		value: '123456789'
	},
	{
		key: 'Olares3',
		value: '123456789'
	},
	{
		key: 'Olares4',
		value: '123456789'
	},
	{
		key: 'Olares5',
		value: '123456789'
	}
];

const { t } = useI18n();

const createEnvConfig = () => {
	// emits('cancelParent');
	$q.dialog({
		component: DialogEnvironmentConfig
	});
};

const edit = (value) => {
	console.log(value);
};
</script>

<style lang="scss" scoped>
.env-container {
	margin: 20px 20px 0 20px;
	padding: 4px;
	border-radius: 12px;
	background-color: $background-1;
}
</style>
