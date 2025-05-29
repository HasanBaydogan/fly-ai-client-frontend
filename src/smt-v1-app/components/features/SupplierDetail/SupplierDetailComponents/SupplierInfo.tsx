import { useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

interface SupplierInfoProps {
  setCompanyName: (value: string) => void;
  companyName: string;
  setTelephoneInput: (value: string) => void;
  telephoneInput: string;
  setMailInput: (value: string) => void;
  mailInput: string;
}

const SupplierInfo = ({
  setCompanyName,
  companyName,
  setTelephoneInput,
  telephoneInput,
  setMailInput,
  mailInput
}: SupplierInfoProps) => {
  const [error, setError] = useState<string | null>(null); // Hata mesajı

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCompanyName(value);

    if (value.trim() === '') {
      setError('Company Name cannot be empty.');
    } else {
      setError(null);
    }
  };

  const handleBlur = () => {
    if (companyName.trim() === '') {
      setError('Company Name cannot be empty.');
    }
  };
  const handleTelephoneChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTelephoneInput(event.target.value);
  };
  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMailInput(event.target.value);
  };

  return (
    <div>
      <Form>
        <Form.Group className="mt-3">
          <Form.Label className="fw-bold fs-8">Supplier Information</Form.Label>
        </Form.Group>

        <div className="d-flex gap-4 mt-2">
          <Form.Group className="flex-grow-1">
            <Form.Control
              type="text"
              placeholder="Company Name*"
              value={companyName}
              onChange={handleCompanyNameChange}
              onBlur={handleBlur}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex gap-4 flex-grow-1">
            <Form.Group className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder="Mail"
                value={mailInput}
                onChange={handleMailChange}
              />
            </Form.Group>
            <Form.Group className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder="Telephone"
                value={telephoneInput}
                onChange={handleTelephoneChange}
              />
            </Form.Group>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default SupplierInfo;
