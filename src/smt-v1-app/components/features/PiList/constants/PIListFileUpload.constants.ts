import { PIAttachmentType } from '../../../../types/PIListFileUpload.types';
import { MainCategory } from '../../../../types/PIListFileUpload.types';

// Map folder IDs to attachment types
export const folderToAttachmentTypeMap: { [key: string]: PIAttachmentType } = {
  'clients-po': PIAttachmentType.CLIENT_PO_ATTACHMENT,
  'clients-pi': PIAttachmentType.CLIENT_PI_ATTACHMENT,
  'clients-swift': PIAttachmentType.CLIENT_SWIFT_ATTACHMENT,
  'official-invoice': PIAttachmentType.CLIENT_OFFICIAL_INVOICE_ATTACHMENT,
  'clients-awb': PIAttachmentType.CLIENT_AWB_ATTACHMENT,
  'packing-list': PIAttachmentType.CLIENT_PACKING_LIST_ATTACHMENT,
  'suppliers-pi': PIAttachmentType.SUPPLIER_PI_ATTACHMENT,
  'suppliers-final-invoice': PIAttachmentType.SUPPLIER_FINAL_INVOICE_ATTACHMENT,
  'suppliers-packing-list': PIAttachmentType.SUPPLIER_PACKING_LIST_ATTACHMENT,
  certificate: PIAttachmentType.SUPPLIER_CERTIFICATE_ATTACHMENT,
  'trace-docs': PIAttachmentType.SUPPLIER_TRACE_DOCS_ATTACHMENT,
  'suppliers-euc': PIAttachmentType.SUPPLIER_EUC_ATTACHMENT,
  'swift-to-supplier': PIAttachmentType.SWIFT_TO_SUPPLIER_ATTACHMENT,
  'purchase-order': PIAttachmentType.SUPPLIER_PURCHASE_ORDER_ATTACHMENT,
  'suppliers-awb': PIAttachmentType.SUPPLIER_AWB_ATTACHMENT,
  'invoice-ff-turkiye': PIAttachmentType.INVOICE_OF_FF_TO_TURKEY_ATTACHMENT,
  'invoice-ff-destination':
    PIAttachmentType.INVOICE_OF_FF_TO_DESTINATION_ATTACHMENT,
  'lot-form': PIAttachmentType.LOT_FORM_ATTACHMENT
};

// Initialize with empty data structure
export const mockData: MainCategory[] = [
  {
    id: 'docs-client',
    name: 'Docs with Client',
    categories: [
      {
        id: 'received',
        name: 'Received',
        subCategories: [
          {
            id: 'clients-po',
            name: "Client's PO",
            files: []
          },
          {
            id: 'clients-swift',
            name: "Client's SWIFT",
            files: []
          }
        ]
      },
      {
        id: 'sent',
        name: 'Sent',
        subCategories: [
          {
            id: 'clients-pi',
            name: "Client's PI",
            files: []
          },
          {
            id: 'official-invoice',
            name: 'Official Invoice',
            files: []
          },
          {
            id: 'clients-awb',
            name: "Client's AWB",
            files: []
          },
          {
            id: 'packing-list',
            name: 'Packing List',
            files: []
          }
        ]
      }
    ]
  },
  {
    id: 'docs-supplier',
    name: 'Docs with Supplier',
    categories: [
      {
        id: 'supplier-received',
        name: 'Received',
        subCategories: [
          {
            id: 'suppliers-pi',
            name: "Supplier's PI",
            files: []
          },
          {
            id: 'suppliers-final-invoice',
            name: "Supplier's Final Invoice",
            files: []
          },
          {
            id: 'suppliers-packing-list',
            name: "Supplier's Packing List",
            files: []
          },
          {
            id: 'certificate',
            name: 'Certificate',
            files: []
          },
          {
            id: 'trace-docs',
            name: 'Trace Docs',
            files: []
          }
        ]
      },
      {
        id: 'supplier-sent',
        name: 'Sent',
        subCategories: [
          {
            id: 'suppliers-euc',
            name: "Supplier's EUC",
            files: []
          },
          {
            id: 'swift-to-supplier',
            name: 'SWIFT to Supplier',
            files: []
          },
          {
            id: 'purchase-order',
            name: 'Purchase Order',
            files: []
          }
        ]
      }
    ]
  },
  {
    id: 'docs-ff-received',
    name: 'Docs with FF Received',
    categories: [
      {
        id: 'suppliers-awb',
        name: "Supplier's AWB",
        subCategories: [],
        files: []
      },
      {
        id: 'invoice-ff-turkiye',
        name: 'Invoice of FF to Transit',
        subCategories: [],
        files: []
      },
      {
        id: 'invoice-ff-destination',
        name: 'Invoice of FF to Destination',
        subCategories: [],
        files: []
      }
    ]
  },
  {
    id: 'docs-ff-sent',
    name: 'Docs with FF Send',
    categories: [
      {
        id: 'lot-form',
        name: 'Lot Form',
        subCategories: [],
        files: []
      }
    ]
  }
];
