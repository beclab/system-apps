import { i18n } from '../boot/i18n';

export const ruleConfig = {
	appNameRules: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('home_appname_rules_1'),
			(val) => /^[A-Za-z].*/.test(val) || i18n.global.t('home_appname_rules_2'),
			(val) =>
				/^[a-zA-Z][a-zA-Z0-9 ._-]{0,30}$/.test(val) ||
				i18n.global.t('home_appname_rules_3')
		],
		placeholder: i18n.global.t('home_appname_rules_1')
	},
	imageName: {
		rules: [(val) => (val && val.length > 0) || i18n.global.t('image_rule')],
		placeholder: i18n.global.t('image_rule')
	},

	startCommand: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('start_command_rule')
		],
		placeholder: i18n.global.t('start_command_rule')
	},

	startCmdArgs: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('start_cmd_args_rule')
		],
		placeholder: i18n.global.t('start_cmd_args_rule')
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

	cpu: {
		rules: [(val) => (val && val.length > 0) || i18n.global.t('cpu_rule')],
		placeholder: i18n.global.t('cpu_rule')
	},
	memory: {
		rules: [(val) => (val && val.length > 0) || i18n.global.t('memory_rule')],
		placeholder: i18n.global.t('memory_rule')
	},

	envConfigKey: {
		rules: [(val) => (val && val.length > 0) || i18n.global.t('enter_input')],
		placeholder: i18n.global.t('enter_input')
	},

	envConfigValue: {
		rules: [(val) => (val && val.length > 0) || i18n.global.t('enter_input')],
		placeholder: i18n.global.t('enter_input')
	},

	hostPath: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('host_path_rule'),
			(val) => /^\/.*$/.test(val) || i18n.global.t('host_path_rule_2')
		],
		placeholder: i18n.global.t('host_path_rule')
	},

	containerPath: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('host_container_rule'),
			(val) => /^\/.+$/.test(val) || i18n.global.t('host_container_rule_2')
		],
		placeholder: i18n.global.t('host_container_rule')
	},

	file: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('file_name_rule'),
			(val) => !/[\\/:*?"<>|]/.test(val) || i18n.global.t('file_name_rule_2')
		],
		placeholder: i18n.global.t('file_name_rule')
	},

	env: {
		rules: [(val) => (val && val.length > 0) || i18n.global.t('image_env')],
		placeholder: i18n.global.t('image_env')
	},

	volume: {
		rules: [
			(val) => (val && val.length > 0) || i18n.global.t('image_volume'),
			(val) => /^[1-9]\d*$/.test(val) || i18n.global.t('image_volume_rule')
		],
		placeholder: i18n.global.t('image_volume')
	}
};
