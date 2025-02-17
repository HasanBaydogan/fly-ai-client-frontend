import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Modal, Row, Col, Table, Badge, ModalBody } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAttachedFile } from 'smt-v1-app/services/GlobalServices';

interface SupplierDetailModalProps {
  show: boolean;
  onHide: () => void;
  supplierData: {
    id: string;
    companyName: string;
    segments: { segmentName: string }[];
    brand: string;
    country: string;
    address: string;
    email?: string;
    contacts: { email: string }[];
    status: {
      label: string;
      type: string;
    };
    quoteID: string | null;
    attachments: {
      attachmentId: string | null;
      attachmentName: string | null;
    }[];
    workingDetails: string | null;
    userName: string;
    certificates: string[];
    dialogSpeed: string;
    dialogQuality: string;
    easeOfSupply: string;
    supplyCapability: string;
    euDemandOfParts: string;
    createdBy: string;
    createdOn: string;
    lastModifiedBy: string;
    lastModifiedOn: string;
  };
}

const SupplierDetailModal = ({
  show,
  onHide,
  supplierData
}: SupplierDetailModalProps) => {
  const openPdfInNewTab = (file: {
    data: string;
    contentType: string | null;
    fileName: string;
  }) => {
    if (!file?.data) {
      console.error('No file data found.');
      return;
    }
    try {
      const base64Data = file.data.split(',')[1];

      // Base64 stringini binary formatına çevir
      const binaryData = atob(base64Data);
      const arrayBuffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }

      // Blob nesnesi oluştur
      const blob = new Blob([arrayBuffer], {
        type: file.contentType || 'application/pdf'
      });
      const url = URL.createObjectURL(blob);

      // Yeni sekmede aç
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'CONTACTED':
        return 'success';
      case 'NOT_CONTACTED':
        return 'warning';
      case 'BLACK_LISTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Belirli bir attachment ID için dosyayı getir
  const handleAttachedClick = async (attachmentId: string | null) => {
    if (!attachmentId) return;
    console.log(`Fetching attachment for ID: ${attachmentId}`);

    try {
      const response = await getAttachedFile(attachmentId);
      console.log('Attachment Response:', response);

      if (response?.data) {
        openPdfInNewTab(response.data);
      } else {
        console.error('Invalid attachment response');
      }
    } catch (error) {
      console.error('Error fetching attachment:', error);
    }
  };
  // /supplier/edit?supplierId={props}
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="gap-5">
        <Modal.Title>Supplier Details</Modal.Title>
        <Link
          className="btn btn-primary px-3"
          to={`/supplier/edit?supplierId=${supplierData.id}`}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
          Edit Supplier
        </Link>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Table borderless>
              <tbody>
                <tr>
                  <td className="fw-bold">Company:</td>
                  <td>{supplierData.companyName}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Segments:</td>
                  <td>
                    {supplierData.segments.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {supplierData.segments.map((segment, index) => (
                          <li key={index}>• {segment.segmentName}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Brand:</td>
                  <td>{supplierData.brand}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Country:</td>
                  <td>{supplierData.country}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Address:</td>
                  <td>{supplierData.address}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Email:</td>
                  <td>{supplierData.contacts?.[0]?.email}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Status:</td>
                  <td>
                    <Badge bg={getStatusColor(supplierData.status.label)}>
                      {supplierData.status.label}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">User Name:</td>
                  <td>{supplierData.userName}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Certificates:</td>
                  <td>{supplierData.certificates.join(', ')}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Dialog Speed:</td>
                  <td>{supplierData.dialogSpeed}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Dialog Quality:</td>
                  <td>{supplierData.dialogQuality}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Ease of Supply:</td>
                  <td>{supplierData.easeOfSupply}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Supply Capability:</td>
                  <td>{supplierData.supplyCapability}</td>
                </tr>
                <tr>
                  <td className="fw-bold">EU Demand of Parts:</td>
                  <td>{supplierData.euDemandOfParts}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Attachments:</td>
                  <td>
                    {supplierData.attachments?.length > 0
                      ? supplierData.attachments.map((attachment, index) => (
                          <span
                            key={index}
                            className="text-primary text-decoration-underline d-block"
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleAttachedClick(attachment.attachmentId)
                            }
                          >
                            • {attachment.attachmentName || 'Unknown File'}
                          </span>
                        ))
                      : ''}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Working Details:</td>
                  <td>{supplierData.workingDetails}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Body>
        <Row className="mt-4">
          <Col>
            <Table borderless>
              <tbody>
                <tr>
                  <td className="fw-bold">Created By:</td>
                  <td>{supplierData.createdBy}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Created On:</td>
                  <td>{supplierData.createdOn}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Last Modified By:</td>
                  <td>{supplierData.lastModifiedBy}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Last Modified On:</td>
                  <td>{supplierData.lastModifiedOn}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SupplierDetailModal;
