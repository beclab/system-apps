import { defineStore } from 'pinia';
import { getGraphicsList } from 'src/network/gpu';
import { Graphics, TaskItem } from 'src/types/gpu';

interface GpuStore {
	gpuList: Graphics[];
	taskList: TaskItem[];
	deviceIds: string[];
}
export const useGpuStore = defineStore('GpuStore', {
	state: (): GpuStore => ({
		gpuList: [],
		taskList: [],
		deviceIds: []
	}),

	getters: {
		gpuSelectOptions(state) {
			return state.gpuList.map((item) => ({
				label: item.nodeName,
				value: item.nodeName
			}));
		}
	},
	actions: {
		updateGpuList(data) {
			this.gpuList = data;
		},
		updateTaskList(data) {
			this.taskList = data;
		},
		getDeviceIds() {
			const params = {
				filters: {}
			};

			getGraphicsList(params).then((res) => {
				this.deviceIds = res.data.list.map((item) => ({
					label: item.uuid,
					value: item.uuid
				}));
			});
		}
	}
});
