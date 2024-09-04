export function getLangWithMeta() {
	let terminusLanguage: string | null = null;
	let locale = navigator.language;
	const terminusLanguageInfo = document.querySelector(
		'meta[name="terminus-language"]'
	);
	if (terminusLanguageInfo && terminusLanguageInfo.getAttribute('content')) {
		terminusLanguage = terminusLanguageInfo.getAttribute('content');
	}

	if (terminusLanguage) {
		locale = terminusLanguage;
	}

	return locale;
}
