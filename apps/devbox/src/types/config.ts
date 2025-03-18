import { i18n } from '../boot/i18n';

export const ruleConfig = {
	imageName: {
		rules: [
			(val) => (val && val.length > 0) || '请输入使用的容器镜像，例如 nginx'
		],
		placeholder: '请输入使用的容器镜像，例如 nginx'
	},

	startCommand: {
		rules: [(val) => (val && val.length > 0) || '如：/bin/bash -c'],
		placeholder: '如：/bin/bash -c'
	},

	websitePort: {
		rules: [
			(val) =>
				(val && val.length > 0) || i18n.global.t('home_entrance_port_rules_1'),
			(val) =>
				(val > 0 && val <= 65535) || i18n.global.t('home_entrance_port_rules_2')
		],
		placeholder: i18n.global.t('home_entrance_port_rules_1')
	},

	envConfigKey: {
		rules: [(val) => (val && val.length > 0) || '请输入'],
		placeholder: '请输入'
	},

	envConfigValue: {
		rules: [(val) => (val && val.length > 0) || '请输入'],
		placeholder: '请输入'
	}
};
