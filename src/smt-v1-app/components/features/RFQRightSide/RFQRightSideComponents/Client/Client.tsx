import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'components/base/DatePicker';
import SearchBox from 'components/common/SearchBox';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const Client = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const [foundClient, setFoundClient] = useState<string | null>(null);

  const companyList = [
    'ABC Company',
    'XYZ Ltd.',
    'Simpson Corp.',
    'Acme Inc.',
    'Globex Corporation',
    'Initech',
    'Umbrella Corporation',
    'Wayne Enterprises',
    'Stark Industries',
    'Wonka Industries'
  ];

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = term
      ? companyList.filter(company =>
          company.toLowerCase().includes(term.toLowerCase())
        )
      : [];
    setFilteredCompanies(filtered);
  };

  const handleSelectCompany = (company: string) => {
    setFoundClient(company); // Set selected company
    clearSearch(); // Clear search input and filtered list
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredCompanies([]);
  };

  const handleAddCompany = () => {
    window.open('about:blank', '_blank');
  };

  const handleCheckboxToggle = () => {
    setFoundClient(null); // Clear the found client
  };

  return (
    <div>
      {/* Client Search Section */}
      <h3 className="mt-5">Client</h3>
      <hr className="custom-line m-0" />
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h4 className="me-3">Client:</h4>
          <SearchBox
            placeholder="Search by Company Name"
            className="pt-0 pe-0"
            inputClassName="rounded-pill my-3"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <div>
          <Button variant="primary" onClick={handleAddCompany}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
            Add Company
          </Button>
        </div>
      </div>

      {/* Display Filtered Company List */}
      {filteredCompanies.length > 0 && (
        <ul className="search-results">
          {filteredCompanies.map((company, index) => (
            <li
              key={index}
              className="search-result-item d-flex align-items-center"
              onClick={() => handleSelectCompany(company)}
              style={{ cursor: 'pointer' }}
            >
              <span>{company}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Selected Client and RFQ Deadline Section */}
      <div className="d-flex align-items-center mt-2">
        <h4 className="me-2">Found Client:</h4>
        <span className="me-2">{foundClient || 'None'}</span>
        <input
          type="checkbox"
          className="me-2"
          checked={!!foundClient}
          onChange={handleCheckboxToggle} // Checkbox tıklaması
          disabled={!foundClient} // Eğer bulunmuş bir client yoksa, checkbox kapalı olsun
        />
      </div>

      <div className="d-flex align-items-center mt-3">
        <h4 className="me-2">RFQ Deadline:</h4>
        <DatePicker placeholder="Select Date" />
      </div>
    </div>
  );
};

export default Client;
