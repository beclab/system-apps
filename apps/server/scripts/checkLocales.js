const fs = require('fs');

const langArr = fs.readdirSync('./locales/').filter((lang) => lang !== 'en');

const read = (lang) => {
	return fs.readdirSync(`locales/${lang}`);
};

const enFiles = read('en');

const errorMessage = [];

langArr.forEach((lang) => {
	const files = read(lang);
	files.forEach((file) => {
		const isExist = enFiles.indexOf(file);

		if (isExist < 0) {
			const message = `locales/${lang} There's more in the folder ${file} folder`;
			errorMessage.push(message);
		}
	});
});

if (errorMessage.length > 0) {
	const error = errorMessage.join('\n');
	console.log(error);
}
