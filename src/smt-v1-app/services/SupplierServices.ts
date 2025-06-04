import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest
} from './ApiCore/GlobalApiCore';
import {
  BrandsAircraftTypes,
  CreateSupplier,
  transformSupplier,
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
    url = `/supplier/filter?${term}`;
  } else {
    url = term
      ? `/supplier/filter?pageNo=${pageNo}&pageSize=${pageSize}&${term}`
      : `/supplier/all-list?pageNo=${pageNo}&pageSize=${pageSize}`;
  }
  return await getRequest(url);
};

export const deleteSupplier = async (supplierId: string) => {
  return await deleteRequest(`/supplier?supplierId=${supplierId}`);
};

export const transformToSupplier = async (
  trasnformSupplier: transformSupplier
) => {
  return await postRequest('/supplier/transform', trasnformSupplier);
};

export const getAllSupplier = async () => {
  return await getRequest('/supplier/all');
};

export const patchOtherValues = async (
  BrandsAircraftTypes: BrandsAircraftTypes
) => {
  return await patchRequest('/supplier/other-values', BrandsAircraftTypes);
};

export const getOtherValues = async () => {
  return await getRequest('/supplier/other-values/all');
};
