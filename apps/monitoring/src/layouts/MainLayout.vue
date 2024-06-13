<template>
	<q-layout view="hHh lpR fFf">
		<q-drawer show-if-above :width="240" side="left" bordered :breakpoint="0">
			<bt-menu
				active-class="my-active-link"
				:items="items"
				v-model="active"
				style="width: 239px"
				@select="selectHandler"
			/>
		</q-drawer>
		<q-page-container class="relative-position dashboard-container">
			<bt-scroll-area class="dashboard-scroll-wrapper" ref="scrollRef">
				<div
					class="text-h3 q-px-xxl q-mb-md text-ink-1"
					style="margin-top: 56px"
				>
					{{ currentItem.label }}
				</div>
				<div class="q-px-xxl q-py-xl" style="min-width: 800px">
					<router-view />
				</div>
			</bt-scroll-area>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MyLayoutContainer from '@packages/ui/src/components/MyLayoutContainer.vue';
import { getAppDetail } from '@packages/ui/src/network';
import { useAppDetailStore } from 'src/stores/AppDetail';
const AppDetailStore = useAppDetailStore();

const options = [
	{
		key: 'overview',
		label: 'Overview',
		icon: 'sym_r_dashboard',
		link: '/overview'
	},
	{
		key: 'applications',
		label: 'Applications',
		icon: 'sym_r_wysiwyg',
		link: '/applications'
	},
	{
		key: 'analytics',
		label: 'Analytics',
		icon: 'sym_r_leaderboard',
		link: '/analytics'
	}
	// {
	//   key: 'notifications',
	//   label: 'Notifications',
	//   icon: 'sym_r_notifications',
	//   link: '/notifications',
	// },
];
const initOption = {
	key: 'sub1',
	label: `${AppDetailStore.user.username}’s Terminus`,
	children: options
};
const items = ref([initOption]);

const router = useRouter();
const route = useRoute();
const active = ref(options[0].key);
const userData = ref();
const scrollRef = ref();

const currentItem = computed(
	() => options.find((item) => item.key === active.value) || { label: '' }
);

const selectHandler = (data: any) => {
	router.push({
		path: data.item.link
	});
};

const menuActive = () => {
	const link = route.path.split('/')[1];
	const target = options.find((item) => item.link === `/${link}`);
	if (target) {
		active.value = target.key;
		scrollRef.value &&
			scrollRef.value?.$refs?.scrollRef?.setScrollPosition('vertical', 0, 10);
	}
};

watch(
	() => route.path,
	() => {
		menuActive();
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.dashboard-scroll-wrapper {
	height: calc(100vh);
	contain: none;
}
.title {
	color: #1f1814;
	font-size: 24px;
	font-weight: 700;
	line-height: 32px;
	padding: 20px 32px 0 32px;
}
::v-deep(.my-active-link) {
	color: $light-blue-default;
	background: $light-blue-soft;
}
</style>
