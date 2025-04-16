<template>
	<router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { useDevelopingApps } from './stores/app';
import { supportLanguages } from './i18n';
import { i18n } from './boot/i18n';

export default defineComponent({
	name: 'App',
	preFetch() {
		const appStore = useDevelopingApps();
		const host = window.location.origin;
		appStore.setUrl(host);
		return new Promise((resolve) => {
			appStore.getApps().then(() => {
				resolve({});
			});
		});
	},
	setup() {
		const appStore = useDevelopingApps();
		const host = window.location.origin;
		appStore.setUrl(host);

		let terminusLanguage = '';
		let terminusLanguageInfo = document.querySelector(
			'meta[name="terminus-language"]'
		);
		if (terminusLanguageInfo && terminusLanguageInfo.content) {
			terminusLanguage = terminusLanguageInfo.content;
		} else {
			terminusLanguage = navigator.language;
		}

		// i18n.global.locale.value = 'en-US';
		console.log(navigator.language);

		if (terminusLanguage) {
			if (supportLanguages.find((e) => e.value == terminusLanguage)) {
				i18n.global.locale.value = terminusLanguage;
			}
		}

		return {};
	}
});
</script>
<style lang="scss">
@import './css/app.scss';
@font-face {
	font-display: block;
	font-family: 'Material Symbols Rounded';
	font-style: normal;
	font-weight: 100 700;
	src: url('@/assets/fonts/MaterialSymbolsRounded.woff2') format('woff2');
	// src: url('@/assets/fonts/nyTnjDwKNJ_190FjzaqkNCeE.woff2') format('woff2');
}
// border: 1px solid $input-stroke;
</style>
