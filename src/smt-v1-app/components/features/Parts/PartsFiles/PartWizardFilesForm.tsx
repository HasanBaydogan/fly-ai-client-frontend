import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Pagination,
  Dropdown,
  Modal,
  Button as RBButton
} from 'react-bootstrap';
import Button from 'components/base/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import PartFileUpload from './PartFileUpload';
import {
  getByAttachedFiles,
  postFileCreate,
  deleteByAttachedFiles,
  putFileUpdate,
  getByDownloadFiles
} from 'smt-v1-app/services/PartServices';

interface PartWizardFilesFormProps {
  partId?: string;
}

const convertFileSize = (
  sizeInBytes: number
): { size: number; unit: string } => {
  if (sizeInBytes < 1024) {
    return { size: sizeInBytes, unit: 'BYTE' };
  } else if (sizeInBytes < 1048576) {
    return { size: +(sizeInBytes / 1024).toFixed(2), unit: 'KILOBYTE' };
  } else {
    return { size: +(sizeInBytes / 1048576).toFixed(2), unit: 'MEGABYTE' };
  }
};

const formatFileSize = (sizeStr: string): string => {
  if (!sizeStr) return '';
  const parts = sizeStr.split(' ');
  if (parts.length === 2) {
    const [numberPart, unitPart] = parts;
    const normalizedUnit = unitPart.trim().toUpperCase();
    if (normalizedUnit === 'MEGABYTE') return `${numberPart} MB`;
    if (normalizedUnit === 'KILOBYTE') return `${numberPart} KB`;
    if (normalizedUnit === 'BYTE') return `${numberPart} Byte`;
    return sizeStr;
  }
  return sizeStr;
};

const PartWizardFilesForm: React.FC<PartWizardFilesFormProps> = ({
  partId
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [base64Files, setBase64Files] = useState<
    {
      id?: string;
      name: string;
      base64: string;
      size?: number;
      description: string;
    }[]
  >([]);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<any>(null);

  // Submit modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<any>(null);
  const [editFileName, setEditFileName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const openFileInNewTab = (file: {
    data: string;
    contentType: string;
    fileName: string;
  }) => {
    try {
      const base64Index = file.data.indexOf('base64,');
      const base64String =
        base64Index !== -1 ? file.data.substring(base64Index + 7) : file.data;
      const binaryData = atob(base64String);
      const length = binaryData.length;
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: file.contentType });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleDownload = async (file: any) => {
    try {
      const response = await getByDownloadFiles(file.partFileId);
      if (response && response.success) {
        const base64Data = response.data.data;
        // Dosya türüne göre contentType belirleniyor.
        const contentType = getContentType(file);
        openFileInNewTab({
          data: base64Data,
          contentType,
          fileName: file.fileName
        });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getContentType = (file: any): string => {
    const fileName = file.fileName.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      return 'application/pdf';
    } else if (fileName.endsWith('.xls')) {
      return 'application/vnd.ms-excel';
    } else if (fileName.endsWith('.xlsx')) {
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      return 'image/jpeg';
    } else if (fileName.endsWith('.png')) {
      return 'image/png';
    } else if (fileName.endsWith('.gif')) {
      return 'image/gif';
    } else {
      return 'application/octet-stream';
    }
  };

  const handleFilesUpload = (
    uploadedFiles: {
      name: string;
      base64: string;
      size?: number;
      description: string;
    }[]
  ) => {
    setBase64Files(uploadedFiles);
  };

  const fetchFiles = useCallback(async () => {
    if (!partId) return;
    setLoading(true);
    try {
      const response = await getByAttachedFiles(partId, currentPage);
      if (response && response.statusCode === 200 && response.data) {
        setFiles(response.data.partFileResponses);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching attached files:', error);
    }
    setLoading(false);
  }, [partId, currentPage]);

  useEffect(() => {
    fetchFiles();
  }, [partId, currentPage, fetchFiles]);

  const handleEdit = (file: any) => {
    setFileToEdit(file);
    setEditFileName(file.fileName);
    setEditDescription(file.description);
    setShowEditModal(true);
  };

  const handleDeleteClick = (file: any) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (fileToDelete) {
      try {
        const deleteResponse = await deleteByAttachedFiles(
          fileToDelete.partFileId
        );
        fetchFiles();
      } catch (error) {
        console.error('Dosya silme hatası:', error);
      }
      setFileToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const confirmSubmit = async () => {
    setShowSubmitModal(false);
    await handleSubmitFiles();
  };

  const handleSubmitFiles = async () => {
    if (!partId) return;
    for (const file of base64Files) {
      const { size, unit } = convertFileSize(file.size || 0);
      const newFilePayload = {
        partId: partId,
        fileName: file.name,
        description: file.description,
        data: file.base64,
        fileSize: size,
        fileSizeUnit: unit
      };
      try {
        const result = await postFileCreate(newFilePayload);
      } catch (error) {
        console.error('Dosya gönderim hatası:', error);
      }
    }
    fetchFiles();
    setBase64Files([]);
  };

  const handleConfirmEdit = async () => {
    if (!fileToEdit) return;
    try {
      const payload = {
        id: fileToEdit.partFileId,
        description: editDescription
      };
      const response = await putFileUpdate(payload);
      // console.log('Dosya güncellendi:', response);
      fetchFiles();
    } catch (error) {
      console.error('Dosya güncelleme hatası:', error);
    }
    setShowEditModal(false);
    setFileToEdit(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        <PartFileUpload onFilesUpload={handleFilesUpload} />

        {base64Files.length > 0 && (
          <div className="mb-3">
            <Button variant="primary" onClick={() => setShowSubmitModal(true)}>
              Submit Files
            </Button>
          </div>
        )}

        {/* Yükleniyor gösterimi */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Description</th>
                <th>File Type</th>
                <th>File Size</th>
                <th>Created By</th>
                <th style={{ width: '50px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.partFileId}>
                  <td>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        handleDownload(file);
                      }}
                    >
                      {file.fileName}
                    </a>
                  </td>

                  <td>{file.date}</td>
                  <td>{file.description}</td>
                  <td>{file.fileType}</td>
                  <td>{formatFileSize(file.fileSize)}</td>
                  <td>{file.createdBy}</td>
                  <td className="text-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="link" className="p-0">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEdit(file)}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeleteClick(file)}>
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div></div>
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      </div>

      {/* Silme Onay Modalı */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete file "{fileToDelete?.fileName}"?
        </Modal.Body>
        <Modal.Footer>
          <RBButton
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </RBButton>
          <RBButton variant="danger" onClick={confirmDelete}>
            Delete
          </RBButton>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showSubmitModal}
        onHide={() => setShowSubmitModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm File Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit these files?</Modal.Body>
        <Modal.Footer>
          <RBButton
            variant="secondary"
            onClick={() => setShowSubmitModal(false)}
          >
            Cancel
          </RBButton>
          <RBButton variant="primary" onClick={confirmSubmit}>
            Submit
          </RBButton>
        </Modal.Footer>
      </Modal>

      {/* Edit Modalı */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="editDescription" className="form-label">
              Description
            </label>
            <input
              id="editDescription"
              type="text"
              className="form-control"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <RBButton variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </RBButton>
          <RBButton variant="primary" onClick={handleConfirmEdit}>
            Save
          </RBButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PartWizardFilesForm;
