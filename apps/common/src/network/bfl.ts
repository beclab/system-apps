import { AxiosResponse } from 'axios';
import { api } from '../boot/axios';
import { Cookies } from 'quasar';
import { AppListResponse } from './network';

export const getUserList = (): Promise<AxiosResponse<any>> => {
	return api.get('/bfl/iam/v1alpha1/users', {
		headers: {
			'X-Authorization': Cookies.get('auth_token')
		}
	});
};

export const getAppsList = (): Promise<AxiosResponse<AppListResponse>> => {
	return api.get('/bfl/app_process/v1alpha1/myapps', {
		headers: {
			'X-Authorization': Cookies.get('auth_token')
		}
	});
};
