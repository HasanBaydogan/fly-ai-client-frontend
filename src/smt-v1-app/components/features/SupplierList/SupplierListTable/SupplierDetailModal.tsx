import React from 'react';
import { Modal, Row, Col, Table, Badge } from 'react-bootstrap';

interface SupplierDetailModalProps {
  show: boolean;
  onHide: () => void;
  supplierData: {
    id: string;
    supplierCompany: string;
    segments: string;
    brand: string;
    countryInfo: string;
    pickupaddress: string;
    email: string;
    status: {
      label: string;
      type: string;
    };
    quoteID: string | null;
    attachedID: string | null;
    attachedName: string | null;
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
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Supplier Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Table borderless>
              <tbody>
                <tr>
                  <td className="fw-bold">Company:</td>
                  <td>{supplierData.supplierCompany}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Segments:</td>
                  <td>{supplierData.segments}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Brand:</td>
                  <td>{supplierData.brand}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Country:</td>
                  <td>{supplierData.countryInfo}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Address:</td>
                  <td>{supplierData.pickupaddress}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Email:</td>
                  <td>{supplierData.email}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Status:</td>
                  <td>
                    <Badge bg={supplierData.status.type}>
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
                  <td className="fw-bold">Quote ID:</td>
                  <td>{supplierData.quoteID || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Attached ID:</td>
                  <td>{supplierData.attachedID || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Attached Name:</td>
                  <td>{supplierData.attachedName || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Working Details:</td>
                  <td>{supplierData.workingDetails || 'N/A'}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
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
