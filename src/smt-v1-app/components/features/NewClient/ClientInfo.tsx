import { useState } from 'react';
import { Col, FloatingLabel, Form } from 'react-bootstrap';

interface SupplierInfoProps {
  setCompanyName: (value: string) => void;
  companyName: string;
  setSubCompany: (value: string) => void;
  subCompany: string;
  setLegalAddress: (value: string) => void;
  legalAddress: string;
  currency: string;
  setCurrency: (value: string) => void; // New prop for updating currency
  currencies: string[];
}

const ClientInfo = ({
  setCompanyName,
  companyName,
  setSubCompany,
  subCompany,
  setLegalAddress,
  legalAddress,
  currency,
  setCurrency,
  currencies
}: SupplierInfoProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCompanyName(value);
    setError(value.trim() === '' ? 'Company Name cannot be empty.' : null);
  };

  const handleBlur = () => {
    if (companyName.trim() === '') {
      setError('Company Name cannot be empty.');
    }
  };

  const handleSubCompany = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubCompany(event.target.value);
  };

  const handleLegalAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLegalAddress(event.target.value);
  };

  return (
    <Col md={12}>
      <Form>
        <Form.Group className="mt-3">
          <Form.Label className="fw-bold fs-8">Client</Form.Label>
        </Form.Group>

        <Form.Group className="d-flex flex-row gap-6 my-3">
          <Col md={5}>
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
          </Col>
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="SubCompany"
              value={subCompany}
              onChange={handleSubCompany}
            />
          </Col>
          {/* Currency Selector */}
          <Col md={1}>
            <Form.Select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
        <Form.Group>
          <Col md={12}>
            <FloatingLabel controlId="floatingTextarea2" label="Legal Address">
              <Form.Control
                as="textarea"
                placeholder="Address"
                style={{ height: '100px' }}
                value={legalAddress}
                onChange={handleLegalAddress}
              />
            </FloatingLabel>
          </Col>
        </Form.Group>
      </Form>
    </Col>
  );
};

export default ClientInfo;
