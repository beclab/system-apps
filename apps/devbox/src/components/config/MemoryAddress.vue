<template>
	<q-card class="env-container" flat>
		<q-card-section class="text-h6 text-ink-1 row items-center justify-between">
			<div class="row items-center justify-center">
				<span>存储卷</span>
				<q-icon class="text-ink-3 q-ml-xs" name="sym_r_help" size="16px">
					<q-tooltip> 存储卷 </q-tooltip>
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
import DialogMemoryAddress from './../dialog/DialogMemoryAddress.vue';

const $q = useQuasar();

const { t } = useI18n();

const columns = [
	{
		name: 'key',
		label: '主机路径',
		align: 'left'
	},
	{ name: 'value', label: '容器路径', align: 'left' },
	{ name: 'operate', label: '操作', align: 'right' }
];

const data = [
	{
		key: 'container1',
		value: '123456789'
	},
	{
		key: 'container2',
		value: '123456789'
	},
	{
		key: 'container3',
		value: '123456789'
	},
	{
		key: 'container4',
		value: '123456789'
	},
	{
		key: 'container5',
		value: '123456789'
	}
];

const createEnvConfig = () => {
	$q.dialog({
		component: DialogMemoryAddress
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

	.header-row {
		height: 36px;
		padding: 0 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.body-row {
		height: 64px;
		padding: 0 12px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);

		&:hover {
			background-color: rgba($color: #000000, $alpha: 0.05);
		}
	}
}
</style>
