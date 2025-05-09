import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { removeCookies, setCookie } from './CookieService';
import { getRequest, postRequest } from './ApiCore/GlobalApiCore';

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export interface xxx {
  id: string;
}
export interface ReverseActive {
  companyId: string;
}

export const getCompanyAll = async () => {
  return await getRequest(`/company/all-detail`);
};
export const postCompanyUpdate = async (PiUpdate: xxx) => {
  return await postRequest('/company/update', PiUpdate);
};
export const postCompanyCreate = async (PiUpdate: xxx) => {
  return await postRequest('/company/create', PiUpdate);
};
export const postCompanyReverseActive = async (companyId: string) => {
  return await postRequest(
    `/company/reverse-active?companyId=${companyId}`,
    {}
  );
};
