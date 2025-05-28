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

// export interface QuotePart {
//   quotePartId: string;
//   partNumber: string;
//   partName: string;
//   partDescription: string;
//   supplierLT: number;
//   clientLT: number;
//   price: number;
//   currency: string;
//   pricedUpdatedDate: string;
//   reqCondition: string;
//   fndCondition: string;
//   reqQuantity: number;
//   fndQuantity: number;
//   supplier: string;
//   DGPackagingCost: boolean;
//   comment: string;
//   tagDate: string;
//   certificateType: string;
//   MSN: string;
//   wareHouse: string;
//   stock: number;
//   stockLocation: string;
//   airlineCompany: string;
//   MSDS: string;
//   isSelected: boolean;
// }

export interface PiParts {
  DGPackagingCost: boolean;
  MSN: string;
  MSDS: string;
  airlineCompany: string;
  certificateType: string;
  clientLT: number;
  comment: string;
  currency: string;
  fndCondition: string;
  fndQuantity: number;
  isSelected: boolean;
  partDescription: string;
  partName: string;
  partNumber: string;
  piPartId: string;
  price: number;
  pricedUpdatedDate: string;
  stageOfPIPart: string;
  reqQuantity: number;
  reqCondition: string;
  stock: number;
  stockLocation: string;
  supplier: string;
  supplierLT: number;
  tagDate: string;
  wareHouse: string;
}

export interface AlternativePiPart {
  piPartId: string;
  partNumber: string;
  parentPartNumber: string;
  stageOfPIPart: string;
  partName: string;
  partDescription: string;
  supplierLT: number;
  clientLT: number;
  price: number;
  currency: string;
  pricedUpdatedDate: string;
  reqCondition: string;
  fndCondition: string;
  reqQuantity: number;
  fndQuantity: number;
  supplier: string;
  DGPackagingCost: boolean;
  comment: string;
  tagDate: string;
  certificateType: string;
  MSN: string;
  wareHouse: string;
  stock: number;
  stockLocation: string;
  airlineCompany: string;
  MSDS: string;
  isSelected: boolean;
}

export interface Pi {
  alternativeQuotePartResponses: AlternativePiPart[];
  companyNameAddress: string;
  clientName: string;
  clientContacts: Contact[];
  clientRFQId: string;
  clientPONumber: string;
  comment: string;
  quoteId: string;
  quoteNumberId: string;
  mailItemMoreDetailResponse: MailItemMoreDetail;
  piParts: PiParts[];
  revisionNumber: number;
  piNumberId: string;
  poRequestedDate: string;
  userComments?: any[];
  rfqMailStatus:
    | 'UNREAD'
    | 'OPEN'
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'SPAM';
}
