import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import { Col, Row, Dropdown, Badge } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { searchByRFQList, getRfqMailId } from 'smt-v1-app/services/RFQService';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

// Add type declaration for Bootstrap
declare global {
  interface Window {
    bootstrap?: {
      Tooltip: {
        new (element: Element): { dispose: () => void };
        getInstance: (element: Element) => { dispose: () => void } | null;
      };
    };
  }
}

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

export interface RFQData {
  rfqReferenceId: string;
  rfqId: string;
  rfqStatus: any;
  clientRFQId: string;
  date: string;
  client: string;
  totalPart: number;
  numOfPricedPart: number;
  numberOfProduct: number;
  comments: string;
  rfqParts: { partNumber: string; partId: string }[];
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const RFQTableColumns: ColumnDef<RFQData>[] = [
  {
    id: 'RFReferenceId',
    accessorKey: 'rfqReferenceId',
    header: 'RFQ Reference ID',
    cell: ({ row: { original } }) => {
      const navigate = useNavigate();

      const handleClick = async () => {
        try {
          const response = await getRfqMailId(original.rfqId);

          if (response.success) {
            navigate(`/rfqs/rfq?rfqMailId=${response.data.id}`);
          } else {
            console.error('API Error:', response.message);
          }
        } catch (error) {
          console.error('API çağrısı sırasında hata:', error);
          window.location.assign('/404');
        }
      };

      return (
        <button
          onClick={handleClick}
          style={{
            textDecoration: 'none',
            color: 'blue',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {original.rfqReferenceId}
        </button>
      );
    },
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '10%', textAlign: 'center' } }
    }
  },
  {
    header: 'Client RFQ ID',
    accessorKey: 'clientRFQId',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    id: 'date',
    header: 'Date',
    accessorKey: 'date',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' }, className: 'ps-3' }
    }
  },
  {
    id: 'quoteStatus',
    header: 'Quote Status',
    cell: ({ row: { original } }) => {
      const status = original.rfqStatus;
      if (!status) return null;
      const badgeColor = quoteStatus[status] || 'warning';
      return <Badge bg={badgeColor}>{formatStatus(status)}</Badge>;
    },
    meta: {
      cellProps: { className: 'ps-3 py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'client',
    header: 'Client',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Total/Find Parts',
    accessorKey: 'numberOfProduct',
    cell: ({ row: { original } }) => {
      const totalPart = original.totalPart ?? 0;
      const numOfPricedPart = original.numOfPricedPart ?? 0;
      return `${numOfPricedPart}/${totalPart}`;
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '5%', textAlign: 'center' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'RFQ Cost',
    accessorKey: 'rfqCost',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '10%' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'Comments',
    accessorKey: 'comments',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Part Number',
    accessorKey: 'partNumber',
    cell: ({ row: { original } }) => {
      if (
        !original.rfqParts ||
        !Array.isArray(original.rfqParts) ||
        original.rfqParts.length < 1
      ) {
        return '-';
      }

      const parts = original.rfqParts.map((part: any) => part.partNumber);
      const hasMoreItems = parts.length > 3;
      const displayParts = hasMoreItems ? parts.slice(0, 2) : parts;

      return (
        <div style={{ whiteSpace: 'nowrap' }}>
          {displayParts.map((part: string, index: number) => (
            <div key={index} className="my-1">
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
          {hasMoreItems && (
            <div className="position-relative">
              <span
                className="text-primary"
                style={{ cursor: 'pointer' }}
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title={parts.slice(2).join('\n• ')}
              >
                ...
              </span>
            </div>
          )}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: {
        style: { width: '5%', textAlign: 'center' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: {
        style: { width: '5%', textAlign: 'center' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: 'lastModifiedBy',
    header: 'Last Modified By',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: {
        style: { width: '5%', textAlign: 'center' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: 'lastModifiedAt',
    header: 'Last Modified At',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2 ' },
      headerProps: {
        style: { width: '5%', textAlign: 'center' },
        className: 'ps-3'
      }
    }
  }
];

type SearchColumn = {
  label: string;
  value: 'all' | 'rfqReferenceId' | 'clientRFQId' | 'client' | 'createdBy';
};

const searchColumns: SearchColumn[] = [
  // { label: 'No Filter', value: 'all' },
  { label: 'RFQ Reference ID', value: 'rfqReferenceId' },
  { label: 'Client RFQ ID', value: 'clientRFQId' },
  { label: 'Client', value: 'client' },
  { label: 'Created By', value: 'createdBy' }
];

interface RFQListTableProps {
  activeView: string;
}

const RFQListTable: FC<RFQListTableProps> = ({ activeView }) => {
  const [data, setData] = useState<RFQData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number | 'all'>(10);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<RFQData>();
  const fetchData = async (currentPage: number, searchParam: string = '') => {
    setLoading(true);
    try {
      const response = await searchByRFQList(
        searchParam,
        currentPage + 1,
        pageSize
      );
      const rfqList = response?.data?.rfqList || [];
      const mappedData: RFQData[] = rfqList.map((item: any) => {
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
          ...item
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

  // Initialize tooltips after rendering
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    // Check if tooltips exist and bootstrap is available
    if (
      typeof window !== 'undefined' &&
      window.bootstrap &&
      tooltipTriggerList &&
      Number(tooltipTriggerList.length) > 0
    ) {
      Array.from(tooltipTriggerList).forEach(tooltipTriggerEl => {
        new window.bootstrap!.Tooltip(tooltipTriggerEl);
      });
    }

    // Cleanup tooltips when component unmounts
    return () => {
      if (
        typeof window !== 'undefined' &&
        window.bootstrap &&
        tooltipTriggerList
      ) {
        Array.from(tooltipTriggerList).forEach(tooltipTriggerEl => {
          const tooltip =
            window.bootstrap!.Tooltip.getInstance(tooltipTriggerEl);
          if (tooltip) {
            tooltip.dispose();
          }
        });
      }
    };
  }, [data]);

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
        {loading ? (
          <div>
            <LoadingAnimation />
          </div>
        ) : (
          <>
            <AdvanceTable
              tableProps={{
                className: 'phoenix-table border-top border-translucent fs-9',
                data: data,
                columns: RFQTableColumns
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
          </>
        )}
      </div>
    </div>
  );
};

export default RFQListTable;
