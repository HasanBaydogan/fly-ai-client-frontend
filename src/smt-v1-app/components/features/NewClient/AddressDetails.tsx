import { useState, useEffect } from 'react';
import {
  Col,
  FloatingLabel,
  Row,
  Badge,
  Dropdown,
  Form
} from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';

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
  setClientMail: (value: string) => void;
  clientMail: string;
  setClientWebsite: (value: string) => void;
  clientWebsite: string;
}

interface CertificateOption {
  label: string;
  value: string;
}

const certificateOptions: CertificateOption[] = [
  { label: 'CERTIFICATE_1', value: 'CERTIFICATE_1' },
  { label: 'CERTIFICATE_2', value: 'CERTIFICATE_2' },
  { label: 'CERTIFICATE_3', value: 'CERTIFICATE_3' },
  { label: 'CERTIFICATE_4', value: 'CERTIFICATE_4' }
];

interface MultiSelectDropdownProps {
  options: CertificateOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelectDropdown = ({
  options,
  selected,
  onChange
}: MultiSelectDropdownProps) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const handleItemClick = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <Dropdown show={open} autoClose="outside" onToggle={toggleOpen}>
      {/* Toggle kısmı: input görünümüne benzer, seçili öğeler badge şeklinde gösteriliyor */}
      <Dropdown.Toggle
        as="div"
        className="form-select w-100 d-flex flex-wrap align-items-center"
        style={{ cursor: 'pointer', minHeight: '38px' }}
        onClick={() => toggleOpen(!open)}
      >
        {selected.length > 0 ? (
          selected.map(cert => (
            <Badge
              key={cert}
              bg="secondary"
              className="me-1 mb-1"
              style={{ fontSize: '0.7rem', padding: '0.5rem 0.75rem' }}
            >
              {cert}
            </Badge>
          ))
        ) : (
          <span className="text-muted">Select Certificate</span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}
      >
        {options.map(option => (
          <Dropdown.Item
            key={option.value}
            as="div"
            onClick={() => handleItemClick(option.value)}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Form.Check
              type="checkbox"
              label={option.label}
              checked={selected.includes(option.value)}
              onChange={() => {}}
              style={{ pointerEvents: 'none' }}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const AddressDetails = ({
  onCountryChange,
  onStatusChange,
  onCertificateTypes,
  getbyCountryList,
  setPickUpAddress,
  pickUpAddress,
  defaultCountry,
  defaultStatus,
  defaultCertificateTypes,
  setClientMail,
  clientMail,
  setClientWebsite,
  clientWebsite
}: AddressDetailsProps) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null); // Hata mesajı

  const [countryList, setCountryList] = useState<Country[]>([]);
  const [certificateTypes, setCertificateTypes] = useState<string[]>([]);
  // Ülke listesini güncelle
  useEffect(() => {
    if (getbyCountryList?.data) {
      setCountryList(getbyCountryList.data);
    }
  }, [getbyCountryList]);

  // Parent’ten gelen default ülke değerini al
  useEffect(() => {
    if (defaultCountry) {
      setSelectedCountry(defaultCountry);
    }
  }, [defaultCountry]);

  // Parent’ten gelen default status değerini al
  useEffect(() => {
    if (defaultStatus) {
      setSelectedStatus(defaultStatus);
    }
  }, [defaultStatus]);

  // Parent’ten gelen default certificate değerlerini al
  useEffect(() => {
    if (defaultCertificateTypes) {
      setCertificateTypes(defaultCertificateTypes);
    }
  }, [defaultCertificateTypes]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountry(value);
    onCountryChange(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onStatusChange(value);
  };

  const handlePickUpAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPickUpAddress(e.target.value);
  };

  const handleCertificateChange = (selected: string[]) => {
    setCertificateTypes(selected);
    onCertificateTypes(selected);
  };

  const handleClientMailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setClientMail(value);

    if (value.trim() === '') {
      setError('Client Mail cannot be empty.');
    } else {
      setError(null);
    }
  };

  const handleBlur = () => {
    if (clientMail.trim() === '') {
      setError('Client Mail cannot be empty.');
    }
  };
  const handleClientWebsiteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClientWebsite(event.target.value);
  };

  return (
    <Col md={12}>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone*</Form.Label>
            <PhoneInput
              country={'tr'}
              value={phone}
              onChange={phone => setPhone(phone)}
              inputStyle={{
                width: '100%',
                borderColor: errors.phone ? '#dc3545' : ''
              }}
            />
            {errors.phone && (
              <div className="text-danger" style={{ fontSize: '0.875em' }}>
                {errors.phone}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Label>Status</Form.Label>
          <Form.Select value={selectedStatus} onChange={handleStatusChange}>
            <option value="">Select Status</option>
            <option value="NOT_CONTACTED">Not Contacted</option>
            <option value="CONTACTED">Contacted</option>
            <option value="BLACK_LISTED">Black</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Mail*"
            value={clientMail}
            onChange={handleClientMailChange}
            onBlur={handleBlur}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Brand"
            value={clientWebsite}
            onChange={handleClientWebsiteChange}
          />
        </Col>
      </Row>
      <Col md={12}></Col>
      <FloatingLabel
        controlId="floatingTextarea2"
        label="Details"
        className="mt-4"
      >
        <Form.Control
          as="textarea"
          placeholder="Details"
          style={{ height: '100px' }}
          value={pickUpAddress}
          onChange={handlePickUpAddress}
        />
      </FloatingLabel>
    </Col>
  );
};

export default AddressDetails;
