import React, { useState, useEffect } from 'react';
import Dropzone from './Dropzone';
import styles from './FileUpload.module.css';
import AttachmentPreview, { FileAttachment } from './AttachmentPreview';

const MAX_TOTAL_SIZE = 16 * 1024 * 1024;

interface Base64File {
  id?: string;
  name: string;
  base64: string;
}

interface FileUploadProps {
  onFilesUpload: (base64Files: Base64File[]) => void;
  initialFiles?: Base64File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUpload,
  initialFiles = []
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const [base64Files, setBase64Files] = useState<Base64File[]>([]);

  // Initialize with initialFiles if provided
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0) {
      setBase64Files(
        initialFiles.map(file => ({
          ...file,
          id: file.id || `${file.name}-${Date.now()}`
        }))
      );

      // Create preview objects from initialFiles
      const previews: FileAttachment[] = initialFiles.map(file => ({
        name: file.name,
        url: file.base64, // Using base64 as URL for initial files
        size: 'N/A', // Size information not available for initial files
        format: 'N/A' // Format information not available for initial files
      }));

      setUploadedFiles(previews);
    }
  }, [initialFiles]);

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
