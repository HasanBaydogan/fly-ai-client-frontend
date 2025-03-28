import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { baseURL } from '../ApiConstants';
import { setCookie } from '../CookieService';

/** Axios instance */
export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' }
});

// console.log('Axios instance created with baseURL:', baseURL);

/** Adding token to request */
api.interceptors.request.use(config => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    // console.log('Access token added to request headers.');
  } else {
    // console.log('No access token found in cookies.');
  }
  return config;
});

/** Token refresh */
const refreshToken = async (): Promise<boolean> => {
  try {
    // console.log('Attempting to refresh token...');
    const response = await api.post('/auth/refresh-token', {
      refresh_token: Cookies.get('refresh_token')
    });

    if (response.data.statusCode === 200) {
      setCookie('access_token', response.data.data.access_token);
      setCookie('refresh_token', response.data.data.refresh_token);
      //  console.log('Token refreshed successfully.');
      return true;
    }

    if ([411, 498, 404].includes(response.data.statusCode)) {
      //  console.log(
      //    'Token refresh failed with status code:',
      //    response.data.statusCode
      //  );
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
  // console.log(
  //   'Handling token failure: clearing tokens and redirecting to home.'
  //  );
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  window.location.assign('/');
};

/** API Generic GET */
export const getRequest = async (url: string): Promise<any> => {
  try {
    // console.log('GET Request initiated:', url);
    const response: AxiosResponse = await api.get(url);
    // console.log('GET Response received:', response.data);
    if (response.data.statusCode === 200) return response.data;
    if (response.data.statusCode === 498) {
      //       console.log('GET request received 498 status, attempting token refresh.');
      return (await tryRefresh(() => api.get(url)))?.data;
    }
    if (response.data.statusCode === 401) {
      //   console.log('GET request unauthorized (401).');
      handleTokenFailure();
    }
  } catch (err) {
    //  console.error(`GET Error on ${url}:`, err);
  }
};

/** API Generic POST */
export const postRequest = async (url: string, data: any): Promise<any> => {
  try {
    // console.log('POST Request initiated:', url, data);
    const response: AxiosResponse = await api.post(url, data);
    // console.log('POST Response received:', response.data);
    if (response.data.statusCode === 200) return response.data;
    if (response.data.statusCode === 498) {
      //   console.log(
      //     'POST request received 498 status, attempting token refresh.'
      //   );
      return (await tryRefresh(() => api.post(url, data)))?.data;
    }
    if (response.data.statusCode === 401) {
      //  console.log('POST request unauthorized (401).');
      handleTokenFailure();
    }
  } catch (err) {
    //  console.error(`POST Error on ${url}:`, err);
  }
};

/** API Generic PUT */
export const putRequest = async (url: string, data: any = {}): Promise<any> => {
  try {
    //   console.log('PUT Request initiated:', url, data);
    const response: AxiosResponse = await api.put(url, data);
    //   console.log('PUT Response received:', response.data);

    if (response.data.statusCode === 200) return response.data;

    if (response.data.statusCode === 404) {
      //   console.error(`PUT 404 Error on ${url}`);
      return { statusCode: 404 };
    }

    if (response.data.statusCode === 498) {
      //    console.log('PUT request received 498 status, attempting token refresh.');
      return (await tryRefresh(() => api.put(url, data)))?.data;
    }

    if (response.data.statusCode === 401) {
      //   console.log('PUT request unauthorized (401).');
      handleTokenFailure();
    }
  } catch (err) {
    //   console.error(`PUT Error on ${url}:`, err);
  }
  return null;
};

/** Generic DELETE */
export const deleteRequest = async (url: string): Promise<any> => {
  try {
    // console.log('DELETE Request initiated:', url);
    const response = await api.delete(url);
    // console.log('DELETE Response received:', response.data);
    if (response.data.statusCode === 200) return response.data;

    if (response.data.statusCode === 498) {
      // console.log(
      //   'DELETE request received 498 status, attempting token refresh.'
      // );
      return (await tryRefresh(() => api.delete(url)))?.data;
    }
    if (response.data.statusCode === 401) {
      // console.log('DELETE request unauthorized (401).');
      handleTokenFailure();
    }
  } catch (error) {
    console.error(`DELETE Request Error at ${url}:`, error);
  }
  return null;
};

/** Refresh logic post retry */
const tryRefresh = async (
  retryFn: () => Promise<AxiosResponse>
): Promise<AxiosResponse | null> => {
  // console.log('Attempting token refresh before retrying request.');
  const refreshed = await refreshToken();
  if (refreshed) {
    // console.log('Token refresh successful, retrying original request.');
    return await retryFn();
  }
  console.log('Token refresh failed, original request will not be retried.');
  return null;
};
