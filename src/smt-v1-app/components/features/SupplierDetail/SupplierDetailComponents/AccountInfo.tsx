import { useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const AccountInfo = ({
  username,
  setUsername,
  password,
  setPassword,
  onCountryChange
}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);
    onCountryChange(value);
  };
  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <Form>
      <Form.Group className="mt-6">
        <Form.Label className="fw-bold fs-8">Account Information</Form.Label>
      </Form.Group>
      <div className="d-flex flex-row gap-4 mt-1">
        <div className="gap-4" style={{ width: '25%' }}>
          <Form.Group className="gap-5">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="User Name"
              value={username}
              onChange={handleUsername}
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
            />
          </Form.Group>
        </div>
        <div className="gap-4 " style={{ width: '75%' }}>
          <Form.Group className="  gap-5 ">
            <Form.Label>Select City</Form.Label>
            <Form.Select value={selectedCountry} onChange={handleCountryChange}>
              <option value="">Select City</option>
              {/* {countryList.map(country => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))} */}
            </Form.Select>

            <Form.Label>Select City</Form.Label>
            <Form.Select value={selectedCountry} onChange={handleCountryChange}>
              <option value="">Select City</option>
              {/* {countryList.map(country => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))} */}
            </Form.Select>
          </Form.Group>
        </div>
      </div>
    </Form>
  );
};

export default AccountInfo;
