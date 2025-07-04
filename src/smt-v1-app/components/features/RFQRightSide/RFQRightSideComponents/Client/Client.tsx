import { faArrowRotateRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'components/base/DatePicker';
import SearchBox from 'components/common/SearchBox';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getAllClientsFromDB } from 'smt-v1-app/services/RFQService';

type Client = {
  clientId: string;
  clientName: string;
};

const Client = ({
  foundClient,
  rfqDeadline,
  setFoundClient,
  setRFQDeadline,
  clientRFQId,
  setClientRFQId,
  toastSuccess,
  toastError
}: {
  foundClient: Client;
  rfqDeadline: Date;
  setFoundClient: React.Dispatch<React.SetStateAction<Client>>;
  setRFQDeadline: React.Dispatch<React.SetStateAction<Date>>;
  clientRFQId: string;
  setClientRFQId: React.Dispatch<React.SetStateAction<string>>;
  toastSuccess: (messageHeader: string, message: string) => void;
  toastError: (messageHeader: string, message: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Client[]>([]);

  const [clientList, setClientList] = useState<Client[]>();

  const [isLoading, setIsLoading] = useState(true);

  const getAllClients = async () => {
    setIsLoading(true);
    const resp = await getAllClientsFromDB();
    setClientList(resp.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllClients();
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    const filtered = query
      ? clientList?.filter(client =>
          client.clientName.toLowerCase().includes(query.toLowerCase())
        ) || []
      : [];
    setFilteredCompanies(filtered);
  };

  const handleSelectClient = (selected: Client[]) => {
    if (selected.length > 0) {
      setFoundClient(selected[0]);
    } else {
      setFoundClient(null);
    }
  };

  const handleAddCompany = () => {
    window.open('/client/new-client', '_blank');
  };

  return (
    <>
      {' '}
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <LoadingAnimation />
        </div>
      ) : (
        <div>
          <h3 className="mt-5">Client</h3>
          <hr className="custom-line m-0" />

          <div className="found-client-container d-flex align-items-center mt-3">
            <h4 className="me-3 mb-0">Client:</h4>
            <span
              className={`me-3 fw-bold ${!foundClient ? 'text-muted' : ''}`}
            >
              {foundClient?.clientName || 'None'}
            </span>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            <div className="d-flex align-items-center">
              <h4 className="me-2">RFQ Deadline:</h4>
              <DatePicker
                placeholder="Select Date"
                value={rfqDeadline}
                onChange={date => setRFQDeadline(date[0])}
              />
            </div>
            <div className="d-flex align-items-center">
              <h4 className="me-2">{'Client RFQ Id : '}</h4>

              <Form.Group>
                <Form.Control
                  placeholder="ClientRFQ Id"
                  value={clientRFQId}
                  onChange={e => setClientRFQId(e.target.value)}
                  disabled
                />
              </Form.Group>
            </div>
          </div>
        </div>
      )}{' '}
    </>
  );
};

export default Client;
