import React, {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FC,
  useRef
} from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import { Col, Row, Dropdown, Badge, Button } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getCompanyAll } from 'smt-v1-app/services/CompanyServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle as faQuestionCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { usePopper } from 'react-popper';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddCompanyModal from '../AddCompanyModal/AddCompanyModal';

// export interface SupplierData {
//   quoteId: string;
//   quoteNumberId: string;
//   revisionNo: string;
//   clientsResponse: { clientId: string; clientName: string }[];
//   clientRFQId: string;
//   numOfProduct: number;
//   quoteStatus: any;
//   formStatus: any;
//   finalCost: number;
//   lastValidDate: string;
//   client?: string;
// }

export interface CompanyData {
  companyId: string;
  logo: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyTelephone: string;
  companyBanks: {
    bankName: string;
    branchName: string;
    branchCode: string;
    swiftCode: string;
    ibanNo: string;
    currency: string;
  }[];
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  active: boolean;
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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

export const QuoteTableColumns: ColumnDef<CompanyData>[] = [
  {
    id: 'logo',
    accessorKey: 'logo',
    header: 'Company Logo',
    cell: ({ row: { original } }: { row: { original: CompanyData } }) => {
      if (!original.logo) {
        return (
          <div
            className="text-center"
            style={{
              minHeight: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: '14px'
            }}
          >
            No Logo
          </div>
        );
      }
      return (
        <div
          style={{
            minHeight: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px'
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <img
              src={original.logo}
              alt={`${original.companyName} Logo`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      );
    },
    meta: {
      headerProps: {
        className: 'text-center',
        style: { width: '10%' }
      }
    }
  },
  {
    header: 'Company Name',
    accessorKey: 'companyName',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    id: 'companyAddress',
    header: 'Company Address',
    accessorKey: 'companyAddress',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '20%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'companyEmail',
    header: 'Company Email',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Company Telephone',
    accessorKey: 'companyTelephone',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '5%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'bankName',
    header: 'Bank İnformation',
    cell: ({ row: { original } }: { row: { original: CompanyData } }) => {
      if (
        !Array.isArray(original.companyBanks) ||
        original.companyBanks.length === 0
      ) {
        return <div className="ps-3">-</div>;
      }

      return (
        <div className="ps-3">
          {original.companyBanks.map((bank, index) => {
            const tooltipContent = (
              <div style={{ whiteSpace: 'pre-line' }}>
                <div>
                  <strong>Bank Name:</strong> {bank.bankName || '-'}
                </div>
                <div>
                  <strong>Branch Name:</strong> {bank.branchName || '-'}
                </div>
                <div>
                  <strong>Branch Code:</strong> {bank.branchCode || '-'}
                </div>
                <div>
                  <strong>Swift Code:</strong> {bank.swiftCode || '-'}
                </div>
                <div>
                  <strong>IBAN:</strong> {bank.ibanNo || '-'}
                </div>
                <div>
                  <strong>Currency:</strong> {bank.currency || '-'}
                </div>
              </div>
            );

            return (
              <div key={index} className="mb-1">
                <EnhancedTooltip
                  tooltipContent={tooltipContent}
                  placement="left"
                >
                  <span style={{ cursor: 'pointer' }}>
                    {bank.bankName} ({bank.currency})
                  </span>
                </EnhancedTooltip>
              </div>
            );
          })}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
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
      headerProps: { style: { width: '5%' }, className: 'text-center' }
    }
  }
];

type SearchColumn = {
  label: string;
  value: 'all' | 'companyName' | 'clientRFQId' | 'clientName';
};

const searchColumns: SearchColumn[] = [
  // { label: 'No Filter', value: 'all' },
  { label: 'Company Name', value: 'companyName' },
  { label: 'Client', value: 'clientName' },
  { label: 'Client RFQ ID', value: 'clientRFQId' }
];

interface CompanyListTableProps {
  activeView: string;
}

const CompanyListTable: FC<CompanyListTableProps> = ({ activeView }) => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const [showAddModal, setShowAddModal] = useState(false);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<CompanyData>();
  const fetchData = async (currentPage: number, searchParam: string = '') => {
    setLoading(true);
    try {
      const response = await getCompanyAll();
      const companyList = response?.data || [];
      const mappedData: CompanyData[] = companyList.map((item: any) => {
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
            <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
              <h2 className="m-3">
                <span className="me-3">Company List</span>{' '}
                <span className="fw-normal text-body-tertiary"></span>
              </h2>
              <Button
                variant="primary"
                className="px-5"
                onClick={() => setShowAddModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Company
              </Button>
            </div>

            <AddCompanyModal
              show={showAddModal}
              onHide={() => setShowAddModal(false)}
              onSuccess={() => {
                fetchData(pageIndex);
                setShowAddModal(false);
              }}
            />
            {/* <div className="d-flex gap-2">
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
            </div> */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyListTable;
