import { useState } from 'react';
import { Col, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

interface SupplierInfoProps {
  setCompanyName: (value: string) => void;
  companyName: string;
  setSubCompany: (value: string) => void;
  subCompany: string;
  setLegalAddress: (value: string) => void;
  legalAddress: string;
  currency: string;
  currencies: string[];
}

const ClientInfo = ({
  setCompanyName,
  companyName,
  setSubCompany,
  subCompany,
  setLegalAddress,
  legalAddress,
  currencies,
  currency
}: SupplierInfoProps) => {
  const [error, setError] = useState<string | null>(null); // Hata mesajı
  const [reqQTY, setReqQTY] = useState(1);
  const [currencyLocal, setCurrencyLocal] = useState(currency);

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
          <Form.Label className="fw-bold fs-8">Client </Form.Label>
        </Form.Group>

        <Form.Group className="d-flex flex-row gap-6 mt-2">
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
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="SubCompany"
              value={subCompany}
              onChange={handleSubCompany}
            />
          </Col>
          <Form.Group className="d-flex align-items-center gap-3 mb-5">
            {/* Para Birimi Seçici */}
            <Col md={3}>
              <Form.Select
                value={currencyLocal}
                onChange={e => setCurrencyLocal(e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </Form.Group>
        <Form.Group className="mt-3">
          <Col md={12}>
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Pick Up Address"
            >
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
