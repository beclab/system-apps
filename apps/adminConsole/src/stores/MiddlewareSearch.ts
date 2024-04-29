import { defineStore } from 'pinia';
import { Buffer } from 'buffer';

interface Data {
	name: string;
	namespace: string;
	nodes: number;
	adminUser: string;
	password: string;
	mongos: {
		endpoint: string;
		size: number;
	};
	redisProxy: {
		endpoint: string;
		size: number;
	};
}
interface State {
	authorization: string;
}

export const useMiddlewareSearch = defineStore('middlewareSearch', {
	state: (): State => ({
		authorization: ''
	}),
	getters: {},
	actions: {
		updateAuthorization(value: string) {
			this.authorization = `Basic ${value}`;
		}
	}
});
