import * as XLSX from 'xlsx';

interface ExcelData {
  blob: Blob;
  fileName: string;
  contentType: string;
  originalResponse: any;
}

// Sütun başlıklarını normalize eden yardımcı fonksiyon
const normalize = (str: any) =>
  typeof str === 'string' ? str.trim().toLowerCase() : str;

export const convertBase64ToBlob = (response: any): ExcelData => {
  try {
    3;
    // console.log('Original Response:', response);

    // Convert base64 to Blob
    const byteCharacters = atob(response.data.data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: response.data.contentType });

    // Create the complete data structure
    const excelData: ExcelData = {
      blob,
      fileName: response.data.fileName,
      contentType: response.data.contentType,
      originalResponse: response
    };

    // Log the conversion results
    // console.log('Converted Blob:', blob);
    // console.log('File Name:', excelData.fileName);
    // console.log('Content Type:', excelData.contentType);
    // console.log('Complete Excel Data:', excelData);

    return excelData;
  } catch (error) {
    console.error('Error converting base64 to Blob:', error);
    throw error;
  }
};

export const logBlobDetails = (blob: Blob) => {
  //   console.log('Blob Size:', blob.size, 'bytes');
  //   console.log('Blob Type:', blob.type);
  //   console.log('Blob Created At:', new Date().toLocaleString());
};

export const createDownloadLink = (blob: Blob, fileName: string): string => {
  return URL.createObjectURL(blob);
};

export const convertBlobToJSON = async (blob: Blob): Promise<any> => {
  try {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Convert ArrayBuffer to Uint8Array
    const uint8Array = new Uint8Array(arrayBuffer);

    // Convert Uint8Array to string
    const binaryString = Array.from(uint8Array)
      .map(byte => String.fromCharCode(byte))
      .join('');

    // Convert binary string to base64
    const base64String = btoa(binaryString);

    // Create JSON structure
    const jsonData = {
      data: base64String,
      type: blob.type,
      size: blob.size,
      lastModified: new Date().toISOString()
    };

    // console.log('Converted Blob to JSON:', jsonData);
    return jsonData;
  } catch (error) {
    console.error('Error converting Blob to JSON:', error);
    throw error;
  }
};
