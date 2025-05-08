import React, { useState, useMemo } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import FileUpload from 'smt-v1-app/components/features/GlobalComponents/FileUpload';
import { postCompanyCreate } from 'smt-v1-app/services/CompanyServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPriceCurrencySymbol } from 'smt-v1-app/types/GlobalTypes';
import {
  parsePhoneNumberFromString,
  AsYouType,
  isValidPhoneNumber,
  getCountries,
  CountryCode,
  getCountryCallingCode
} from 'libphonenumber-js';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  validateIBAN,
  electronicFormatIBAN,
  friendlyFormatIBAN
} from 'ibantools';
import { useIbanValidator } from '../../GlobalComponents/IbanValidator';

// Get all available countries and sort them alphabetically
const COUNTRIES = getCountries().sort((a, b) => {
  const countryA = new Intl.DisplayNames(['en'], { type: 'region' }).of(a) || a;
  const countryB = new Intl.DisplayNames(['en'], { type: 'region' }).of(b) || b;
  return countryA.localeCompare(countryB);
});

// Currency options based on the available currencies in GlobalTypes
const CURRENCY_OPTIONS = [
  'USD',
  'EUR',
  'RUB',
  'TRY',
  'GBP',
  'JPY',
  'CNY',
  'CAD',
  'AUD',
  'MXN',
  'NZD',
  'CHF',
  'SGD',
  'HKD',
  'INR',
  'BRL',
  'KRW',
  'SEK',
  'NOK',
  'DKK',
  'ZAR',
  'AED',
  'SAR',
  'MYR',
  'THB',
  'IDR',
  'PLN',
  'CZK',
  'HUF',
  'ILS'
];

// Add file validation constants
const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB in bytes
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

interface Base64File {
  id: string;
  name: string;
  base64: string;
}

interface AddCompanyModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface BankInfo {
  bankName: string;
  branchName: string;
  branchCode: string;
  swiftCode: string;
  ibanNo: string;
  currency: string;
  ibanError?: string;
}

interface CompanyData {
  id?: string;
  logo: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyTelephone: string;
  companyBanks: BankInfo[];
}

const initialBankInfo: BankInfo = {
  bankName: '',
  branchName: '',
  branchCode: '',
  swiftCode: '',
  ibanNo: '',
  currency: 'USD' // Default currency
};

