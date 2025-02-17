import { useEffect, useState } from 'react';
import { Col, FloatingLabel, Row, Form } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';

interface AddressDetailsProps {
  onStatusChange: (value: string) => void;
  setClientDetail: (value: string) => void;
  clientDetail: string;
  defaultStatus?: string;
  setClientMail: (value: string) => void;
  clientMail: string;
  setClientWebsite: (value: string) => void;
  clientWebsite: string;
  phone: string; // Yeni prop: phone
  setPhone: (value: string) => void; // Yeni prop: setPhone
}

const ClientMidPart = ({
  onStatusChange,
  setClientDetail,
  clientDetail,
  defaultStatus,
  setClientMail,
  clientMail,
  setClientWebsite,
  clientWebsite,
  phone,
  setPhone
}: AddressDetailsProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  // Tek bir hata nesnesi kullanıyoruz; örneğin, email veya phone için.
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (defaultStatus) {
      setSelectedStatus(defaultStatus);
    }
  }, [defaultStatus]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onStatusChange(value);
  };

  const handleClientDetail = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClientDetail(e.target.value);
  };

  const handleClientMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientMail(value);
    // Eğer değer boş değilse email hatasını temizleyelim.
    if (value.trim() !== '') {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // İsim çakışmasını önlemek için fonksiyon adını validateClientMail olarak değiştirdik.
  const validateClientMail = () => {
    const newErrors: { [key: string]: string } = {};

    if (!clientMail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(clientMail.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleClientWebsiteChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setClientWebsite(e.target.value);
  };

  return (
    <Col md={12}>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone*</Form.Label>
            <PhoneInput
              country={'tr'}
              value={phone} // Parent'tan gelen state kullanılıyor
              onChange={value => setPhone(value)} // Parent fonksiyonu ile güncelleniyor
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
          <Form.Label>Mail</Form.Label>
          <Form.Control
            placeholder="Mail*"
            value={clientMail}
            onChange={handleClientMailChange}
            onBlur={validateClientMail}
            type="email"
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Col>
        <Col md={6}>
          <Form.Label>Website</Form.Label>
          <Form.Control
            type="text"
            placeholder="Client Website"
            value={clientWebsite}
            onChange={handleClientWebsiteChange}
          />
        </Col>
      </Row>
      <FloatingLabel
        controlId="floatingTextarea2"
        label="Details"
        className="mt-4"
      >
        <Form.Control
          as="textarea"
          placeholder="Details"
          style={{ height: '100px' }}
          value={clientDetail}
          onChange={handleClientDetail}
        />
      </FloatingLabel>
    </Col>
  );
};

export default ClientMidPart;
