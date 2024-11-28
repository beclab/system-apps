import { defineStore } from 'pinia';
import { uid } from 'quasar';

import { WebSocketStatusEnum, WebSocketBean } from '@bytetrade/core';
import { bus } from 'src/utils/bus';
export interface WebSocketState {
	websocket: WebSocketBean | null;
}

function generateSocketId() {
	const shaResult = uid().replace(/-/g, '');
	let result = 0;
	for (let i = 0; i < 8; i++) {
		const number = parseInt('0' + shaResult[i]);
		result = result * 16 + number;
	}
	return Math.floor(result);
}

const loginID = generateSocketId();

export const useSocketStore = defineStore('counter', {
	state: () => {
		return {
			websocket: null
		} as WebSocketState;
	},

	actions: {
		start() {
			const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

			const ws_url = `${protocol}//${
				process.env.proxyTarget || window.location.host
			}/ws`;

			this.websocket = new WebSocketBean({
				url: ws_url,
				needReconnect: true,
				reconnectMaxNum: 5,
				reconnectGapTime: 3000,
				heartSend: JSON.stringify({
					event: 'ping',
					data: {}
				}),
				onopen: async () => {
					this.send({
						event: 'login',
						data: { id: loginID }
					});
				},
				onmessage: (ev) => {
					try {
						const message = JSON.parse(ev.data);

						if (message.event == 'app_installation_event') {
							bus.emit('app_installation_event', message);
						}
					} catch (e) {
						console.log('message error');
						console.log(e);
					}
				},
				onerror: () => {
					console.log('socket error');
				},
				onreconnect: () => {
					console.log('socket start reconnect');
				},
				onFailReconnect: () => {
					console.log('socket fail reconnect');
				}
			});
			this.websocket.start();
			console.log('socket start !!!!');
		},

		isConnected() {
			if (!this.websocket) {
				return false;
			}
			return this.websocket.status == WebSocketStatusEnum.open;
		},
		send(data: any, resend = false) {
			if (!this.websocket) {
				return;
			}
			const sendResult = this.websocket!.send(data, resend);
			return sendResult;
		},
		restart() {
			if (this.websocket) {
				this.websocket!.dispose();
			}
			this.start();
		},
		dispose() {
			if (this.websocket) {
				this.websocket!.dispose();
			}
			this.websocket = null;
		}
	}
});
