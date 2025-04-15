import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from './ApiCore/GlobalApiCore';

interface PIAttachment {
  data: string;
}

interface PIRequest {
  receivedDate: string;
  attachments: PIAttachment[];
  receivedPOMethod: 'MESSAGE' | 'MAIL';
  selectedCompanyId: string;
  quoteId: string;
}

export const postPi = async (data: PIRequest) => {
  return await postRequest('/pi/wizard', data);
};

export const getAllCompany = async () => {
  return await getRequest(`/company/all`);
};
