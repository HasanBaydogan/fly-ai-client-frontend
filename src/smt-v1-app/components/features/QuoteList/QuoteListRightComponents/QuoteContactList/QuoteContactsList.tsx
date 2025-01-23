import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import CustomButton from '../../../../../../components/base/Button';
import { Contact } from '../../mockData';
import ContactAddModal from '../ContactAddModal/ContactAddModal';

interface QuoteContactsListProps {
  contacts: Contact[];
  handleAddContact: (contact: Contact) => void;
  handleDeleteContact: (contactId: string) => void;
}

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
      // You might want to add proper validation/error handling here
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(), // Simple ID generation for demo
      fullName: fullName.trim(),
      email: email.trim(),
      title: title.trim(),
      phone: phone.trim(),
      cellPhone: cellPhone.trim()
    };

    handleAddContact(newContact);

    // Reset form
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
        />
      </div>

      <div className="mx-2" style={{ height: '250px', overflowY: 'auto' }}>
        <Table responsive style={{ marginBottom: '0' }}>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1
            }}
          >
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Title</th>
              <th>Phone</th>
              <th>Cell Phone</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleSelectContact(contact.id)}
                  />
                </td>
                <td>{contact.fullName}</td>
                <td>{contact.email}</td>
                <td>{contact.title}</td>
                <td>{contact.phone}</td>
                <td>{contact.cellPhone}</td>
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
