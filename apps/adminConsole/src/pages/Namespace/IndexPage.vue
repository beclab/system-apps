<template>
	<div class="relative-position">
		<MenuHeader size="xxl">
			<template #title-after>
				<q-tabs
					class="q-pl-lg q-ml-md text-grey-8"
					content-class="tabs-content-wrapper"
					style="font-size: 16px"
					v-model="tab"
					align="left"
					active-color="primary"
					:breakpoint="0"
					no-caps
					narrow-indicator
				>
					<q-tab :ripple="false" content-class="tabs-content-wrapper" :name="1">
						Usage Ranking
					</q-tab>
					<q-tab :ripple="false" :name="2"> Resources </q-tab>
				</q-tabs>
			</template>
		</MenuHeader>
		<bt-scroll-area
			style="height: calc(100vh - 56px)"
			:content-style="contentStyle"
			:content-active-style="contentStyle"
		>
			<div class="relative-position q-px-xxl q-py-lg">
				<Namespace v-if="tab === 1"></Namespace>
				<ClusterResource v-if="tab === 2"></ClusterResource>
			</div>
		</bt-scroll-area>
		<RouterViewTransition></RouterViewTransition>
	</div>
</template>

<script setup lang="ts">
import Namespace from 'src/pages/Applications/IndexPage.vue';
import ClusterResource from 'src/pages/NodeResource/IndexPage2.vue';
import MenuHeader from 'src/layouts/MenuHeader.vue';
import RouterViewTransition from '@packages/ui/src/components/RouterViewTransition.vue';
import { ref } from 'vue';

const tab = ref(1);

const contentStyle = {
	minWidth: 'auto',
	width: '100%'
};
</script>

<style>
.tabs-content-wrapper {
	font-size: 16px;
}
</style>
