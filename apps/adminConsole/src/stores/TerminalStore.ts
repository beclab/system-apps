import { PodItem } from '@packages/ui/src/network/network';
import { defineStore } from 'pinia';
import { getNodesList } from 'src/network';
import { ObjectMapper } from 'src/utils/object.mapper';

interface TerminalStore {
	data: PodItem[];
	terminal_init: boolean;
	terminal_active: boolean;
}
export const useTerminalStore = defineStore('terminalStore', {
	state: (): TerminalStore => ({
		data: [],
		terminal_init: false,
		terminal_active: false
	}),
	getters: {
		terminal_show: (state) => {
			return state.terminal_init && state.terminal_active;
		}
	},
	actions: {
		async init() {
			const params = {
				limit: -1
			};
			return getNodesList(params).then((res) => {
				this.data = res.data.items;
			});
		},
		async terminalPanelStatus(status: boolean) {
			this.terminal_active = status;
		},
		async terminalPanelInit() {
			this.terminal_init = true;
		}
	}
});
