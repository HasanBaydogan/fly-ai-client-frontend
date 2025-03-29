import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import { Col, Row, Dropdown, Badge } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { searchByQuoteList } from 'smt-v1-app/services/QuoteService';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const formStatus: { [key: string]: string } = {
  QUOTE_CREATED: 'warning',
  PO_WAITING_FROM_CLIENT: 'info',
  PO_RECEIVED_FROM_CLIENT: 'success',
  PI_SENT_TO_CLIENT: 'primary'
};

const quoteStatus: { [key: string]: string } = {
  QUOTE_CREATED: 'warning',
  QUOTE_SENT: 'success'
};

export interface SupplierData {
  quoteId: string;
  quoteNumberId: string;
  revisionNo: string;
  clientsResponse: { clientId: string; clientName: string }[];
  clientRFQId: string;
  numOfProduct: number;
  quoteStatus: any;
  formStatus: any;
  finalCost: number;
  lastValidDate: string;
  client?: string;
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const QuoteTableColumns: ColumnDef<SupplierData>[] = [
  {
    id: 'quoteNumberId',
    accessorKey: 'quoteNumberId',
    header: 'Quote Number',
    cell: ({ row: { original } }) => (
      <Link
        to={`/quotes/quote?quoteId=${original.quoteId}`}
        style={{ textDecoration: 'none', color: 'secondary' }}
      >
        {original.quoteNumberId}
      </Link>
    ),
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' } }
    }
  },
  {
    header: 'Revision',
    accessorKey: 'revisionNo',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    id: 'clientName',
    header: 'Client',
    accessorKey: 'client',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'clientRFQId',
    header: 'Client RFQ ID',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Number Of Product',
    accessorKey: 'numOfProduct',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    id: 'quoteStatus',
    header: 'Quote Status',
    cell: ({ row: { original } }) => {
      const status = original.quoteStatus;
      if (!status) return null;
      const badgeColor = quoteStatus[status] || 'warning';
      return <Badge bg={badgeColor}>{formatStatus(status)}</Badge>;
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-8' }
    }
  },
  {
    id: 'formStatus',
    header: 'Form Status',
    cell: ({ row: { original } }) => {
      const status = original.formStatus;
      if (!status) return null;
      const badgeColor = formStatus[status] || 'warning';
      return <Badge bg={badgeColor}>{formatStatus(status)}</Badge>;
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-8' }
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
    accessorKey: 'lastValidDate',
    header: 'Validity Date',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  }
];

type SearchColumn = {
  label: string;
  value: 'all' | 'quoteNumberId' | 'clientRFQId' | 'clientName';
};

const searchColumns: SearchColumn[] = [
  // { label: 'No Filter', value: 'all' },
  { label: 'Quote Number', value: 'quoteNumberId' },
  { label: 'Client', value: 'clientName' },
  { label: 'Client RFQ ID', value: 'clientRFQId' }
];

interface QuoteListTableProps {
  activeView: string;
}

const QuoteListTable: FC<QuoteListTableProps> = ({ activeView }) => {
  const [data, setData] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number | 'all'>(10);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<SupplierData>();
  const fetchData = async (currentPage: number, searchParam: string = '') => {
    setLoading(true);
    try {
      const response = await searchByQuoteList(
        searchParam,
        currentPage + 1,
        pageSize
      );
      const quoteList = response?.data?.quotes || [];
      const mappedData: SupplierData[] = quoteList.map((item: any) => {
        let clientNames = '';
        if (Array.isArray(item.clientsResponse)) {
          clientNames = item.clientsResponse
            .map((c: any) => c.clientName)
            .join(', ');
        } else if (
          item.clientsResponse &&
          typeof item.clientsResponse === 'object'
        ) {
          clientNames = item.clientsResponse.clientName;
        }
        return {
          ...item,
          client: clientNames
        };
      });
      setData(mappedData);
      setTotalItems(response?.data?.totalElements || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useMemo(
    () =>
      debounce((term: string, column: SearchColumn) => {
        const effectiveTerm = term.trim();
        const searchParam = effectiveTerm
          ? `${column.value}=${effectiveTerm}`
          : '';
        if (pageSize !== 'all') {
          setGlobalFilter(undefined);
          setColumnFilters([{ id: column.value, value: effectiveTerm }]);
        } else {
          setGlobalFilter(effectiveTerm || undefined);
          setColumnFilters([]);
        }
        setPageIndex(0);
        fetchData(0, searchParam);
      }, 300),
    [setGlobalFilter, setColumnFilters, pageSize]
  );

  useEffect(() => {
    const effectivePageIndex = pageSize === 'all' ? 0 : pageIndex;
    const effectiveTerm = searchTerm.trim();
    const searchParam = effectiveTerm
      ? `${selectedColumn.value}=${effectiveTerm}`
      : '';
    fetchData(effectivePageIndex, searchParam);
  }, [pageIndex, pageSize]);

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
    const searchParam =
      selectedColumn.value === 'all'
        ? ''
        : `${selectedColumn.value}=${searchTerm}`;
    fetchData(pageIndex, searchParam);
  }, [pageIndex, pageSize]);

  return (
    <div>
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
          <Col xs="auto" className="d-flex gap-2 ms-auto">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                size="sm"
                id="dropdown-items-per-page"
                style={{ minWidth: '100px' }}
              >
                {pageSize === 'all' ? 'All Items' : `${pageSize} Items`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {([5, 10, 25, 50, 100, 'all'] as (number | 'all')[]).map(
                  size => (
                    <Dropdown.Item
                      key={size.toString()}
                      active={pageSize === size}
                      onClick={() => {
                        setPageSize(size);
                        setPageIndex(0);
                      }}
                    >
                      {size === 'all' ? 'All Quotes' : `${size} Quotes`}
                    </Dropdown.Item>
                  )
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <div className="border-bottom border-translucent">
        {loading && (
          <div>
            <LoadingAnimation></LoadingAnimation>
          </div>
        )}
        <AdvanceTable
          tableProps={{
            className: 'phoenix-table border-top border-translucent fs-9',
            data: data,
            columns: QuoteTableColumns
          }}
        />
        <AdvanceTableFooter
          pagination
          className="py-1"
          totalItems={totalItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};

export default QuoteListTable;
