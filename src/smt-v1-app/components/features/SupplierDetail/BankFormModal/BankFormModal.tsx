import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPriceCurrencySymbol } from 'smt-v1-app/types/GlobalTypes';
import {
  validateIBAN,
  electronicFormatIBAN,
  friendlyFormatIBAN
} from 'ibantools';
import { useIbanValidator } from '../../GlobalComponents/IbanValidator';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

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

interface BankInfo {
  bankName: string;
  branchName: string;
  branchCode: string;
  swiftCode: string;
  ibanNo: string;
  currency: string;
  ibanError?: string;
}

interface BankFormModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (banks: BankInfo[]) => void;
  initialBanks?: BankInfo[];
}

const initialBankInfo: BankInfo = {
  bankName: '',
  branchName: '',
  branchCode: '',
  swiftCode: '',
  ibanNo: '',
  currency: 'USD'
};

const BankFormModal: React.FC<BankFormModalProps> = ({
  show,
  onHide,
  onSubmit,
  initialBanks = []
}) => {
  const { validateIban, formatIban } = useIbanValidator();
  const [banks, setBanks] = useState<BankInfo[]>([{ ...initialBankInfo }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize banks with initial data
  useEffect(() => {
    if (initialBanks && initialBanks.length > 0) {
      setBanks(
        initialBanks.map(bank => ({
          ...bank,
          ibanError: undefined
        }))
      );
    } else {
      setBanks([{ ...initialBankInfo }]);
    }
  }, [initialBanks, show]);

  const handleBankInputChange = (
    index: number,
    field: keyof BankInfo,
    value: string
  ) => {
    if (field === 'ibanNo') {
      const { isValid, error, formattedIban } = validateIban(value);

      setBanks(prev =>
        prev.map((bank, i) =>
          i === index
            ? {
                ...bank,
                ibanNo: formattedIban || value,
                ibanError: error
              }
            : bank
        )
      );
    } else {
      setBanks(prev =>
        prev.map((bank, i) =>
          i === index ? { ...bank, [field]: value } : bank
        )
      );
    }
  };

  const handleAddBank = () => {
    setBanks(prev => [...prev, { ...initialBankInfo }]);
  };

  const handleRemoveBank = (index: number) => {
    setBanks(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    // Check if all required fields are filled
    const hasEmptyFields = banks.some(
      bank =>
        !bank.bankName.trim() ||
        !bank.branchName.trim() ||
        !bank.branchCode.trim() ||
        !bank.swiftCode.trim() ||
        !bank.ibanNo.trim() ||
        !bank.currency
    );

    if (hasEmptyFields) {
      return false;
    }

    // Validate all IBANs
    const hasInvalidIBAN = banks.some(bank => {
      if (bank.ibanNo) {
        const cleanIBAN = bank.ibanNo.replace(/\s/g, '');
        return !validateIban(cleanIBAN);
      }
      return false;
    });

    return !hasInvalidIBAN;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format IBANs to electronic format for submission
      const formattedBanks = banks.map(bank => ({
        bankName: bank.bankName,
        branchName: bank.branchName,
        branchCode: bank.branchCode,
        swiftCode: bank.swiftCode,
        ibanNo: bank.ibanNo ? electronicFormatIBAN(bank.ibanNo) : '',
        currency: bank.currency
      }));

      onSubmit(formattedBanks);
      onHide();
    } catch (error) {
      console.error('Error submitting banks:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      setBanks([{ ...initialBankInfo }]);
      setIsSubmitting(false);
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setIsSubmitting(false);
        onHide();
      }}
      size="lg"
    >
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title>Bank Information</Modal.Title>
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

          {banks.map((bank, index) => (
            <div
              key={index}
              className="border rounded p-3 mb-3 position-relative"
            >
              {banks.length > 1 && (
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
                        handleBankInputChange(index, 'bankName', e.target.value)
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
                        handleBankInputChange(index, 'currency', e.target.value)
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
                  </Form.Group>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
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
        <Button
          variant="success"
          onClick={handleSubmit}
          disabled={isSubmitting || !validateForm()}
        >
          {isSubmitting ? 'Saving...' : 'Save Banks'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BankFormModal;
