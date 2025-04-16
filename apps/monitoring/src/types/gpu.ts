export interface GraphicsListParams {
	filters: {
		nodeName?: string;
		type?: string;
		uid?: boolean;
	};
	pageRequest: {
		pageSize: number;
		pageNo: number;
		sort: 'ASC' | 'DESC';
		sortField: string;
	};
}

export interface Graphics {
	uuid: string;
	nodeName: string;
	type: string;
	vgpuUsed: number;
	vgpuTotal: number;
	coreUsed: number;
	coreTotal: number;
	memoryUsed: number;
	memoryTotal: number;
	nodeUid: string;
	health: boolean;
	mode: 'hami-core' | 'time-slice' | 'mps';
	temperature?: number;
	powerUsage?: number;
	lastUpdated?: string;
	status?: 'online' | 'offline' | 'error';
}

export interface GraphicsListResponse {
	list: Graphics[];
}

export type GpuUtilization = {
	vgpu: number;
	core: number;
	memory: number;
};

export type TaskStatus = 'success' | 'running' | 'failed' | 'pending';

export interface TaskListParams {
	filters: {
		name?: string;
		nodeName?: string;
		status?: TaskStatus;
		deviceId?: string;
	};
	pageRequest: {
		pageSize: number;
		pageNo: number;
		sort: 'ASC' | 'DESC';
		sortField: string;
	};
}

export interface TaskItem {
	name: string;
	status: TaskStatus;
	appName: string;
	nodeName: string;
	allocatedDevices: number;
	allocatedCores: number;
	allocatedMem: number;
	type: 'NVIDIA' | 'AMD' | 'Intel';
	createTime: string;
	startTime: string | null;
	endTime: string | null;
	podUid: string;
	nodeUid: string;
	resourcePool: string;
	flavor: string;
	priority: string;
	namespace: string;
	deviceIds: string[];
}

export interface TaskListResponse {
	items: TaskItem[];
}

export interface GraphicsDetailsParams {
	uid: string;
}

export interface GraphicsDetailsResponse
	extends Omit<
		Graphics,
		'status' | 'temperature' | 'powerUsage' | 'lastUpdated'
	> {
	uuid: string;
	nodeName: string;
	type: string;
	vgpuUsed: number;
	vgpuTotal: number;
	coreUsed: number;
	coreTotal: number;
	memoryUsed: number;
	memoryTotal: number;
	nodeUid: string;
	health: boolean;
	mode: 'hami-core' | 'time-slice' | 'mps';
}

export interface InstantVectorParams {
	query: string;
}

export interface InstantVector {
	metric: {
		[key: string]: string;
	};
	value: number;
	timestamp: string;
}

export interface InstantVectorResponse {
	data: InstantVector[];
}

export interface RangeVectorParams {
	range: {
		start: string;
		end: string;
		step: string;
	};
	query: string;
}

export interface RangeVector {
	metric: {
		device_no: 'nvidia0';
		driver_version: '550.144.03';
	};
	values: {
		value: 8.55;
		timestamp: '1744603402000';
	}[];
}

export interface RangeVectorResponse {
	data: RangeVector[];
}

export interface TaskDetailParams {
	name: string;
	podUid: string;
}

export interface TaskDetailResponse {
	name: 'ollama';
	status: 'success';
	appName: 'ollama-79b65bd5f6-kv9dx';
	nodeName: 'olares';
	allocatedDevices: 1;
	allocatedCores: 100;
	allocatedMem: 16000;
	type: 'NVIDIA';
	createTime: '2025-04-15T13:54:57+08:00';
	startTime: '';
	endTime: '';
	podUid: '5351b879-ffc2-4cdd-b375-48f44e1c03dd';
	nodeUid: 'efdfe171-b9b8-4dcd-b171-b9761eb63d99';
	resourcePool: '';
	flavor: '';
	priority: '';
	namespace: 'ollama-xuejingjie094';
	deviceIds: ['GPU-06eafd39-b5fe-286c-bee8-dd716e91371f'];
}
