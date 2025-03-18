import enUS from './en-US';
import zhCN from './zh-CN';
import ControlHubLang from '@apps/admin_console/src/i18n';

export default {
	'en-US': { ...ControlHubLang['en-US'], ...enUS },
	'zh-CN': { ...ControlHubLang['zh-CN'], ...zhCN }
};

export const defaultLanguage = 'en-US';

export const supportLanguages = [
	{ value: 'en-US', label: 'English' },
	{ value: 'zh-CN', label: '简体中文' }
];

export type supportLanguageType = 'en-US' | 'zh-CN' | undefined;
