import { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

interface Brand {
  value: string;
  isSelected: boolean;
}

interface AircraftType {
  value: string;
  isSelected: boolean;
}

interface AccountInfoProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onCountryChange: (value: string) => void;
  brands?: Brand[];
  aircraftTypes?: AircraftType[];
  onBrandsChange?: (brand: string) => void;
  onAircraftTypesChange?: (type: string) => void;
}

const AccountInfo = ({
  username,
  setUsername,
  password,
  setPassword,
  onCountryChange,
  brands = [],
  aircraftTypes = [],
  onBrandsChange,
  onAircraftTypesChange
}: AccountInfoProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedAircraftType, setSelectedAircraftType] = useState<string>('');
  const [isBrandInput, setIsBrandInput] = useState(false);
  const [isAircraftInput, setIsAircraftInput] = useState(false);

  // Initial data setup
  useEffect(() => {
    if (brands && brands.length > 0) {
      const selectedBrandObj = brands.find(brand => brand.isSelected);
      if (selectedBrandObj) {
        setSelectedBrand(selectedBrandObj.value);
        onBrandsChange?.(selectedBrandObj.value);
      }
    }

    if (aircraftTypes && aircraftTypes.length > 0) {
      const selectedAircraftTypeObj = aircraftTypes.find(
        type => type.isSelected
      );
      if (selectedAircraftTypeObj) {
        setSelectedAircraftType(selectedAircraftTypeObj.value);
        onAircraftTypesChange?.(selectedAircraftTypeObj.value);
      }
    }
  }, []); // Run only once on component mount

  // Update when props change
  useEffect(() => {
    if (brands && brands.length > 0) {
      const selectedBrandObj = brands.find(brand => brand.isSelected);
      if (selectedBrandObj && selectedBrandObj.value !== selectedBrand) {
        setSelectedBrand(selectedBrandObj.value);
        onBrandsChange?.(selectedBrandObj.value);
      }
    }
  }, [brands]);

  useEffect(() => {
    if (aircraftTypes && aircraftTypes.length > 0) {
      const selectedAircraftTypeObj = aircraftTypes.find(
        type => type.isSelected
      );
      if (
        selectedAircraftTypeObj &&
        selectedAircraftTypeObj.value !== selectedAircraftType
      ) {
        setSelectedAircraftType(selectedAircraftTypeObj.value);
        onAircraftTypesChange?.(selectedAircraftTypeObj.value);
      }
    }
  }, [aircraftTypes]);

  const handleBrandsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsBrandInput(true);
      setSelectedBrand('');
    } else {
      setIsBrandInput(false);
      setSelectedBrand(value);
      onBrandsChange?.(value);
    }
  };

  const handleAircraftTypesChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (value === 'new') {
      setIsAircraftInput(true);
      setSelectedAircraftType('');
    } else {
      setIsAircraftInput(false);
      setSelectedAircraftType(value);
      onAircraftTypesChange?.(value);
    }
  };

  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedBrand(value);
    onBrandsChange?.(value);
  };

  const handleAircraftInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSelectedAircraftType(value);
    onAircraftTypesChange?.(value);
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
        <div className="gap-4" style={{ width: '75%' }}>
          <Form.Group className="gap-5">
            <Form.Label>Brands</Form.Label>
            {isBrandInput ? (
              <Form.Control
                type="text"
                placeholder="Enter new brand"
                value={selectedBrand}
                onChange={handleBrandInputChange}
                onBlur={() => {
                  if (!selectedBrand.trim()) {
                    setIsBrandInput(false);
                  }
                }}
              />
            ) : (
              <Form.Select value={selectedBrand} onChange={handleBrandsChange}>
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.value} value={brand.value}>
                    {brand.value}
                  </option>
                ))}
                <option value="new">+ Add New Brand</option>
              </Form.Select>
            )}

            <Form.Label>Aircraft Type</Form.Label>
            {isAircraftInput ? (
              <Form.Control
                type="text"
                placeholder="Enter new aircraft type"
                value={selectedAircraftType}
                onChange={handleAircraftInputChange}
                onBlur={() => {
                  if (!selectedAircraftType.trim()) {
                    setIsAircraftInput(false);
                  }
                }}
              />
            ) : (
              <Form.Select
                value={selectedAircraftType}
                onChange={handleAircraftTypesChange}
              >
                <option value="">Select Aircraft Type</option>
                {aircraftTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.value}
                  </option>
                ))}
                <option value="new">+ Add New Aircraft Type</option>
              </Form.Select>
            )}
          </Form.Group>
        </div>
      </div>
    </Form>
  );
};

export default AccountInfo;
