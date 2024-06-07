<template>
	<q-layout class="control-hub-layout" view="hHh lpR fFf">
		<q-drawer show-if-above :width="240" side="left" bordered :breakpoint="0">
			<bt-scroll-area class="full-height" style="padding-top: 6px">
				<bt-menu
					active-class="my-active-link"
					:items="items"
					v-model="active"
					@select="selectHandler"
				/>
			</bt-scroll-area>
		</q-drawer>
		<q-page-container class="settings_content_view">
			<div class="layout-content-wrapper">
				<div>
					<router-view />
				</div>
			</div>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSplitMenu } from '@packages/ui/src/stores/menu';
import {
	updateBreadcrumbs,
	options,
	currentItem,
	active,
	options2,
	options3
} from './breadcrumbs';
const splitMenu = useSplitMenu();

const items = [
	{
		key: 'terminus',
		label: 'Terminus',
		children: options
	},
	{
		key: 'resource',
		label: 'Resource',
		children: options2
	},
	{
		key: 'middleware',
		label: 'Middleware',
		children: options3
	}
];

const optionsAll = [...options, ...options2, ...options3];

const router = useRouter();
const route = useRoute();

const selectHandler = (data: any) => {
	currentItem.value = data.item;
	splitMenu.type = data.item.key;
	const breadcrumbsData = {
		title: data.item.label,
		icon: data.item.icon
	};
	updateBreadcrumbs(breadcrumbsData, true);
	route.meta.item = data.item.label;
	router.push({
		path: data.item.link
	});
};

onMounted(() => {
	console.log('test');
	const link = route.path.split('/')[1];
	const target = optionsAll.find((item) => item.link === `/${link}`);
	console.log('target:', target, link);
	if (target) {
		active.value = target.key;
		currentItem.value = target;

		const breadcrumbsData = {
			title: target.label,
			icon: target.icon
		};
		updateBreadcrumbs(breadcrumbsData, true);
	}
});
</script>

<style lang="scss" scoped>
.layout-content-wrapper {
	// background: $bg-content;
	transform: translate(0);
}
.control-hub-sidebar {
	border: 1px solid red;
}
.title {
	color: #1f1814;
	font-size: 24px;
	font-weight: 700;
	line-height: 32px;
	padding: 20px 32px 0 32px;
}

::v-deep(.my-active-link) {
	color: $blue-6;
	background: $blue-soft;
}
::v-deep(.q-drawer.q-drawer--bordered) {
	border-color: $separator;
}
</style>
<style></style>
