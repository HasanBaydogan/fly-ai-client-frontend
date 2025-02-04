import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Contact } from '../../../../../containers/QuoteContainer/QuoteContainerTypes';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface ContactAddModalProps {
  show: boolean;
  onHide: () => void;
  onAdd: (contact: Contact) => void;
}

const ContactAddModal: React.FC<ContactAddModalProps> = ({
  show,
  onHide,
  onAdd
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!phone.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      title: title.trim(),
      phone: phone.trim(),
      cellPhone: cellPhone.trim()
    };

    onAdd(newContact);
    onHide();
    // Reset form
    setFullName('');
    setEmail('');
    setTitle('');
    setPhone('');
    setCellPhone('');
    setErrors({});
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name*</Form.Label>
            <Form.Control
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              isInvalid={!!errors.fullName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email*</Form.Label>
            <Form.Control
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title*</Form.Label>
            <Form.Control
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Cell Phone (Optional)</Form.Label>
            <PhoneInput
              country={'tr'}
              value={cellPhone}
              onChange={phone => setCellPhone(phone)}
              inputStyle={{ width: '100%' }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Close
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Add Contact
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactAddModal;
