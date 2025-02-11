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
  setCurrency: (value: string) => void; // Currency güncellemesi için yeni prop
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
  // Şirket adı ve legal address için ayrı hata durumları oluşturduk.
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [legalAddressError, setLegalAddressError] = useState<string | null>(
    null
  );

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setCompanyName(value);
    setCompanyError(
      value.trim() === '' ? 'Company Name cannot be empty.' : null
    );
  };

  const handleCompanyBlur = () => {
    if (companyName.trim() === '') {
      setCompanyError('Company Name cannot be empty.');
    }
  };

  const handleSubCompany = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubCompany(event.target.value);
  };

  const handleLegalAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setLegalAddress(value);
    setLegalAddressError(
      value.trim() === '' ? 'Legal Address cannot be empty.' : null
    );
  };

  const handleLegalAddressBlur = () => {
    if (legalAddress.trim() === '') {
      setLegalAddressError('Legal Address cannot be empty.');
    }
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
              onBlur={handleCompanyBlur}
              isInvalid={!!companyError}
            />
            <Form.Control.Feedback type="invalid">
              {companyError}
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
                onChange={handleLegalAddressChange}
                onBlur={handleLegalAddressBlur}
                isInvalid={!!legalAddressError}
              />
              <Form.Control.Feedback type="invalid">
                {legalAddressError}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Form.Group>
      </Form>
    </Col>
  );
};

export default ClientInfo;
