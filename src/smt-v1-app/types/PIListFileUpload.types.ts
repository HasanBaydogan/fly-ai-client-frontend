// Type definitions for API integration
export interface AttachmentType {
  id: string | null;
  data?: string;
  fileName: string;
}

// API response interfaces
export interface PIAttachmentItem {
  id: string;
  fileName: string;
}

export interface PIAttachmentTypeGroup {
  type: string;
  piAttachments: PIAttachmentItem[];
}

export interface PIAttachmentsResponse {
  data: PIAttachmentTypeGroup[];
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

export interface PISelectedAttachmentResponse {
  data: {
    id: string;
    fileName: string;
    data: string;
  };
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

// Enum for attachment types that maps to API types
export enum PIAttachmentType {
  CLIENT_AWB_ATTACHMENT = 'CLIENT_AWB_ATTACHMENT',
  CLIENT_OFFICIAL_INVOICE_ATTACHMENT = 'CLIENT_OFFICIAL_INVOICE_ATTACHMENT',
  CLIENT_PACKING_LIST_ATTACHMENT = 'CLIENT_PACKING_LIST_ATTACHMENT',
  CLIENT_PO_ATTACHMENT = 'CLIENT_PO_ATTACHMENT',
  CLIENT_PI_ATTACHMENT = 'CLIENT_PI_ATTACHMENT',
  CLIENT_SWIFT_ATTACHMENT = 'CLIENT_SWIFT_ATTACHMENT',
  INVOICE_OF_FF_TO_DESTINATION_ATTACHMENT = 'INVOICE_OF_FF_TO_DESTINATION_ATTACHMENT',
  INVOICE_OF_FF_TO_TURKEY_ATTACHMENT = 'INVOICE_OF_FF_TO_TURKEY_ATTACHMENT',
  LOT_FORM_ATTACHMENT = 'LOT_FORM_ATTACHMENT',
  SUPPLIER_AWB_ATTACHMENT = 'SUPPLIER_AWB_ATTACHMENT',
  SUPPLIER_CERTIFICATE_ATTACHMENT = 'SUPPLIER_CERTIFICATE_ATTACHMENT',
  SUPPLIER_EUC_ATTACHMENT = 'SUPPLIER_EUC_ATTACHMENT',
  SUPPLIER_FINAL_INVOICE_ATTACHMENT = 'SUPPLIER_FINAL_INVOICE_ATTACHMENT',
  SUPPLIER_PACKING_LIST_ATTACHMENT = 'SUPPLIER_PACKING_LIST_ATTACHMENT',
  SUPPLIER_PI_ATTACHMENT = 'SUPPLIER_PI_ATTACHMENT',
  SUPPLIER_PURCHASE_ORDER_ATTACHMENT = 'SUPPLIER_PURCHASE_ORDER_ATTACHMENT',
  SUPPLIER_TRACE_DOCS_ATTACHMENT = 'SUPPLIER_TRACE_DOCS_ATTACHMENT',
  SWIFT_TO_SUPPLIER_ATTACHMENT = 'SWIFT_TO_SUPPLIER_ATTACHMENT'
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  url?: string;
}

export interface SubCategoryItem {
  id: string;
  name: string;
  files: FileItem[];
}

export interface CategoryItem {
  id: string;
  name: string;
  subCategories: SubCategoryItem[];
  files?: FileItem[];
}

export interface MainCategory {
  id: string;
  name: string;
  categories: CategoryItem[];
}

export interface PIListFileUploadProps {
  show: boolean;
  onHide: () => void;
  piId: string;
}

export interface SelectedCategory {
  mainId: string | null;
  categoryId: string | null;
  subCategoryId: string | null;
}

export interface FileToDelete {
  fileId: string;
  nodeId: string;
  parentNodeType: 'category' | 'subcategory';
}
