import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import ClientDetailModal from '../ClientDetailModal';
import {
  ClientDataDetail,
  getByClientDetailList
} from 'smt-v1-app/services/ClientServices';
import { Link } from 'react-router-dom';

interface ActionDropdownItemsProps {
  clientId: string;
  clientDataDetail: ClientDataDetail; // prop adını camelCase olarak tanımladık
}

const ActionDropdownItems = ({ clientId }: ActionDropdownItemsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [fetchedClientData, setFetchedClientData] =
    useState<ClientDataDetail | null>(null);

  const handleViewClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log(`Fetching client for ID: ${clientId}`);

    try {
      // clientId ile veriyi çekiyoruz
      const response = await getByClientDetailList(clientId);
      console.log('Response from getByClientDetailList:', response);
      // Gelen veriyi state'e atıyoruz.
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
        <ClientDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          ClientDataDetail={fetchedClientData}
        />
      )}
    </>
  );
};

export default ActionDropdownItems;
