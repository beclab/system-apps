import enUS from './en-US';
import zhCN from './zh-CN';
import kubeEnUS from '@packages/ui/src/i18n';

export default {
	'en-US': { ...kubeEnUS['en-US'], ...enUS },
	'zh-CN': { ...kubeEnUS['zh-CN'], ...zhCN }
};
