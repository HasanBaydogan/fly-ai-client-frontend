import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import SupplierDetailModal from '../SupplierDetailModal';
import { SupplierData } from 'smt-v1-app/services/SupplierServices';
import { Link } from 'react-router-dom';

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
