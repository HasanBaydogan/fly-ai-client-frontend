import { getRequest } from './ApiCore/GlobalApiCore';

export const getbySegmentList = async () => {
  return await getRequest('/segment/all');
};

export const getAttachedFile = async (attachmentId: string) => {
  return await getRequest(`/attachment/id/${attachmentId}`);
};

export const getAllCurrenciesFromDB = async () => {
  return await getRequest(`/currency/all`);
};
