<template>
	<div class="column index-menu">
		<q-select
			v-model="selectedIndex"
			data-cy="index-dropdown"
			:options="options"
			dense
			use-input
			input-debounce="0"
			:label="t('search.selectIndex')"
			behavior="menu"
			class="q-mt-md q-mb-sm"
			@filter="filterFn"
			@update:model-value="selectFn"
		>
			<template #no-option>
				<q-item>
					<q-item-section class="text-grey">
						{{ t('search.noResult') }}</q-item-section
					>
				</q-item>
			</template>
		</q-select>
		<div class="index-table">
			<QInputStyle>
				<q-input
					v-model="filterField"
					data-cy="index-field-search-input"
					dense
					outlined
					clearable
					debounce="1"
					:placeholder="t('search.searchField')"
				>
					<template #prepend>
						<q-icon name="search" />
					</template>
				</q-input>
			</QInputStyle>
			<QTableStyle2>
				<q-table
					v-model:selected="selectedFields"
					:rows="indexFields"
					row-key="name"
					:filter="filterField"
					:filter-method="filterFieldFn"
					:pagination="{ rowsPerPage: 999 }"
					dense
					flat
					hide-header
					hide-bottom
					selection="multiple"
					class="field-table q-mt-md"
					@row-click="clickFieldFn"
					@update:selected="selectedFieldFn"
					style="height: calc(100vh - 360px)"
				>
				</q-table>
			</QTableStyle2>
		</div>
	</div>
</template>

<script>
import { t } from 'src/boot/i18n';
import { defineComponent, ref } from 'vue';
import { nameList } from '../../network/search';
import QInputStyle from '@packages/ui/src/components/QInputStyle.vue';
import QSectionStyle from '@packages/ui/src/components/QSectionStyle.vue';
import QTableStyle2 from '@packages/ui/src/components/QTableStyle2.vue';

export default defineComponent({
	name: 'ComponentSearchIndexSelect',
	components: {
		QInputStyle,
		QTableStyle2
	},
	props: {
		data: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['updated'],
	setup(props, { emit }) {
		const getIndexData = (field) => props.data[field];
		const selectedIndex = ref(getIndexData('name'));
		const selectedFields = ref(getIndexData('columns'));
		const indexFields = ref([]);
		const cachedFields = ref({});
		const options = ref([]);

		const defaultFields = () => {
			return [{ name: '_id' }, { name: '_index' }, { name: '_score' }];
		};

		// index operation
		const filterFn = (val, update) => {
			nameList(val).then((res) => {
				let indexList = [];
				if (res.data) {
					res.data.map((item) => {
						indexList.push({
							label: item,
							value: item
						});
					});
				}
				update(() => {
					options.value = indexList;
				});
			});
		};

		const getSelectedIndexName = () => {
			if (selectedIndex.value && selectedIndex.value.value) {
				return selectedIndex.value.value;
			}
			return '';
		};

		const selectFn = (index) => {
			selectedFields.value = [];
			indexFields.value = defaultFields();
			cachedFields.value = {};

			emit('updated', {
				name: getSelectedIndexName(),
				columns: []
			});
		};

		const setIndexFields = (fields) => {
			for (var k in fields) {
				if (cachedFields.value[fields[k]]) {
					continue;
				}
				indexFields.value.push({ name: fields[k] });
				cachedFields.value[fields[k]] = true;
			}
		};

		// fields operation
		const filterField = ref('');
		const filterFieldFn = (rows, terms) => {
			var filtered = [];
			terms = terms.toLowerCase();
			for (var i = 0; i < rows.length; i++) {
				if (rows[i]['name'].toLowerCase().includes(terms)) {
					filtered.push(rows[i]);
				}
			}
			return filtered;
		};
		const clickFieldFn = (evt, row, index) => {
			if (selectedFields.value.includes(row)) {
				selectedFields.value = selectedFields.value.filter(
					(v) => v.name !== row.name
				);
			} else {
				selectedFields.value.push(row);
			}
			emit('updated', {
				name: getSelectedIndexName(),
				columns: selectedFields.value.map((v) => v.name)
			});
		};
		const selectedFieldFn = () => {
			emit('updated', {
				name: getSelectedIndexName(),
				columns: selectedFields.value.map((v) => v.name)
			});
		};

		return {
			t,
			selectedIndex,
			selectedFields,
			options,
			filterFn,
			selectFn,
			indexFields,
			cachedFields,
			filterField,
			filterFieldFn,
			clickFieldFn,
			selectedFieldFn,
			setIndexFields
		};
	}
});
</script>

<style lang="scss">
.index-menu {
	.index-table {
		width: 100%;
	}
	.field-table {
		width: 100%;
	}
}
</style>
