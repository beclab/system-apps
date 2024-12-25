import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';

export const getUserInto = (): Promise<AxiosResponse<any>> => {
	return api.get('/api/profile/init');
};
