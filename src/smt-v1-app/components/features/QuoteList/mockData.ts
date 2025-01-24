import { MailItemMoreDetail, MailItemAttachment, RFQ, RFQMailStatus} from '../../../containers/QuoteListContainer/RfqContainerTypes';


const mockAttachments: MailItemAttachment[] = [
  {
    attachmentId: '1',
    fileName: 'RFQ_Details.pdf'
  },
  {
    attachmentId: '2',
    fileName: 'Technical_Specifications.xlsx'
  }
];

export const mockMailItem: MailItemMoreDetail = {
  from: 'john.doe@aerospace.com',
  mailContentItemResponses: `
    Hello dear colleagues
 
Please see the new RFQ below (or in attachment):

If you have a certificate with your suggestion, please send it. This will increase the chances and speed up the receipt of PO



Best regards,
Zhu Rong
Sales manager
  `,
  mailDate: '22.01.2025',
  mailItemAttachmentResponses: mockAttachments,
  senderCompanyName: 'Aerospace Solutions Inc.',
  subject: 'RFQ - Urgent Parts Request'
};

export const mockContacts: Contact[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john.doe@aerospace.com',
    title: 'Sales Manager',
    phone: '+1 555-0123',
    cellPhone: '+1 555-4567'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane.smith@aerospace.com',
    title: 'Technical Lead',
    phone: '+1 555-8901',
    cellPhone: '+1 555-2345'
  }
];

export const mockRFQ: RFQ = {
  alternativeRFQPartResponses: [
    {
      partId: '2',
      rfqPartId: '2',
      partNumber: 'XYZ789',
      partName: 'Alternative Aircraft Component 1',
      parentRFQPart: {
        partId: '1',
        rfqPartId: '1',
        partNumber: 'ABC123',
        partName: 'Aircraft Component'
      },
      reqQTY: 5,
      fndQTY: 5,
      reqCND: 'NE',
      fndCND: 'NE',
      supplierLT: 25,
      clientLT: 40,
      price: 850,
      currency: 'USD',
      supplier: {
        supplierId: '2',
        supplierName: 'Supplier B',
      },
      comment: 'Alternative part with better price'
    },
    {
      partId: '3',
      rfqPartId: '3',
      partNumber: 'DEF456',
      partName: 'Alternative Aircraft Component 2',
      parentRFQPart: {
        partId: '1',
        rfqPartId: '1',
        partNumber: 'ABC123',
        partName: 'Aircraft Component'
      },
      reqQTY: 5,
      fndQTY: 5,
      reqCND: 'OH',
      fndCND: 'OH',
      supplierLT: 20,
      clientLT: 35,
      price: 600,
      currency: 'USD',
      supplier: {
        supplierId: '3',
        supplierName: 'Supplier C',
      },
      comment: 'Overhauled alternative with competitive price'
    }
  ],
  clientRFQNumberId: '2785674',
  clientResponse: {
    clientId: '1',
    clientName: 'Grand China LIMITED',
    // ... diğer client özellikleri
  },
  lastModifiedDate: '22.01.2025',
  mailItemMoreDetailResponse: mockMailItem,
  rfqDeadline: '22.01.2025',
  rfqId: '233234',
  quoteId: '233234',
  rfqMailId: 'mail123',
  rfqMailStatus: 'WFS' as RFQMailStatus,
  rfqNumberId: '233234',
  client:'Grand China LIMITED',
  savedRFQItems: [
    {
      partId: '1',
      rfqPartId: '1',
      partNumber: 'ABC123',
      partName: 'Aircraft Component',
      reqQTY: 5,
      fndQTY: 5,
      reqCND: 'NE',
      fndCND: 'NE',
      supplierLT: 30,
      clientLT: 45,
      price: 1000,
      currency: 'USD',
      supplier: {
        supplierId: '1',
        supplierName: 'Supplier A',
      },
      comment: '',
      dgPackagingCost: false,
      tagDate: '',
      lastUpdatedDate: '2024-03-20',
      certificateType: 'CERTIFICATE_1',
      MSN: '',
      wareHouse: '',
      stock: 0,
      stockLocation: '',
      airlineCompany: '',
      MSDS: ''
    },
    {
      partId: '2',
      rfqPartId: '2',
      partNumber: 'XYZ789',
      partName: 'Engine Component',
      reqQTY: 3,
      fndQTY: 2,
      reqCND: 'OH',
      fndCND: 'OH',
      supplierLT: 45,
      clientLT: 60,
      price: 2500,
      currency: 'EUR',
      supplier: {
        supplierId: '2',
        supplierName: 'Supplier B',
      },
      comment: 'Urgent delivery required',
      dgPackagingCost: true,
      tagDate: '2024-04-01',
      lastUpdatedDate: '2024-03-25',
      certificateType: 'CERTIFICATE_2',
      MSN: 'MSN123',
      wareHouse: 'Warehouse B',
      stock: 5,
      stockLocation: 'Istanbul',
      airlineCompany: 'Turkish Airlines',
      MSDS: 'Required'
    },
    {
      partId: '3',
      rfqPartId: '1',
      partNumber: 'ABC123',
      partName: 'Aircraft Component',
      reqQTY: 5,
      fndQTY: 5,
      reqCND: 'NE',
      fndCND: 'NE',
      supplierLT: 30,
      clientLT: 45,
      price: 1000,
      currency: 'USD',
      supplier: {
        supplierId: '1',
        supplierName: 'Supplier A',
      },
      comment: '',
      dgPackagingCost: false,
      tagDate: '',
      lastUpdatedDate: '2024-03-20',
      certificateType: 'CERTIFICATE_1',
      MSN: '',
      wareHouse: '',
      stock: 0,
      stockLocation: '',
      airlineCompany: '',
      MSDS: ''
    },
  ],
  contacts: mockContacts
};

export interface Contact {
  id: string;
  fullName: string;
  email: string;
  title: string;
  phone: string;
  cellPhone: string;
}

