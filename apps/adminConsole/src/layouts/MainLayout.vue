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
import { useAppDetailStore } from 'src/stores/AppDetail';
import {
	updateBreadcrumbs,
	options,
	currentItem,
	active,
	options2,
	options3
} from './breadcrumbs';
const { t } = useI18n();
const appDetailStore = useAppDetailStore();
const splitMenu = useSplitMenu();

const items = computed(() => {
	const item1 = [
		{
			key: 'terminus',
			label: t('TERMINUS'),
			children: options.value
		},
		{
			key: 'resource',
			label: t('RESOURCE'),
			children: options2.value
		}
	];
	const item2 = [
		{
			key: 'middleware',
			label: t('MIDDLEWARE'),
			children: options3.value
		}
	];

	return appDetailStore.isDemo ? item1 : item1.concat(item2);
});

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
	const link = route.path.split('/')[1];
	let target: any = optionsAll[0];
	if (link === 'site-middleware') {
		target = optionsAll.find((item) => item.link === route.path);
	} else {
		target = optionsAll.find((item) => item.link === `/${link}`);
	}
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
