// Bu dosya GlobalApiCore yapısına uygun şekilde refaktör edilmelidir
// getRequest, postRequest, putRequest, deleteRequest fonksiyonlarını kullanmalıyız
// Örnek olarak bir iki fonksiyon refaktör edilmiştir

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

// Örnek Refactor: Parça Listesi Arama
export const searchByPartList = async (
  term: string,
  pageNo: number,
  pageSize: number
) => {
  const url = term
    ? `/part/filter/${pageNo}/${pageSize}?${term}`
    : `/part/all/${pageNo}/${pageSize}`;

  return await getRequest(url);
};

// Parça Detayı Getir
export const getByItemFields = async (partNumber: string) => {
  return await getRequest(`/part/part-number/${partNumber}`);
};

// Yeni Parça Ekleme
export const postPartCreate = async (newPart: createPart) => {
  return await postRequest(`/part/create`, newPart);
};

// Parça Güncelleme
export const putPartUpdate = async (payload: updatePartPayload) => {
  return await putRequest(`/part/update`, payload);
};

// UDF Getir
export const getByUDFPartList = async (partId: string) => {
  return await getRequest(`/part/udf/part-id/${partId}`);
};

// UDF Ekle
export const postUDFCreate = async (newUDF: createUDF) => {
  return await postRequest(`/part/udf/create`, newUDF);
};

// Notları Listele
export const searchByNoteList = async (
  pageSize: number,
  pageNo: number,
  partId: string
) => {
  return await getRequest(`/part/note/part-id/${partId}/${pageNo}/${pageSize}`);
};

// Not Güncelle
export const putUpdateNotes = async (payload: updatePayload) => {
  return await putRequest(`/part/note/update`, payload);
};

// Not Ekle
export const postNewNotes = async (newPart: newNotePayload) => {
  return await postRequest(`/part/note/create`, newPart);
};

// Not Sil
export const deleteByNotes = async (noteId: string) => {
  return await deleteRequest(`/part/note/note-id/${noteId}`);
};

// Alternatif Parçaları Listele
export const getByAlternatives = async (partId: string, pageNo: number) => {
  return await getRequest(
    `/part/alternative-part/part-id/${partId}/${pageNo}/5`
  );
};

// Dosya ekleme
export const postFileCreate = async (newFile: postFile) => {
  return await postRequest(`/part-file/create`, newFile);
};

// Dosya Sil
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
