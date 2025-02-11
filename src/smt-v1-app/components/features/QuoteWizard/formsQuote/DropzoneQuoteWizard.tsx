import React, { useEffect, useState } from 'react';
import styles from '../../SupplierDetail/SupplierDetailComponents/FileUpload.module.css';

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

  useEffect(() => {
    if (alreadyUploadedFiles && alreadyUploadedFiles.length > 0) {
      // Notify parent about the already uploaded files.
      onFilesUpload(alreadyUploadedFiles);

      // Format the files for base64 state (optional: adjust id generation as needed).
      const formattedUploadFiles = alreadyUploadedFiles.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        base64: file.base64
      }));
      setBase64Files(formattedUploadFiles);
      console.log(formattedUploadFiles);

      // Create preview objects.
      const previewFiles: FileAttachment[] = alreadyUploadedFiles.map(file => {
        // Convert base64 string to a Blob.
        return {
          name: file.name,
          url: 'asdasdas',
          size: 'N/A', // or compute the size if available
          format: '' // e.g., "application/pdf"
        };
      });
      console.log(previewFiles);
      setUploadedFiles(previewFiles);
    }
  }, []);

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

      const newPreviews: FileAttachment[] = acceptedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        format: file.type
      }));

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
          <AttachmentPreview
            key={index}
            attachment={file}
            handleRemove={() => handleRemoveFile(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
