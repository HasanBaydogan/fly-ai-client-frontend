import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import SupplierDetailModal from '../SupplierDetailModal';
import { SupplierData } from 'smt-v1-app/services/SupplierServices';
import { Link } from 'react-router-dom';

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

interface ActionDropdownItemsProps {
  supplierId: string;
  supplierData: SupplierData;
}

const ActionDropdownItems = ({
  supplierId,
  supplierData
}: ActionDropdownItemsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <Dropdown.Item onClick={() => setShowDetailModal(true)}>
        View
      </Dropdown.Item>
      <Dropdown.Item as={Link} to={`/supplier/edit?supplierId=${supplierId}`}>
        Edit
      </Dropdown.Item>
      <SupplierDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        supplierData={supplierData}
      />
    </>
  );
};

export default ActionDropdownItems;
