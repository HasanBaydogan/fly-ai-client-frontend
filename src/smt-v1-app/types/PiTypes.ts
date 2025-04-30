import { S } from '@fullcalendar/core/internal-common';

export interface PIAttachment {
  data: string;
}

export interface PIRequest {
  receivedDate: string;
  attachments: PIAttachment[];
  receivedPOMethod: 'MESSAGE' | 'MAIL';
  selectedCompanyId: string;
  quoteId: string;
}

export interface PICommentUpdate {
  id: string;
  comment: string;
  severity: string;
}

export interface PICommentNew {
  piId: string;
  comment: string;
  severity: string;
}

export interface PIAttachmentRequest {
  id: string | null;
  data?: string;
}

export interface PIAttachmentUploadRequest {
  PIId: string;
  piAttachmentRequests: PIAttachmentRequest[];
  type: string;
}

export interface PIAttachmentResponse {
  data: Array<{
    id: string;
    fileName: string;
  }>;
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

export interface PiData {
  piId: string;
  piNumberId: string;
  revisionNo: string;
  quoteNumberId: string;
  contractNo: string;
  piStatus: {
    label:
      | 'NONE'
      | 'PI_CREATED'
      | 'PI_SENT_TO_CLIENT'
      | 'PO_WAITING_FROM_CLIENT'
      | 'PO_RECEIVED_FROM_CLIENT'
      | 'PO_RECEIVED_BUT_PI_NOT_CREATED'
      | 'PO_CREATED'
      | 'PO_PARTIALLY_SENT'
      | 'PO_FULLY_SENT'
      | 'LOT_CREATED'
      | 'LOT_PARTIALLY_SENT'
      | 'LOT_FULLY_SENT';
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
  company: string;
  numOfProduct: number;
  piParts: [string];
  poRequestedDate: string;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  lastModifiedAt: string;
  total: string;
}
