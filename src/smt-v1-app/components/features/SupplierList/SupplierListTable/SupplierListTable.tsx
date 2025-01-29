import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import AdvanceTableFooter from 'components/base/AdvanceTableFooter';
import Badge from 'components/base/Badge';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { searchBySupplierList, SupplierData } from './SearchBySupplierListMock';
import ActionDropdownItems from './ActionDropdownItems/ActionDropdownItems';

export const projectListTableColumns: ColumnDef<SupplierData>[] = [
  {
    id: 'supplierCompany',
    accessorKey: 'supplierCompany',
    header: 'Supplier Company',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '25%' } }
    }
  },
  {
    header: 'Segments',
    accessorKey: 'segments',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'brand',
    header: 'Brand',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Country Info',
    accessorKey: 'countryInfo',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'pickupaddress',
    header: 'Pick Up Address',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'email',
    header: 'E-Mails',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '15%' }, className: 'ps-3' }
    }
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: ({ status }) => status.label,
    cell: ({ row: { original } }) => {
      const { status } = original;
      return (
        <Badge variant="phoenix" bg={status.type}>
          {status.label}
        </Badge>
      );
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-8' }
    }
  },
  {
    id: 'action',
    cell: ({ row: { original } }) => (
      <RevealDropdownTrigger>
        <RevealDropdown>
          <ActionDropdownItems supplierId={original.id.toString()} />
        </RevealDropdown>
      </RevealDropdownTrigger>
    ),
    meta: {
      headerProps: { style: { width: '10%' }, className: 'text-end' },
      cellProps: { className: 'text-end' }
    }
  }
];

interface CustomTableProps {
  className?: string;
  data: SupplierData[];
  columns: ColumnDef<SupplierData>[];
}

const SupplierListTable = () => {
  const [data, setData] = useState<SupplierData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchData = useMemo(
    () => async (term: string) => {
      setLoading(true);
      try {
        const response = await searchBySupplierList(term);
        if (response && response.data) {
          console.log('Setting Data:', response.data); // Debug için ekleyin
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(searchTerm);
  }, [fetchData, searchTerm]);

  return (
    <div className="border-bottom border-translucent">
      <div className="mb-3"></div>
      <AdvanceTable
        tableProps={
          {
            className: 'phoenix-table border-top border-translucent fs-9',
            data,
            columns: projectListTableColumns
          } as CustomTableProps
        }
      />
      <AdvanceTableFooter pagination className="py-1" />
    </div>
  );
};

export default SupplierListTable;
