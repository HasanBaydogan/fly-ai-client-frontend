import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import { Col, Row, Dropdown, Badge, Button } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
// import { PiData } from 'smt-v1-app/types/PiTypes';
import { searchByPiList } from 'smt-v1-app/services/PIServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faSitemap,
  faQuestionCircle as faQuestionCircleSolid,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle as faQuestionCircleRegular } from '@fortawesome/free-regular-svg-icons';
import PIListFileUpload from 'smt-v1-app/components/features/PiList/PIListFileUpload';
import ActionTextArea from './ActionTextArea';

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

const piStatus: { [key: string]: string } = {
  NONE: 'dark',
  PI_CREATED: 'primary',
  PI_SENT_TO_CLIENT: 'success',
  PO_WAITING_FROM_CLIENT: 'warning',
  PO_RECEIVED_FROM_CLIENT: 'warning',
  PO_RECEIVED_BUT_PI_NOT_CREATED: 'danger',
  PO_CREATED: 'primary',
  PO_PARTIALLY_SENT: 'info',
  PO_FULLY_SENT: 'success',
  LOT_CREATED: 'primary',
  LOT_PARTIALLY_SENT: 'info',
  LOT_FULLY_SENT: 'success'
};

export interface PiListData {
  piId: string;
  piNumberId: string;
  revisionNo: string;
  quoteNumberId: string;
  contractNo: string;
  piStatus: any;
  company: string;
  numOfProduct: number;
  piParts: [string];
  poRequestedDate: string;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  lastModifiedAt: string;
  total: string;
  actions?: string;
  piActions: Array<{
    piActionId: string;
    description: string;
    createdBy: string;
    createdAt: string;
  }>;
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const PiTableColumns: ColumnDef<PiListData>[] = [
  {
    id: 'actions',
    header: 'Buttons',
    cell: ({ row: { original } }) => {
      const [showFileUploadModal, setShowFileUploadModal] = useState(false);

      return (
        <div className="d-flex gap-2 px-2">
          <Link
            to={`/pi/detail?piId=${original.piId}`}
            style={{ textDecoration: 'none' }}
          >
            <Button
              variant="outline-primary"
              size="sm"
              title="PI Detail"
              className="d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
            >
              <FontAwesomeIcon icon={faFileInvoice} />
            </Button>
          </Link>
          <Button
            variant="outline-secondary"
            size="sm"
            title="PI File Upload"
            className="d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={() => setShowFileUploadModal(true)}
          >
            <FontAwesomeIcon icon={faUpload} />
          </Button>

          {showFileUploadModal && (
            <PIListFileUpload
              show={showFileUploadModal}
              onHide={() => setShowFileUploadModal(false)}
              piId={original.piId}
            />
          )}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'text-center py-2' },
      headerProps: { style: { width: '5%' }, className: 'text-center' }
    }
  },
  {
    id: 'piNumberId',
    accessorKey: 'piNumberId',
    header: 'PI ID',
    cell: ({ row: { original } }) => <span>{original.piNumberId}</span>,
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '7%' } }
    }
  },
  {
    id: 'piStatus ',
    header: 'PI Status',
    cell: ({ row: { original } }) => {
      const status = original.piStatus;
      if (!status) return null;
      const badgeColor = piStatus[status] || 'warning';
      return <Badge bg={badgeColor}>{formatStatus(status)}</Badge>;
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: '8%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Actions',
    id: 'actionsColumn',
    accessorKey: '1--',
    cell: ({ row: { original } }) => (
      <ActionTextArea piId={original.piId} actions={original.piActions || []} />
    ),
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '60%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Client',
    accessorKey: 'company',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '20%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Invoice',
    accessorKey: '3---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: '4---',
    header: 'Customer Payment',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Supplier Invoice',
    accessorKey: '5---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: '6---',
    header: 'Bank',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Bank Type',
    accessorKey: '7---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'poRequestedDate',
    header: 'PO Date',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'PI Date',
    accessorKey: '8---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: '9---',
    header: 'C. Payment Date',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'S. Paid Date',
    accessorKey: '11---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: '22---',
    header: 'LT Days',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    header: 'LT Deadline',
    accessorKey: '33---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: '44---',
    header: 'OP Supplier',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Supplier',
    accessorKey: '55---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  // {
  //   accessorKey: 'numOfProduct',
  //   header: 'Number Of Product',
  //   meta: {
  //     cellProps: { className: 'ps-3 text-body py-2' },
  //     headerProps: { style: { width: '10%' }, className: 'ps-3' }
  //   }
  // },
  {
    accessorKey: 'piParts',
    header: 'PI Parts',
    cell: ({ row: { original } }) => {
      if (
        !original.piParts ||
        !Array.isArray(original.piParts) ||
        original.piParts.length < 1
      ) {
        return '-';
      }

      const parts = original.piParts;
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
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  // {
  //   accessorKey: 'poRequestedDate',
  //   header: 'PoRequested Date',
  //   meta: {
  //     cellProps: { className: 'ps-3 text-body py-2' },
  //     headerProps: { style: { width: '10%' }, className: 'ps-3' }
  //   }
  // },
  {
    id: 'userHistory',
    header: 'User History',
    cell: ({ row: { original } }) => {
      const historyData = {
        'Created By': original.createdBy || '-',
        'Created At': original.createdAt || '-',
        'Last Modified By': original.lastModifiedBy || '-',
        'Last Modified At': original.lastModifiedAt || '-'
      };

      const tooltipContent = Object.entries(historyData)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      return (
        <div className="text-center">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            data-bs-html="true"
            title={tooltipContent}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon
              icon={faQuestionCircleRegular}
              style={{ fontSize: '1.5rem', color: 'black' }}
            />
          </span>
        </div>
      );
    },
    meta: {
      cellProps: { className: 'text-center py-2' },
      headerProps: { style: { width: '5%' }, className: 'text-center' }
    }
  }
  // {
  //   accessorKey: 'total',
  //   header: 'Total',
  //   cell: ({ row: { original } }) => {
  //     const total = parseFloat(original.total);
  //     return isNaN(total)
  //       ? '-'
  //       : total.toLocaleString('en-US', {
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2
  //         });
  //   },
  //   meta: {
  //     cellProps: { className: 'ps-3 text-body py-2' },
  //     headerProps: { style: { width: '10%' }, className: 'ps-3' }
  //   }
  // }
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

const PiListTable: FC<QuoteListTableProps> = ({ activeView }) => {
  const [data, setData] = useState<PiListData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [actionsColumnWidth, setActionsColumnWidth] = useState(
    window.innerWidth < 1500 ? '100%' : '60%'
  );

  // Add resize listener to update the Actions column width
  useEffect(() => {
    const handleResize = () => {
      setActionsColumnWidth(window.innerWidth < 1500 ? '100%' : '60%');
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Instead of modifying the columns, recreate the whole array
  const columns = useMemo(() => {
    // Find the original Actions column
    const actionsColumnIndex = PiTableColumns.findIndex(
      col => typeof col.header === 'string' && col.header === 'Actions'
    );

    if (actionsColumnIndex !== -1) {
      // Create a new array with the same columns
      return PiTableColumns.map((col, index) => {
        // Only modify the Actions column
        if (index === actionsColumnIndex) {
          return {
            ...col,
            meta: {
              ...col.meta,
              headerProps: {
                ...col.meta?.headerProps,
                className: 'ps-3',
                style: {
                  width: actionsColumnWidth,
                  minWidth: '300px'
                }
              }
            }
          };
        }
        // Return other columns unchanged
        return col;
      });
    }

    return PiTableColumns;
  }, [actionsColumnWidth]);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<PiListData>();
  const fetchData = async (currentPage: number, searchParam: string = '') => {
    setLoading(true);
    try {
      const response = await searchByPiList(
        searchParam,
        currentPage + 1,
        pageSize
      );
      const piList = response?.data?.piResponses || [];
      const mappedData: PiListData[] = piList.map((item: any) => {
        let clientNames = '';
        if (Array.isArray(item.piResponses)) {
          clientNames = item.piResponses
            .map((c: any) => c.clientName)
            .join(', ');
        } else if (item.piResponses && typeof item.piResponses === 'object') {
          clientNames = item.piResponses.clientName;
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
                {pageSize === 'all' ? 'All Items' : `${pageSize} PI's`}
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
                      {size === 'all' ? 'All PI`s' : `${size} PI's`}
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
            <div style={{ width: '100%', overflow: 'auto' }}>
              <div style={{ width: '160%' }}>
                <AdvanceTable
                  tableProps={{
                    className:
                      'phoenix-table border-top border-translucent fs-9',
                    data: data,
                    columns: columns
                  }}
                />
              </div>
            </div>
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

export default PiListTable;
