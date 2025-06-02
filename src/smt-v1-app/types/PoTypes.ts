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
