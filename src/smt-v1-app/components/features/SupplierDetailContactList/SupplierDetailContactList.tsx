import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { Dropdown, Modal } from 'react-bootstrap';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import ActionDropdownItems from 'components/common/ActionDropdownItems';
import AdvanceTableFooter from 'components/base/AdvanceTableFooter';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { useState } from 'react';
import ContactFormModal from './ContactFormModal/ContactFormModal';
import { Button } from 'react-bootstrap';
import './SupplierContactList.css';

export interface ContactData {
  id: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  cellphone: string;
}

interface ContactListProps {
  data: ContactData[];
  onEdit?: (contact: ContactData) => void;
  onDelete?: (contact: ContactData) => void;
}

const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';

  // Türkiye formatı için düzenleme
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('90')) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
      8
    )}`;
  }
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
};

const createColumns = (
  onEdit?: (contact: ContactData) => void,
  onDelete?: (contact: ContactData) => void
): ColumnDef<ContactData>[] => [
  {
    accessorKey: 'name',
    header: 'Name'
  },
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
    accessorKey: 'title'
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <RevealDropdownTrigger>
        <RevealDropdown>
          <Dropdown.Item onClick={() => onEdit?.(original)}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => onDelete?.(original)}>
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

export const ContactList = ({ data, onEdit, onDelete }: ContactListProps) => {
  const columns = createColumns(onEdit, onDelete);

  const table = useAdvanceTable({
    data,
    columns,
    selection: false,
    sortable: true
  });

  return (
    <AdvanceTableProvider {...table}>
      <AdvanceTable
        tableProps={{
          size: 'sm',
          className: 'phoenix-table fs-9 mb-0 border-top border-translucent'
        }}
        rowClassName="hover-actions-trigger btn-reveal-trigger position-static"
      />
    </AdvanceTableProvider>
  );
};

const SupplierDetailContactList = () => {
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<
    ContactData | undefined
  >();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<ContactData | null>(
    null
  );

  const handleAddContact = (contact: ContactData) => {
    if (editingContact) {
      setContacts(contacts.map(c => (c.id === contact.id ? contact : c)));
    } else {
      setContacts([...contacts, contact]);
    }
  };

  const handleEdit = (contact: ContactData) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleDeleteClick = (contact: ContactData) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(c => c.id !== contactToDelete.id));
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const columns: ColumnDef<ContactData>[] = [
    ...(selectedContacts.length > 0
      ? [
          {
            id: 'select',
            header: ({ table }) => (
              <input
                type="checkbox"
                checked={selectedContacts.length === contacts.length}
                onChange={handleSelectAll}
              />
            ),
            cell: ({ row }) => (
              <input
                type="checkbox"
                checked={selectedContacts.includes(row.original.id)}
                onChange={e => {
                  const id = row.original.id;
                  if (e.target.checked) {
                    setSelectedContacts(prev => [...prev, id]);
                  } else {
                    setSelectedContacts(prev =>
                      prev.filter(contactId => contactId !== id)
                    );
                  }
                }}
              />
            ),
            meta: {
              headerProps: { style: { width: '40px' } }
            }
          }
        ]
      : []),
    {
      accessorKey: 'name',
      header: 'Full Name'
    },
    {
      accessorKey: 'title'
    },
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
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          onClick={() => {
            setEditingContact(undefined);
            setShowModal(true);
          }}
        >
          New Contact
        </Button>
      </div>

      <AdvanceTableProvider {...table}>
        <AdvanceTable
          tableProps={{
            size: 'sm',
            className: 'phoenix-table fs-9 mb-0 border-top border-translucent'
          }}
          rowClassName="hover-actions-trigger btn-reveal-trigger position-static"
        />
      </AdvanceTableProvider>

      <ContactFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingContact(undefined);
        }}
        onSubmit={handleAddContact}
        editContact={editingContact}
      />

      {/* Delete Confirmation Modal */}
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
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupplierDetailContactList;
