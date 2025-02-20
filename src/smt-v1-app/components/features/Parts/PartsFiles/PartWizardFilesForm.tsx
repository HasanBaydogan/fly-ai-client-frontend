import React, { useState } from 'react';
import { Col, Row, Table, Pagination, Dropdown } from 'react-bootstrap';
import Button from 'components/base/Button';
import illus38 from 'assets/img/spot-illustrations/38.webp';
import illusDark38 from 'assets/img/spot-illustrations/dark_38.webp';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import PartFileUpload from './PartFileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const files = [
  {
    id: 1,
    name: 'VL_Photos_22a',
    date: '29/03/2023 10:33:03',
    description: 'PRODUCT PHOTO',
    fileType: 'Photo',
    fileSize: '128KB',
    createdBy: 'Ahmet Durmaz'
  },
  {
    id: 2,
    name: 'DK-120902_152',
    date: '28/02/2023 15:23:33',
    description: 'Certificate',
    fileType: 'PDF',
    fileSize: '1.3MB',
    createdBy: 'Fatih Kadir'
  }
];

const WizardSuccessStep = () => {
  const { startOver } = useWizardFormContext();
  // Hook'u burada kullanabilirsiniz.
  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);

  const handleFilesUpload = (
    uploadedFiles: { name: string; base64: string }[]
  ) => {
    setBase64Files(uploadedFiles);
  };

  // Üç nokta menüsündeki "View" tıklandığında yapılacak işlem
  const handleView = (file: any) => {
    window.open('/dosya-goruntuleme-url/' + file.id, '_blank');
  };

  // "Edit" tıklandığında yapılacak işlem
  const handleEdit = (file: any) => {
    alert(`Edit mode for file: ${file.name}`);
  };

  // "Delete" tıklandığında yapılacak işlem
  const handleDelete = (file: any) => {
    const confirmed = window.confirm(
      `${file.name} isimli dosyayı silmek istediğinize emin misiniz?`
    );
    if (confirmed) {
      alert(`Dosya silindi: ${file.name}`);
      // Silme işlemini burada uygulayabilirsiniz.
    }
  };

  return (
    <>
      {/* Dosya listesi ve tablo */}
      <div>
        {/* Dosya yükleme bileşeni */}
        <PartFileUpload onFilesUpload={handleFilesUpload} />

        {/* Dosya tablosu */}
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
              <tr key={file.id}>
                <td>{file.name}</td>
                <td>{file.date}</td>
                <td>{file.description}</td>
                <td>{file.fileType}</td>
                <td>{file.fileSize}</td>
                <td>{file.createdBy}</td>
                <td className="text-center">
                  <Dropdown>
                    <Dropdown.Toggle variant="link" className="p-0">
                      <FontAwesomeIcon icon={faEllipsisH} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleView(file)}>
                        View
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleEdit(file)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(file)}>
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Sayfalandırma alanı (Pagination) */}
        <div className="d-flex justify-content-between align-items-center">
          <div></div>
          <Pagination className="mb-0">
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default WizardSuccessStep;
