import { getRequest, postRequest } from './ApiCore/GlobalApiCore';
import { SendEmailProps } from 'smt-v1-app/components/features/QuoteWizard/formsQuote/WizardSendMailForm';

export const getQuoteDetailsById = async (quoteId: string) => {
  return await getRequest(`/quote/id/${quoteId}`);
};

export const getQuoteIdwithMailId = async (rfqMailId: string) => {
  return await getRequest(`/quote/last-quote/${rfqMailId}`);
};

export const convertRFQToQuote = async (rfqMailId: string) => {
  return await postRequest(`/quote/convert/${rfqMailId}`, {});
};

export const quoteWizardIntro = async (
  quoteId: string,
  quotePartIds: string[],
  alternativeQuotePartIds: string[]
) => {
  return await postRequest(`/quote/quote-wizard/${quoteId}`, {
    quotePartIds,
    alternativeQuotePartIds
  });
};

export const getPreEmailSendingParameters = async (quoteId: string) => {
  return await getRequest(`/quote/pre-email-sending/${quoteId}`);
};

export const sendQuoteEmail = async (sendEmailProps: SendEmailProps) => {
  return await postRequest(`/quote/send-email`, sendEmailProps);
};

export const getRFQMailIdToGoToRFQMail = async (quoteId: string) => {
  return await getRequest(`/quote/go-to-rfq-mail/${quoteId}`);
};

export const searchByQuoteList = async (
  term: string,
  pageNo: number,
  pageSize: number | 'all' = 10
) => {
  let url = '';
  if (pageSize === 'all') {
    url = `/quote/filter?${term}`;
  } else {
    url = term
      ? `/quote/filter?pageNo=${pageNo}&pageSize=${pageSize}&${term}`
      : `/quote/all-list?pageNo=${pageNo}&pageSize=${pageSize}`;
  }
  return await getRequest(url);
};

export const getUserQuoteStats = async (year: number, month: number) => {
  return await getRequest(
    `/quote/user-quote-status?month=${year}&year=${month}`
  );
};
