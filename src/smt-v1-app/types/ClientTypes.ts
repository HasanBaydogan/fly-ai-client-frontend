import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';
import { FormattedContactData } from 'smt-v1-app/components/features/Client/NewClient/NewClientContact/ContactListSection';
export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}

export interface UpdateClientPayload {
  clientId: string;
  companyName: string;
  legalAddress: string;
  subCompanyName: string;
  currencyPreference: string;
  segmentIdList: string[];
  details: string;
  clientStatus: SupplierStatus;
  phone: string;
  website: string;
  mail: string;
  contactRequests: FormattedContactData[];
  attachmentRequests: {
    fileName: string;
    data: string;
  }[];
  userComments: {
    comment: string;
    severity: string;
  }[];
  clientPriceMarginTableRequest: { [k: string]: number };
  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };
}

export interface CreateClient {
  companyName: string;
  legalAddress: string;
  subCompanyName: string;
  currencyPreference: string;
  segmentIdList: string[];
  details: string;
  clientStatus: SupplierStatus;
  phone: string;
  website: string;
  mail: string;
  contactRequests: FormattedContactData[];
  attachmentRequests: {
    fileName: string;
    data: string;
  }[];
  userComments: {
    comment: string;
    severity: string;
  }[];
  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };
}

export interface ClientDataDetail {
  id: string;
  clientId: string;
  companyName: string;
  segments: { segmentName: string }[];
  currencyPreference: string;
  website: string;
  legalAddress: string;
  email?: string;
  contacts: { email: string }[];
  clientStatus: SupplierStatus;
  quoteID: string | null;
  attachmentResponses: {
    attachmentId: string | null;
    fileName: string | null;
  }[];
  details: string | null;
  subCompanyName: string;
  phone: string;

  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };
  marginTable: {
    below200: number;
    btw200and500: number;
    btw500and1_000: number;
    btw1_000and5_000: number;
    btw5_000and10_000: number;
    btw10_000and50_000: number;
    btw50_000and100_000: number;
    btw100_000and150_000: number;
    btw150_000and200_000: number;
    btw200_000and400_000: number;
    btw400_000and800_000: number;
    btw800_000and1_000_000: number;
    btw1_000_000and2_000_000: number;
    btw2_000_000and4_000_000: number;
    above4_000_000: number;
    lastModifiedBy: string;
  };
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}
export type ClientStatus = {
  label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
  type: 'success' | 'warning' | 'danger';
};

export interface ClientData {
  id: string;
  clientId: string;
  companyName: string;
  segments: { segmentName: string }[];
  currency: string;
  website: string;
  legalAddress: string;
  email?: string;
  contacts: { email: string }[];
  clientStatus: ClientStatus;
  quoteID: string | null;
  attachmentResponses: {
    attachmentId: string | null;
    fileName: string | null;
  }[];
  details: string | null;
  subCompanyName: string;
  phone: string;
  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };

  marginTable: {
    below200: number;
    btw200and500: number;
    btw500and1_000: number;
    btw1_000and5_000: number;
    btw5_000and10_000: number;
    btw10_000and50_000: number;
    btw50_000and100_000: number;
    btw100_000and150_000: number;
    btw150_000and200_000: number;
    btw200_000and400_000: number;
    btw400_000and800_000: number;
    btw800_000and1_000_000: number;
    btw1_000_000and2_000_000: number;
    btw2_000_000and4_000_000: number;
    above4_000_000: number;
    lastModifiedBy: string;
  };
  comment: string;
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}
