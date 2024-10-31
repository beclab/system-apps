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
	padding: 12px;
}
body.desktop .q-focus-helper ～ .q-btn--rounded {
	border-radius: 4px;
}
.q-menu .q-item {
	padding: 8px;
	font-size: 12px;
	font-style: normal;
	font-weight: 500;
	line-height: 16px;
	color: $ink-2;
	min-height: 32px;
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
./stores/AppStore
