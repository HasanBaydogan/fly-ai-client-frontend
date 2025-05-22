import { SendEmailProps } from 'smt-v1-app/components/features/PIWizard/forms/WizardSendMailForm';
import {
  getRequest,
  postRequest,
  deleteRequest,
  patchRequest
} from './ApiCore/GlobalApiCore';

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
