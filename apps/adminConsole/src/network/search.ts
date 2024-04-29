import { AxiosResponse } from 'axios';
import { api as http } from '../boot/axios';
import { useMiddlewareSearch } from 'stores/MiddlewareSearch';
const middlewareSearch = useMiddlewareSearch();

export const list = (
	page_num: number,
	page_size: number,
	sort_by: string,
	desc: boolean,
	name: string
) => {
	return http.get(
		`/zinc_search/api/index?page_num=${page_num}&page_size=${page_size}&sort_by=${sort_by}&desc=${desc}&name=${name}`,
		{
			headers: {
				Authorization: middlewareSearch.authorization
			}
		}
	);
};

export const search = ({ index, query }: { index: string; query: string }) => {
	let url = '/es/_search';
	if (index != '') {
		url = '/es/' + index + '/_search';
	}
	return http.post(`/zinc_search${url}`, query, {
		headers: {
			Authorization: middlewareSearch.authorization
		}
	});
};

export const update = (data: any) => {
	return http.put('/zinc_search/api/index/' + data.name, data, {
		headers: {
			Authorization: middlewareSearch.authorization
		}
	});
};

export const deleteItem = (names: string) => {
	return http.delete('/zinc_search/api/index/' + names, {
		headers: {
			Authorization: middlewareSearch.authorization
		}
	});
};

export const nameList = (name: string) => {
	return http.get('/zinc_search/api/index_name?name=' + name, {
		headers: {
			Authorization: middlewareSearch.authorization
		}
	});
};

export const getZincSearchList = (params: any): Promise<AxiosResponse<any>> => {
	return http.get('/zinc_search/api/index', {
		params,
		headers: {
			Authorization: middlewareSearch.authorization
		}
	});
};

export const getZincSearchFields = (
	name: string
): Promise<AxiosResponse<any>> => {
	return http.post(
		`/zinc_search/es/${name}/_search`,
		{},
		{
			headers: {
				Authorization: middlewareSearch.authorization
			}
		}
	);
};
