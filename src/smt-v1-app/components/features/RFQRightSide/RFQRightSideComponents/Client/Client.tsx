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
  client,
  rfqDeadline
}: {
  client: Client;
  rfqDeadline: string;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Client[]>([]);
  const [foundClient, setFoundClient] = useState<Client | null>(client);
  const [clientList, setClientList] = useState<Client[]>();

  const parseDeadline = (deadlineString: string): Date => {
    const [day, month, year] = deadlineString.split('.').map(Number);
    return new Date(year, month - 1, day); // Note: Month is 0-indexed.
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    rfqDeadline ? parseDeadline(rfqDeadline) : undefined
  );

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

  const handleSelectCompany = (selected: Client[]) => {
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
              onChange={handleSelectCompany} // Handle selection
              selected={foundClient ? [foundClient] : []} // Preselect found client
              multiple={false} // Single selection only
              positionFixed // Keeps dropdown attached to the input
              style={{ zIndex: 1050 }} // Ensure visibility of dropdown
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

      <div className="d-flex align-items-center mt-3">
        <h4 className="me-2">RFQ Deadline:</h4>
        <DatePicker
          placeholder="Select Date"
          value={selectedDate}
          onChange={date => setSelectedDate(date[0])} // Flatpickr returns an array of dates.
        />
      </div>
    </div>
  );
};

export default Client;
