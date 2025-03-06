import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import CustomButton from '../../../../../../components/base/Button';
import ContactAddModal from '../ContactAddModal/ContactAddModal';
import 'react-phone-input-2/lib/style.css';
import { Contact } from 'smt-v1-app/containers/QuoteContainer/QuoteContainerTypes';

interface QuoteContactsListProps {
  contacts: Contact[];
  handleAddContact: (contact: Contact) => void;
  handleDeleteContact: (contactId: string) => void;
}

const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length < 10) return phoneNumber;

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }

  return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(
    -10,
    -7
  )}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
};

const QuoteContactsList: React.FC<QuoteContactsListProps> = ({
  contacts,
  handleAddContact,
  handleDeleteContact
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleNewContactAddition = () => {
    if (!fullName || !email) {
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      title: title.trim(),
      phone: phone.trim(),
      cellPhone: cellPhone.trim()
    };

    handleAddContact(newContact);
    setFullName('');
    setEmail('');
    setTitle('');
    setPhone('');
    setCellPhone('');
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
      setSelectAll(true);
    } else {
      setSelectedContacts([]);
      setSelectAll(false);
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev => {
      const newSelection = prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId];

      setSelectAll(newSelection.length === contacts.length);
      return newSelection;
    });
  };

  return (
    <div>
      <h3 className="mt-3">Contacts</h3>
      <hr className="custom-line m-0" />

      <div
        className="d-flex justify-content-end"
        style={{ padding: '10px', paddingRight: '0px' }}
      >
        <CustomButton
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} className="ms-0" />}
          onClick={() => setShowAddModal(true)}
        >
          New Contact
        </CustomButton>
      </div>

      <div
        className="mx-2"
        style={{ height: '250px', overflowY: 'auto', overflowX: 'auto' }}
      >
        <Table responsive style={{ marginBottom: '0', tableLayout: 'fixed' }}>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1
            }}
          >
            <tr>
              <th style={{ width: '50px' }}>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th
                style={{
                  width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Full Name
              </th>
              <th
                style={{
                  width: '200px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Email
              </th>
              <th
                style={{
                  width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Title
              </th>
              <th
                style={{
                  width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Phone
              </th>
              <th
                style={{
                  width: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Cell Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td style={{ width: '50px' }}>
                  <Form.Check
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                  />
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {contact.fullName}
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {contact.email}
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {contact.title}
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formatPhoneNumber(contact.phone)}
                </td>
                <td
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formatPhoneNumber(contact.cellPhone)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ContactAddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAddContact}
      />
    </div>
  );
};

export default QuoteContactsList;
