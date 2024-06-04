<template>
	<router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { useAppDetailStore } from './stores/AppDetail';
import './css/custom.scss';

export default defineComponent({
	name: 'App',
	preFetch({ store }) {
		const appDetail = useAppDetailStore();

		return appDetail.init();
	},
	setup() {
		return {};
	}
});
</script>
<style lang="scss">
q-icon {
	color: $ink-2;
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
	color: $ink-2;
	min-height: 32px;
}
.q-card--dark {
	border-color: $separator;
}
</style>
