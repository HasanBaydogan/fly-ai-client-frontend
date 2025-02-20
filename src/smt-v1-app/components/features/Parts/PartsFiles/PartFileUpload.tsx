import React, { useState } from 'react';
import Dropzone from '../../SupplierDetail/SupplierDetailComponents/Dropzone';
import styles from '../../GlobalComponents/FileUpload.module.css';
import AttachmentPreview, {
  FileAttachment
} from '../../SupplierDetail/SupplierDetailComponents/AttachmentPreview';
import Button from 'components/base/Button';

const MAX_TOTAL_SIZE = 16 * 1024 * 1024;

interface Base64File {
  id: string;
  name: string;
  base64: string;
}

// Genişletilmiş dosya ön izleme tipi
interface ExtendedFileAttachment extends FileAttachment {
  customDescription?: string;
  isConfirmed?: boolean;
}

interface FileUploadProps {
  onFilesUpload: (base64Files: Base64File[]) => void;
}

const PartFileUpload: React.FC<FileUploadProps> = ({ onFilesUpload }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ExtendedFileAttachment[]>(
    []
  );
  const [base64Files, setBase64Files] = useState<Base64File[]>([]);

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

      const newPreviews: ExtendedFileAttachment[] = acceptedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        format: file.type,
        customDescription: '', // Başlangıçta açıklama boş
        isConfirmed: false // Düzenlenmemiş (aktif) durum
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

    const updatedBase64Files = base64Files.filter(
      file => file.name !== removedPreview.name
    );
    setBase64Files(updatedBase64Files);
    onFilesUpload(updatedBase64Files);
  };

  // Açıklama onaylandığında, input alanını pasif hale getirir
  const handleConfirmDescription = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index] = {
      ...updatedFiles[index],
      isConfirmed: true
    };
    setUploadedFiles(updatedFiles);
  };

  // Düzenleme butonuna tıklanırsa input aktif hale gelir
  const handleEditDescription = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index] = {
      ...updatedFiles[index],
      isConfirmed: false
    };
    setUploadedFiles(updatedFiles);
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
          <div key={index} className="d-flex align-items-center mb-2">
            <AttachmentPreview
              attachment={file}
              handleRemove={() => handleRemoveFile(index)}
            />
            {/* Açıklama input alanı */}
            <input
              type="text"
              placeholder="Enter description"
              value={file.customDescription || ''}
              onChange={e => {
                const updatedFiles = [...uploadedFiles];
                updatedFiles[index] = {
                  ...updatedFiles[index],
                  customDescription: e.target.value
                };
                setUploadedFiles(updatedFiles);
              }}
              className="form-control ms-2"
              style={{ maxWidth: '200px' }}
              disabled={file.isConfirmed}
            />
            {file.isConfirmed ? (
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => handleEditDescription(index)}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="primary"
                className="ms-2"
                onClick={() => handleConfirmDescription(index)}
              >
                Confirm
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartFileUpload;
