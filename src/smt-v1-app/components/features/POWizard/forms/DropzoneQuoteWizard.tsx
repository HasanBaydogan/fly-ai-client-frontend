import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from 'smt-v1-app/components/features/GlobalComponents/FileUpload.module.css';

import Dropzone from '../../SupplierDetail/SupplierDetailComponents/Dropzone';
import AttachmentPreview, {
  FileAttachment
} from '../../SupplierDetail/SupplierDetailComponents/AttachmentPreview';

const MAX_TOTAL_SIZE = 21 * 1024 * 1024;

interface Base64File {
  id?: string;
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
  const processedFilesRef = useRef<Set<string>>(new Set());

  // Memoize the file processing callback
  const processAlreadyUploadedFiles = useCallback(() => {
    if (!alreadyUploadedFiles || alreadyUploadedFiles.length === 0) {
      return;
    }

    // Filter out empty files and already processed files
    const validFiles = alreadyUploadedFiles.filter(file => {
      const isValid =
        file && file.name && file.base64 && file.base64.trim() !== '';
      const isProcessed = processedFilesRef.current.has(file.name);
      return isValid && !isProcessed;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Mark files as processed
    validFiles.forEach(file => {
      processedFilesRef.current.add(file.name);
    });

    // Notify parent about the valid files
    onFilesUpload(validFiles);

    // Format the files for base64 state
    const formattedUploadFiles = validFiles.map(file => ({
      id: file.id || Date.now().toString(),
      name: file.name,
      base64: file.base64
    }));

    setBase64Files(prevFiles => {
      const newFiles = formattedUploadFiles.filter(
        newFile =>
          !prevFiles.some(existingFile => existingFile.name === newFile.name)
      );
      return [...prevFiles, ...newFiles];
    });

    // Create preview objects for PDF files
    const previewFiles: FileAttachment[] = validFiles.map(file => {
      try {
        // Handle both data URL and raw base64 formats
        const base64Data = file.base64.includes('base64,')
          ? file.base64.split('base64,')[1]
          : file.base64;

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        return {
          name: file.name,
          url: url,
          size: 'N/A',
          format: 'application/pdf'
        };
      } catch (error) {
        console.error('Error creating preview for file:', file.name, error);
        return {
          name: file.name,
          url: '',
          size: 'N/A',
          format: 'application/pdf'
        };
      }
    });

    setUploadedFiles(prevFiles => {
      const newPreviews = previewFiles.filter(
        newPreview =>
          !prevFiles.some(
            existingPreview => existingPreview.name === newPreview.name
          )
      );
      return [...prevFiles, ...newPreviews];
    });
  }, [alreadyUploadedFiles, onFilesUpload]);

  // Use the memoized callback in useEffect
  useEffect(() => {
    processAlreadyUploadedFiles();
  }, [processAlreadyUploadedFiles]);

  const handleDrop = async (acceptedFiles: File[], fileRejections: any[]) => {
    const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      setErrorMessage('Total attachment size cannot exceed 21MB.');
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

    // Remove from base64Files by matching by name
    const updatedBase64Files = base64Files.filter(
      file => file.name !== removedPreview.name
    );
    setBase64Files(updatedBase64Files);
    onFilesUpload(updatedBase64Files);

    // Remove from processed files set
    processedFilesRef.current.delete(removedPreview.name);

    // Clean up the object URL
    if (removedPreview.url) {
      URL.revokeObjectURL(removedPreview.url);
    }
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [uploadedFiles]);

  return (
    <div className="">
      {/* <Dropzone
        onDrop={handleDrop}
        className={
          styles.suppliercreatezoneattachmentsdropzonefileuploadcontainer
        }
      /> */}
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
