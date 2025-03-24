import { getRequest, postRequest, putRequest } from './ApiCore/GlobalApiCore';

export const getAllRFQMails = async (
  pageNo: number,
  pageSize: number,
  filterType: string,
  sinceFromDate: string
) => {
  return await postRequest('/rfq-mail/previews', {
    pageNo,
    pageSize,
    filterType,
    sinceFrom: sinceFromDate
  });
};

export const searchByRfqNumberId = async (
  rfqNumberId: string,
  pageNo: number,
  pageSize: number
) => {
  return await getRequest(
    `/rfq-mail/search/${rfqNumberId}/${pageNo}/${pageSize}`
  );
};

// RFQ Mail point status
export const point = async (
  rfqMailId: string,
  rfqMailPointStatus: 'SPAM' | 'NOT_RFQ' | 'NO_QUOTE' | 'UNREAD'
) => {
  return await putRequest('/rfq-mail/point', { rfqMailPointStatus, rfqMailId });
};

// RFQ Mail detail
export const getRfqMailDetailFromDB = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/detail/${rfqMailId}`);
};

// RFQ Mail log
export const getRFQMailLogsFromDB = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/detail/logs/${rfqMailId}`);
};

// RFQ Mail open control
export const isOpenRFQMail = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/is-open-rfq-mail/${rfqMailId}`);
};

// RFQ Mail cancel
export const cancelRFQMail = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/cancel-rfq-mail/${rfqMailId}`, {});
};

// RFQ Mail OPEN -> WFS transition
export const convertOpenToWFS = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/status-to-wfs/${rfqMailId}`, {});
};

// RFQ Maili revert
export const reverseRFQMail = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/reverse-rfq-mail-status/${rfqMailId}`, {});
};

// RFQ Mail Subject search
export const searchRFQMailBySubject = async (
  subject: string,
  pageNo: number,
  pageSize: number
) => {
  return await getRequest(
    `/rfq-mail/search/mail-subject/${subject}/${pageNo}/${pageSize}`
  );
};

//RFQ Mail Filter
export const getByMailFilterItems = async (dateFrom: string) => {
  return await getRequest(`/rfq-mail/filter-parameters?dateFrom=${dateFrom}`);
};

//RFQ Mail Filter Parameters
export const searchByFilterParameters = async (
  pageNo: number,
  pageSize: number,
  params: string
) => {
  return await getRequest(
    `/rfq-mail/search-filter-parameters/${pageNo}/${pageSize}?${params}`
  );
};
