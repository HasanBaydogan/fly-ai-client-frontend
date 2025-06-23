import { SendEmailProps } from 'smt-v1-app/components/features/PIWizard/forms/WizardSendMailForm';
import {
  getRequest,
  postRequest,
  deleteRequest,
  patchRequest
} from './ApiCore/GlobalApiCore';
import {
  PIAttachment,
  PIRequest,
  PICommentUpdate,
  PICommentNew,
  PIAttachmentRequest,
  PIAttachmentUploadRequest,
  PIAttachmentResponse,
  PINewAction,
  PIUpdateAction,
  PiUpdateOthers,
  PIStage
} from '../types/PiTypes';

export const searchByPiList = async (
  term: string,
  piStatus: string,
  pageNo: number,
  pageSize: number | 'all' = 10
) => {
  let url = '';
  if (pageSize === 'all') {
    url = `/pi/filter?${term}&piStatusRequest=${piStatus}`;
  } else {
    url = `/pi/filter?pageNo=${pageNo}&pageSize=${pageSize}&${term}&piStatusRequest=${piStatus}`;
  }
  return await getRequest(url);
};

export const getAllCompany = async () => {
  return await getRequest(`/company/all`);
};

export const getPreEmailSendingParameters = async (piId: string) => {
  return await getRequest(`/pi/pre-email-sending?piId=${piId}`);
};

export const getPiDetails = async (piNumberId: string) => {
  return await getRequest(`/pi/pi-detail?piId=${piNumberId}`);
};

export const sendQuoteEmail = async (sendEmailProps: SendEmailProps) => {
  return await postRequest(`/pi/send-email`, sendEmailProps);
};

export const postPi = async (data: PIRequest) => {
  return await postRequest('/pi/wizard', data);
};

export const postPiUserCommentUpdate = async (
  CommentUpdate: PICommentUpdate
) => {
  return await postRequest('/pi-user-comment/update', CommentUpdate);
};

export const postPiUserCommentNew = async (NewComment: PICommentNew) => {
  return await postRequest('/pi-user-comment/new', NewComment);
};

export const deletePiUserComment = async (CommentId: string) => {
  return await deleteRequest(`/pi-user-comment/delete${CommentId}`);
};

export const getPiWizard = async (piId: string) => {
  return await getRequest(`/pi/detail-wizard?piId=${piId}`);
};

export const getPiAttachments = async (piId: string) => {
  return await getRequest(`/pi/attachment/all?piId=${piId}`);
};

export const getPiSelectedAttachments = async (id: string, type: string) => {
  return await getRequest(`/pi/attachment?id=${id}&type=${type}`);
};

export const uploadPIAttachments = async (
  piId: string,
  attachments: PIAttachmentRequest[],
  type: string
): Promise<PIAttachmentResponse> => {
  const requestData: PIAttachmentUploadRequest = {
    PIId: piId,
    piAttachmentRequests: attachments,
    type
  };

  return await postRequest('/pi/attachment', requestData);
};

export const postPiActionCreate = async (NewAction: PINewAction) => {
  return await postRequest('/pi/pi-action/create', NewAction);
};

export const postPiActionUpdate = async (UpdateAction: PIUpdateAction) => {
  return await postRequest('/pi/pi-action/update', UpdateAction);
};

export const postOpenEditMode = async (piId: string) => {
  return await postRequest(`/pi/open-edit-mode?piId=${piId}`, piId);
};

export const postPiUpdate = async (PiUpdate: PiUpdateOthers) => {
  return await postRequest('/pi/update', PiUpdate);
};

export const getAllCurrenciesFromDB = async () => {
  return await getRequest(`/currency/all`);
};

export const postCloseEditMode = async (piId: string) => {
  return await postRequest(`/pi/close-edit-mode?piId=${piId}`, piId);
};

export const patchPiPart = async (piPartStatuses: PIStage) => {
  return await patchRequest('/pi-part', piPartStatuses);
};

// export const sendHeartbeatRequest = async () => {
//   return await getRequest(`/user/heartbeat`);
// };

export const getPiActionLogs = async (piId: string) => {
  return await getRequest(`/pi/all-action-logs?piId=${piId}`);
};
