import { ex, S } from '@fullcalendar/core/internal-common';

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

export interface PINewAction {
  piId: string;
  description: string;
}

export interface PIUpdateAction {
  piActionId: string;
  description: string;
}

export interface PiUpdateOthers {
  piId: string;
  piStatus:
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
  piBank: 'OTHER' | 'EK' | 'FB' | 'RUS' | 'NUROL';
  piBankType: 'NONE' | 'TRANSIT' | 'EXPORT' | 'IMPORTS';
  clientPaidPrice: {
    currency: string;
    price: number;
  };
  clientPaidDate: string;
  supplierPaidPrice: {
    currency: string;
    price: number;
  };
  supplierPaidDate: string;
  leadTimeDays: number;
  opSupplierId: string;
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
      | 'CANCELLED';
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
  piActions: Array<{
    piActionId: string;
    description: string;
    createdBy: string;
    createdAt: string;
  }>;
}

export interface PIStage {
  piPartId: string;
  stageOfPIPart:
    | 'NONE'
    | 'PO_WAITING_FROM_CLIENT'
    | 'PO_RECEIVED_FROM_CLIENT'
    | 'PI_CREATED'
    | 'PI_SENT_TO_CLIENT'
    | 'PI_R_SENT_TO_CLIENT'
    | 'PENDING_PAYMENT_FROM_CUSTOMER'
    | 'PAYMENT_SENT_FROM_CUSTOMER'
    | 'PAYMENT_TO_R_RECEIVED_FROM_CUSTOMER'
    | 'PAYMENT_TO_TURKEY_RECEIVED_FROM_CUSTOMER'
    | 'PO_NEED_TO_SENT_SUPPLIER'
    | 'PO_SENT_TO_SUPPLIER'
    | 'PO_APPROVED_BY_SUPPLIER'
    | 'TO_BE_PAID_TO_SUPPLIER'
    | 'PAYMENT_REQUEST_SENT_TO_ACCOUNTING'
    | 'PAID_TO_SUPPLIER'
    | 'PAYMENT_APPROVED_BY_SUPPLIER'
    | 'LT_PENDING_BY_SUPPLIER'
    | 'READY_FOR_PICKUP_AT_SUPPLIER'
    | 'SUPPLIER_PREPARING_TO_SEND_BY_SUPP_FF'
    | 'SUPPLIER_CONTACT_SENT_TO_OUR_FF'
    | 'PICK_UP_PENDING_BY_OUR_FF'
    | 'PART_ON_THE_WAY_TO_TURKEY_BY_OUR_FF'
    | 'PART_ON_THE_WAY_TO_TURKEY_BY_SUPPLIERS_FF'
    | 'E_INVOICE_REQUEST_SENT_TO_ACCOUNTING'
    | 'PART_IN_TURKEY'
    | 'CUSTOMS_PROCEDURE_STARTED'
    | 'AWB_SENT_TO_CUSTOMER_FOR_APPROVAL'
    | 'WB_APPROVED_BY_CUSTOMER'
    | 'PART_ON_THE_WAY_TO_FINAL_DESTINATION'
    | 'DELIVERED'
    | 'PI_RECEIVED_BUT_PI_NOT_CREATED'
    | 'PO_CREATED'
    | 'PO_PARTIALLY_SENT'
    | 'PO_FULLY_SENT'
    | 'LOT_CREATED'
    | 'LOT_PARTIALLY_SENT'
    | 'LOT_FULLY_SENT'
    | 'CANCELED'
    | 'REFUNDED_TO_CUSTOMERS_ACCOUNT'
    | 'REFUNDED_TO_CUSTOMERS_BALANCE';
}
