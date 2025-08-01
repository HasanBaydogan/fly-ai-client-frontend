import {
  faFile,
  faFilePdf,
  faFileExcel,
  faFileWord,
  faFileImage,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { folderToAttachmentTypeMap } from '../constants/PIListFileUpload.constants';
import {
  MainCategory,
  FileItem
} from '../../../../types/PIListFileUpload.types';

export const getFileIcon = (fileType: string): IconDefinition => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return faFilePdf;
    case 'xlsx':
    case 'xls':
      return faFileExcel;
    case 'docx':
    case 'doc':
      return faFileWord;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return faFileImage;
    case 'txt':
      return faFileAlt;
    default:
      return faFile;
  }
};

// Function to convert file to Base64
export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        // Return the complete data URL including the MIME type prefix
        resolve(reader.result.toString());
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

// Find main category by ID
export const getMainCategoryById = (
  data: MainCategory[],
  id: string
): MainCategory | undefined => {
  return data.find(main => main.id === id);
};

// Find category by ID within a main category
export const getCategoryById = (
  data: MainCategory[],
  mainCategoryId: string,
  categoryId: string
): any => {
  const mainCategory = getMainCategoryById(data, mainCategoryId);
  if (!mainCategory) return undefined;
  return mainCategory.categories.find(category => category.id === categoryId);
};

// Find subcategory by ID within a category
export const getSubCategoryById = (
  data: MainCategory[],
  mainCategoryId: string,
  categoryId: string,
  subCategoryId: string
): any => {
  const category = getCategoryById(data, mainCategoryId, categoryId);
  if (!category) return undefined;
  return category.subCategories.find(
    subCategory => subCategory.id === subCategoryId
  );
};

// Get the inverse mapping from attachment type to folder ID
export const getAttachmentTypeToFolderMap = () => {
  return Object.entries(folderToAttachmentTypeMap).reduce(
    (acc, [folderId, attachmentType]) => {
      acc[attachmentType] = folderId;
      return acc;
    },
    {} as Record<string, string>
  );
};

// Function to get file extension from MIME type
export const getFileExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExt: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'application/zip': 'zip',
    'application/x-zip-compressed': 'zip',
    'application/octet-stream': 'bin'
  };

  return mimeToExt[mimeType.toLowerCase()] || 'bin';
};

// Function to extract MIME type and file extension from base64 data URL
export const extractFileInfoFromBase64 = (
  dataUrl: string
): {
  mimeType: string;
  extension: string;
  base64Data: string;
} => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/data:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const extension = getFileExtensionFromMimeType(mimeType);
  const base64Data = arr[1] || '';

  return {
    mimeType,
    extension,
    base64Data
  };
};

// Function to get the MIME type based on file extension
export const getMimeType = (fileType: string): string => {
  const type = fileType.toLowerCase();
  switch (type) {
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
};

// Yardımcı fonksiyon: Data URL'den dosya indirme
export function downloadDataUrlFile(dataUrl: string, fileName: string) {
  const { mimeType, extension, base64Data } =
    extractFileInfoFromBase64(dataUrl);

  // Eğer fileName'de uzantı yoksa, MIME type'dan çıkarılan uzantıyı ekle
  const finalFileName = fileName.includes('.')
    ? fileName
    : `${fileName}.${extension}`;

  const bstr = atob(base64Data);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = finalFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

// Helper function to download a file
export const downloadFile = (blob: Blob, fileName: string) => {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up blob URL after download
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 100);
};
