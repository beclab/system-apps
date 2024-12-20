<template>
	<router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { useAppDetailStore } from './stores/AppDetail';
import './css/custom.scss';
import { useSocketStore } from './stores/AppStore';
import { useAppList } from 'src/stores/AppList';
import { bus } from 'src/utils/bus';

export default defineComponent({
	name: 'App',
	preFetch() {
		const appDetail = useAppDetailStore();
		const appList = useAppList();

		appList.getAppList();

		return appDetail.init();
	},
	setup() {
		const appList = useAppList();
		const appStore = useSocketStore();
		appStore.start();

		bus.on('app_installation_event', (data) => {
			appList.getAppList();
		});
		return {};
	}
});
</script>
<style lang="scss">
.q-btn--outline:before {
	border-color: $btn-stroke;
}
// .q-btn {
// 	color: $ink-on-brand;
// }
.q-btn .q-icon {
	color: $ink-2;
}

.q-menu {
	padding: 8px;
	border-radius: 8px;
	background: $background-2;

	box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
}
body.desktop .q-focus-helper ～ .q-btn--rounded {
	border-radius: 4px;
}
.q-menu .q-item {
	padding: 8px;
	padding-left: 12px;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: 16px;
	color: $ink-2;
	min-height: 32px;
	border-radius: 4px;
}
.q-card--dark {
	border-color: $separator;
}
.q-inner-loading--dark {
	background: $background-1;
}
body.body--dark .q-dialog__backdrop {
	background: $background-6;
}
</style>
