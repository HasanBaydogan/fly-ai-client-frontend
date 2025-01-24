import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import { Dropdown } from 'react-bootstrap';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';

export interface ContactData {
  name: string;
  email: string;
  title: number;
  phone: string;
  contactname: string;
}

interface ContactListProps {
  data: ContactData[];
  onEdit?: (contact: ContactData) => void;
  onDelete?: (contact: ContactData) => void;
}

const createColumns = (
  onEdit?: (contact: ContactData) => void,
  onDelete?: (contact: ContactData) => void
): ColumnDef<ContactData>[] => [
  {
    accessorKey: 'name'
  },
  {
    accessorKey: 'email',
    cell: ({ row: { original } }) => (
      <Link to={`mailto:${original.email}`}>{original.email}</Link>
    )
  },
  {
    accessorKey: 'phone'
  },
  {
    accessorKey: 'contactname'
  },
  {
    accessorKey: 'title'
  },

  {
    id: 'action',
    cell: ({ row: { original } }) => (
      <Dropdown>
        <Dropdown.Menu></Dropdown.Menu>
      </Dropdown>
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
    selection: true,
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

// SupplierDetailContactList bileşeni örnek veri ile kullanım için
const SupplierDetailContactList = () => {
  const sampleData: ContactData[] = [
    {
      name: 'Anna',
      email: 'anna@example.com',
      phone: '+90545 321 22 41',
      contactname: 'x',
      title: 18
    },
    {
      name: 'Homer',
      email: 'homer@example.com',
      phone: '+90545 321 22 41',
      contactname: 'x',
      title: 35
    },
    {
      name: 'Oscar',
      email: 'oscar@example.com',
      phone: '+90545 321 22 41',
      contactname: 'x',
      title: 52
    },
    {
      name: 'Emily',
      email: 'emily@example.com',
      phone: '+90545 321 22 41',
      contactname: 'x',
      title: 30
    },
    {
      name: 'Jara',
      email: 'jara@example.com',
      phone: '+90545 321 22 41',
      contactname: 'x',
      title: 25
    },
    {
      name: 'Clark',
      email: 'clark@example.com',
      phone: '+90545 321 22 41',
      contactname: 'x',
      title: 39
    }
  ];

  const handleEdit = (contact: ContactData) => {
    console.log('Edit contact:', contact);
  };

  const handleDelete = (contact: ContactData) => {
    console.log('Delete contact:', contact);
  };

  return <ContactList data={sampleData} />;
};

export default SupplierDetailContactList;
