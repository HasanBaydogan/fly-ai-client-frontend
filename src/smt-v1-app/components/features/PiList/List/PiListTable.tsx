import React, {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FC,
  createContext,
  useContext
} from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import {
  Col,
  Row,
  Dropdown,
  Badge,
  Button,
  Toast,
  ToastContainer,
  Form
} from 'react-bootstrap';
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
  faUpload,
  faEdit,
  faSave
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
  bank?: string;
  bankType?: string;
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

// Create context outside of component
const PiListTableContext = createContext<{
  editingPiId: string | null;
  handleEditToggle: (piId: string) => void;
}>({ editingPiId: null, handleEditToggle: () => {} });

// Static columns without the Actions column that needs editingPiId
export const PiTableColumnsStatic: ColumnDef<PiListData>[] = [
  {
    id: 'actions',
    header: 'Buttons',
    cell: ({ row: { original } }) => {
      const [showFileUploadModal, setShowFileUploadModal] = useState(false);
      // Use the shared context
      const { editingPiId, handleEditToggle } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;

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

          {/* Edit/Save Button */}
          <Button
            variant={isEditing ? 'outline-success' : 'outline-info'}
            size="sm"
            title={isEditing ? 'Save Changes' : 'Edit PI'}
            className="d-flex align-items-center justify-content-center"
            style={{ width: '32px', height: '32px' }}
            onClick={() => handleEditToggle(original.piId)}
          >
            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
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
  // The Actions column will be added inside the component
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
    id: 'bank',
    accessorKey: '6---',
    header: 'Bank',
    cell: ({ row: { original } }) => {
      // We'll replace this implementation with a simple element as it will be dynamically replaced
      return <div>{original.bank || 'OTHER'}</div>;
    },
    meta: {
      cellProps: {
        className: 'ps-3 fs-9 text-body white-space-nowrap py-2'
      },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Bank Type',
    accessorKey: '7---',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [selectedBankType, setSelectedBankType] = useState(
        original.bankType || 'NONE'
      );

      const bankTypeOptions = ['NONE', 'TRANSIT', 'EXPORT', 'IMPORTS'];

      const handleBankTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const newValue = e.target.value;
        setSelectedBankType(newValue);
        original.bankType = newValue;
      };

      if (isEditing) {
        return (
          <Form.Select
            size="sm"
            value={selectedBankType}
            onChange={handleBankTypeChange}
            style={{ minWidth: '100px' }}
          >
            {bankTypeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        );
      }

      return (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            minWidth: '100px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {original.bankType || 'NONE'}
        </div>
      );
    },
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

// Export an alias for backward compatibility with other files
export const PiTableColumns = PiTableColumnsStatic;

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

// Add a custom AdvanceTable wrapper component for highlighting edited rows
const EditableAdvanceTable = ({
  tableProps,
  editingId
}: {
  tableProps: any;
  editingId: string | null;
}) => {
  // Use useEffect to apply styling directly to DOM elements after render
  useEffect(() => {
    if (editingId) {
      // Small delay to ensure the table has rendered
      setTimeout(() => {
        // Find all rows and apply border to the one that matches editingId
        const tableRows = document.querySelectorAll('table tr');
        tableRows.forEach(element => {
          // Cast Element to HTMLElement to access style property
          const row = element as HTMLElement;

          // Clear previous styling from all rows first
          row.style.border = '';
          row.style.boxShadow = '';
          row.style.backgroundColor = '';

          // Look for data-piid attribute or cell content that matches editingId
          const rowContent = row.innerHTML;
          if (rowContent.includes(editingId)) {
            row.style.border = '2px solid #f3a21c';
            row.style.boxShadow = '0 0 8px rgba(243, 162, 28, 0.3)';
            row.style.backgroundColor = 'rgba(243, 162, 28, 0.05)';
          }
        });
      }, 100);
    } else {
      // If no editing ID, clear all row styles
      const tableRows = document.querySelectorAll('table tr');
      tableRows.forEach(element => {
        // Cast Element to HTMLElement
        const row = element as HTMLElement;
        row.style.border = '';
        row.style.boxShadow = '';
        row.style.backgroundColor = '';
      });
    }
  }, [editingId]);

  return (
    <AdvanceTable
      tableProps={{
        ...tableProps,
        getRowProps: (row: any) => {
          if (row.original.piId === editingId) {
            return {
              'data-piid': editingId, // Add a data attribute to identify the row
              style: {
                border: '2px solid #f3a21c', // Apply border directly as well
                backgroundColor: 'rgba(243, 162, 28, 0.05)'
              }
            };
          }
          return {};
        }
      }}
    />
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
  const [actionsColumnWidth, setActionsColumnWidth] = useState(
    window.innerWidth < 1500 ? '100%' : '30%'
  );
  const [editingPiId, setEditingPiId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Add resize listener to update the Actions column width
  useEffect(() => {
    const handleResize = () => {
      setActionsColumnWidth(window.innerWidth < 1500 ? '100%' : '40%');
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to handle edit mode
  const handleEditToggle = (piId: string) => {
    if (editingPiId && editingPiId !== piId) {
      // Show warning if trying to edit a different PI
      setWarningMessage(
        'Another PI is currently being edited. Please save or cancel that edit first.'
      );
      setShowWarning(true);
      return;
    }

    if (editingPiId === piId) {
      // Save changes and exit edit mode
      // Here you would implement the actual save logic
      console.log('Saving changes for PI:', piId);
      setEditingPiId(null);
    } else {
      // Enter edit mode
      setEditingPiId(piId);
    }
  };

  // Instead of recreating the columns array, directly modify the first column
  const columns = useMemo(() => {
    // Create a deep copy of the original columns
    const modifiedColumns = [...PiTableColumnsStatic];

    // Add the Actions column that needs editingPiId
    modifiedColumns.splice(3, 0, {
      header: 'Actions',
      id: 'actionsColumn',
      accessorKey: '1--',
      cell: ({ row: { original } }) => (
        <ActionTextArea
          piId={original.piId}
          actions={original.piActions || []}
          isEditMode={editingPiId === original.piId}
        />
      ),
      meta: {
        cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
        headerProps: {
          className: 'ps-3',
          style: {
            width: actionsColumnWidth,
            minWidth: '300px'
          }
        }
      }
    });

    // Find and replace the Bank column
    const bankColumnIndex = modifiedColumns.findIndex(col => {
      if ('accessorKey' in col) {
        return col.accessorKey === '6---';
      }
      return false;
    });

    if (bankColumnIndex !== -1) {
      modifiedColumns[bankColumnIndex] = {
        id: 'bank',
        accessorKey: '6---',
        header: 'Bank',
        cell: ({ row: { original } }) => {
          const isEditing = editingPiId === original.piId;
          const [selectedBank, setSelectedBank] = useState(
            original.bank || 'OTHER'
          );

          const bankOptions = ['OTHER', 'EK', 'FB', 'RUS', 'NUROL'];

          const handleBankChange = (
            e: React.ChangeEvent<HTMLSelectElement>
          ) => {
            const newValue = e.target.value;
            setSelectedBank(newValue);
            original.bank = newValue;
          };

          if (isEditing) {
            return (
              <Form.Select
                size="sm"
                value={selectedBank}
                onChange={handleBankChange}
                style={{ minWidth: '100px' }}
              >
                {bankOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            );
          }

          return (
            <div
              style={{
                padding: '0.25rem 0.5rem',
                minWidth: '100px',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem',
                background: '#f8f9fa',
                minHeight: '31px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {original.bank || 'OTHER'}
            </div>
          );
        },
        meta: {
          cellProps: {
            className: 'ps-3 fs-9 text-body white-space-nowrap py-2'
          },
          headerProps: { style: { width: '10%' }, className: 'ps-3' }
        }
      };
    }

    // Replace the first column (Buttons/actions column)
    modifiedColumns[0] = {
      id: 'actions',
      header: 'Buttons',
      cell: ({ row: { original } }) => {
        const [showFileUploadModal, setShowFileUploadModal] = useState(false);
        const isEditing = editingPiId === original.piId;

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

            {/* Edit/Save Button */}
            <Button
              variant={isEditing ? 'outline-success' : 'outline-info'}
              size="sm"
              title={isEditing ? 'Save Changes' : 'Edit PI'}
              className="d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              onClick={() => handleEditToggle(original.piId)}
            >
              <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
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
    };

    return modifiedColumns;
  }, [actionsColumnWidth, editingPiId]);

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
      {/* Warning Toast */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1050 }}
      >
        <Toast
          show={showWarning}
          onClose={() => setShowWarning(false)}
          delay={3000}
          autohide
          bg="warning"
        >
          <Toast.Header>
            <strong className="me-auto">Warning</strong>
          </Toast.Header>
          <Toast.Body>{warningMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

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
          <PiListTableContext.Provider
            value={{ editingPiId, handleEditToggle }}
          >
            <div style={{ width: '100%', overflow: 'auto' }}>
              <div style={{ width: '160%' }}>
                <EditableAdvanceTable
                  tableProps={{
                    className:
                      'phoenix-table border-top border-translucent fs-9',
                    data: data,
                    columns: columns
                  }}
                  editingId={editingPiId}
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
          </PiListTableContext.Provider>
        )}
      </div>
    </div>
  );
};

export default PiListTable;
