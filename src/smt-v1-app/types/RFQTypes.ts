export interface RFQData {
  rfqReferenceId: string;
  rfqId: string;
  rfqStatus: any;
  clientRFQId: string;
  date: string;
  numberOfProduct: number;
  comments: string;
  rfqParts: { partNumber: string; partId: string }[];
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}
