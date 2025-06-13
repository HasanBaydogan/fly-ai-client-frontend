import { useEffect, useMemo, useState, ChangeEvent, FC, useRef } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle as faQuestionCircleRegular } from '@fortawesome/free-regular-svg-icons';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import { Col, Row, Dropdown, Badge, Button } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { searchByPoList } from 'smt-v1-app/services/PoServices';
import { usePopper } from 'react-popper';

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

const status: { [key: string]: string } = {
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
  piParts: [string];
  poRequestedDate: string;
  actions?: string;
  poId: string;
  poNumberId: string;
  quoteNumberId: string;
  vendors: [string];
  status: any;
  numOfProduct: number;
  partNumbers: [string];
  shipTo: string;
  reqruisitioner: string;
  shipVia: string;
  fob: string;
  shippingTerms: string;
  poTax: {
    taxRate: number;
    isIncluded: boolean;
  };
  total: string;
  createdBy: string;
  lastModifiedBy: string;
  createdAt: string;
  lastModifiedAt: string;
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
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <div className="d-flex gap-2 px-2">
        <Link
          to={`/po/detail?poId=${original.poId}`}
          style={{ textDecoration: 'none' }}
        >
          <Button
            variant="outline-primary"
            size="sm"
            title="PO Detail"
            className="d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
          >
            <FontAwesomeIcon icon={faFileInvoice} />
          </Button>
        </Link>
      </div>
    ),
    meta: {
      cellProps: { className: 'text-center py-2' },
      headerProps: { style: { width: '5%' }, className: 'text-center' }
    }
  },
  {
    id: 'piNumberId',
    accessorKey: 'poNumberId',
    header: 'PO ID',
    cell: ({ row: { original } }) => <span>{original.poNumberId}</span>,
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '7%' } }
    }
  },
  {
    id: '----',
    accessorKey: '----',
    header: 'Quote ID',
    cell: ({ row: { original } }) => <span>{original.quoteNumberId}</span>,
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '7%' } }
    }
  },
  {
    id: 'piStatus ',
    header: 'Status',
    cell: ({ row: { original } }) => {
      const status = original.status;
      if (!status) return null;
      const badgeColor = status[status] || 'warning';
      return <Badge bg={badgeColor}>{formatStatus(status)}</Badge>;
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: '8%' }, className: 'ps-3' }
    }
  },
  // {
  //   header: 'Supplier',
  //   accessorKey: 'vendors',
  //   id: 'Supplier',
  //   cell: ({ row: { original } }) => {
  //     if (
  //       !original.vendors ||
  //       !Array.isArray(original.vendors) ||
  //       original.vendors.length < 1
  //     ) {
  //       return '-';
  //     }

  //     const parts = original.vendors;
  //     const hasMoreItems = parts.length > 3;
  //     const displayParts = hasMoreItems ? parts.slice(0, 2) : parts;

  //     const tooltipContent = (
  //       <div style={{ whiteSpace: 'pre-line' }}>
  //         {parts.map((part: string, index: number) => (
  //           <div key={index}>
  //             <span className="me-1">•</span>
  //             {part}
  //           </div>
  //         ))}
  //       </div>
  //     );

  //     return (
  //       <div style={{ whiteSpace: 'nowrap', position: 'relative' }}>
  //         {displayParts.map((part: string, index: number) => (
  //           <div key={index} className="my-1">
  //             <span className="me-1">•</span>
  //             {part}
  //           </div>
  //         ))}
  //         {hasMoreItems && (
  //           <div style={{ display: 'inline-block' }}>
  //             <EnhancedTooltip
  //               tooltipContent={tooltipContent}
  //               placement="right"
  //             >
  //               <span className="text-primary">...</span>
  //             </EnhancedTooltip>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   },
  //   meta: {
  //     cellProps: { className: 'ps-3 text-body py-2' },
  //     headerProps: {
  //       style: { width: '150px', minWidth: '150px' },
  //       className: 'ps-3'
  //     }
  //   }
  // },
  {
    header: 'Vendor',
    accessorKey: 'vendors',
    id: 'vendors',
    cell: ({ row: { original } }) => {
      if (
        !original.vendors ||
        !Array.isArray(original.vendors) ||
        original.vendors.length < 1
      ) {
        return '-';
      }

      const parts = original.vendors;
      const hasMoreItems = parts.length > 3;
      const displayParts = hasMoreItems ? parts.slice(0, 2) : parts;

      const tooltipContent = (
        <div style={{ whiteSpace: 'pre-line' }}>
          {parts.map((part: string, index: number) => (
            <div key={index}>
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
        </div>
      );

      return (
        <div style={{ whiteSpace: 'nowrap', position: 'relative' }}>
          {displayParts.map((part: string, index: number) => (
            <div key={index} className="my-1">
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
          {hasMoreItems && (
            <div style={{ display: 'inline-block' }}>
              <EnhancedTooltip
                tooltipContent={tooltipContent}
                placement="right"
              >
                <span className="text-primary">...</span>
              </EnhancedTooltip>
            </div>
          )}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: {
        style: { width: '150px', minWidth: '150px' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: 'numberOfPart',
    header: 'Number Of Product',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'partNumbers',
    header: 'PO Parts',
    cell: ({ row: { original } }) => {
      if (
        !original.partNumbers ||
        !Array.isArray(original.partNumbers) ||
        original.partNumbers.length < 1
      ) {
        return '-';
      }

      const parts = original.partNumbers;
      const hasMoreItems = parts.length > 3;
      const displayParts = hasMoreItems ? parts.slice(0, 2) : parts;

      const tooltipContent = (
        <div style={{ whiteSpace: 'pre-line' }}>
          {parts.map((part: string, index: number) => (
            <div key={index}>
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
        </div>
      );

      return (
        <div style={{ whiteSpace: 'nowrap', position: 'relative' }}>
          {displayParts.map((part: string, index: number) => (
            <div key={index} className="my-1">
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
          {hasMoreItems && (
            <div style={{ display: 'inline-block' }}>
              <EnhancedTooltip
                tooltipContent={tooltipContent}
                placement="right"
              >
                <span className="text-primary">...</span>
              </EnhancedTooltip>
            </div>
          )}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: {
        style: { width: '150px', minWidth: '150px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'Ship To',
    accessorKey: 'shipTo',
    cell: ({ row: { original } }) => {
      const value = original.shipTo;
      return value && value.trim() !== '' ? value : '-';
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'requisitioner',
    header: 'Requisitoner',
    cell: ({ row: { original } }) => {
      const value = original.reqruisitioner;
      return value && value.trim() !== '' ? value : '-';
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'ShipVIA',
    accessorKey: 'shipVia',
    cell: ({ row: { original } }) => {
      const value = original.shipVia;
      return value && value.trim() !== '' ? value : '-';
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'fob',
    header: 'FOB',
    cell: ({ row: { original } }) => {
      const value = original.fob;
      return value && value.trim() !== '' ? value : '-';
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Shipping Terms',
    accessorKey: 'shippingTerms',
    cell: ({ row: { original } }) => {
      const value = original.shippingTerms;
      return value && value.trim() !== '' ? value : '-';
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'poTax',
    header: 'Tax',
    cell: ({ row: { original } }) => {
      const taxRate = original.poTax?.taxRate;
      return taxRate && taxRate !== 0;
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Shipping',
    accessorKey: '11---',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row: { original } }) => {
      const total = parseFloat(original.total);
      return isNaN(total)
        ? '-'
        : total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
    },
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Comments',
    accessorKey: '33---',
    cell: ({ row: { original } }) => {
      const value = original['33---'];
      return value && value.trim() !== '' ? value : '-';
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
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

      const tooltipContent = (
        <div style={{ whiteSpace: 'pre-line' }}>
          {Object.entries(historyData).map(([key, value], index) => (
            <div key={index}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      );

      return (
        <div className="text-center">
          <EnhancedTooltip tooltipContent={tooltipContent} placement="left">
            <FontAwesomeIcon
              icon={faQuestionCircleRegular}
              style={{ fontSize: '1.5rem', color: 'black', cursor: 'pointer' }}
            />
          </EnhancedTooltip>
        </div>
      );
    },
    meta: {
      cellProps: { className: 'text-center py-2' },
      headerProps: {
        style: { width: '100px', minWidth: '100px' },
        className: 'text-center'
      }
    }
  }
];

type SearchColumn = {
  label: string;
  value:
    | 'all'
    | 'poNumberId'
    | 'quoteNumberId'
    | 'vendor'
    | 'partNumbers'
    | 'partName';
};

const searchColumns: SearchColumn[] = [
  // { label: 'No Filter', value: 'all' },
  { label: 'PO Number', value: 'poNumberId' },
  { label: 'Quote Number', value: 'quoteNumberId' },
  { label: 'Vendor', value: 'vendor' },
  { label: 'Part Numbers', value: 'partNumbers' },
  { label: 'Part Name', value: 'partName' }
];

interface QuoteListTableProps {
  activeView: string;
}

// Create a reusable EnhancedTooltip component
const EnhancedTooltip = ({
  children,
  tooltipContent,
  placement = 'right'
}: {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAvailable, setisAvailable] = useState(false);
  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      placement,
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10]
          }
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: document.body,
            padding: 10
          }
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['left', 'bottom', 'top']
          }
        }
      ]
    }
  );

  const handleMouseEnter = () => {
    if (!isAvailable) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isAvailable) {
      setShowTooltip(false);
    }
  };

  const handleClick = () => {
    setisAvailable(!isAvailable);
    setShowTooltip(!isAvailable);
  };

  return (
    <>
      <div
        ref={referenceRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          ref={popperRef}
          style={{
            ...styles.popper,
            zIndex: 1050,
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: '0.25rem',
            padding: '0.5rem',
            maxWidth: '300px',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            fontSize: '0.875rem'
          }}
          {...attributes.popper}
        >
          {tooltipContent}
          {isAvailable && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '2px 6px',
                fontWeight: 'bold'
              }}
              onClick={e => {
                e.stopPropagation();
                setisAvailable(false);
                setShowTooltip(false);
              }}
            >
              ×
            </div>
          )}
        </div>
      )}
    </>
  );
};

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

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<PiListData>();
  const fetchData = async (currentPage: number, searchParam: string = '') => {
    setLoading(true);
    try {
      const response = await searchByPoList(
        searchParam,
        currentPage + 1,
        pageSize
      );
      const poList = response?.data?.poResponses || [];
      const mappedData: PiListData[] = poList.map((item: any) => {
        let poNumberIds = '';
        if (Array.isArray(item.poResponses)) {
          poNumberIds = item.poResponses
            .map((c: any) => c.clientName)
            .join(', ');
        } else if (item.poResponses && typeof item.poResponses === 'object') {
          poNumberIds = item.poResponses.poNumberId;
        }
        return {
          ...item,
          client: poNumberIds
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

  // useEffect(() => {
  //   const effectivePageIndex = pageSize === 'all' ? 0 : pageIndex;
  //   const effectiveTerm = searchTerm.trim();
  //   const searchParam = effectiveTerm
  //     ? `${selectedColumn.value}=${effectiveTerm}`
  //     : '';
  //   fetchData(effectivePageIndex, searchParam);
  // }, [pageIndex, pageSize]);

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
                    columns: PiTableColumns
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
