export default {
	launch_input_placehoder: 'Search',
	launch_no_result: 'No results',
	page_404: 'Oops. Nothing here...',
	no_data: 'No data.',
	home_welcome: 'Welcome to Studio',
	home_desc: 'An easy way to develop in Olares',
	home_start: 'Start',
	home_create: 'Create a new application',
	home_update: 'Upload a chart package',
	home_recent: 'Recent',
	home_recent_resc_1: 'Your recently developed apps',
	home_recent_resc_2: ' will appear here',
	home_documents: 'Documents',
	home_doc_1: 'Studio tutorials',
	home_doc_2: 'Basic concepts of Olares applications',
	home_doc_3: 'Understand Olares Application Chart',
	home_doc_4: 'OlaresManifest configuration guide',
	home_doc_5: 'How to submit an application',
	home_visit_1: 'Visit',
	home_visit_2: 'for more information.',
	home_appname: 'App name',
	home_appname_hint: 'App namespace in Olares',
	home_appname_rules_1: 'Enter the app name',
	home_appname_rules_2: 'Must start with a letters',
	home_appname_rules_3:
		'Contains up to 30 characters. Only letters, numbers, spaces, (.), (-), or (_) allowed',
	home_apptype: 'App type',
	home_apptype_hint: 'Choose the application type',
	home_entrance_port: 'Main entrance port',
	home_entrance_port_hint: 'Port of the main entrance',
	home_entrance_port_rules_1: 'Port of the main entrance',
	home_entrance_port_rules_2: 'Must be an integer between 0 and 65535',
	home_image: 'Image',
	home_image_hint: 'Image for app containers',
	home_image_rules: 'Add image',
	home_port: 'Port',
	home_port_hint: 'Specify ports that need to be exposed',
	home_port_rules: 'Must be an integer between 0 and 65535',
	home_memory: 'Required memory',
	home_memory_hint: 'Requested memory for the app',
	home_memory_rules: 'Must be a number greater than 0',
	home_gpu: 'Required GPU',
	home_gpu_hint: 'Requested GPU memory for the app',
	home_gpu_place: 'Leave empty if no GPU is required',
	cancel: 'Cancel',
	create: 'Create',
	submit: 'Submit',
	app_files: 'Files',
	app_containers: 'Containers',
	app_config: 'Config',
	type: 'Type',
	name: 'Name',
	version: 'Version',
	username: 'Username',
	password: 'Password',
	distributed: 'Distributed',
	operations: 'Operations',
	required: 'Required',
	limits: 'Limits',
	upload: 'Upload',
	replace: 'Replace',
	close: 'Close',
	policies: 'Policies',
	btn_install: 'Install',
	btn_installing: 'Installing',
	btn_upgrade: 'Upgrade',
	btn_cancel: 'Cancel',
	btn_confirm: 'Confirm',
	btn_preview: 'Preview',
	btn_upload: 'Upload',
	btn_download: 'Download',
	btn_uninstall: 'Uninstall',
	btn_delete: 'Delete',
	btn_unbind: 'Unbind',
	btn_bind: 'Bind',
	btn_binding: 'Binding',
	btn_open_ide: 'Open IDE',
	btn_rename: 'Rename',
	application: 'Application',
	container_list: 'Dev container list',
	requirementNotSpecified: 'Requirement not specified',
	upload_file_nofi: 'Drag and drop JPEG, PNG, or WEBP files to upload',
	upload_icon_nofi: 'Drag and drop PNG or WEBP files to upload',
	dialog_create_file: 'Create file',
	dialog_create_folder: 'Create folder',
	dialog_create_title: 'Name',
	dialog_title_bind: 'Bind a dev container',
	dialog: {
		addEntrance: 'Add entrance',
		editEntrance: 'Edit entrance',
		addSubPolicies: 'Add sub policies',
		editSubPolicies: 'Edit sub policies',
		addClientReference: 'Add client reference',
		editClientReference: 'Edit client reference',
		addRequiredData: 'Add required data',
		editRequiredData: 'Edit required data',
		addClient: 'Add {type} client',
		editClient: 'Edit {type} client',
		addMiddle: 'Add {type}',
		editMiddle: 'Edit {type}'
	},
	containers_env: 'Env',
	containers_bind_app: 'Binding App container',
	containers_bind_dev: 'Binding Dev container',
	containers_pod_selector: 'Pod selector',
	containers_update_time: 'Update time',
	containers_dev_env: 'Dev Env',
	containers_select_env: 'Select dev containers',
	containers_input_name: 'Container name',
	config_name: 'App configuration',
	config_metadata_icon: 'Icon',
	config_metadata_icon_hint:
		'Your app icon in the Olares Market. Use a PNG or WEBP file, up to 512 KB, sized at 256x256 pixels.',
	config_metadata_apptitle: 'App title',
	config_metadata_apptitle_hint: 'Your app title in Olares Market',
	config_metadata_apptitle_rules: 'Enter the app title',
	config_metadata_versionname: 'Version',
	config_metadata_versionname_hint:
		'The version of your app. Format it in the SemVer 2.0.0 format.',
	config_metadata_versionname_rules: 'Enter the version',
	config_metadata_categories: 'Categories',
	config_metadata_categories_hint:
		'List the categories under which your app will appear in the Olares Market',
	config_metadata_categories_rules: 'Enter categories for your app',
	config_metadata_shortdesc: 'Short description',
	config_metadata_shortdesc_hint:
		'A short description that will appear below the app title in the Olares Market',
	config_metadata_shortdesc_rules: 'Enter the short description',
	config_metadata_fulldesc: 'Full description',
	config_metadata_fulldesc_hint: 'A comprehensive description of your app',
	config_metadata_fulldesc_rules: 'Enter the full description',
	config_details_upgrade_desc: 'Upgrade description',
	config_details_upgrade_hint:
		'The new features or improvements in this version',
	config_details_upgrade_rules: 'Enter the upgrade description',
	config_details_developer: 'Developer',
	config_details_developer_hint: 'Enter the name of the app developer',
	config_details_developer_rules: 'Enter the developer',
	config_details_submitter: 'Submitter',
	config_details_submitter_hint:
		'Enter the name of the individual or entity submitting the app',
	config_details_submitter_rules: 'Enter the submitter',
	config_details_featimage: 'Featured image',
	config_details_featimage_hint:
		'Upload a featured image in JPEG, PNG or WEBP, up to 8MB and sized at 1440x900 pixels',
	config_details_promotemage: 'Promotion image',
	config_details_promotemage_hint:
		'Upload 2-8 promotional screenshots in JPEG, PNG, or WEBP. Ensure each image does not exceed 8MB and is sized at 1440x900 pixels.',
	config_details_document: 'Document',
	config_details_document_hint:
		"Add a link to your app's documentation or user manual",
	config_details_website: 'Website',
	config_details_website_hint: "Provide the URL to your app's official website",
	config_details_legalnote: 'Legal note',
	config_details_legalnote_hint:
		'Add a link to the legal notes that you want to display for the app',
	config_details_license: 'License',
	config_details_license_hint: "Add a link to your app's license agreement",
	config_details_sourcecode: 'Source code',
	config_details_sourcecode_hint: "Add a link to your app's source code",
	config_details_supportclient: 'Supported clients',
	config_details_supportclient_desc:
		'Provide links to download or access your app on other platforms',
	config_space_entrances: 'Entrances',
	config_space_entrances_desc: 'Specify at least one method to access the app',
	config_space_resources: 'Resources',
	config_space_resources_desc:
		'Specify requested and limited resources for the app',
	config_space_middleware: 'Middleware',
	config_space_middleware_desc: 'Specify the necessary middleware for the app',
	config_space_dependencies: 'Dependencies',
	config_space_dependencies_desc:
		'Indicate if your app depends on other apps or requires a specific OS version',
	config_space_appdata: 'Require app data',
	config_space_adddata_desc:
		'Require read and write permissions to the appdata directory',
	config_space_systemdata: 'Require system data',
	config_space_systemdata_desc:
		'Require permissions to access system data through service providers',
	config_space_entrancename: 'Entrance name',
	config_space_entrancename_hint: 'Assign a unique name for this entrance',
	config_space_entrancename_rules: 'Enter the entrance name',
	config_space_entrancename_rules2:
		'Only allows lowercase letters (a-z), numbers (0-9), and hyphens (-)',
	config_space_addentrance_name_hint: 'The name of the dependent app',
	config_space_addentrance_name_rules1: 'Enter the app name',
	config_space_addentrance_name_rules2:
		'Must start with an alphabetic character',
	config_space_addentrance_name_rules3:
		'Only allows lowercase letters (a-z) and numbers (0-9)',
	config_space_addentrance_version_hint: 'Version required',
	config_space_addentrance_version_rules: 'Enter the version',
	config_space_entrancetitle: 'Entrance title',
	config_space_entrancetitle_hint: 'The desktop shortcut title for the app',
	config_space_entrancetitle_rules: 'Enter the entrance title',
	config_space_entranceicon: 'Entrance icon',
	config_space_entranceicon_desc: 'The desktop shortcut icon for the app',
	config_space_hostname: 'Host name',
	config_space_hostname_hint: 'Enter the host name for the app entrance',
	config_space_hostname_rules: 'Enter the host name',
	config_space_hostname_rule2:
		'Only allows lowercase letters (a-z), numbers (0-9), and hyphens (-)',
	config_space_gpu_required: 'GPU required',
	config_space_required: 'Required {type}',
	config_space_limited: 'Limited {type}',
	config_space_required_hint: 'Minimum {type} required for the app',
	config_space_limited_hint:
		'{type} limit for the app. The app will be suspended if the resource limit is exceeded.',
	config_space_postgres_name_rules: 'Enter the required user name',
	config_space_postgres_password_place:
		'Leave empty to generate a 16-bit random password',
	config_space_middleware_Databases: 'Databases',
	config_option_cluster: 'Cluster scoped',
	config_option_cluster_desc:
		'Whether this app is installed for all users in a Olares cluster',
	config_option_Reference_name_rules: 'Enter the name',
	config_option_Reference_name_rules2:
		'Must start with an alphabetic character',
	config_option_Reference_name_rules3:
		'Contain only lowercase letters (a-z) and numbers (0-9)',
	config_space_client: 'Client reference',
	config_space_client_desc:
		'Specify the client apps that require access to this cluster app',
	config_space_analytics: 'Enable Analytics',
	config_space_analytics_desc: 'Enable website analytics for your app',
	config_space_websocket: 'Enable Websocket',
	config_space_websocket_desc: 'Enable websocket for your app',
	config_space_port: 'Port',
	config_space_url: 'URL',
	config_space_visible: 'Visible',
	config_space_visible_hint:
		'Show entrance icon and title on the Olares desktop',
	config_space_authlevel: 'Auth level',
	config_space_authlevel_desc:
		'A private entrance that requires activating Tailscale for access',
	config_space_openmethod: 'Open method',
	config_space_openmethod_desc:
		'Show entrance icon and title on the Olares desktop',
	config_space_policy: 'Policy scope',
	config_space_policy_hint:
		'Set affected URLs of the policy. Regular expressions are supported.',
	config_space_policy_place:
		'Add affected URLs of the policy. Regular expressions are supported.',
	config_space_policy_rules: 'Enter the affected domain',
	config_space_mfalevel: 'MFA level',
	config_space_mfalevel_hint:
		'Two-factor authentication requires a one-time password to access the entrance',
	config_space_onetimevalid: 'One-time authentication ',
	config_space_onetimevalid_hint:
		'Authentication is required every time to access this entrance',
	config_space_validduration: 'Valid duration',
	config_space_validduration_hint:
		'Set how long (in seconds) a user can stay signed in before re-authenticate with MFA. Leave empty for one-time authentications.',
	config_space_description: 'Description',
	config_space_description_hint: 'A brief description of this policy',
	config_permissions_datagroup: 'Data group',
	config_permissions_datagroup_hint: 'Group of required data',
	config_permissions_datagroup_rules: 'Enter the data group',
	config_permissions_datatype: 'Data type',
	config_permissions_datatype_hint: 'Type of required data',
	config_permissions_datatype_rules: 'Enter the data type',
	config_permissions_version_hint: 'Version of required data',
	config_permissions_version_rules: 'Enter the version',
	config_permissions_operations_hint:
		'Required operations for the service provider',
	config_permissions_operations_rules: 'Please enter key input the operations.',
	config: {
		addClients: 'Add clients',
		addEntrance: 'Add entrance',
		add: 'Add',
		addDependencies: 'Add dependencies'
	},
	enums: {
		ADD_FOLDER: 'Add folder',
		ADD_FILE: 'Add file',
		RENAME: 'Rename',
		DELETE: 'Delete',
		METADATA: 'Metadata',
		DETAILS: 'Details',
		SPACE: 'Specs',
		PERMISSIONS: 'Permissions',
		OPTIONS: 'Options',
		Studio: 'Studio',
		Home: 'Home',
		Containers: 'Containers',
		Help: 'Help',
		Applications: 'Applications'
	},

	message: {
		save_file_success: 'File saved successfully',
		save_file_failed: 'Failed to save file',
		save_loadChart_failed: 'Failed to load chart',
		save_select_failed: 'Failed to select',
		save_loadChildren_failed: 'Failed to load children',
		create_file_success: 'File created successfully',
		create_file_failed: 'File created successfully',
		create_folder_success: 'Folder created successfully',
		create_folder_failed: 'Failed to create folder',
		rename_folder_success: 'Renamed successfully',
		rename_folder_failed: 'Failed to rename',
		delete_file_success: 'File deleted successfully',
		delete_file_failed: 'Failed to delete',
		deleteTip: 'Delete {name} ?',
		save_file: 'Do you want to save the current file?',
		rename_file: 'Rename File',
		confirmation: 'Confirmation',
		start_installing: 'Start installing',
		start_upgrade: 'Start upgraging',
		start_uninstalling: 'Start uninstalling',
		cancel_installation: 'Are you sure you want to cancel the installation?',
		successfully: 'Successfully',
		upgrade_app: 'Are you sure you want to Upgrade the app?',
		uninstall_app: 'Are you sure you want to uninstall {appName}?',
		delete_app: 'Are you sure you want to delete {appName}?'
	},

	docker: {
		deploy_container: 'Port your own container to Olares',
		transplant_app: 'Transplant third-party applications to Olares',
		coding: 'Coding on Olares',
		create_default_app: 'Create a Hello World application',
		create_app_title: 'Use image to create an application',
		image_command_title: 'Image and Command',
		container_image: 'Image',
		start_command: 'Command',
		command_parameters: 'Args',
		container_port: 'Port',
		instance_specifications: 'Instance Specifications',
		memory: 'Memory',
		manufacturer: 'vendor',
		env_variables: 'Environment Variables',
		key: 'key',
		value: 'value',
		storage_volume: 'Storage Volume',
		host_path: 'Host path',
		container_path: 'Mount Path',
		add_env_variables: 'Add Environment Variables',
		add_storage_volume: 'Add Storage Volume',
		volume_size: 'Volume Size'
	},

	appStatus: {
		empty: 'Empty',
		deployed: 'Deployed',
		deploying: 'Deploying',
		undeploy: 'Undeploy',
		abnormal: 'Abnormal'
	},

	appInstallStatus: {
		pending: 'Pending',
		downloading: 'Downloading',
		processing: 'Processing',
		canceled: 'Canceled',
		failed: 'Failed',
		completed: 'Completed'
	},

	header_btn: {
		apply: 'Apply',
		edit: 'Edit',
		open: 'Unfold',
		fold: 'Fold'
	},

	image_rule: 'Please enter the container image to be used, for example, nginx',
	start_command_rule: 'For example: /bin/bash -c',
	start_cmd_args_rule: 'For example: echo "Hello Kubernetes"',
	enter_input: 'Please enter',
	host_path_rule: 'Please enter the host path',
	host_path_rule_2: 'The host path must start with /',
	host_container_rule: 'Please enter the mount path',
	host_container_rule_2: 'The mount path must start with /',
	file_name_rule: 'Please enter the file name',
	file_name_rule_2:
		'The file name cannot contain the following characters: \\ / : * ? " < > |',
	cpu_rule: 'Please select CPU',
	memory_rule: 'Please select memory',
	host_path_repeat: 'Duplicate host path',
	container_path_repeat: 'Duplicate mount path',
	env_repeat: 'Environment configuration already exists',
	loading: 'Loading',
	task_progress: 'Task in progress',

	image_create: 'Create Image',
	vscode_desktop: 'VS Code Desktop',
	vscode_server: 'coder-server',
	image_env: 'Please select or enter a development environment',
	image_volume: 'Please enter the volume size',
	image_volume_rule: 'Volume size must be a positive integer',
	installing: 'Creating resources'
};
