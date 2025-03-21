import { getRequest, postRequest, putRequest } from './ApiCore/GlobalApiCore';

// RFQ Mail Listeleme
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

// RFQ Mail RFQ Number ID ile arama
export const searchByRfqNumberId = async (
  rfqNumberId: string,
  pageNo: number,
  pageSize: number
) => {
  return await getRequest(
    `/rfq-mail/search/${rfqNumberId}/${pageNo}/${pageSize}`
  );
};

// RFQ Mail puanlama
export const point = async (
  rfqMailId: string,
  rfqMailPointStatus: 'SPAM' | 'NOT_RFQ' | 'NO_QUOTE' | 'UNREAD'
) => {
  return await putRequest('/rfq-mail/point', { rfqMailPointStatus, rfqMailId });
};

// RFQ Mail detayını çek
export const getRfqMailDetailFromDB = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/detail/${rfqMailId}`);
};

// RFQ Mail loglarını çek
export const getRFQMailLogsFromDB = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/detail/logs/${rfqMailId}`);
};

// RFQ Mail açık mı kontrolü
export const isOpenRFQMail = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/is-open-rfq-mail/${rfqMailId}`);
};

// RFQ Mail iptal et
export const cancelRFQMail = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/cancel-rfq-mail/${rfqMailId}`, {});
};

// RFQ Mail OPEN -> WFS dönüşümü
export const convertOpenToWFS = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/status-to-wfs/${rfqMailId}`, {});
};

// RFQ Maili tersine çevir (revert)
export const reverseRFQMail = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/reverse-rfq-mail-status/${rfqMailId}`, {});
};

// RFQ Mail Subject ile arama
export const searchRFQMailBySubject = async (
  subject: string,
  pageNo: number,
  pageSize: number
) => {
  return await getRequest(
    `/rfq-mail/search/mail-subject/${subject}/${pageNo}/${pageSize}`
  );
};
