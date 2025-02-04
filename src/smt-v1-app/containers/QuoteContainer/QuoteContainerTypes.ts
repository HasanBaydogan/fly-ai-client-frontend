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

export interface QuotePart {quotePartId: string,
  partNumber: string,
  partName: string,
  supplierLT: number,
  clientLT: number,
  price: number,
  currency: string,
  pricedUpdatedDate: string,
  reqCondition: string,
  fndCondition: string,
  reqQuantity: number,
  fndQuantity: number,
  supplier: string,
  DGPackagingCost: boolean,
  comment: string,
  tagDate: string,
  certificateType: string,
  MSN: string,
  wareHouse: string,
  stock: number,
  stockLocation: string,
  airlineCompany: string,
  MSDS: string,
  isSelected: boolean
}
export interface AlternativeQuotePart {
  quotePartId: string,
    partNumber: string,
    parentPartNumber:string,
    partName: string,
    supplierLT: number,
    clientLT: number,
    price: number,
    currency: string,
    pricedUpdatedDate: string,
    reqCondition: string,
    fndCondition: string,
    reqQuantity: number,
    fndQuantity: number,
    supplier: string,
    DGPackagingCost: boolean,
    comment: string,
    tagDate: string,
    certificateType: string,
    MSN: string,
    wareHouse: string,
    stock: number,
    stockLocation: string,
    airlineCompany: string,
    MSDS: string,
    isSelected: boolean
}



export interface Quote {
  alternativeQuotePartResponses: AlternativeQuotePart[];
  client: string;
  clientContacts: Contact[];
  clientRFQId: string;
  comment:string;
  quoteId: string;
  quoteNumberId:string;
  mailItemMoreDetailResponse: MailItemMoreDetail;
  quotePartResponses: QuotePart[];
  revisionNumber:number;
  rfqNumberId: string;
  lastModifiedDate:string;
  rfqMailStatus: string;
  

}
