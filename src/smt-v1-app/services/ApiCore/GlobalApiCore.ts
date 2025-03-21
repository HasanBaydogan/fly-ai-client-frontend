import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { baseURL } from '../ApiConstants';
import { setCookie } from '../CookieService';

/** Axios instance */
export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

/** Adding token to request */
api.interceptors.request.use(config => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
  return config;
});

/** Token refresh */
const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await api.post('/auth/refresh-token', {
      refresh_token: Cookies.get('refresh_token')
    });

    if (response.data.statusCode === 200) {
      setCookie('access_token', response.data.data.access_token);
      setCookie('refresh_token', response.data.data.refresh_token);
      return true;
    }

    if ([411, 498, 404].includes(response.data.statusCode)) {
      handleTokenFailure();
    }

    return false;
  } catch (err) {
    console.error('Refresh Error:', err);
    handleTokenFailure();
    return false;
  }
};

/** Token or authorisation error */
const handleTokenFailure = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  window.location.assign('/');
};

/** API Generic GET */
export const getRequest = async (url: string): Promise<any> => {
  try {
    const response: AxiosResponse = await api.get(url);
    if (response.data.statusCode === 200) return response.data;
    if (response.data.statusCode === 498)
      return (await tryRefresh(() => api.get(url)))?.data;
    if (response.data.statusCode === 401) handleTokenFailure();
  } catch (err) {
    console.error(`GET Error on ${url}:`, err);
  }
};

/** API Generic POST */
export const postRequest = async (url: string, data: any): Promise<any> => {
  try {
    const response: AxiosResponse = await api.post(url, data);
    if (response.data.statusCode === 200) return response.data;
    if (response.data.statusCode === 498)
      return (await tryRefresh(() => api.post(url, data)))?.data;
    if (response.data.statusCode === 401) handleTokenFailure();
  } catch (err) {
    console.error(`POST Error on ${url}:`, err);
  }
};

export const putRequest = async (url: string, data: any = {}): Promise<any> => {
  try {
    const response: AxiosResponse = await api.put(url, data);

    if (response.data.statusCode === 200) return response.data;

    if (response.data.statusCode === 404) {
      console.error(`PUT 404 Error on ${url}`);
      return { statusCode: 404 };
    }

    if (response.data.statusCode === 498)
      return (await tryRefresh(() => api.put(url, data)))?.data;

    if (response.data.statusCode === 401) handleTokenFailure();
  } catch (err) {
    console.error(`PUT Error on ${url}:`, err);
  }
  return null;
};

/** Generic DELETE */
export const deleteRequest = async (url: string): Promise<any> => {
  try {
    const response = await api.delete(url);
    if (response.data.statusCode === 200) return response.data;

    if (response.data.statusCode === 498)
      return (await tryRefresh(() => api.delete(url)))?.data;
    if (response.data.statusCode === 401) handleTokenFailure();
  } catch (error) {
    console.error(`DELETE Request Error at ${url}:`, error);
  }
  return null;
};

/** Refresh logic post retry */
const tryRefresh = async (
  retryFn: () => Promise<AxiosResponse>
): Promise<AxiosResponse | null> => {
  const refreshed = await refreshToken();
  if (refreshed) return await retryFn();
  return null;
};
