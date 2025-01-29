import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import SupplierDetailModal from '../SupplierDetailModal';
import { mockData, SupplierData } from '../SearchBySupplierListMock';

interface ActionDropdownItemsProps {
  supplierId: string;
}

const ActionDropdownItems = ({ supplierId }: ActionDropdownItemsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const supplierData = mockData[supplierId];

  return (
    <>
      <Dropdown.Item onClick={() => setShowDetailModal(true)}>
        View
      </Dropdown.Item>
      <Dropdown.Item eventKey="2">Export</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="4" className="text-danger">
        Remove
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
