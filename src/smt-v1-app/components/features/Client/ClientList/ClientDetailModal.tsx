import React, { useEffect } from 'react';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAttachedFile } from 'smt-v1-app/services/GlobalServices';

interface ClientDetailModalProps {
  show: boolean;
  onHide: () => void;
  ClientDataDetail: {
    id: string;
    clientId: string;
    companyName: string;
    segments?: { segmentName: string }[];
    currencyPreference: string;
    website: string;
    legalAddress: string;
    mail?: string;
    contacts: { email: string }[];
    clientStatus?: any; // API'den string gelebilir, nesne de olabilir
    quoteID: string | null;
    attachmentResponses?: {
      attachmentId: string | null;
      fileName: string | null;
    }[];
    details: string | null;
    phone: string;
    subCompanyName: string;
    clientRatings: {
      dialogQuality: number;
      volumeOfOrder: number;
      continuityOfOrder: number;
      easeOfPayment: number;
      easeOfDelivery: number;
    };
    marginTable: {
      below200: number;
      btw200and500: number;
      btw500and1_000: number;
      btw1_000and5_000: number;
      btw5_000and10_000: number;
      btw10_000and50_000: number;
      btw50_000and100_000: number;
      btw100_000and150_000: number;
      btw150_000and200_000: number;
      btw200_000and400_000: number;
      btw400_000and800_000: number;
      btw800_000and1_000_000: number;
      btw1_000_000and2_000_000: number;
      btw2_000_000and4_000_000: number;
      above4_000_000: number;
      lastModifiedBy: string;
    };
    createdBy: string;
    createdOn: string;
    lastModifiedBy: string;
    lastModifiedOn: string;
  };
}

// Yardımcı fonksiyon: marginTable anahtarlarını okunabilir formata çevirir
const formatMarginKey = (key: string) => {
  // Örneğin, "btw200and500" -> "Between 200 and 500"
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^btw/, 'Between ')
    .replace(/and/, ' and ');
};

const ClientDetailModal = ({
  show,
  onHide,
  ClientDataDetail
}: ClientDetailModalProps) => {
  useEffect(() => {
    // console.log('ClientDataDetail received in Modal:', ClientDataDetail);
  }, [ClientDataDetail]);

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
      const binaryData = atob(base64Data);
      const arrayBuffer = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([arrayBuffer], {
        type: file.contentType || 'application/pdf'
      });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  };

  const getStatusColor = (type: string) => {
    switch (type.toUpperCase()) {
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

  const statusLabel =
    ClientDataDetail.clientStatus &&
    typeof ClientDataDetail.clientStatus === 'string'
      ? ClientDataDetail.clientStatus
      : ClientDataDetail.clientStatus?.label || 'N/A';

  const statusColor =
    ClientDataDetail.clientStatus &&
    typeof ClientDataDetail.clientStatus === 'string'
      ? getStatusColor(ClientDataDetail.clientStatus)
      : getStatusColor(ClientDataDetail.clientStatus?.label || '');

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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="gap-5">
        <Modal.Title>Client Details</Modal.Title>
        <Link
          className="btn btn-primary px-3"
          to={`/client/edit?clientId=${ClientDataDetail.id}`}
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
                    {(ClientDataDetail.segments || []).length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {(ClientDataDetail.segments || []).map(
                          (segment, index) => (
                            <li key={index}>• {segment.segmentName}</li>
                          )
                        )}
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
                    <Badge bg={statusColor}>{statusLabel}</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Website:</td>
                  <td>{ClientDataDetail.website}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Legal Address:</td>
                  <td>{ClientDataDetail.legalAddress}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Email:</td>
                  <td>{ClientDataDetail.mail}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Phone:</td>
                  <td>{ClientDataDetail.phone}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Dialog Quality:</td>
                  <td>{ClientDataDetail.clientRatings.dialogQuality}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Volume of Order:</td>
                  <td>{ClientDataDetail.clientRatings.volumeOfOrder}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Continuity of Order:</td>
                  <td>{ClientDataDetail.clientRatings.continuityOfOrder}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Ease of Payment:</td>
                  <td>{ClientDataDetail.clientRatings.easeOfPayment}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Ease of Delivery:</td>
                  <td>{ClientDataDetail.clientRatings.easeOfDelivery}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Attachments:</td>
                  <td>
                    {(ClientDataDetail.attachmentResponses || []).length > 0
                      ? (ClientDataDetail.attachmentResponses || []).map(
                          (attachment, index) => (
                            <span
                              key={index}
                              className="text-primary text-decoration-underline d-block"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleAttachedClick(attachment.attachmentId)
                              }
                            >
                              • {attachment.fileName || 'Unknown File'}
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
      <div className="d-flex content-row">
        <Modal.Dialog>
          <Row>
            <Col>
              <Table borderless className="table-sm">
                <thead>
                  <tr>
                    <th>
                      <h4 className="mb-3"> Margin Table</h4>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ClientDataDetail.marginTable &&
                    Object.entries(ClientDataDetail.marginTable).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td className="fw-bold">{formatMarginKey(key)}:</td>
                          <td>{value}</td>
                        </tr>
                      )
                    )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Dialog>
        <Modal.Dialog className="mt-9">
          <Row>
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
        </Modal.Dialog>
      </div>
    </Modal>
  );
};

export default ClientDetailModal;
