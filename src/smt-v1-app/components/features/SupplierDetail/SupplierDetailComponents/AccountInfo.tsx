import React, { useState, useEffect } from 'react';
import { Col, Dropdown, Form } from 'react-bootstrap';
import { patchOtherValues } from 'smt-v1-app/services/SupplierServices';

interface AircraftType {
  value: string;
  isSelected: boolean;
}

interface BrandGroup {
  label: string;
  options: { value: string; name: string }[];
}

interface AccountInfoProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  brands?: string[];
  aircraftTypes?: AircraftType[];
  onBrandsChange?: (brand: string) => void;
  onAircraftTypesChange?: (type: string) => void;
  aircraftTypeOptions?: string[];
}

const AccountInfo = ({
  username,
  setUsername,
  password,
  setPassword,
  brands = [],
  aircraftTypes = [],
  onBrandsChange,
  onAircraftTypesChange,
  aircraftTypeOptions = []
}: AccountInfoProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedAircraftType, setSelectedAircraftType] = useState<string>('');
  const [isAircraftInput, setIsAircraftInput] = useState(false);
  const [aircraftInputStatus, setAircraftInputStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [localAircraftTypeOptions, setLocalAircraftTypeOptions] =
    useState<string[]>(aircraftTypeOptions);

  // Brand groups structure similar to oemGroups
  const brandGroups = [
    {
      label: 'Tyres',
      options: [
        { value: 'MICHELIN', name: 'Michelin' },
        { value: 'DUNLOP', name: 'Dunlop' },
        { value: 'BRIDGESTONE', name: 'Bridgestone' },
        { value: 'GOODYEAR', name: 'Goodyear' }
      ]
    },
    {
      label: 'Avionics',
      options: [
        { value: 'A_COLLINS_AEROSPACE', name: 'Collins Aerospace' },
        { value: 'HONEYWELL', name: 'Honeywell' },
        { value: 'THALES_GROUP', name: 'Thales Group' },
        {
          value: 'SAFRAN_ELECTRONICS_DEFENSE',
          name: 'Safran Electronics & Defense'
        },
        { value: 'L3HARRIS_TECHNOLOGIES', name: 'L3Harris Technologies' }
      ]
    },
    {
      label: 'Landing Gear',
      options: [
        { value: 'SAFRAN_LANDING_SYSTEMS', name: 'Safran Landing Systems' },
        { value: 'B_COLLINS_AEROSPACE', name: 'Collins Aerospace' },
        { value: 'LIEBHERR_AEROSPACE', name: 'Liebherr Aerospace' },
        { value: 'HEROUX_DEVTEK', name: 'Heroux-Devtek' }
      ]
    },
    {
      label: 'Actuators & Control Systems',
      options: [
        { value: 'PARKER_AEROSPACE', name: 'Parker Aerospace' },
        { value: 'MOOG_INC', name: 'Moog Inc.' },
        { value: 'SAFRAN_AEROSYSTEMS', name: 'Safran Aerosystems' }
      ]
    },
    {
      label: 'Aerostructures',
      options: [
        { value: 'SPIRIT_AEROSYSTEMS', name: 'Spirit AeroSystems' },
        { value: 'PREMIUM_AEROTEC', name: 'Premium Aerotec' },
        { value: 'GKN_AEROSPACE', name: 'GKN Aerospace' }
      ]
    }
  ];

  // Get dropdown title for brands
  const getBrandDropdownTitle = () => {
    if (brands.length === 0) {
      return 'Select Brand';
    }

    if (brands.includes('ANY')) {
      return 'ANY';
    }

    const allBrands = brandGroups.flatMap(g => g.options);
    const firstSelectedBrand = allBrands.find(b => b.value === brands[0]);

    if (!firstSelectedBrand) {
      return 'Select Brands';
    }
    if (brands.length === 1) {
      return firstSelectedBrand.name;
    }

    const remainingCount = brands.length - 1;
    return `${firstSelectedBrand.name} +${remainingCount} Brands`;
  };

  // Handle brand checkbox change
  const handleBrandCheckboxChange = (brandValue: string) => {
    onBrandsChange?.(brandValue);
  };

  // Initial data setup
  useEffect(() => {
    if (brands && brands.length > 0) {
      setSelectedBrand(brands[0]);
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
      setSelectedBrand(brands[0]);
    }

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
  }, [brands, aircraftTypes]);

  // Sync with parent options if they change
  useEffect(() => {
    setLocalAircraftTypeOptions(aircraftTypeOptions);
  }, [aircraftTypeOptions]);

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

  const handleAircraftInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSelectedAircraftType(value);
    onAircraftTypesChange?.(value);
    setAircraftInputStatus('idle');
  };

  // Yeni aircraft type ekleme işlemi
  const handleAircraftInputBlur = async () => {
    if (
      selectedAircraftType.trim() &&
      !localAircraftTypeOptions.includes(selectedAircraftType)
    ) {
      try {
        await patchOtherValues({
          value: selectedAircraftType,
          status: 'AIRCRAFT'
        });
        setLocalAircraftTypeOptions(prev => [...prev, selectedAircraftType]);
        setAircraftInputStatus('success');
      } catch (e) {
        setAircraftInputStatus('error');
        // Hata yönetimi eklenebilir
      }
    }
    if (!selectedAircraftType.trim()) {
      setIsAircraftInput(false);
      setAircraftInputStatus('idle');
    }
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
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                variant="outline-secondary"
                style={{
                  background: 'white',
                  border: '1px solid #d8e0e9',
                  color: '#212529',
                  fontWeight: 430,
                  fontSize: '0.9rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '0.5rem',
                  boxShadow: 'none',
                  outline: 'none'
                }}
                id="dropdown-brands"
                className="w-100 text-start d-flex justify-content-between align-items-center"
              >
                <span className="text-truncate">{getBrandDropdownTitle()}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100 p-0">
                <Dropdown.Item
                  as="div"
                  onClick={() => handleBrandCheckboxChange('ANY')}
                >
                  <Form.Check
                    className="p-1 mx-2"
                    type="checkbox"
                    id="brand-any"
                    label="ANY"
                    checked={brands.includes('ANY')}
                    onChange={() => {}}
                  />
                </Dropdown.Item>
                {brandGroups.map(group => (
                  <React.Fragment key={group.label}>
                    <Dropdown.Header className="p-2 mx-3">
                      {group.label}
                    </Dropdown.Header>
                    {group.options.map(option => (
                      <Dropdown.Item
                        className="p-1 mx-0"
                        as="div"
                        key={option.value}
                        onClick={() => handleBrandCheckboxChange(option.value)}
                        style={{
                          opacity: brands.includes('ANY') ? 0.5 : 1,
                          pointerEvents: brands.includes('ANY')
                            ? 'none'
                            : 'auto'
                        }}
                      >
                        <Form.Check
                          type="checkbox"
                          id={`brand-${option.value}`}
                          label={option.name}
                          checked={brands.includes(option.value)}
                          onChange={() => {}}
                          disabled={brands.includes('ANY')}
                        />
                      </Dropdown.Item>
                    ))}
                  </React.Fragment>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Form.Label>Aircraft Type</Form.Label>
            {isAircraftInput ? (
              <Form.Control
                type="text"
                placeholder="Enter new aircraft type"
                value={selectedAircraftType}
                onChange={handleAircraftInputChange}
                onBlur={handleAircraftInputBlur}
                style={{
                  borderColor:
                    aircraftInputStatus === 'success'
                      ? 'green'
                      : aircraftInputStatus === 'error'
                      ? 'red'
                      : undefined
                }}
              />
            ) : (
              <Form.Select
                value={selectedAircraftType}
                onChange={handleAircraftTypesChange}
              >
                <option value="">Select Aircraft Type</option>
                {localAircraftTypeOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
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
