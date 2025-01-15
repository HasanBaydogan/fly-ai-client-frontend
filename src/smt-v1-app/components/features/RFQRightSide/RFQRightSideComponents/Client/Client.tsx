import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'components/base/DatePicker';
import SearchBox from 'components/common/SearchBox';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
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
  setClientRFQId
}: {
  foundClient: Client;
  rfqDeadline: Date;
  setFoundClient: React.Dispatch<React.SetStateAction<Client>>;
  setRFQDeadline: React.Dispatch<React.SetStateAction<Date>>;
  clientRFQId: string;
  setClientRFQId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Client[]>([]);

  const [clientList, setClientList] = useState<Client[]>();

  useEffect(() => {
    const getAllClients = async () => {
      const resp = await getAllClientsFromDB();
      setClientList(resp.data);
    };

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
      setFoundClient(selected[0]); // Set the first selected client
    } else {
      setFoundClient(null);
    }
  };

  const handleAddCompany = () => {
    window.open('about:blank', '_blank');
  };

  return (
    <div>
      <h3 className="mt-5">Client</h3>
      <hr className="custom-line m-0" />
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="d-flex align-items-center">
          <h4 className="me-3">Client:</h4>
          <Form.Group className="d-flex align-items-center">
            <Typeahead
              id="client-search"
              labelKey="clientName"
              options={clientList || []} // Use the client list
              placeholder="Search by Client Name"
              onInputChange={handleSearch} // Handle input change for filtering
              onChange={handleSelectClient} // Handle selection
              selected={foundClient ? [foundClient] : []} // Preselect found client
              multiple={false} // Single selection only
              positionFixed // Keeps dropdown attached to the input
              style={{ zIndex: 10 }} // Ensure visibility of dropdown
            />
          </Form.Group>
        </div>
        <div>
          <Button variant="primary" onClick={handleAddCompany}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
            Add Client
          </Button>
        </div>
      </div>

      <div className="found-client-container d-flex align-items-center mt-3">
        <h4 className="me-3 mb-0">Found Client:</h4>
        <span className={`me-3 fw-bold ${!foundClient ? 'text-muted' : ''}`}>
          {foundClient?.clientName || 'None'}
        </span>
        <input
          type="checkbox"
          className="form-check-input me-2"
          checked={!!foundClient}
          onChange={() => setFoundClient(null)} // Clear selection on uncheck
          disabled={!foundClient} // Disable if no client is selected
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="d-flex align-items-center">
          <h4 className="me-2">RFQ Deadline:</h4>
          <DatePicker
            placeholder="Select Date"
            value={rfqDeadline}
            onChange={date => setRFQDeadline(date[0])} // Flatpickr returns an array of dates.
          />
        </div>
        <div className="d-flex align-items-center">
          <h4 className="me-2">{'Client RFQ Id : '}</h4>
          <Form.Group>
            <Form.Control
              placeholder="ClientRFQ Id"
              value={clientRFQId}
              onChange={e => setClientRFQId(e.target.value)}
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
};

export default Client;
