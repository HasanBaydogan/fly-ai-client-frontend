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
  ClientData,
  searchByClientList
} from 'smt-v1-app/services/ClientServices';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';

export const ClientTableColumns: ColumnDef<ClientData>[] = [
  {
    id: 'companyName',
    accessorKey: 'companyName',
    header: 'Company',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '20%' } }
    }
  },
  {
    header: 'Details',
    accessorKey: 'details ',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '35%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'currencyPreference',
    header: 'Currency',
    meta: {
      cellProps: { className: 'fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' } }
    }
  },
  {
    header: 'Website',
    accessorKey: 'website',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '20%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'legalAddress',
    header: 'Legal Address',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '20%' }, className: 'ps-3' }
    }
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: ({ clientStatus }) => clientStatus?.label || '',
    cell: ({ row: { original } }) => {
      const { clientStatus } = original;
      if (!clientStatus) return null;
      return (
        <Badge variant="phoenix" bg={clientStatus.type || 'warning'}>
          {clientStatus.label || ''}
        </Badge>
      );
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-8' }
    }
  },
  {
    id: 'action',
    cell: ({ row: { original } }) => (
      <RevealDropdownTrigger>
        <RevealDropdown>
          <ActionDropdownItems
            clientId={original.clientId ? original.clientId.toString() : ''}
            ClientDataDetail={original}
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
  value: keyof ClientData | 'all';
};

const searchColumns: SearchColumn[] = [
  { label: 'No Filter', value: 'all' },
  { label: 'Company Name', value: 'companyName' },
  { label: 'Currency', value: 'currencyPreference' },
  { label: 'Website', value: 'website' },
  { label: 'Legal Address', value: 'legalAddress' }
];

/* ***********************
   ANA BİLEŞEN: ClientList
   (Hem arama/filtreleme hem de tablo görüntüleme)
   *********************** */
interface ClientListProps {
  activeView: string;
}

const ClientList: FC<ClientListProps> = ({ activeView }) => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const pageSize = 6;

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<ClientData>();

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
      const response = await searchByClientList(
        query,
        currentPage + 1,
        pageSize
      );
      const clients = response?.data?.clients || [];
      if (Array.isArray(clients)) {
        const mappedData: ClientData[] = clients.map((item: any) => ({
          clientId: item.clientId,
          companyName: item.companyName,
          segments: Array.isArray(item.segments)
            ? item.segments.map((seg: any) => ({
                segmentName: seg.segmentName || ''
              }))
            : [],
          currencyPreference: item.currencyPreference || '',
          website: item.website || '',
          legalAddress: item.legalAddress || '',
          email: item.email || '',
          contacts: Array.isArray(item.contacts)
            ? item.contacts
            : [{ email: item.email || '' }],
          clientStatus: {
            label: item.clientStatus || 'NOT_CONTACTED',
            type: 'warning'
          },
          quoteID: null,
          attachments: Array.isArray(item.attachments)
            ? item.attachments.map((att: any) => ({
                attachmentId: att.attachmentId || '',
                attachmentName: att.attachmentName || ''
              }))
            : [],
          details: item.details || '',
          subCompanyName: item.subCompanyName || '',
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
        console.error('Clients array not found in API response');
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchData(value, selectedColumn);
  };

  const handleColumnSelect = (column: SearchColumn) => {
    setSelectedColumn(column);
    debouncedFetchData(searchTerm, column);
  };

  useEffect(() => {
    fetchData(searchTerm, pageIndex, selectedColumn);
  }, [pageIndex]);

  return (
    <div>
      {/* Üst kısım: Arama ve filtreleme */}
      <div className="mb-4">
        <Row className="g-3 align-items-center">
          <Col xs={12} md={5}>
            <div className="d-flex gap-2">
              <SearchBox
                placeholder={`Search in ${selectedColumn.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={handleSearch}
                disabled={selectedColumn.value === 'all'}
                className="flex-grow-1"
              />
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="text-start"
                  style={{ minWidth: '150px' }}
                >
                  {selectedColumn.label}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {searchColumns.map(column => (
                    <Dropdown.Item
                      key={column.value.toString()}
                      onClick={() => handleColumnSelect(column)}
                    >
                      {column.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>

      {/* Alt kısım: Tablo ve sayfalama */}
      <div className="border-bottom border-translucent">
        {loading && <div>Loading...</div>}
        <AdvanceTable
          tableProps={{
            className: 'phoenix-table border-top border-translucent fs-9',
            data: data,
            columns: ClientTableColumns
          }}
        />
        <AdvanceTableFooter
          pagination
          className="py-1"
          totalItems={totalItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      </div>
    </div>
  );
};

export default ClientList;
