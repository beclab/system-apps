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
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSplitMenu } from '@packages/ui/src/stores/menu';
import { useI18n } from 'vue-i18n';
import {
	updateBreadcrumbs,
	options,
	currentItem,
	active,
	options2,
	options3
} from './breadcrumbs';
const { t } = useI18n();

const splitMenu = useSplitMenu();

const items = computed(() => [
	{
		key: 'terminus',
		label: t('TERMINUS'),
		children: options.value
	},
	{
		key: 'resource',
		label: t('RESOURCE'),
		children: options2.value
	},
	{
		key: 'middleware',
		label: t('MIDDLEWARE'),
		children: options3.value
	}
]);

const optionsAll = [...options.value, ...options2.value, ...options3.value];

const router = useRouter();
const route = useRoute();

const selectHandler = (data: any) => {
	splitMenu.changeStatus(data.item.key);
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
		splitMenu.changeStatus(target.key);
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
