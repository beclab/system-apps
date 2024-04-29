<template>
	<q-dialog
		v-model="visible"
		persistent
		full-height
		full-width
		@hide="hideHanlder"
		@before-show="beforeShowHanlder"
		@show="showHanlder"
	>
		<q-card class="q-ma-none">
			<q-card-section class="row items-center q-pb-none">
				<div class="text-h6">{{ t('Search') }}</div>
				<q-space />
				<q-btn icon="close" flat round dense v-close-popup />
			</q-card-section>
			<q-card-section>
				<search-bar
					ref="searchBar"
					:data="queryData"
					@updated="queryUpdated"
					@refresh="searchData"
				/>
			</q-card-section>
			<q-separator dark color="grey-4" />
			<q-card-section class="q-pa-none">
				<my-splitter
					style="height: calc(100vh - 171px)"
					after-class="split-after-warpper"
				>
					<template v-slot:before>
						<q-card-section>
							<index-list
								ref="indexListRef"
								:data="indexData"
								@updated="indexUpdated"
							/>
						</q-card-section>
					</template>
					<template v-slot:after>
						<div
							class="q-gutter-sm q-pa-sm content-wrapper"
							style="min-height: calc(100vh - 164px)"
						>
							<search-result
								ref="searchResultRef"
								@updated:fields="updateIndexFields"
							/>
						</div>
					</template>
				</my-splitter>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script>
import { defineComponent, ref } from 'vue';

import SearchBar from 'components/search/SearchBar.vue';
import IndexList from 'components/search/IndexList.vue';
import SearchResult from 'components/search/SearchResult.vue';
import MySplitter from '@packages/ui/src/components/MySplitter.vue';
import Empty2 from '@packages/ui/src/components/Empty2.vue';
import MyCard from '@packages/ui/src/components/MyCard.vue';
import { t } from 'src/boot/i18n';
const queryDataInit = {
	query: '',
	time: {
		tab: 'relative',
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		selectedRelativePeriod: 'Minutes',
		selectedRelativeValue: 30,
		selectedFullTime: false
	}
};

const indexDataInit = {
	name: '',
	columns: []
};
export default defineComponent({
	name: 'PageSearch',
	components: {
		SearchBar,
		IndexList,
		SearchResult,
		MySplitter
	},
	props: {
		name: String.prototype
	},
	setup(props, { emit }) {
		const indexData = ref({ ...indexDataInit });
		const visible = ref(false);
		const queryData = ref({ ...queryDataInit });

		const searchBar = ref(null);
		const indexListRef = ref(null);
		const searchResultRef = ref(null);
		const searchData = () => {
			searchResultRef.value.searchData(indexData.value, queryData.value);
		};

		const resetColumns = () => {
			searchResultRef.value &&
				searchResultRef.value.resetColumns(indexData.value);
		};

		const indexUpdated = ({ name, columns }) => {
			if (indexData.value.name != name) {
				indexData.value.name = name;
				indexData.value.columns = columns;
				queryData.value.query = '';
				searchBar.value.setSearchQuery('');
				searchData();
			} else {
				indexData.value.columns = columns;
				resetColumns();
			}
		};

		const queryUpdated = ({ query, time }) => {
			console.log('queryUpdated', query);
			queryData.value.query = query;
			queryData.value.time = time;
			searchData();
		};

		const updateIndexFields = (fields) => {
			indexListRef.value.setIndexFields(fields);
		};

		function show() {
			visible.value = true;
		}

		function hideHanlder() {
			queryData.value = { ...queryDataInit };
			indexData.value = { ...indexDataInit };
			searchResultRef.value && searchResultRef.value.resetData();
			resetColumns();
		}

		function beforeShowHanlder() {
			indexData.value = { ...indexDataInit, name: props.name };
		}

		function showHanlder() {
			indexListRef.value && indexListRef.value.selectFn();
			searchData();
		}

		return {
			indexData,
			queryData,
			searchBar,
			indexListRef,
			searchResultRef,
			searchData,
			indexUpdated,
			queryUpdated,
			updateIndexFields,
			show,
			visible,
			t,
			hideHanlder,
			beforeShowHanlder,
			showHanlder
		};
	}
});
</script>
<style>
.split-after-warpper {
	background: #f1f5f9;
}
</style>
