export interface PoData {
  poId: string;
  poNumberId: string;
  quoteNumberId: string;
  vendors: [string];
  status: {
    label:
      | 'NONE'
      | 'PENDING_PAYMENT'
      | 'PAYMENT_RECEIVED_PARTIALLY'
      | 'PAYMENT_RECEIVED'
      | 'PAID_TO_SUPPLIER_PARTIALLY'
      | 'PAID_TO_SUPPLIER'
      | 'LOGISTIC_ON_PROGRESS'
      | 'IN_TURKEY'
      | 'PARTIALLY_SENT_TO_CLIENT'
      | 'SENT_TO_CLIENT'
      | 'CLOSED'
      | 'REFUNDED'
      | 'CANCELED';
    type:
      | 'dark'
      | 'primary'
      | 'success'
      | 'warning'
      | 'warning'
      | 'danger'
      | 'primary'
      | 'info'
      | 'success'
      | 'primary'
      | 'info'
      | 'success';
  };
  numOfProduct: number;
  partNumbers: [string];
  shipTo: string;
  reqruisitioner: string;
  shipVia: string;
  fob: string;
  shippingTerms: string;
  poTax: {
    taxRate: number;
    isIncluded: boolean;
  };
  total: string;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  lastModifiedAt: string;
}

export interface PODetailData {
  aircargoToX: {
    airCargoToX: number;
    isIncluded: boolean;
  };
  sealineToX: {
    sealineToX: number;
    isIncluded: boolean;
  };
  truckCarriageToX: {
    truckCarriageToX: number;
    isIncluded: boolean;
  };
  poParts: {
    poPartId: string;
    partNumber: string;
    description: string;
    qty: number;
    leadTime: number;
    price: number;
    total: number;
    taxRate: number;
    isTaxIncluded: boolean;
    taxAmount: number;
    totalWithTax: number;
  }[];
  poId: string;
  poNumberId: string;
  piNumberId: string;
  piId: string;
  alternativePOParts: {
    poPartId: string;
    partNumber: string;
    description: string;
    qty: number;
    leadTime: number;
    price: number;
    total: number;
    taxRate: number;
    isTaxIncluded: boolean;
    taxAmount: number;
    totalWithTax: number;
  }[];
  attachments: {
    filename: string;
    data: string;
  }[];
  poStatus: string;
  comments: string;
  fob: string;
  shippingTerms: string;
  shipTo: string;
  requsitioner: string;
  shipVia: string;
  poTax: {
    taxRate: number;
    isIncluded: boolean;
  };
  selectedCompany: string;
  quoteReferenceId: string;
  poRequestedDate?: string;
  revisionNumber?: number;
}
