import { getRequest, postRequest, putRequest } from './ApiCore/GlobalApiCore';
import { CreateClient, UpdateClientPayload } from '../types/ClientTypes';

/** Client filtreli veya tüm listeyi getirir */
export const searchByClientList = async (
  term: string,
  pageNo: number,
  pageSize: number | 'all' = 10
) => {
  let url = '';
  if (pageSize === 'all') {
    url = term ? `/client/filter?${term}` : `/client/all-list`;
  } else {
    url = term
      ? `/client/filter/${pageNo}/${pageSize}?${term}`
      : `/client/all/${pageNo}/${pageSize}`;
  }
  return await getRequest(url);
};

/** Client detay getir */
export const getByClientId = async (clientId: string) => {
  return await getRequest(`/client/id/more-detail/${clientId}`);
};

/** Client detay listesini getir */
export const getByClientDetailList = async (clientId: string) => {
  return await getRequest(`/client/id/detail/${clientId}`);
};

/** Tüm currency listesini getir */
export const getbyCurrencyController = async () => {
  return await getRequest(`/currency/all`);
};

/** Varsayılan Margin Table getir */
export const getByMarginTable = async () => {
  return await getRequest(`/client/default-margin-table`);
};

/** Client oluştur */
export const createClient = async (newClient: CreateClient) => {
  return await postRequest(`/client/create`, newClient);
};

/** Client güncelle */
export const updateClient = async (payload: UpdateClientPayload) => {
  return await putRequest(`/client/update`, payload);
};
