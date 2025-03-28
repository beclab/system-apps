export const cpuOptions = ['50m', '100m', '200m', '500m', '1', '2', '4'];

export const memoryOptions = [
	'64Mi',
	'128Mi',
	'256Mi',
	'512Mi',
	'1Gi',
	'2Gi',
	'4Gi',
	'8Gi'
];

export const statusStyle = {
	pending: {
		color: '#ADADAD'
	},
	processing: {
		color: '#FFC46D'
	},
	installing: {
		color: '#3377FF'
	},
	upgrading: {
		color: '#3377FF'
	},
	running: {
		color: '#29CC5F'
	},
	uninstalling: {
		color: '#FF4D4D'
	},
	errored: {
		color: '#FF4D4D'
	},
	failed: {
		color: '#FF4D4D'
	},
	canceled: {
		color: '#ADADAD'
	},
	suspend: {
		color: '#e53935'
	}
};

// export const FilesOption: Record<
//   OPERATE_ACTION,
//   {
//     name: string;
//     icon: string;
//   }
// > = {
//   [OPERATE_ACTION.ADD_FOLDER]: {
//     name: 'Add Folder',
//     icon: 'sym_r_create_new_folder',
//   },
//   [OPERATE_ACTION.ADD_FILE]: {
//     name: 'Add File',
//     icon: 'sym_r_note_add',
//   },
//   [OPERATE_ACTION.RENAME]: {
//     name: 'Rename',
//     icon: 'sym_r_edit_square',
//   },
//   [OPERATE_ACTION.DELETE]: {
//     name: 'Delete',
//     icon: 'sym_r_delete',
//   },
// };
