import {
  createPart,
  createUDF,
  newNotePayload,
  postFile,
  updateFilesPayload,
  updatePartPayload,
  updatePayload
} from 'smt-v1-app/types/PartTypes';
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from './ApiCore/GlobalApiCore';

interface PartHistorySuggestionResponse {
  success: boolean;
  data: {
    partNumber: string;
    partName: string;
    reqCND?: string;
    reqQTY?: number;
    dgPackagingCost?: boolean;
  }[];
}

export const searchByPartList = async (
  term: string,
  pageNo: number,
  pageSize: number | 'all'
) => {
  let url = '';
  if (pageSize === 'all') {
    url = `/part/filter?${term}`;
  } else {
    url = term
      ? `/part/filter?pageNo=${pageNo}&pageSize=${pageSize}&${term}`
      : `/part/all-list?pageNo=${pageNo}&pageSize=${pageSize}`;
  }
  return await getRequest(url);
};

export const getByItemFields = async (partNumber: string) => {
  return await getRequest(`/part/part-number?partNumber=${partNumber}`);
};

export const postPartCreate = async (newPart: createPart) => {
  return await postRequest(`/part/create`, newPart);
};

export const putPartUpdate = async (payload: updatePartPayload) => {
  return await putRequest(`/part/update`, payload);
};

export const getByUDFPartList = async (partId: string) => {
  return await getRequest(`/part/udf/part-id/${partId}`);
};

export const postUDFCreate = async (newUDF: createUDF) => {
  return await postRequest(`/part/udf/create`, newUDF);
};

export const searchByNoteList = async (
  pageSize: number,
  pageNo: number,
  partId: string
) => {
  return await getRequest(`/part/note/part-id/${partId}/${pageNo}/${pageSize}`);
};

export const putUpdateNotes = async (payload: updatePayload) => {
  return await putRequest(`/part/note/update`, payload);
};

export const postNewNotes = async (newPart: newNotePayload) => {
  return await postRequest(`/part/note/create`, newPart);
};

export const deleteByNotes = async (noteId: string) => {
  return await deleteRequest(`/part/note/note-id/${noteId}`);
};

export const getByAlternatives = async (partId: string, pageNo: number) => {
  return await getRequest(
    `/part/alternative-part/part-id/${partId}/${pageNo}/5`
  );
};

export const postFileCreate = async (newFile: postFile) => {
  return await postRequest(`/part-file/create`, newFile);
};

export const deleteByAttachedFiles = async (partFileId: string) => {
  return await deleteRequest(`/part-file/id/${partFileId}`);
};

export const putFileUpdate = async (payload: updateFilesPayload) => {
  return await putRequest(`/part-file/update`, payload);
};

export const getByAlternativesDetail = async (partId: string) => {
  return await getRequest(`/part/alternative-part/history/id/${partId}`);
};

export const getByAttachedFiles = async (partId: string, pageNo: number) => {
  return await getRequest(`/part-file/all/part-id/${partId}/${pageNo}/5`);
};

export const getByDownloadFiles = async (partFileId: string) => {
  return await getRequest(`/part-file/attachment/${partFileId}`);
};

export const getPartHistorySuggestion = async (term: string) => {
  return await getRequest(`/rfq-part/history?partNumber=${term}`);
};
