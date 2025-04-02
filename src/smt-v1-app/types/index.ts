export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}

export type Status = {
  label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
  type: 'success' | 'warning' | 'danger';
};

export type Certypes =
  | 'CERTIFICATE_1'
  | 'CERTIFICATE_2'
  | 'CERTIFICATE_3'
  | 'CERTIFICATE_4';

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
