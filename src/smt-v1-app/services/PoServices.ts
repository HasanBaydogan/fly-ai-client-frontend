import { SendEmailProps } from 'smt-v1-app/components/features/POWizard/forms/WizardSendMailForm';
import {
  getRequest,
  postRequest,
  deleteRequest,
  patchRequest
} from './ApiCore/GlobalApiCore';

export interface POEmailRequest {
  to: string[];
  cc: string[];
  subject: string;
  attachments: {
    filename: string;
    data: string;
  }[];
  body: string;
}

export interface POEmailProps {
  poEmailRequests: POEmailRequest[];
  POId: string;
  shipTo: string;
  requisitoner: string;
  shipVia: string;
  fob: string;
  shippingTerms: string;
  selectedPOParts: {
    poPartId: string;
    partNumber: string;
    description: string;
    qty: number;
    leadTime: number;
    price: number;
  }[];
  pOTax: {
    taxRate: number;
    isIncluded: boolean;
  };
  airCargoToX: {
    airCargoToX: number;
    isIncluded: boolean;
  };
  sealineToX: {
    sealineToX: number;
    isIncluded: boolean;
  };
  truckCarriageToX: {
    truckCarriageToX: number;
    isIncluded: boolean;
  };
}

export const getPreWizardCompanys = async (piId: string) => {
  return await getRequest(`/po/pre-wizard?piId=${piId}`);
};

export const postSelectCompany = async (
  piId: string,
  selectedCompanyId: string
) => {
  return await postRequest(`/po/wizard`, {
    piId: piId,
    selectedCompanyId: selectedCompanyId
  });
};

export const getPreEmailSendingParameters = async (poId: string) => {
  return await getRequest(`/po/pre-email-sending?poId=${poId}`);
};

export const sendQuoteEmail = async (sendEmailProps: POEmailProps) => {
  return await postRequest(`/po/send-email`, sendEmailProps);
};