// Add phone formatting helper function
const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('90')) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
      8
    )}`;
  }
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  show,
  onHide,
  onSuccess
}) => {
  const { validateIban, formatIban } = useIbanValidator();
  const [formData, setFormData] = useState<CompanyData>({
    logo: '',
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    companyTelephone: '',
    companyBanks: [{ ...initialBankInfo }]
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [phoneError, setPhoneError] = useState<string>('');
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value as CountryCode;
    setSelectedCountry(newCountry);

    // Re-format the existing number with new country code if exists
    if (formData.companyTelephone) {
      const formatter = new AsYouType(newCountry);
      const formattedNumber = formatter.input(
        formData.companyTelephone.replace(/\D/g, '')
      );
      setFormData(prev => ({
        ...prev,
        companyTelephone: formattedNumber
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setPhoneError('');
    setFormData(prev => ({
      ...prev,
      companyTelephone: value
    }));
  };

  const handleBankInputChange = (
    index: number,
    field: keyof BankInfo,
    value: string
  ) => {
    if (field === 'ibanNo') {
      const { isValid, error, formattedIban } = validateIban(value);

      setFormData(prev => ({
        ...prev,
        companyBanks: prev.companyBanks.map((bank, i) =>
          i === index
            ? {
                ...bank,
                ibanNo: formattedIban || value,
                ibanError: error
              }
            : bank
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        companyBanks: prev.companyBanks.map((bank, i) =>
          i === index ? { ...bank, [field]: value } : bank
        )
      }));
    }
  };

  const handleAddBank = () => {
    setFormData(prev => ({
      ...prev,
      companyBanks: [...prev.companyBanks, { ...initialBankInfo }]
    }));
  };

  const handleRemoveBank = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companyBanks: prev.companyBanks.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (base64Files: Base64File[]) => {
    setFileError('');

    if (base64Files.length > 1) {
      setFileError('Only one image can be uploaded');
      return;
    }

    if (base64Files.length === 0) {
      return;
    }

    // Get the base64 string without the data URL prefix
    const base64Data = base64Files[0].base64.split(',')[1];
    // Calculate file size from base64 string
    const fileSize = (base64Data.length * 3) / 4;

    // Check file size (12MB limit)
    if (fileSize > MAX_FILE_SIZE) {
      setFileError('File size must be less than 12MB');
      return;
    }

    // Check file type from the data URL prefix
    const fileType = base64Files[0].base64.split(';')[0].split(':')[1];
    if (!ACCEPTED_IMAGE_TYPES.includes(fileType)) {
      setFileError('Please upload only image files (JPEG, PNG, GIF, WEBP)');
      return;
    }

    setFormData(prev => ({
      ...prev,
      logo: base64Files[0].base64
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validate all IBANs before submit
    const hasInvalidIBAN = formData.companyBanks.some(bank => {
      if (bank.ibanNo) {
        const cleanIBAN = bank.ibanNo.replace(/\s/g, '');
        return !validateIBAN(cleanIBAN);
      }
      return false;
    });

    if (hasInvalidIBAN) {
      return;
    }

    // Format IBANs to electronic format for submission
    const formattedData = {
      ...formData,
      companyBanks: formData.companyBanks.map(bank => ({
        ...bank,
        ibanNo: bank.ibanNo ? electronicFormatIBAN(bank.ibanNo) : ''
      }))
    };

    // Validate phone number
    if (
      !formattedData.companyTelephone ||
      formattedData.companyTelephone.length < 10
    ) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    if (form.checkValidity() === false || phoneError) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const companyDataWithId = {
        ...formattedData,
        id: 'temp-' + Date.now().toString()
      };
      await postCompanyCreate(companyDataWithId);
      onSuccess();
      onHide();
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ImagePreview = () => {
    if (!formData.logo) {
      return (
        <div
          className="text-center border rounded"
          style={{
            width: '150px',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '14px',
            backgroundColor: '#f8f9fa'
          }}
        >
          No Logo
        </div>
      );
    }

    return (
      <div
        className="border rounded"
        style={{
          width: '150px',
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: '8px',
          position: 'relative'
        }}
      >
        <img
          src={formData.logo}
          alt="Company Logo Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
        <Button
          variant="link"
          className="position-absolute top-0 end-0 text-danger p-1"
          onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
          style={{ fontSize: '1.2rem' }}
        >
          ×
        </Button>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h6 className="mb-3">Company Logo</h6>
            <div className="small text-muted">
              Accepted formats: JPEG, PNG, GIF, WEBP. Maximum size: 12MB
            </div>
            <div className="d-flex gap-4 align-items-start">
              <div className="mt-6">
                <ImagePreview />
              </div>
              <div className="flex-grow-1">
                <FileUpload onFilesUpload={handleFileUpload} />
                {fileError && (
                  <Alert variant="danger" className="mt-2 py-2">
                    {fileError}
                  </Alert>
                )}
              </div>
            </div>
          </div>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter company name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company Email</Form.Label>
                <Form.Control
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid email.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company Telephone</Form.Label>
                <PhoneInput
                  country={'tr'}
                  value={formData.companyTelephone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: '100%',
                    height: '38px',
                    borderColor: phoneError ? '#dc3545' : '#ced4da'
                  }}
                  containerStyle={{
                    marginBottom: '0.5rem'
                  }}
                />
                {phoneError && (
                  <div className="text-danger" style={{ fontSize: '0.875em' }}>
                    {phoneError}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}></Col>
          </Row>

          <Row className="mb-3">
            <Col md={12} className="mt-3">
              <Form.Group>
                <Form.Label>Company Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter company address.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Bank Information</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleAddBank}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Bank
              </Button>
            </div>

            {formData.companyBanks.map((bank, index) => (
              <div
                key={index}
                className="border rounded p-3 mb-3 position-relative"
              >
                {formData.companyBanks.length > 1 && (
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-0 text-danger"
                    onClick={() => handleRemoveBank(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                )}
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Bank Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={bank.bankName}
                        onChange={e =>
                          handleBankInputChange(
                            index,
                            'bankName',
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Branch Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={bank.branchName}
                        onChange={e =>
                          handleBankInputChange(
                            index,
                            'branchName',
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Branch Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={bank.branchCode}
                        onChange={e =>
                          handleBankInputChange(
                            index,
                            'branchCode',
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Swift Code</Form.Label>
                      <Form.Control
                        type="text"
                        value={bank.swiftCode}
                        onChange={e =>
                          handleBankInputChange(
                            index,
                            'swiftCode',
                            e.target.value
                          )
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>IBAN</Form.Label>
                      <Form.Control
                        type="text"
                        value={bank.ibanNo}
                        onChange={e =>
                          handleBankInputChange(index, 'ibanNo', e.target.value)
                        }
                        isInvalid={!!bank.ibanError}
                        placeholder="TR33 0006 1005 1978 6457 8413 26"
                        required
                        style={{
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {bank.ibanError}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        value={bank.currency}
                        onChange={e =>
                          handleBankInputChange(
                            index,
                            'currency',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Select Currency</option>
                        {CURRENCY_OPTIONS.map(currency => (
                          <option key={currency} value={currency}>
                            {currency} ({getPriceCurrencySymbol(currency)})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a currency.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Company'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCompanyModal;
