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
  dgPackagingCost: boolean;
  clientLT: number;
  comment: string;
  currency: string;
  fndCND: string;
  fndQTY: number;
  isSelected: boolean;
  partDescription: string;
  partName: string;
  partNumber: string;
  piPartId: string;
  price: number;
  pricedUpdatedDate: string;
  stageOfPIPart: string;
  reqQTY: number;
  reqCND: string;
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
  partName: string;
  partDescription: string;
  stageOfPIPart: string;
  supplierLT: number;
  clientLT: number;
  price: number;
  currency: string;
  pricedUpdatedDate: string;
  fndCND: string;
  fndQTY: number;
  reqQTY: number;
  reqCND: string;
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
  comment: string;
  quoteId: string;
  quoteNumberId: string;
  mailItemMoreDetailResponse: MailItemMoreDetail;
  piParts: PiParts[];
  revisionNumber: number;
  poNumberId: string;
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
  requsitioner?: string;
  shipVia?: string;
  fob?: string;
  shippingTerms?: string;
  poStatus?: string;
  poTax?: {
    taxRate: number;
    isIncluded: boolean;
  };
  airCargoToX?: {
    airCargoToX: number;
    isIncluded: boolean;
  };
  sealineToX?: {
    sealineToX: number;
    isIncluded: boolean;
  };
  truckCarriageToX?: {
    truckCarriageToX: number;
    isIncluded: boolean;
  };
  shipTo?: string;
}
