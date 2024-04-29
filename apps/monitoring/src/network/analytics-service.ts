import {
	PageviewsParams,
	MetricsParams,
	StatsParams,
	StatsResponse
} from 'app/types/analytics';
import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';
import { Cookies } from 'quasar';

export const getPageviews = (
	websiteId: string,
	params: PageviewsParams
): Promise<AxiosResponse<any>> => {
	return api.post(
		`/analytics_service/api/websites/${websiteId}/pageviews`,
		params
	);
};

export const getRealtime = (
	websiteId: string,
	startAt: PageviewsParams['startAt'],
	config?: Record<string, any>
): Promise<AxiosResponse<any>> => {
	return api.post(`/analytics_service/api/realtime/${websiteId}`, {
		startAt
	});
};

export const getWebsites = (): Promise<AxiosResponse<any>> => {
	return api.get('/analytics_service/api/me/websites');
};

export const getAnalyticsMetrics = (
	websiteId: string,
	params: MetricsParams
): Promise<AxiosResponse<any>> => {
	return api.post(
		`/analytics_service/api/websites/${websiteId}/metrics`,
		params
	);
};

export const getAnalyticsStats = (
	websiteId: string,
	params: StatsParams
): Promise<AxiosResponse<StatsResponse>> => {
	return api.post(`/analytics_service/api/websites/${websiteId}/stats`, params);
};
