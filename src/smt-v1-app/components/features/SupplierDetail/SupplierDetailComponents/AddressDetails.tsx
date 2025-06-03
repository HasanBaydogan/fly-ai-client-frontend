import { useState, useEffect } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';

interface Country {
  countryId: string;
  countryName: string;
}

interface AddressDetailsProps {
  onStatusChange: (value: string) => void;
  onCertificateTypes: (value: string[]) => void;
  getbyCountryList?: { data: Country[] };
  setPickUpAddress: (value: string) => void;
  pickUpAddress: string;
  legalAddress: string;
  setLegalAddress: (value: string) => void;
  legalCity: string;
  setLegalCity: (value: string) => void;
  legalCountryId: string;
  setLegalCountryId: (value: string) => void;
  pickupCity: string;
  setPickupCity: (value: string) => void;
  pickupCountryId: string;
  setPickupCountryId: (value: string) => void;
  defaultCountry?: string;
  defaultStatus?: string;
  defaultCertificateTypes?: string[];
}

const AddressDetails = ({
  onStatusChange,
  getbyCountryList,
  setPickUpAddress,
  pickUpAddress,
  legalAddress,
  setLegalAddress,
  legalCity,
  setLegalCity,
  legalCountryId,
  setLegalCountryId,
  pickupCity,
  setPickupCity,
  pickupCountryId,
  setPickupCountryId,
  defaultCountry
}: AddressDetailsProps) => {
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]);

  useEffect(() => {
    if (getbyCountryList?.data) {
      setCountryList(getbyCountryList.data);
    }
  }, [getbyCountryList]);

  useEffect(() => {
    if (defaultCountry) {
      setLegalCountryId(defaultCountry);
      setPickupCountryId(defaultCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece ilk render'da çalışsın

  const handleLegalCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setLegalCountryId(value);
  };

  const handlePickupCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setPickupCountryId(value);
  };

  const handleLegalCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLegalCity(value);
  };

  const handlePickupCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPickupCity(value);
  };

  const handleUseSameAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setUseSameAddress(checked);
    if (checked) {
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
            value={legalCity}
            onChange={handleLegalCityChange}
          />
        </Form.Group>
        <Form.Group style={{ width: '25%' }}>
          <Form.Label>Legal Country</Form.Label>
          <Form.Select
            value={legalCountryId}
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
            value={pickupCity}
            onChange={handlePickupCityChange}
            disabled={useSameAddress}
          />
        </Form.Group>
        <Form.Group style={{ width: '25%' }}>
          <Form.Label>Pickup Country</Form.Label>
          <Form.Select
            value={pickupCountryId}
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
