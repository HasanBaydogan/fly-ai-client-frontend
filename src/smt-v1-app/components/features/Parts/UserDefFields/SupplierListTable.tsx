import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import Badge from 'components/base/Badge';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { Col, Row, Dropdown } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import ActionDropdownItems from './ActionDropdownItems/ActionDropdownItems';
import {
  SupplierData,
  searchBySupplierList
} from 'smt-v1-app/services/SupplierServices';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';

/* ***********************
   TABLO KOLON TANIMLAMALARI
   *********************** */
export const projectListTableColumns: ColumnDef<SupplierData>[] = [
  {
    id: 'fieldName',
    accessorKey: 'fieldName',
    header: 'Field Name',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' } }
    }
  },
  {
    header: 'Field Default Value',
    accessorKey: 'fieldDefaultValue',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '25%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Updated By',
    accessorKey: 'updatedBy',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    id: 'action',
    cell: ({ row: { original } }) => (
      <RevealDropdownTrigger>
        <RevealDropdown>
          <ActionDropdownItems
            supplierId={original.id ? original.id.toString() : ''}
            supplierData={original}
          />
        </RevealDropdown>
      </RevealDropdownTrigger>
    ),
    meta: {
      headerProps: { style: { width: '10%' }, className: 'text-end' },
      cellProps: { className: 'text-end' }
    }
  }
];

/* ***********************
   YARDIMCI FONKSİYONLAR
   *********************** */
const handleNullValue = (value: string) => {
  return value === 'null null' ? '' : value;
};

type SearchColumn = {
  label: string;
  value: keyof SupplierData | 'all';
};

/* ***********************
   ANA BİLEŞEN: SupplierList
   (Hem arama/filtreleme hem de tablo görüntüleme)
   *********************** */
interface SupplierListProps {
  activeView: string;
}

const SupplierList: FC<SupplierListProps> = ({ activeView }) => {
  const [data, setData] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [pageSize, setPageSize] = useState<number>(5); // Page size state,

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<SupplierData>();

  const fetchData = async (
    term: string,
    currentPage: number,
    column: SearchColumn
  ) => {
    setLoading(true);
    try {
      let query = '';
      if (term) {
        query =
          column.value !== 'all' ? `${column.value}=${term}` : `search=${term}`;
      }
      const response = await searchBySupplierList(
        query,
        currentPage + 1,
        pageSize
      );
      const suppliers = response?.data?.suppliers || [];
      if (Array.isArray(suppliers)) {
        const mappedData: SupplierData[] = suppliers.map((item: any) => ({
          id: item.id,
          companyName: item.supplierCompany,
          segments: Array.isArray(item.segments)
            ? item.segments.map((seg: any) => ({
                segmentName: seg.segmentName || ''
              }))
            : [],
          brand: item.brand || '',
          country: item.countryInfo || '',
          address: item.pickupaddress || '',
          email: item.email || '',
          contacts: Array.isArray(item.contacts)
            ? item.contacts
            : [{ email: item.email || '' }],
          status: {
            label: item.status || 'NOT_CONTACTED',
            type: 'warning'
          },
          quoteID: null,
          attachments: Array.isArray(item.attachments)
            ? item.attachments.map((att: any) => ({
                attachmentId: att.attachmentId || '',
                attachmentName: att.attachmentName || ''
              }))
            : [],
          workingDetails: item.workingDetails || '',
          userName: item.userName || '',
          certificates: item.certificateType || [],
          dialogSpeed:
            item.dialogSpeed !== undefined ? item.dialogSpeed.toString() : '',
          dialogQuality:
            item.dialogQuality !== undefined
              ? item.dialogQuality.toString()
              : '',
          easeOfSupply:
            item.easeOfSupply !== undefined ? item.easeOfSupply.toString() : '',
          supplyCapability:
            item.supplyCapability !== undefined
              ? item.supplyCapability.toString()
              : '',
          euDemandOfParts:
            item.euDemandOfParts !== undefined
              ? item.euDemandOfParts.toString()
              : '',
          createdBy: handleNullValue(item.createdBy || ''),
          createdOn: item.createdOn || '',
          lastModifiedBy: handleNullValue(item.lastModifiedBy || ''),
          lastModifiedOn: item.lastModifiedOn || ''
        }));
        setData(mappedData);
        setTotalItems(response.data.totalItems);
      } else {
        console.error('Suppliers array not found in API response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useMemo(
    () =>
      debounce((term: string, column: SearchColumn) => {
        if (term) {
          if (column.value === 'all') {
            setGlobalFilter(term || undefined);
            setColumnFilters([]);
          } else {
            setGlobalFilter(undefined);
            setColumnFilters([{ id: column.value, value: term }]);
          }
        } else {
          setGlobalFilter(undefined);
          setColumnFilters([]);
        }
        setPageIndex(0);
        fetchData(term, 0, column);
      }, 300),
    [setGlobalFilter, setColumnFilters]
  );

  return (
    <div>
      {/* Alt kısım: Tablo ve sayfalama */}
      <div className="border-bottom border-translucent">
        {loading && <div>Loading...</div>}
        <AdvanceTable
          tableProps={{
            className: 'phoenix-table border-top border-translucent fs-9',
            data: data,
            columns: projectListTableColumns
          }}
        />
        {/* <AdvanceTableFooter
          pagination
          className="py-1"
          totalItems={totalItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize} // Pass pageSize here
          setPageSize={setPageSize} // Allow page size change
        /> */}
      </div>
    </div>
  );
};

export default SupplierList;
