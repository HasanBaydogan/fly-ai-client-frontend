import { SendEmailProps } from 'smt-v1-app/components/features/PIWizard/forms/WizardSendMailForm';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  patchRequest
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

interface PICommentUpdate {
  id: string;
  comment: string;
  severity: string;
}

interface PICommentNew {
  piId: string;
  comment: string;
  severity: string;
}

export const searchByPiList = async (
  term: string,
  pageNo: number,
  pageSize: number | 'all' = 10
) => {
  let url = '';
  if (pageSize === 'all') {
    url = `/pi/filter?${term}`;
  } else {
    url = `/pi/filter?pageNo=${pageNo}&pageSize=${pageSize}&${term}`;
  }
  return await getRequest(url);
};

export const getAllCompany = async () => {
  return await getRequest(`/company/all`);
};

export const getPreEmailSendingParameters = async (piId: string) => {
  return await getRequest(`/pi/pre-email-sending?piId=${piId}`);
};

export const getPiDetails = async (piId: string) => {
  return await getRequest(`/pi/pi-detail?piId=68063fd6412ee873b4d558ee`);
};

export const sendQuoteEmail = async (sendEmailProps: SendEmailProps) => {
  return await postRequest(`/pi/send-email`, sendEmailProps);
};

export const postPi = async (data: PIRequest) => {
  return await postRequest('/pi/wizard', data);
};

export const postPiUserCommentUpdate = async (
  CommentUpdate: PICommentUpdate
) => {
  return await postRequest('/pi-user-comment/update', CommentUpdate);
};

export const postPiUserCommentNew = async (NewComment: PICommentNew) => {
  return await postRequest('/pi-user-comment/new', NewComment);
};

export const deletePiUserComment = async (CommentId: string) => {
  return await deleteRequest(`/pi-user-comment/delete${CommentId}`);
};
