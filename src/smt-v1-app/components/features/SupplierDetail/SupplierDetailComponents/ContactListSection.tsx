import { useState, useEffect } from 'react';
import { Col, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import ContactFormModal from '../ContactFormModal/ContactFormModal';

// 📌 Contact Veri Tipi (bileşenin dahili kullanımında)
export interface ContactData {
  id: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  cellphone: string;
}

// 📌 Parent’a gönderilecek format (SupplierEditContainer gibi)
export interface FormattedContactData {
  id: string;
  fullName: string;
  email: string;
  title: string;
  phone: string;
  cellPhone: string;
}

// → Props tanımı: Artık initialContacts opsiyonel olarak ekleniyor.
interface ContactListSectionProps {
  onContactsChange: (contacts: FormattedContactData[]) => void;
  initialContacts?: FormattedContactData[];
}

// 📌 Telefon numarasını formatlayan yardımcı fonksiyon
const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('90')) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
      8
    )}`;
  }
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

// 📌 ContactListSection Bileşeni
const ContactListSection = ({
  onContactsChange,
  initialContacts
}: ContactListSectionProps) => {
  // initialContacts varsa ContactData formatına dönüştürülüp state'e aktarılıyor
  const [contacts, setContacts] = useState<ContactData[]>(() => {
    if (initialContacts && initialContacts.length > 0) {
      return initialContacts.map(contact => ({
        id: contact.id,
        name: contact.fullName,
        email: contact.email,
        title: contact.title,
        phone: contact.phone,
        cellphone: contact.cellPhone
      }));
    }
    return [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<
    ContactData | undefined
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<ContactData | null>(
    null
  );

  // Contact'ları istenen formata dönüştürüp parent'e gönder
  useEffect(() => {
    const formattedContacts = contacts.map(contact => ({
      id: contact.id,
      fullName: contact.name,
      email: contact.email,
      title: contact.title,
      phone: contact.phone,
      cellPhone: contact.cellphone
    }));
    onContactsChange(formattedContacts);
  }, [contacts, onContactsChange]);

  // → Yeni kişi ekleme veya düzenleme işlemi
  const handleAddContact = (contact: ContactData) => {
    setContacts(prevContacts => {
      if (editingContact) {
        return prevContacts.map(c => (c.id === contact.id ? contact : c));
      } else {
        return [...prevContacts, contact];
      }
    });
    setEditingContact(undefined);
    setShowModal(false);
  };

  // → Kişi düzenleme
  const handleEdit = (contact: ContactData) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  // → Kişi silme butonuna tıklanınca
  const handleDeleteClick = (contact: ContactData) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  // → Kişinin silinmesini onaylayın
  const confirmDelete = () => {
    setContacts(prevContacts =>
      prevContacts.filter(c => c.id !== contactToDelete?.id)
    );
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  // → Tablo için kolonlar
  const columns: ColumnDef<ContactData>[] = [
    { accessorKey: 'name', header: 'Full Name' },
    { accessorKey: 'title', header: 'Title' },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }) => (
        <Link to={`mailto:${original.email}`}>{original.email}</Link>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => formatPhoneNumber(row.original.phone)
    },
    {
      accessorKey: 'cellphone',
      header: 'Cell Phone',
      cell: ({ row }) => formatPhoneNumber(row.original.cellphone)
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row: { original } }) => (
        <RevealDropdownTrigger>
          <RevealDropdown>
            <Dropdown.Item onClick={() => handleEdit(original)}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDeleteClick(original)}>
              Delete
            </Dropdown.Item>
          </RevealDropdown>
        </RevealDropdownTrigger>
      ),
      meta: {
        headerProps: { style: { width: '7%' } },
        cellProps: { className: 'text-end' }
      }
    }
  ];

  const table = useAdvanceTable({
    data: contacts,
    columns,
    selection: false,
    sortable: true
  });

  return (
    <Form>
      <Col md={12}>
        <Form.Group className="mt-5 mx-5">
          <Form.Label className="fw-bold fs-7">Contact List</Form.Label>
        </Form.Group>

        {/* Yeni kişi ekleme butonu */}
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            New Contact
          </Button>
        </div>

        {/* Tablo */}
        <AdvanceTableProvider {...table}>
          <AdvanceTable
            tableProps={{
              size: 'sm',
              className: 'phoenix-table fs-9 mb-0 border-top border-translucent'
            }}
            rowClassName="hover-actions-trigger btn-reveal-trigger position-static"
          />
        </AdvanceTableProvider>

        {/* Kişi ekleme/düzenleme Modal */}
        <ContactFormModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setEditingContact(undefined);
          }}
          onSubmit={handleAddContact}
          editContact={editingContact}
        />

        {/* Silme Onay Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete contact{' '}
            <strong>{contactToDelete?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Form>
  );
};

export default ContactListSection;
