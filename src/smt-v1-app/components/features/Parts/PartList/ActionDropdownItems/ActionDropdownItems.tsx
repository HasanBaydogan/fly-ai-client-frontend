import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import PartDetailModal from '../PartDetailModal';
import {
  ClientDataDetail,
  getByClientDetailList
} from 'smt-v1-app/services/ClientServices';
import { Link } from 'react-router-dom';

interface ActionDropdownItemsProps {
  clientId: string;
  clientDataDetail: ClientDataDetail;
}

const ActionDropdownItems = ({ clientId }: ActionDropdownItemsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [fetchedClientData, setFetchedClientData] =
    useState<ClientDataDetail | null>(null);

  const handleViewClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const response = await getByClientDetailList(clientId);

      setFetchedClientData(response.data);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
    setShowDetailModal(true);
  };

  return (
    <>
      <Dropdown.Item onClick={handleViewClick}>View</Dropdown.Item>
      <Dropdown.Item as={Link} to={`/client/edit?clientId=${clientId}`}>
        Edit
      </Dropdown.Item>
      {showDetailModal && (
        <PartDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          ClientDataDetail={fetchedClientData}
        />
      )}
    </>
  );
};

export default ActionDropdownItems;
