import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import Badge from 'components/base/Badge';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { Col, Row, Dropdown, Button } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import ActionDropdownItems from './ActionDropdownItems/ActionDropdownItems';
import {
  ClientData,
  searchByClientList
} from 'smt-v1-app/services/ClientServices';
import { searchByPartList } from 'smt-v1-app/services/PartServices';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';

export const ClientTableColumns: ColumnDef<ClientData>[] = [
  {
    id: 'quoteId',
    accessorKey: 'quoteId',
    header: 'Quote ID',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' } }
    }
  },
  {
    header: 'Revision',
    accessorKey: 'revision',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'client',
    header: 'Client',
    meta: {
      cellProps: { className: 'fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' } }
    }
  },
  {
    header: 'Client RFQ ID',
    accessorKey: 'clientRfqId',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'numberOfProduct',
    header: 'Number Of Product',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'formStatus',
    header: 'Form Status',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'finalCost',
    header: 'Final Cost',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'validityDuration',
    header: 'Validity Duration',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '15%' }, className: 'ps-3' }
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
            clientDataDetail={original} // Prop adını güncelledik
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
  { label: 'Quota ID', value: 'companyName' },
  { label: 'Revision', value: 'currencyPreference' },
  { label: 'Client', value: 'website' },
  { label: 'Client RFQ ID', value: 'legalAddress' },
  { label: 'Number Of Product', value: 'legalAddress' },
  { label: 'Form Status', value: 'legalAddress' },
  { label: 'Final Cost', value: 'legalAddress' },
  { label: 'Validity Duration', value: 'legalAddress' }
];

/* ***********************
   ANA BİLEŞEN: ClientList
   (Hem arama/filtreleme hem de tablo görüntüleme)
   *********************** */
interface ClientListProps {
  activeView: string;
}

const PartListTable: FC<ClientListProps> = ({ activeView }) => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number>(10);
  // console.log('Page Size', pageSize);

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
      const response = await searchByPartList(query, currentPage + 1, pageSize);
      const clients = response?.data?.clients || [];
      if (Array.isArray(clients)) {
        const mappedData: ClientData[] = clients.map((item: any) => ({
          id: item.id,
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
          attachmentResponses: Array.isArray(item.attachmentResponses)
            ? item.attachmentResponses.map((att: any) => ({
                attachmentId: att.attachmentId || '',
                fileName: att.fileName || ''
              }))
            : [],
          details: item.details || '',
          subCompanyName: item.subCompanyName || '',
          phone: item.phone || '',
          clientRatings: item.clientRatings || {
            dialogQuality: 0,
            volumeOfOrder: 0,
            continuityOfOrder: 0,
            easeOfPayment: 0,
            easeOfDelivery: 0
          },
          marginTable: item.marginTable || {
            below200: 0,
            btw200and500: 0,
            btw500and1_000: 0,
            btw1_000and5_000: 0,
            btw5_000and10_000: 0,
            btw10_000and50_000: 0,
            btw50_000and100_000: 0,
            btw100_000and150_000: 0,
            btw150_000and200_000: 0,
            btw200_000and400_000: 0,
            btw400_000and800_000: 0,
            btw800_000and1_000_000: 0,
            btw1_000_000and2_000_000: 0,
            btw2_000_000and4_000_000: 0,
            above4_000_000: 0,
            lastModifiedBy: ''
          },
          comment: item.comment || '',
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
  }, [pageIndex, pageSize]);

  return (
    <div>
      {/* Üst kısım: Arama ve filtreleme */}
      <div className="mb-4 ">
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

          {/* Items per page selector */}
          <Col xs="auto" className="d-flex gap-2 ms-auto">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                size="sm"
                id="dropdown-items-per-page"
                style={{ minWidth: '100px' }}
              >
                {pageSize} Parts
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[5, 10, 25, 50, 100].map(size => (
                  <Dropdown.Item
                    key={size}
                    active={pageSize === size}
                    onClick={() => {
                      setPageSize(size);
                      setPageIndex(0); // Reset to first page
                    }}
                  >
                    {size} Items
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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
          pageSize={pageSize} // Pass pageSize here
          setPageSize={setPageSize} // Allow page size change
        />
      </div>
    </div>
  );
};

export default PartListTable;
