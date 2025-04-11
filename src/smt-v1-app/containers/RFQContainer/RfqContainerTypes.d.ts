import Client from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/Client/Client';
import { Supplier } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/PartList/PartListHelper';

interface RFQPart {
  partId: string | null;
  rfqPartId: string | null;
  partNumber: string;
  partName: string;
  partDescription: string;
  reqQTY: number;
  fndQTY: number;
  reqCND: NE | FN | NS | OH | SV | AR | RP | IN | TST | '';
  fndCND: NE | FN | NS | OH | SV | AR | RP | IN | TST | '';
  supplierLT: number;
  clientLT: number;
  price: number;
  currency: string;
  supplier: Supplier;
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

interface AlternativeRFQPart {
  parentRFQPart: RFQPart;
  partId: string | null;
  rfqPartId: string | null;
  partNumber: string;
  partName: string;
  partDescription: string;
  reqQTY: number;
  fndQTY: number;
  reqCND: NE | FN | NS | OH | SV | AR | RP | IN | TST | '';
  fndCND: NE | FN | NS | OH | SV | AR | RP | IN | TST | '';
  supplierLT: number;
  clientLT: number;
  price: number;
  currency: string;
  supplier: Supplier;
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
  alternativeRFQPartResponses: AlternativeRFQPart[];
  clientRFQNumberId: string | null;
  clientResponse: Client;
  lastModifiedDate: string;
  emailSentDate: string;
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
