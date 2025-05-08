export interface QuoteData {
  quoteId: string;
  quoteNumberId: string;
  revisionNo: string;
  clientsResponse: { clientId: string; clientName: string }[];
  clientRFQId: string;
  numOfProduct: number;
  quoteStatus: {
    label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
    type: 'success' | 'warning' | 'danger';
  };
  formStatus: {
    label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
    type: 'success' | 'warning' | 'danger';
  };
  finalCost: number;
  lastValidDate: string;
}
