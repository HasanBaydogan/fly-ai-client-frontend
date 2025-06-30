import { FormattedContactData } from 'smt-v1-app/components/features/SupplierDetail/SupplierDetailComponents/ContactListSection';
import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';

export interface SupplierData2 {
  id: string;
  companyName: string;
  segments: { segmentName: string }[];
  brands: string[];
  country: string;
  address: string;
  mail: string;
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
export interface SupplierData {
  id: string;
  companyName: string;
  segments: { segmentName: string }[];
  brands: string;
  country: string;
  address: string;
  mail: string;
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
  // brand: string;
  supplierStatus: string;
  attachments: {
    fileName: string;
    data: string;
  }[];
  workingDetails: string;
  username: string;
  password: string;
  contacts: FormattedContactData[];
  certificateTypes: Certypes[];
  supplierPickupAddress: {
    pickUpAddress: string;
    city: string;
    countryId: string;
  };
  supplierLegalAddress: {
    legalAddress: string;
    city: string;
    countryId: string;
  };
  telephone: string;
  mail: string;
  contextNotes: string;
  aircraftTypes: string[];
  brands: string[];
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
  status: string;
  attachments: { id: string | null; fileName: string; data: string }[];
  workingDetails: string;
  username: string;
  password: string;
  supplierPickupAddress: {
    pickUpAddress: string;
    city: string;
    countryId: string;
  };
  supplierLegalAddress: {
    legalAddress: string;
    city: string;
    countryId: string;
  };
  contacts: {
    id: string;
    fullName: string;
    email: string;
    title: string;
    phone: string;
    cellPhone: string;
  }[];
  certificateTypes: string[];
  mail: string;
  telephone: string;
  aircraftTypes: string[];
  contextNotes: string;
  brands: string[];
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

export interface BrandsAircraftTypes {
  value: string;
  status: string;
}
