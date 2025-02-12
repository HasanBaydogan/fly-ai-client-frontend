import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Modal, Row, Col, Table, Badge, ModalBody } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAttachedFile } from 'smt-v1-app/services/ClientServices';

interface ClientDetailModalProps {
  show: boolean;
  onHide: () => void;
  ClientDataDetail: {
    clientId: string;
    companyName: string;
    segments: { segmentName: string }[];
    currencyPreference: string;
    website: string;
    legalAddress: string;
    email?: string;
    contacts: { email: string }[];
    clientStatus: {
      label: string;
      type: string;
    };
    quoteID: string | null;
    attachments: {
      attachmentId: string | null;
      attachmentName: string | null;
    }[];
    details: string | null;
    subCompanyName: string;
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

const ClientDetailModal = ({
  show,
  onHide,
  ClientDataDetail
}: ClientDetailModalProps) => {
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
  // /client/edit?clientId={props}
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="gap-5">
        <Modal.Title>Client Details</Modal.Title>
        <Link
          className="btn btn-primary px-3"
          to={`/client/edit?clientId=${ClientDataDetail.clientId}`}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="me-2" />
          Edit Client
        </Link>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Table borderless>
              <tbody>
                <tr>
                  <td className="fw-bold">Company Name:</td>
                  <td>{ClientDataDetail.companyName}</td>
                </tr>
                <tr>
                  <td className="fw-bold">SubCompany:</td>
                  <td>{ClientDataDetail.subCompanyName}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Currency Preference:</td>
                  <td>{ClientDataDetail.currencyPreference}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Segments:</td>
                  <td>
                    {ClientDataDetail.segments.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {ClientDataDetail.segments.map((segment, index) => (
                          <li key={index}>• {segment.segmentName}</li>
                        ))}
                      </ul>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Details:</td>
                  <td>{ClientDataDetail.details}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Status:</td>
                  <td>
                    <Badge
                      bg={getStatusColor(ClientDataDetail.clientStatus.label)}
                    >
                      {ClientDataDetail.clientStatus.label}
                    </Badge>
                  </td>
                </tr>

                <tr>
                  <td className="fw-bold">Website:</td>
                  <td>{ClientDataDetail.website}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Address:</td>
                  <td>{ClientDataDetail.legalAddress}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Email:</td>
                  <td>{ClientDataDetail.email}</td>
                </tr>

                <tr>
                  <td className="fw-bold">Certificates:</td>
                  <td>{ClientDataDetail.certificates.join(', ')}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Dialog Speed:</td>
                  <td>{ClientDataDetail.dialogSpeed}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Dialog Quality:</td>
                  <td>{ClientDataDetail.dialogQuality}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Ease of Supply:</td>
                  <td>{ClientDataDetail.easeOfSupply}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Supply Capability:</td>
                  <td>{ClientDataDetail.supplyCapability}</td>
                </tr>
                <tr>
                  <td className="fw-bold">EU Demand of Parts:</td>
                  <td>{ClientDataDetail.euDemandOfParts}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Attachments:</td>
                  <td>
                    {ClientDataDetail.attachments?.length > 0
                      ? ClientDataDetail.attachments.map(
                          (attachment, index) => (
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
                          )
                        )
                      : ''}
                  </td>
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
                  <td>{ClientDataDetail.createdBy}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Created On:</td>
                  <td>{ClientDataDetail.createdOn}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Last Modified By:</td>
                  <td>{ClientDataDetail.lastModifiedBy}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Last Modified On:</td>
                  <td>{ClientDataDetail.lastModifiedOn}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ClientDetailModal;
