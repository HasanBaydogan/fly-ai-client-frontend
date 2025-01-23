export interface MailItemAttachment {
  attachmentId: string;
  fileName: string;
}

export interface MailItemMoreDetail {
  from: string;
  mailContentItemResponses: string;
  mailDate: string;
  mailItemAttachmentResponses: MailItemAttachment[];
  senderCompanyName: string;
  subject: string;
}

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  title: string;
  phone: string;
  cellPhone: string;
}

export type RFQMailStatus = 'WFS' | 'UNREAD' | 'OPEN' | 'PQ' | 'FQ' | 'NOT_RFQ' | 'NO_QUOTE' | 'SPAM';

export interface RFQ {
  alternativeRFQPartResponses: any[];
  clientRFQNumberId: string;
  clientResponse: {
    clientId: string;
    clientName: string;
  };
  lastModifiedDate: string;
  mailItemMoreDetailResponse: MailItemMoreDetail;
  savedRFQItems: any[];
  contacts: Contact[];
  rfqDeadline: string;
  rfqId: string;
  quoteId: string;
  rfqMailId: string;
  rfqMailStatus: RFQMailStatus;
  rfqNumberId: string;
  client: string;
}
