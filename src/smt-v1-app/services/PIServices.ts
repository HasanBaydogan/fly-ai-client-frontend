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

export const postPi = async (data: PIRequest) => {
  return await postRequest('/pi/wizard', data);
};

export const getAllCompany = async () => {
  return await getRequest(`/company/all`);
};

export const getPreEmailSendingParameters = async (piId: string) => {
  return await getRequest(`/pi/pre-email-sending?piId=${piId}`);
};

export const sendQuoteEmail = async (sendEmailProps: SendEmailProps) => {
  return await postRequest(`/pi/send-email`, sendEmailProps);
};
