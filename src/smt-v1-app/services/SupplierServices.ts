import { getRequest, postRequest, putRequest } from './ApiCore/GlobalApiCore';
import {
  CreateSupplier,
  UpdateSupplierPayload
} from 'smt-v1-app/types/SupplierTypes';

export const getbySegmentList = async () => {
  return await getRequest('/segment/all');
};

export const getbyCountryList = async () => {
  return await getRequest('/country/all');
};

export const postSupplierCreate = async (newSupplier: CreateSupplier) => {
  return await postRequest('/supplier/create', newSupplier);
};

export const getBySupplierId = async (supplierId: string) => {
  return await getRequest(`/supplier/id/${supplierId}`);
};

export const putBySupplierUpdate = async (payload: UpdateSupplierPayload) => {
  return await putRequest('/supplier/update', payload);
};

export const searchBySupplierList = async (
  term: string,
  pageNo: number,
  pageSize: number | 'all' = 6
) => {
  let url = '';
  if (pageSize === 'all') {
    // 'All' seçiliyse pagination parametresi kullanılmadan çağrı yapılıyor.
    url = term ? `/supplier/filter?${term}` : `/supplier/all-list`;
  } else {
    url = term
      ? `/supplier/all/filtered/${pageNo}/${pageSize}?${term}`
      : `/supplier/all/filtered/${pageNo}/${pageSize}`;
  }
  return await getRequest(url);
};
