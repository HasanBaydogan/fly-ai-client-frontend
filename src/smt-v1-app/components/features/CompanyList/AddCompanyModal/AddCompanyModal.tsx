import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import FileUpload from 'smt-v1-app/components/features/GlobalComponents/FileUpload';
import {
  postCompanyCreate,
  postCompanyUpdate,
  xxx
} from 'smt-v1-app/services/CompanyServices';
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
import { CompanyData, BankInfo, CargoOption } from '../List/CompanyListTable';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

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

interface CompanyFormData extends Partial<CompanyData> {
  logo: string;
  companyName: string;
  companyAddress: string;
  cargoAddress: string; // Optional field for cargo address
  companyEmail: string;
  companyTelephone: string;
  companyBanks: BankInfo[];
  cargoOptions: CargoOption[];
}

interface AddCompanyModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  isEditMode?: boolean;
  initialData?: CompanyData;
}

const initialBankInfo: BankInfo = {
  bankName: '',
  branchName: '',
  branchCode: '',
  swiftCode: '',
  ibanNo: '',
  currency: 'USD'
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
  onSuccess,
  isEditMode = false,
  initialData
}) => {
  const { validateIban, formatIban } = useIbanValidator();
  const [formData, setFormData] = useState<CompanyFormData>({
    logo: '',
    companyName: '',
    companyAddress: '',
    cargoAddress: '',
    companyEmail: '',
    companyTelephone: '',
    companyBanks: [{ ...initialBankInfo }],
    cargoOptions: []
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [phoneError, setPhoneError] = useState<string>('');
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string>('');

  const formRef = useRef<HTMLFormElement>(null);

  // Initialize form data with initialData when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        companyId: initialData.companyId,
        logo: initialData.logo,
        companyName: initialData.companyName,
        companyAddress: initialData.companyAddress,
        cargoAddress: initialData.cargoAddress || '',
        companyEmail: initialData.companyEmail,
        companyTelephone: initialData.companyTelephone,
        companyBanks: initialData.companyBanks.map(bank => ({
          ...bank,
          ibanError: undefined
        })),
        cargoOptions: initialData.cargoOptions || []
      });
    }
  }, [isEditMode, initialData]);

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

  const handleAddCargoOption = () => {
    const newCargoOption: CargoOption = {
      id: `${Date.now()}`,
      name: '',
      active: true
    };
    setFormData(prev => ({
      ...prev,
      cargoOptions: [...prev.cargoOptions, newCargoOption]
    }));
  };

  const handleRemoveCargoOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cargoOptions: prev.cargoOptions.filter((_, i) => i !== index)
    }));
  };

  const handleCargoOptionChange = (
    index: number,
    field: keyof CargoOption,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      cargoOptions: prev.cargoOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | Event) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form) {
      console.error('Form reference not found');
      setIsSubmitting(false);
      return;
    }

    // Validate all IBANs before submit
    const hasInvalidIBAN = formData.companyBanks.some(bank => {
      if (bank.ibanNo) {
        const cleanIBAN = bank.ibanNo.replace(/\s/g, '');
        return !validateIban(cleanIBAN);
      }
      return false;
    });

    if (hasInvalidIBAN) {
      setIsSubmitting(false);
      return;
    }

    // Validate phone number
    if (!formData.companyTelephone || formData.companyTelephone.length < 10) {
      setPhoneError('Please enter a valid phone number');
      setIsSubmitting(false);
      return;
    }

    if (form.checkValidity() === false || phoneError) {
      e.stopPropagation();
      setValidated(true);
      setIsSubmitting(false);
      return;
    }

    // If validation is not done yet, just validate
    if (!validated) {
      setValidated(true);
      setIsSubmitting(false);
      return;
    }

    // If we're already validated and submitting, proceed with the actual submission
    try {
      // Format IBANs to electronic format for submission
      const formattedBanks = formData.companyBanks.map(bank => ({
        bankName: bank.bankName,
        branchName: bank.branchName,
        branchCode: bank.branchCode,
        swiftCode: bank.swiftCode,
        ibanNo: bank.ibanNo ? electronicFormatIBAN(bank.ibanNo) : '',
        currency: bank.currency
      }));

      const formattedData = {
        ...formData,
        companyBanks: formattedBanks
      };

      if (isEditMode) {
        if (!formData.companyId) {
          throw new Error('Company ID is required for update');
        }
        const updateData = {
          ...formattedData,
          id: formData.companyId,
          active: initialData?.active ?? false // Preserve the current active status during update
        };
        await postCompanyUpdate(updateData as xxx);
      } else {
        const companyDataWithId = {
          ...formattedData,
          id: 'temp-' + Date.now().toString(),
          active: true // Always set active to true for new companies
        };
        await postCompanyCreate(companyDataWithId);
      }
      onSuccess();
      onHide();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} company:`,
        error
      );
      setValidated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      setFormData({
        logo: '',
        companyName: '',
        companyAddress: '',
        cargoAddress: '',
        companyEmail: '',
        companyTelephone: '',
        companyBanks: [{ ...initialBankInfo }],
        cargoOptions: []
      });
      setValidated(false);
      setPhoneError('');
      setFileError('');
      setIsSubmitting(false); // Also reset submitting state when modal closes
    }
  }, [show]);

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
    <Modal
      show={show}
      onHide={() => {
        setIsSubmitting(false);
        onHide();
      }}
      size="lg"
    >
      <Form
        ref={formRef}
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <Modal.Header
          closeButton={!isSubmitting} // Disable close button during submission
        >
          <Modal.Title>
            {isEditMode ? 'Edit Company' : 'Add New Company'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isSubmitting && (
            <div
              className="position-absolute w-100 h-100 top-0 start-0 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
              style={{ zIndex: 1 }}
            >
              <LoadingAnimation />
            </div>
          )}
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
          <Row className="mb-3">
            <Col md={12} className="mt-0">
              <Form.Group>
                <Form.Label>Cargo Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="cargoAddress"
                  value={formData.cargoAddress}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter cargo address.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Cargo Options</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleAddCargoOption}
                className="d-flex align-items-center"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Cargo Option
              </Button>
            </div>

            {formData.cargoOptions.map((option, index) => (
              <div
                key={index}
                className="border rounded p-3 mb-3 position-relative"
              >
                <Button
                  variant="link"
                  className="position-absolute end-0 top-0 text-danger"
                  onClick={() => handleRemoveCargoOption(index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Row className="g-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Cargo Option Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={option.name}
                        onChange={e =>
                          handleCargoOptionChange(index, 'name', e.target.value)
                        }
                        placeholder="Enter cargo option name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <div className="d-flex align-items-center">
                        <Button
                          variant={option.active ? 'success' : 'danger'}
                          size="sm"
                          onClick={() =>
                            handleCargoOptionChange(
                              index,
                              'active',
                              !option.active
                            )
                          }
                          style={{
                            width: '48px',
                            height: '24px',
                            borderRadius: '12px',
                            border: 'none',
                            position: 'relative',
                            transition: 'background-color 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0'
                          }}
                        >
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              position: 'absolute',
                              left: option.active ? 'calc(100% - 21px)' : '3px',
                              transition: 'left 0.3s ease'
                            }}
                          />
                        </Button>
                        <span className="ms-2">
                          {option.active ? 'Active' : 'Passive'}
                        </span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}
          </div>

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
          {validated && !isSubmitting ? (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  setValidated(false);
                  setPhoneError('');
                }}
              >
                Discard
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setIsSubmitting(true);
                  handleSubmit(new Event('submit'));
                }}
              >
                Confirm
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsSubmitting(false);
                  onHide();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isEditMode ? 'Update Company' : 'Create Company'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCompanyModal;
