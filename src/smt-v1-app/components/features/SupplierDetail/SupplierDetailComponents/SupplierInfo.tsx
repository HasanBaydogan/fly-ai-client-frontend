import { useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

interface SupplierInfoProps {
  setCompanyName: (value: string) => void;
  companyName: string;
  setBrandInput: (value: string) => void;
  brandInput: string;
}

const SupplierInfo = ({
  setCompanyName,
  companyName,
  setBrandInput,
  brandInput
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
  const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBrandInput(event.target.value);
  };

  return (
    <Col md={12}>
      <Form>
        <Form.Group className="mt-3">
          <Form.Label className="fw-bold fs-8">Supplier Information</Form.Label>
        </Form.Group>

        <Form.Group className="d-flex flex-row gap-6 mt-2">
          <Col md={6}>
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
              placeholder="Brand"
              value={brandInput}
              onChange={handleBrandChange}
            />
          </Col>
        </Form.Group>
      </Form>
    </Col>
  );
};

export default SupplierInfo;
