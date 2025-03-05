import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
// import PartDetailModal from '../PartDetailModal';
import {
  ClientDataDetail,
  getByClientDetailList
} from 'smt-v1-app/services/ClientServices';
import { QuoteData } from 'smt-v1-app/services/QuoteService';
import { Link } from 'react-router-dom';
import PartDetailModal from 'smt-v1-app/components/features/Parts/PartList/PartDetailModal';

interface ActionDropdownItemsProps {
  clientId: string;
  clientDataDetail: QuoteData;
}

const ActionDropdownItems = ({ clientId }: ActionDropdownItemsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [fetchedClientData, setFetchedClientData] =
    useState<ClientDataDetail | null>(null);

  const handleViewClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // console.log(`Fetching client for ID: ${clientId}`);

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
