<template>
	<MyGridLayout colWidth="540px" gap="xl">
		<WebsiteChart
			v-for="item in websites"
			:key="item.id"
			:name="item.title || item.name"
			:icon="item.icon"
			:websiteId="item.id"
			:loading="loading"
			:url="item.url"
		>
		</WebsiteChart>
		<!-- <AnalyticsCard :showing="loading"></AnalyticsCard> -->
	</MyGridLayout>
	<RouterViewTransition></RouterViewTransition>
</template>

<script setup lang="ts">
import { getWebsites, getAppsList } from 'src/network';
import { computed, ref } from 'vue';
import { setWebsiteDateDefault } from './DatefilterState';
import WebsiteChart from './WebsiteChart.vue';
import RouterViewTransition from '@packages/ui/src/components/RouterViewTransition.vue';
import MyGridLayout from '@packages/ui/src/components/MyGridLayout.vue';
import AnalyticsCard from 'components/Skeleton/AnalyticsCard.vue';
import desktopIcon from '@packages/ui/src/assets/desktop.svg';
import { useAppDetailStore } from 'src/stores/AppDetail';
const appDetail = useAppDetailStore();

const loadingData = new Array(2).fill('');
const websites = ref(loadingData);
const loading = ref(true);
const apps = ref<any>([]);

const iconFilter = (name: string) => {
	const target = apps.value.find((item: any) => item.name === name);
	return target ? target.icon : '';
};
const fetchData = () => {
	loading.value = true;
	getAppsList().then((res) => {
		apps.value = res.data.data;
	});
	Promise.all([getWebsites(), getAppsList()])
		.then(([res, resApps]) => {
			const app = undefined;
			let icon = '';
			let title = '';
			apps.value = resApps.data.data.items;
			const appNames = apps.value
				.map((item: any) => item.name)
				.concat(['desktop']);

			websites.value = res.data
				.filter((item) => appNames.includes(item.name))
				.map((item) => {
					const app = apps.value.find((app: any) => app.name === item.name);
					if (app) {
						const entrance = app.entrances.find(
							(entrance) => !entrance.invisible
						);
						return {
							...app,
							...item,
							title: entrance.title,
							icon: entrance.icon,
							url:
								entrance.name === 'profile'
									? `//${app.url.split('profile.')[1]}`
									: `//${entrance.url}`
						};
					} else if (item.name === 'desktop') {
						icon = desktopIcon;
						title = 'Desktop';

						const url = `//desktop.${appDetail.user.username}${
							location.hostname.split(appDetail.user.username)[1]
						}`;
						return { ...app, ...item, title, icon, url };
					}
					return { ...app, ...item, url: `//${app.url}` };
				});
			setWebsiteDateDefault(websites.value);
		})
		.finally(() => {
			loading.value = false;
		});
};

fetchData();
</script>

<style></style>
