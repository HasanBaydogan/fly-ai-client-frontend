import React, { useEffect, useState } from 'react';
import styles from 'smt-v1-app/components/features/GlobalComponents/FileUpload.module.css';

import Dropzone from '../../SupplierDetail/SupplierDetailComponents/Dropzone';
import AttachmentPreview, {
  FileAttachment
} from '../../SupplierDetail/SupplierDetailComponents/AttachmentPreview';

const MAX_TOTAL_SIZE = 21 * 1024 * 1024;

interface Base64File {
  id: string;
  name: string;
  base64: string;
}

interface FileUploadProps {
  onFilesUpload: (base64Files: Base64File[]) => void;
  alreadyUploadedFiles?: Base64File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUpload,
  alreadyUploadedFiles
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const [base64Files, setBase64Files] = useState<Base64File[]>([]);

  function dataURLtoBlob(dataurl: string): Blob {
    const [header, base64Data] = dataurl.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid dataURL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(base64Data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  function calculateSizeFromBase64(base64String: string): string {
    // Base64 string'den prefix'i kaldır
    const base64WithoutPrefix = base64String.split(',')[1] || base64String;

    // Base64 uzunluğundan byte boyutunu hesapla
    // Her 4 base64 karakter 3 byte'a denk gelir
    const padding = base64WithoutPrefix.endsWith('==')
      ? 2
      : base64WithoutPrefix.endsWith('=')
      ? 1
      : 0;
    const fileSize = (base64WithoutPrefix.length * 3) / 4 - padding;

    // Boyutu uygun birime çevir (B, KB, MB)
    if (fileSize < 1024) {
      return `${fileSize.toFixed(2)} B`;
    } else if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(2)} KB`;
    } else {
      return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    }
  }

  useEffect(() => {
    if (alreadyUploadedFiles && alreadyUploadedFiles.length > 0) {
      // Notify parent about the already uploaded files.
      onFilesUpload(alreadyUploadedFiles);

      // Format the files for base64 state
      const formattedUploadFiles = alreadyUploadedFiles.map(file => {
        let base64String = file.base64;
        // Eğer base64 verisi data: ile başlamıyorsa, prefix ekle
        if (!base64String.startsWith('data:')) {
          base64String = `data:application/pdf;base64,${base64String}`;
        }
        return {
          id: Date.now().toString(),
          name: file.name,
          base64: base64String
        };
      });
      setBase64Files(formattedUploadFiles);

      // Create preview objects.
      const previewFiles: FileAttachment[] = formattedUploadFiles.map(file => {
        return {
          name: file.name,
          url: file.base64,
          size: calculateSizeFromBase64(file.base64),
          format: 'application/pdf'
        };
      });
      setUploadedFiles(previewFiles);
    }
  }, []);

  // Component unmount olduğunda blob URL'leri temizle
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.url.startsWith('blob:')) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [uploadedFiles]);

  const handleDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
    const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      setErrorMessage('Total attachment size cannot exceed 16MB.');
      return;
    }

    setErrorMessage(null);

    const base64Promises = acceptedFiles.map((file, index) => {
      return new Promise<Base64File>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          if (reader.result && typeof reader.result === 'string') {
            resolve({
              id: `${file.name}-${Date.now()}-${index}`,
              name: file.name,
              base64: reader.result
            });
          } else {
            reject(new Error(`Base64 conversion failed for: ${file.name}`));
          }
        };

        reader.onerror = error => reject(error);
      });
    });

    try {
      const newBase64Files = await Promise.all(base64Promises);
      const updatedBase64Files = [...base64Files, ...newBase64Files];

      setBase64Files(updatedBase64Files);
      onFilesUpload(updatedBase64Files);

      const newPreviews: FileAttachment[] = acceptedFiles.map(
        (file, index) => ({
          name: file.name,
          url: URL.createObjectURL(file),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          format: file.type
        })
      );

      setUploadedFiles(prevFiles => [...prevFiles, ...newPreviews]);
    } catch (error) {
      console.error('Error converting files to Base64:', error);
      setErrorMessage('Some files could not be processed.');
    }
  };

  const handleRemoveFile = (index: number) => {
    const removedPreview = uploadedFiles[index];
    const updatedPreviews = uploadedFiles.filter((_, ind) => ind !== index);
    setUploadedFiles(updatedPreviews);

    // Also remove from base64Files by matching by name.
    // (If multiple files have the same name, a better ID check would be needed.)
    const updatedBase64Files = base64Files.filter(
      file => file.name !== removedPreview.name
    );
    setBase64Files(updatedBase64Files);
    onFilesUpload(updatedBase64Files);
  };

  const handleFileClick = (url: string, fileName: string) => {
    // Base64 data URL'i doğrudan yeni sekmede aç
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${fileName}</title>
          </head>
          <body style="margin:0;padding:0;">
            <embed width="100%" height="100%" src="${url}" type="application/pdf" />
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="pt-5">
      <Dropzone
        onDrop={handleDrop}
        className={
          styles.suppliercreatezoneattachmentsdropzonefileuploadcontainer
        }
      />
      {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
      <div className="mt-3">
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            style={{ cursor: 'pointer' }}
            onClick={() => handleFileClick(file.url, file.name)}
          >
            <AttachmentPreview
              attachment={file}
              handleRemove={() => handleRemoveFile(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
