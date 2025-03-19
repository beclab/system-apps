import enUS from './en-US';
import zhCN from './zh-CN';
import kubeEnUS from '@packages/ui/src/i18n';

export default {
	'en-US': { ...kubeEnUS['en-US'], ...enUS },
	'zh-CN': { ...kubeEnUS['zh-CN'], ...zhCN }
};

export const defaultLanguage = 'en-US';

export const supportLanguages = [
	{ value: 'en-US', label: 'English' },
	{ value: 'zh-CN', label: '简体中文' }
];

export type supportLanguageType = 'en-US' | 'zh-CN' | undefined;
