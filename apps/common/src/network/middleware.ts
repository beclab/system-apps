export type MiddlewareType = 'postgres' | 'mongodb' | 'redis' | 'zinc';

export interface MiddlewareItem {
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

export interface MiddlewareListResponse {
	code: number;
	data: MiddlewareItem[] | [];
}

export interface MiddlewarePasswordParams {
	name: string;
	namespace: string;
	middleware: MiddlewareType;
	user: string;
	password: string;
}

export interface MiddlewarePasswordResponse {
	code: number;
	message: string;
}
