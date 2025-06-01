import { useState, useEffect } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';

interface Country {
  countryId: string;
  countryName: string;
}

interface AddressDetailsProps {
  onCountryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCertificateTypes: (value: string[]) => void;
  getbyCountryList?: { data: Country[] };
  setPickUpAddress: (value: string) => void;
  pickUpAddress: string;
  defaultCountry?: string;
  defaultStatus?: string;
  defaultCertificateTypes?: string[];
}

const AddressDetails = ({
  onCountryChange,
  onStatusChange,
  onCertificateTypes,
  getbyCountryList,
  setPickUpAddress,
  pickUpAddress,
  defaultCountry,
  defaultStatus,
  defaultCertificateTypes
}: AddressDetailsProps) => {
  const [legalCityName, setLegalCityName] = useState('');
  const [legalCountryName, setLegalCountryName] = useState('');
  const [pickupCityName, setPickupCityName] = useState('');
  const [pickupCountryName, setPickupCountryName] = useState('');
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [legalAddress, setLegalAddress] = useState('');

  useEffect(() => {
    if (getbyCountryList?.data) {
      setCountryList(getbyCountryList.data);
    }
  }, [getbyCountryList]);

  useEffect(() => {
    if (defaultCountry) {
      setLegalCountryName(defaultCountry);
      setPickupCountryName(defaultCountry);
    }
  }, [defaultCountry]);

  const handleLegalCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setLegalCountryName(value);
    if (useSameAddress) {
      setPickupCountryName(value);
      onCountryChange(value);
    }
  };

  const handlePickupCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setPickupCountryName(value);
    if (useSameAddress) {
      setLegalCountryName(value);
      onCountryChange(value);
    }
  };

  const handleLegalCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLegalCityName(value);
    if (useSameAddress) {
      setPickupCityName(value);
    }
  };

  const handlePickupCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickupCityName(value);
  };

  const handleUseSameAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setUseSameAddress(checked);
    if (checked) {
      setPickupCityName(legalCityName);
      setPickupCountryName(legalCountryName);
      setPickUpAddress(legalAddress);
    }
  };

  const handleLegalAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLegalAddress(value);
    if (useSameAddress) {
      setPickUpAddress(value);
    }
  };

  const handlePickUpAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPickUpAddress(value);
  };

  return (
    <div className="mt-2">
      <div className="mt-2">
        <div className="mt-4 mb-3 d-flex gap-4">
          <Form.Group className="flex-grow-1">
            <FloatingLabel controlId="floatingTextarea2" label="Legal Address">
              <Form.Control
                as="textarea"
                placeholder="Address"
                style={{ height: '100px' }}
                value={legalAddress}
                onChange={handleLegalAddress}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="flex-grow-1">
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Pick Up Address"
            >
              <Form.Control
                as="textarea"
                placeholder="Address"
                style={{ height: '100px' }}
                value={pickUpAddress}
                onChange={handlePickUpAddress}
                disabled={useSameAddress}
              />
            </FloatingLabel>
          </Form.Group>
        </div>
      </div>
      <div className="mt-2 mb-3 d-flex gap-3">
        <Form.Group style={{ width: '25%' }}>
          <Form.Label>Legal City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            value={legalCityName}
            onChange={handleLegalCityChange}
          />
        </Form.Group>
        <Form.Group style={{ width: '25%' }}>
          <Form.Label>Legal Country</Form.Label>
          <Form.Select
            value={legalCountryName}
            onChange={handleLegalCountryChange}
          >
            <option value="">Select Country</option>
            {countryList.map(country => (
              <option key={country.countryId} value={country.countryId}>
                {country.countryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="px-2" style={{ width: '25%' }}>
          <Form.Label>Pickup City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter City"
            value={pickupCityName}
            onChange={handlePickupCityChange}
            disabled={useSameAddress}
          />
        </Form.Group>
        <Form.Group style={{ width: '25%' }}>
          <Form.Label>Pickup Country</Form.Label>
          <Form.Select
            value={pickupCountryName}
            onChange={handlePickupCountryChange}
            disabled={useSameAddress}
          >
            <option value="">Select Country</option>
            {countryList.map(country => (
              <option key={country.countryId} value={country.countryId}>
                {country.countryName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      <div className="mt-2 mb-3">
        <Form.Check
          type="checkbox"
          id="useSameAddress"
          label="Use same address as Pick Up Address"
          checked={useSameAddress}
          onChange={handleUseSameAddressChange}
        />
      </div>
    </div>
  );
};

export default AddressDetails;
