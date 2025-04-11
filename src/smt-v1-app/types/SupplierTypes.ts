import { FormattedContactData } from 'smt-v1-app/components/features/SupplierDetail/SupplierDetailComponents/ContactListSection';
import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';

export interface SupplierData {
  id: string;
  companyName: string;
  segments: { segmentName: string }[];
  brand: string;
  country: string;
  address: string;
  email?: string;
  contacts: { email: string }[];
  status: SupplierStatus;
  quoteID: string | null;
  attachments: {
    attachmentId: string | null;
    attachmentName: string | null;
  }[];
  workingDetails: string | null;
  userName: string;
  certificates: string[];
  dialogSpeed: string;
  dialogQuality: string;
  easeOfSupply: string;
  supplyCapability: string;
  euDemandOfParts: string;
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

export interface CreateSupplier {
  supplierCompanyName: string;
  segmentIds: string[];
  brand: string;
  countryId: string;
  pickUpAddress: string;
  supplierStatus: SupplierStatus;
  attachments: {
    fileName: string;
    data: string;
  }[];
  workingDetails: string;
  username: string;
  password: string;
  contacts: FormattedContactData[];
  certificateTypes: Certypes[];
  dialogSpeed: number;
  dialogQuality: number;
  easeOfSupply: number;
  supplyCapability: number;
  euDemandParts: number;
}

export interface UpdateSupplierPayload {
  supplierId: string;
  supplierCompanyName: string;
  segmentIds: string[];
  brand: string;
  countryId: string;
  pickUpAddress: string;
  status: string;
  attachments: { id: string; fileName: string; data: string }[];
  workingDetails: string;
  username: string;
  password: string;
  contacts: FormattedContactData[];
  certificateTypes: Certypes[];
  dialogSpeed: number;
  dialogQuality: number;
  easeOfSupply: number;
  supplyCapability: number;
  euDemandParts: number;
}

export interface transformSupplier {
  fromId: string;
  toId: string;
}
