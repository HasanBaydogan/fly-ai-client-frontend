import { getRequest, postRequest, putRequest } from './ApiCore/GlobalApiCore';
import { SaveRFQ } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

export const openRFQ = async (rfqMailId: string) => {
  const response = await putRequest(`/rfq-mail/open-rfq-mail/${rfqMailId}`);

  if (response?.statusCode === 404) {
    window.location.assign('/404');
    return;
  }

  return response;
};

export const getAllClientsFromDB = async () => {
  return await getRequest(`/client/all`);
};

export const getAllSuppliersFromDB = async () => {
  return await getRequest(`/supplier/all`);
};

export const getAllCurrenciesFromDB = async () => {
  return await getRequest(`/currency/all`);
};

export const saveRFQToDB = async (saveRFQ: SaveRFQ) => {
  return await postRequest(`/rfq/save`, saveRFQ);
};

export const searchByRFQList = async (
  term: string,
  pageNo: number,
  pageSize: number | 'all' = 10
) => {
  let url = '';
  if (pageSize === 'all') {
    url = `/rfq/filter?${term}`;
  } else {
    url = term
      ? `/rfq/filter?pageNo=${pageNo}&pageSize=${pageSize}&${term}`
      : `/rfq/all-list?pageNo=${pageNo}&pageSize=${pageSize}`;
  }
  return await getRequest(url);
};
