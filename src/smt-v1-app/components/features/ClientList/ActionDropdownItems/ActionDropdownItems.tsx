import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import ClientDetailModal from '../ClientDetailModal';
import { ClientDataDetail } from 'smt-v1-app/services/ClientServices';
import { Link } from 'react-router-dom';

interface ActionDropdownItemsProps {
  clientId: string;
  ClientDataDetail: ClientDataDetail; // clientData'yı props olarak alıyoruz
}

const ActionDropdownItems = ({
  clientId,
  ClientDataDetail
}: ActionDropdownItemsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <>
      <Dropdown.Item onClick={() => setShowDetailModal(true)}>
        View
      </Dropdown.Item>
      <Dropdown.Item as={Link} to={`/client/edit?clientId=${clientId}`}>
        Edit
      </Dropdown.Item>
      <ClientDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        ClientDataDetail={ClientDataDetail}
      />
    </>
  );
};

export default ActionDropdownItems;
