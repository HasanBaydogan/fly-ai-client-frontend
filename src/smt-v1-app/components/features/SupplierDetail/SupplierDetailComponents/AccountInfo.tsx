import { useState, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { patchOtherValues } from 'smt-v1-app/services/SupplierServices';

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
  brands?: Brand[];
  aircraftTypes?: AircraftType[];
  onBrandsChange?: (brand: string) => void;
  onAircraftTypesChange?: (type: string) => void;
  brandOptions?: string[];
  aircraftTypeOptions?: string[];
  onBrandAdded?: (brand: string) => void;
  onAircraftTypeAdded?: (aircraftType: string) => void;
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
  brandOptions = [],
  aircraftTypeOptions = [],
  onBrandAdded,
  onAircraftTypeAdded
}: AccountInfoProps) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedAircraftType, setSelectedAircraftType] = useState<string>('');
  const [isBrandInput, setIsBrandInput] = useState(false);
  const [isAircraftInput, setIsAircraftInput] = useState(false);
  const [brandInputStatus, setBrandInputStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [aircraftInputStatus, setAircraftInputStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [localBrandOptions, setLocalBrandOptions] =
    useState<string[]>(brandOptions);
  const [localAircraftTypeOptions, setLocalAircraftTypeOptions] =
    useState<string[]>(aircraftTypeOptions);

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

  // Sync with parent options if they change
  useEffect(() => {
    setLocalBrandOptions(brandOptions);
  }, [brandOptions]);
  useEffect(() => {
    setLocalAircraftTypeOptions(aircraftTypeOptions);
  }, [aircraftTypeOptions]);

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
    setBrandInputStatus('idle');
  };

  const handleAircraftInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSelectedAircraftType(value);
    onAircraftTypesChange?.(value);
    setAircraftInputStatus('idle');
  };

  // Yeni brand ekleme işlemi
  const handleBrandInputBlur = async () => {
    if (selectedBrand.trim() && !localBrandOptions.includes(selectedBrand)) {
      try {
        await patchOtherValues({ value: selectedBrand, status: 'BRAND' });
        setLocalBrandOptions(prev => [...prev, selectedBrand]);
        setBrandInputStatus('success');
        onBrandAdded?.(selectedBrand);
      } catch (e) {
        setBrandInputStatus('error');
        // Hata yönetimi eklenebilir
      }
    }
    if (!selectedBrand.trim()) {
      setIsBrandInput(false);
      setBrandInputStatus('idle');
    }
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
        onAircraftTypeAdded?.(selectedAircraftType);
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
            {isBrandInput ? (
              <Form.Control
                type="text"
                placeholder="Enter new brand"
                value={selectedBrand}
                onChange={handleBrandInputChange}
                onBlur={handleBrandInputBlur}
                style={{
                  borderColor:
                    brandInputStatus === 'success'
                      ? 'green'
                      : brandInputStatus === 'error'
                      ? 'red'
                      : undefined
                }}
              />
            ) : (
              <Form.Select value={selectedBrand} onChange={handleBrandsChange}>
                <option value="">Select Brand</option>
                {localBrandOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
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
