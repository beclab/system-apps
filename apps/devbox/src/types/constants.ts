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

export const envOptions = [
	{
		label: 'beclab/node-ts-dev:0.1.1',
		value: 'beclab/node-ts-dev:0.1.1'
	},
	{
		label: 'beclab/go-dev:0.1.1',
		value: 'beclab/go-dev:0.1.1'
	},
	{
		label: 'beclab/python-dev:0.1.1',
		value: 'beclab/python-dev:0.1.1'
	}
];

export const diskOptions = ['Gi', 'Mi'];

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
