<template>
	<router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { useAppDetailStore } from './stores/AppDetail';
import { useAppList } from './stores/AppList';
import './css/custom.scss';

export default defineComponent({
	name: 'App',
	preFetch({ store }) {
		const appDetail = useAppDetailStore();
		const appList = useAppList();

		appDetail.init();

		return appList.init();
	},
	setup() {
		return {};
	}
});
</script>
<style lang="scss" scoped>
::v-deep(.q-btn .q-icon) {
	font-size: 1.666666em;
}
</style>
<style lang="scss">
.q-btn .q-icon {
	color: $grey-8;
}
.q-menu {
	padding: 12px;
}
body.desktop .q-focus-helper {
	border-radius: 4px;
}
.q-menu .q-item {
	padding: 8px;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: 16px;
	color: $grey-8;
	min-height: 32px;
}
</style>
