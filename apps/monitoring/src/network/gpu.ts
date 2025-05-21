import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import {
	GraphicsDetailsParams,
	GraphicsDetailsResponse,
	GraphicsListParams,
	GraphicsListResponse,
	InstantVectorParams,
	InstantVectorResponse,
	RangeVectorParams,
	RangeVectorResponse,
	TaskDetailParams,
	TaskDetailResponse,
	TaskListParams,
	TaskListResponse
} from 'src/types/gpu';

const apiPrefix = '/gpu/api/vgpu';

export const getGraphicsList = (
	params: GraphicsListParams
): Promise<AxiosResponse<GraphicsListResponse>> => {
	return api.post(`${apiPrefix}/v1/gpus`, params);
};

export const getTaskList = (
	params: TaskListParams
): Promise<AxiosResponse<TaskListResponse>> => {
	return api.post(`${apiPrefix}/v1/containers`, params);
};

export const getGraphicsDetails = (
	params: GraphicsDetailsParams
): Promise<AxiosResponse<GraphicsDetailsResponse>> => {
	return api.get(`${apiPrefix}/v1/gpu`, {
		params
	});
};

export const getInstantVector = (
	params: InstantVectorParams
): Promise<AxiosResponse<InstantVectorResponse>> => {
	return api.post(`${apiPrefix}/v1/monitor/query/instant-vector`, params);
};

export const getRangeVector = (
	params: RangeVectorParams
): Promise<AxiosResponse<RangeVectorResponse>> => {
	return api.post(`${apiPrefix}//v1/monitor/query/range-vector`, params);
};

export const getTaskDetail = (
	params: TaskDetailParams
): Promise<AxiosResponse<TaskDetailResponse>> => {
	return api.get(`${apiPrefix}/v1/container`, {
		params
	});
};
