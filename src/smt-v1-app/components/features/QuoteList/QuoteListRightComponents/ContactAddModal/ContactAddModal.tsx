import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Contact } from '../../../../../containers/QuoteListContainer/RfqContainerTypes';
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

  const handleSubmit = () => {
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
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <PhoneInput
              country={'tr'}
              value={phone}
              onChange={phone => setPhone(phone)}
              inputStyle={{ width: '100%' }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cell Phone</Form.Label>
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
