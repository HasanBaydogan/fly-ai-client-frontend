import classNames from 'classnames';
import {
  Accept,
  DropEvent,
  FileRejection,
  DropzoneProps as ReactDropZoneProps,
  useDropzone
} from 'react-dropzone';
import Button from 'components/base/Button';
import imageIcon from 'assets/img/icons/image-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import AttachmentPreview, { FileAttachment } from './AttachmentPreview';
import ImageAttachmentPreview from 'components/common/ImageAttachmentPreview';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const MAX_TOTAL_SIZE = 9.5 * 1024 * 1024;

interface DropzoneProps {
  className?: string;
  size?: 'sm';
  reactDropZoneProps?: ReactDropZoneProps;
  accept?: Accept;
  noPreview?: boolean;
  defaultFiles?: File[];
  onDrop?: <T extends File>(
    acceptedFiles: T[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
}

const Dropzone = ({
  className,
  size,
  onDrop,
  accept,
  defaultFiles = [],
  noPreview,
  reactDropZoneProps,
  children
}: PropsWithChildren<DropzoneProps>) => {
  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [previews, setPreviews] = useState<FileAttachment[]>([]);
  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Base64 conversion failed.'));
        }
      };

      reader.onerror = error => reject(error);
    });
  };

  const handleDrop = async (
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) => {
    setErrorMessage(null);

    let validFiles: File[] = [];
    let newBase64Files: { name: string; base64: string }[] = [];
    let newPreviews: FileAttachment[] = [];

    for (const file of acceptedFiles) {
      if (file.size > MAX_TOTAL_SIZE) {
        setErrorMessage(`"${file.name}" file exceeds 9.5MB!`);
      } else {
        validFiles.push(file);
        const base64 = await convertToBase64(file);
        newBase64Files.push({ name: file.name, base64 });

        // **FileAttachment nesnesini uygun formatta oluştur**
        newPreviews.push({
          name: file.name,
          url: URL.createObjectURL(file),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          format: file.type
        });
      }
    }
    // Yalnızca geçerli dosyaları kaydet
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setBase64Files(prevBase64 => [...prevBase64, ...newBase64Files]);
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);

    if (onDrop) {
      onDrop(validFiles, fileRejections, {} as DropEvent);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, ind) => index !== ind));
    setBase64Files(prevBase64 => prevBase64.filter((_, ind) => index !== ind));
    setPreviews(prevPreviews => prevPreviews.filter((_, ind) => index !== ind));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept,
    ...reactDropZoneProps
  });

  const imageOnly = useMemo(() => {
    return Boolean(accept && accept['image/*']);
  }, [accept]);

  useEffect(() => {
    if (defaultFiles.length > 0) {
      setFiles(defaultFiles);
      // Eğer defaultFiles varsa, previews ve base64Files da oluşturulmalıdır
      const defaultPreviews = defaultFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        format: file.type
      }));
      setPreviews(defaultPreviews);
    }
  }, [defaultFiles]);

  return (
    <>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}

      {imageOnly && !noPreview && files.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <ImageAttachmentPreview
              key={file.name}
              image={URL.createObjectURL(file)}
              handleClose={() => handleRemoveFile(index)}
            />
          ))}
        </div>
      )}

      <div
        {...getRootProps()}
        className={classNames(className, 'dropzone', {
          'dropzone-sm': size === 'sm'
        })}
      >
        <input {...getInputProps()} />
        {children ? (
          <>{children}</>
        ) : (
          <div className="text-body-tertiary text-opacity-85 fw-bold fs-9">
            Drag your file here {imageOnly ? 'image' : 'file'} Upload{' '}
            <span className="text-body-secondary">or </span>
            <Button variant="link" className="p-0">
              Select from Device
            </Button>
            <br />
            <img
              className="mt-3"
              src={imageIcon}
              width={size === 'sm' ? 24 : 40}
              alt="Upload Icon"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dropzone;
