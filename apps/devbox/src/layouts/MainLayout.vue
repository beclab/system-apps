<template>
	<q-layout class="main-layout" view="lHh Lpr lFf">
		<q-drawer class="my-drawer" behavior="desktop" show-if-above :width="240">
			<q-scroll-area style="height: calc(100vh)">
				<bt-menu
					active-class="text-body1 bg-teal-soft text-teal-pressed"
					:items="menuStore.menuList"
					expand-separator
					v-model="menuStore.currentItem"
					@select="changeItemMenu"
				/>

				<div
					class="noApp"
					v-if="
						menuStore.menuList[1].children &&
						menuStore.menuList[1].children.length <= 0
					"
				>
					<div class="noapp-icon">A</div>
					<div class="npapp-text">Your Application</div>
				</div>
			</q-scroll-area>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script lang="ts" setup>
import { watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useDevelopingApps } from '@/stores/app';
import { useDockerStore } from '@/stores/docker';
import { useMenuStore, MenuLabel } from '@/stores/menu';
import { pushToSystem } from './../utils/utils';

const store = useDevelopingApps();
const menuStore = useMenuStore();
const dockerStore = useDockerStore();
const router = useRouter();
const route = useRoute();

watch(
	() => store.apps,
	() => {
		menuStore.updateApplications();
	}
);

watch(
	() => route.path,
	() => {
		menuStore.updatePathToMenu(route.path);
	},
	{
		immediate: true
	}
);

onMounted(() => {
	menuStore.updateApplications();
});

const changeItemMenu = (data: any): void => {
	const key: string = data.key;
	menuStore.currentItem = key;
	dockerStore.appStatus = undefined;
	dockerStore.appInstallState = undefined;

	if (key === MenuLabel.HOME) {
		router.push({ path: '/home' });
	} else if (key === MenuLabel.CONTAINERS) {
		router.push({ path: '/containers' });
	} else if (key.startsWith('/app')) {
		const app_name = key.slice(5);
		pushToSystem(app_name, router);
	}

	menuStore.updateApplications();
};
</script>

<style lang="scss">
.my-drawer {
	border-right: 1px solid $separator;
}
</style>

<style lang="scss" scoped>
.main-layout {
	background-color: $background-1;
}
.edit-view {
	height: 32px;
	width: calc(100% - 30px);
	margin-top: 20px;
	margin-left: 15px;
	margin-right: 15px;
}

.noApp {
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 12px 20px;
	.noapp-icon {
		width: 20px;
		height: 20px;
		border-radius: 4px;
		border: 1px dashed rgba(204, 203, 203, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 8px;
		color: #cccbcb;
	}
	.npapp-text {
		overflow: hidden;
		color: #cccbcb;
		text-overflow: ellipsis;
		font-family: Roboto;
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: 24px;
	}
}
</style>
