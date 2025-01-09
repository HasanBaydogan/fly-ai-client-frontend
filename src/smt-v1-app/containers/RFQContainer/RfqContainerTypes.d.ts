interface RFQPart {
  partId: string;
  rfqPartId: string;
  partNumber: string;
  partName: string;
  reqQTY: number;
  fndQTY: number;
  reqCND: NE | FN | NS | OH | SV | AR | RP | IN | TST;
  fndCND: NE | FN | NS | OH | SV | AR | RP | IN | TST;
  supplierLT: number;
  clientLT: number;
  unitPriceResponse: {
    currencyId: string;
    unitPrice: number;
    currency: string;
  };
  supplier: {
    supplierId: string;
    supplierName: string;
  };
  comment: string;
  dgPackagingCost: boolean;
  tagDate: string;
  lastUpdatedDate: string;
  certificateType:
    | CERTIFICATE_1
    | CERTIFICATE_2
    | CERTIFICATE_3
    | CERTIFICATE_4;

  MSN: string;
  wareHouse: string;
  stock: number;
  stockLocation: string;
  airlineCompany: string;
  MSDS: string;
}
interface RFQ {
  alternativeRFQPartResponses: [];
  clientRFQNumberId: string | null;
  clientResponse: string | null;
  lastModifiedDate: string;
  mailItemMoreDetailResponse: MailItemMoreDetail;
  rfqDeadline: string;
  rfqId: string | null;
  rfqMailId: string;
  rfqMailStatus:
    | 'UNREAD'
    | 'OPEN'
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'SPAM';
  rfqNumberId: string;
  savedRFQItems: RFQPart[];
}

interface MailItemMoreDetail {
  from: string;
  mailContentItemResponses: string;
  mailDate: string;
  mailItemAttachmentResponses: MailItemAttachment[];
  senderCompanyName: string;
  subject: string;
}
interface MailItemAttachment {
  attachmentId: string;
  fileName: string;
}
