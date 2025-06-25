import React, {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FC,
  createContext,
  useContext,
  useRef
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import {
  Col,
  Row,
  Dropdown,
  Badge,
  Button,
  Form,
  Modal,
  Nav
} from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { PiUpdateOthers } from 'smt-v1-app/types/PiTypes';
import {
  searchByPiList,
  postOpenEditMode,
  postPiUpdate,
  getAllCurrenciesFromDB,
  postCloseEditMode
} from 'smt-v1-app/services/PIServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faQuestionCircle as faQuestionCircleSolid,
  faUpload,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle as faQuestionCircleRegular } from '@fortawesome/free-regular-svg-icons';
import PIListFileUpload from 'smt-v1-app/components/features/PiList/PIListFileUpload';
import ActionTextArea from './ActionTextArea';
import { getPriceCurrencySymbol } from 'smt-v1-app/types/RFQRightSideHelper';

import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';
import { usePopper } from 'react-popper';

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

declare module 'react-bootstrap' {
  export interface DropdownProps {
    autoClose?: boolean | 'outside' | 'inside';
  }
}

const piStatus: { [key: string]: string } = {
  // TRADE Confirmation Stages (WHITE)
  PI_CREATED: 'secondary',
  PO_SENT_TO_SUPPLIER: 'secondary',
  PO_APPROVED_BY_SUPPLIER: 'secondary',
  PI_SENT_TO_CLIENT: 'secondary',
  // PAYMENT STAGES (BLUE)
  PENDING_PAYMENT_FROM_CLIENT: 'info',
  PAYMENT_TRANSFERRED_FROM_CLIENT: 'info',
  PAYMENT_RECEIVED_FROM_CLIENT_FULLY: 'info',
  PAYMENT_RECEIVED_FROM_CLIENT_PARTIALLY: 'info',
  PAYMENT_REQUEST_SENT_TO_ACCOUNTING: 'info',
  PAID_TO_SUPPLIER_FULLY: 'info',
  PAID_TO_SUPPLIER_PARTIALLY: 'info',
  PAYMENT_CONFIRMED_BY_SUPPLIER: 'info',

  // Delivery To Transit Stages (YELLOW)
  LT_PENDING_BY_SUPPLIER: 'warning',
  LOT_CREATED: 'warning',
  LOT_SENT_TO_FFs: 'warning',
  FF_ARRANGED_FOR_LOT: 'warning',
  READY_FOR_PICKUP_AT_SUPPLIER: 'warning',
  SUPPLIER_PREPARING_TO_SEND_BY_OWN_FFs: 'warning',
  SUPPLIER_CONTACT_SENT_TO_OUR_FF: 'warning',
  PICK_UP_PENDING_BY_OUR_FF: 'warning',
  PART_ON_THE_WAY_TO_TRANSIT: 'warning',
  SENT_TO_CLIENT_PARTIALLY: 'warning', // PARTIALLY_SENT_TO_CLIENT,

  // Custom Stages (LIGHT GREEN)
  OFFICIAL_INVOICE_REQUESTED_SENT_TO_ACCOUNTING: 'success',
  AWB_TO_TRANSIT_AND_INVOICES_SENT_TO_CUSTOMS_AGENT: 'success',
  PART_IN_TURKEY: 'success', // IN_TURKEY,
  CUSTOMS_PROCEDURE_STARTED: 'success',
  AWB_TO_DESTINATION_SENT_TO_CLIENT_FOR_APPROVAL: 'success',
  AWB_APPROVED_BY_CLIENT: 'success',
  ORDER_ON_THE_WAY_TO_DESTINATION: 'success',

  // Delivery to Client Stages (DARK GREEN)
  FINAL_AWB_AND_OFFICIAL_INVOICE_SENT_TO_CLIENT: 'success',
  SENT_TO_CLIENT_FULLY: 'success',
  DELIVERY_CONFIRMED_BY_CLIENT: 'success',
  // Cancellation and Refund Stages (RED)
  CANCELED_PO_BEFORE_PAYMENT_BY_CLIENT: 'danger', // CANCELED
  CANCELED_PO_AFTER_PAYMENT_REFUNDED_TO_CUSTOMERS_ACCOUNT: 'danger', // CLOSED,
  CANCELED_PO_AFTER_PAYMENT_REFUNDED_TO_CUSTOMERS_BALANCE: 'danger' // REFUNDED,
};

export interface PiListData {
  piId: string;
  piNumberId: string;
  revisionNo: string;
  quoteNumberId: string;
  contractNo: string;
  clientPONumber: string;
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
  customerPaymentDate?: string;
  supplierPaidDate?: string;
  ltDays?: number;
  opSupplier?: string;
  customerPayment?: number;
  piBank?: string;
  piBankType?: string;
  clientPaidDate?: string;
  clientPaidPrice?: {
    currency: string;
    price: number;
  };
  invoice?: {
    currency: string;
    price: number;
  };
  leadTimeDays?: number;
  leadTimeDeadline?: string;
  piDate?: string;
  supplierPaidPrice?: {
    currency: string;
    price: number;
  };
  opSupplierId?: string;
  supplier?: any[];
  piActions: Array<{
    piActionId: string;
    description: string;
    createdBy: string;
    createdAt: string;
  }>;
}

// Define interface for the API response from postOpenEditMode
interface EditModeResponse {
  data: {
    isAvailable: boolean;
  };
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

// Format number with thousands separator
const formatNumber = (number: string): string => {
  return number.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format currency with proper symbol and decimal places
// includeSymbol parameter controls whether to add currency symbol to avoid duplicates
const formatCurrency = (
  inputValue: string,
  currency: string,
  blur: string = '',
  includeSymbol: boolean = true
): string => {
  if (inputValue === '') return '';
  let input_val = inputValue;

  // Format the decimal part
  if (input_val.indexOf('.') >= 0) {
    const decimal_pos = input_val.indexOf('.');
    let left_side = input_val.substring(0, decimal_pos);
    let right_side = input_val.substring(decimal_pos);
    left_side = formatNumber(left_side);
    right_side = formatNumber(right_side);
    if (blur === 'blur') {
      right_side += '00';
    }
    right_side = right_side.substring(0, 2);
    input_val = includeSymbol
      ? `${getCurrencySymbol(currency)}${left_side}.${right_side}`
      : `${left_side}.${right_side}`;
  } else {
    input_val = includeSymbol
      ? `${getCurrencySymbol(currency)}${formatNumber(inputValue)}`
      : `${formatNumber(inputValue)}`;
    if (blur === 'blur') {
      input_val += '.00';
    }
  }
  return input_val;
};

// Extract numeric value from formatted currency string
const extractNumericValue = (
  formattedValue: string,
  currency: string
): number => {
  const x = formattedValue.split(getCurrencySymbol(currency));
  if (x.length > 1) {
    const inputValueArray = x[1].split(',');
    let totalinputValueString = '';
    inputValueArray.forEach(item => {
      totalinputValueString += item;
    });
    return Math.round(parseFloat(totalinputValueString) * 100) / 100;
  } else if (x.length === 1) {
    return Math.round(parseFloat(x[0]) * 100) / 100;
  }
  return 0;
};

// Function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  return getPriceCurrencySymbol(currency);
};

// Format date to dd.MM.yyyy for backend
const formatDateForBackend = (dateString: string): string => {
  if (!dateString) return '';

  // Check if already in correct format
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
    return dateString;
  }

  // Try to parse the date
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};

// Format date from dd.MM.yyyy to YYYY-MM-DD for date inputs
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';

  // Check if in dd.MM.yyyy format
  const dateParts = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (dateParts) {
    const [_, day, month, year] = dateParts;
    return `${year}-${month}-${day}`;
  }

  // Try to parse as a Date object
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date

    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch (e) {
    console.error('Error formatting date for input:', e);
    return '';
  }
};

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Create a reusable component for the read-only currency display
const ReadOnlyCurrency = ({
  price,
  currency
}: {
  price?: number;
  currency?: string;
}) => {
  if (price === undefined || currency === undefined) return <span>-</span>;

  return (
    <div
      style={{
        padding: '0.25rem 0.5rem',
        width: '110px',
        border: '1px solid #ced4da',
        borderRadius: '0.25rem',
        background: '#f8f9fa',
        minHeight: '31px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {formatCurrency(price.toString(), currency)}
    </div>
  );
};

// Create a reusable component for the currency input
interface CurrencyInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  selectedCurrency: string;
  currencies: string[];
  onCurrencyChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  loadingCurrencies: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  onBlur,
  selectedCurrency,
  currencies,
  onCurrencyChange,
  loadingCurrencies
}) => {
  return (
    <div className="d-flex">
      <div className="me-2" style={{ minWidth: '80px' }}>
        {loadingCurrencies ? (
          <Form.Select size="sm" disabled>
            <option>Loading...</option>
          </Form.Select>
        ) : (
          <Form.Select
            size="sm"
            value={selectedCurrency}
            onChange={onCurrencyChange}
          >
            {currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency} ({getCurrencySymbol(currency)})
              </option>
            ))}
          </Form.Select>
        )}
      </div>
      <Form.Control
        type="text"
        size="sm"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={e => {
          // Allow: digits, backspace, delete, tab, escape, enter, decimal point
          if (
            (e.key >= '0' && e.key <= '9') || // Allow digits
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Tab' ||
            e.key === 'Enter' ||
            e.key === 'Escape' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === '.' ||
            // Allow control combinations (copy/paste/etc)
            e.ctrlKey ||
            e.metaKey
          ) {
            return;
          }

          // Prevent all other keys
          e.preventDefault();
        }}
        onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
          e.currentTarget.blur()
        }
        placeholder={`${getCurrencySymbol(selectedCurrency)}1,000,000.00`}
        style={{ width: '120px' }}
      />
    </div>
  );
};

// Create context outside of component
const PiListTableContext = createContext<{
  editingPiId: string | null;
  handleEditToggle: (piId: string) => void;
  currencies: string[];
  loadingCurrencies: boolean;
  setShowUnsavedWarning?: (show: boolean) => void;
  setRefreshRequested?: (refresh: boolean) => void;
  setPendingAction?: (action: (() => void) | null) => void;
  refreshTableData?: () => void;
}>({
  editingPiId: null,
  handleEditToggle: () => {},
  currencies: [],
  loadingCurrencies: false
});

// Static columns without the Actions column that needs editingPiId
export const PiTableColumnsStatic: ColumnDef<PiListData>[] = [
  {
    id: 'actions',
    header: 'Buttons',
    cell: ({ row: { original } }) => {
      const [showFileUploadModal, setShowFileUploadModal] = useState(false);
      // Use the shared context
      const {
        editingPiId,
        handleEditToggle,
        setShowUnsavedWarning,
        setRefreshRequested,
        setPendingAction,
        refreshTableData
      } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;

      const handlePiDetailClick = (e: React.MouseEvent) => {
        if (editingPiId && editingPiId !== original.piId) {
          e.preventDefault();
          return;
        }
      };

      const handleCancelEdit = () => {
        if (isEditing) {
          // Show unsaved changes modal
          if (
            setShowUnsavedWarning &&
            setRefreshRequested &&
            setPendingAction
          ) {
            setShowUnsavedWarning(true);
            setRefreshRequested(false);
            setPendingAction(() => () => {
              postCloseEditMode(original.piId)
                .then(response => {
                  console.log('Edit mode closed:', response);
                  // Use the context's refreshTableData function if available
                  if (refreshTableData) {
                    refreshTableData();
                  } else if (window.location) {
                    window.location.reload();
                  }
                })
                .catch(error => {
                  console.error('Error closing edit mode:', error);
                });
            });
          }
        }
      };

      return (
        <div className="d-flex gap-2 px-2">
          <Link
            to={`/pi/detail?piId=${original.piId}`}
            style={{
              textDecoration: 'none',
              pointerEvents:
                editingPiId && editingPiId !== original.piId ? 'none' : 'auto',
              opacity: editingPiId && editingPiId !== original.piId ? 0.5 : 1
            }}
            onClick={handlePiDetailClick}
            data-editing-allowed={isEditing ? 'true' : 'false'}
          >
            <Button
              variant="outline-primary"
              size="sm"
              title="PI Detail"
              className="d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              disabled={editingPiId && editingPiId !== original.piId}
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
            onClick={() => {
              if (editingPiId && editingPiId !== original.piId) {
                return;
              }
              setShowFileUploadModal(true);
            }}
            disabled={editingPiId && editingPiId !== original.piId}
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
            disabled={editingPiId && editingPiId !== original.piId}
          >
            <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
          </Button>

          {/* Cancel Edit Button - Only show when in edit mode */}
          {isEditing && (
            <Button
              variant="outline-danger"
              size="sm"
              title="Cancel Edit"
              className="d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              onClick={handleCancelEdit}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          )}

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
      headerProps: {
        style: { width: '120px', minWidth: '120px' },
        className: 'text-center'
      }
    }
  },
  {
    id: 'piNumberId',
    accessorKey: 'piNumberId',
    header: 'PI ID',
    cell: ({ row: { original } }) => <span>{original.piNumberId}</span>,
    meta: {
      cellProps: { className: ' py-2' },
      headerProps: { style: { width: '80px', minWidth: '80px' } }
    }
  },
  {
    id: 'clientPONumber',
    accessorKey: 'clientPONumber',
    header: 'PO Ref No',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [poRefValue, setPoRefValue] = useState<string>(
        original.clientPONumber || ''
      );

      // Update the value when edit mode changes or when data changes
      useEffect(() => {
        setPoRefValue(original.clientPONumber || '');
      }, [isEditing, original.clientPONumber]);

      const handlePoRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setPoRefValue(newValue);
        original.clientPONumber = newValue;
      };

      if (isEditing) {
        return (
          <Form.Control
            type="text"
            size="sm"
            value={poRefValue}
            onChange={handlePoRefChange}
            style={{ minWidth: '120px' }}
          />
        );
      }

      return (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            width: '100px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {original.clientPONumber || '-'}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '120px', minWidth: '120px' } }
    }
  },
  {
    id: 'piStatus',
    header: 'PI Status',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;

      // Varolan değeri default olarak al
      const [selectedStatus, setSelectedStatus] = useState(
        original.piStatus || 'NONE'
      );

      // Edit moduna geçildiğinde veya original.piStatus değiştiğinde selectedStatus'u güncelle
      useEffect(() => {
        setSelectedStatus(original.piStatus || 'NONE');
      }, [original.piStatus, isEditing]);

      const statusOptions = [
        'PI_CREATED',
        'PO_SENT_TO_SUPPLIER',
        'PO_APPROVED_BY_SUPPLIER',
        'PI_SENT_TO_CLIENT',
        'PENDING_PAYMENT_FROM_CLIENT',
        'PAYMENT_TRANSFERRED_FROM_CLIENT',
        'PAYMENT_RECEIVED_FROM_CLIENT_FULLY',
        'PAYMENT_RECEIVED_FROM_CLIENT_PARTIALLY',
        'PAYMENT_REQUEST_SENT_TO_ACCOUNTING',
        'PAID_TO_SUPPLIER_FULLY',
        'PAID_TO_SUPPLIER_PARTIALLY',
        'PAYMENT_CONFIRMED_BY_SUPPLIER',
        'LT_PENDING_BY_SUPPLIER',
        'LOT_CREATED',
        'LOT_SENT_TO_FFs',
        'FF_ARRANGED_FOR_LOT',
        'READY_FOR_PICKUP_AT_SUPPLIER',
        'SUPPLIER_PREPARING_TO_SEND_BY_OWN_FFs',
        'SUPPLIER_CONTACT_SENT_TO_OUR_FF',
        'PICK_UP_PENDING_BY_OUR_FF',
        'PART_ON_THE_WAY_TO_TRANSIT',
        'OFFICIAL_INVOICE_REQUESTED_SENT_TO_ACCOUNTING',
        'AWB_TO_TRANSIT_AND_INVOICES_SENT_TO_CUSTOMS_AGENT',
        'PART_IN_TURKEY',
        'CUSTOMS_PROCEDURE_STARTED',
        'AWB_TO_DESTINATION_SENT_TO_CLIENT_FOR_APPROVAL',
        'AWB_APPROVED_BY_CLIENT',
        'ORDER_ON_THE_WAY_TO_DESTINATION',
        'FINAL_AWB_AND_OFFICIAL_INVOICE_SENT_TO_CLIENT',
        'SENT_TO_CLIENT_PARTIALLY',
        'SENT_TO_CLIENT_FULLY',
        'DELIVERY_CONFIRMED_BY_CLIENT',
        'CANCELED_PO_BEFORE_PAYMENT_BY_CLIENT',
        'CANCELED_PO_AFTER_PAYMENT_REFUNDED_TO_CUSTOMERS_ACCOUNT',
        'CANCELED_PO_AFTER_PAYMENT_REFUNDED_TO_CUSTOMERS_BALANCE'
      ];

      const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedStatus(newValue);
        original.piStatus = newValue;
      };

      if (isEditing) {
        return (
          <Form.Select
            size="sm"
            value={selectedStatus}
            onChange={handleStatusChange}
            style={{ minWidth: '150px' }}
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>
                {formatStatus(option)}
              </option>
            ))}
          </Form.Select>
        );
      }

      const status = original.piStatus;
      if (!status) return null;
      const badgeColor = piStatus[status] || 'warning';
      return <Badge bg={badgeColor}>{formatStatus(status)}</Badge>;
    },
    meta: {
      cellProps: { className: ' py-2' },
      headerProps: {
        style: { width: '150px', minWidth: '150px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'Client',
    accessorKey: 'company',
    meta: {
      cellProps: {
        className: 'ps-3 fs-9 text-body  py-2',
        style: { width: '150px', minWidth: '150px' }
      },
      headerProps: { style: { width: '150px', minWidth: '150px' } }
    }
  },
  {
    header: 'Invoice',
    accessorKey: 'invoice',
    cell: ({ row: { original } }) => (
      <ReadOnlyCurrency
        price={original.invoice?.price}
        currency={original.invoice?.currency}
      />
    ),
    meta: {
      cellProps: {
        className: 'ps-3 fs-9 text-body white-space-nowrap py-2',
        style: { width: '120px', minWidth: '120px' }
      },
      headerProps: {
        style: { width: '120px', minWidth: '120px' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: '4---',
    header: 'Customer Payment',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId, currencies, loadingCurrencies } =
        useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [paymentValue, setPaymentValue] = useState<number | undefined>(
        original.clientPaidPrice?.price
      );
      const [paymentStringValue, setPaymentStringValue] = useState<string>(
        formatCurrency(
          original.clientPaidPrice?.price?.toString() || '',
          original.clientPaidPrice?.currency || 'USD'
        )
      );
      const [selectedCurrency, setSelectedCurrency] = useState<string>(
        original.clientPaidPrice?.currency || 'USD'
      );

      // Update the selected payment value and currency when edit mode changes or when data changes
      useEffect(() => {
        setPaymentValue(original.clientPaidPrice?.price);
        setPaymentStringValue(
          formatCurrency(
            original.clientPaidPrice?.price?.toString() || '',
            original.clientPaidPrice?.currency || 'USD'
          )
        );
        setSelectedCurrency(original.clientPaidPrice?.currency || 'USD');
      }, [isEditing, original.clientPaidPrice]);

      const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Handle backspace/delete
        if (inputValue === '') {
          setPaymentStringValue('');
          if (!original.clientPaidPrice) {
            original.clientPaidPrice = { currency: selectedCurrency, price: 0 };
          }
          original.clientPaidPrice.price = 0;
          return;
        }

        // Process only digits and decimal point
        let value = inputValue.replace(/[^0-9.]/g, '');

        // Format the value
        let formattedValue = formatCurrency(value, selectedCurrency);
        setPaymentStringValue(formattedValue);

        // Extract numeric value and update the data object
        if (!original.clientPaidPrice) {
          original.clientPaidPrice = { currency: selectedCurrency, price: 0 };
        }
        original.clientPaidPrice.price = extractNumericValue(
          formattedValue,
          selectedCurrency
        );
      };

      const handlePaymentBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
          setPaymentStringValue('');
          if (!original.clientPaidPrice) {
            original.clientPaidPrice = { currency: selectedCurrency, price: 0 };
          }
          original.clientPaidPrice.price = 0;
          return;
        }

        // Process only digits and decimal point
        let value = inputValue.replace(/[^0-9.]/g, '');

        // Format with blur option to append .00 if needed
        let formattedValue = formatCurrency(value, selectedCurrency, 'blur');
        setPaymentStringValue(formattedValue);

        // Extract numeric value and update the data object
        if (!original.clientPaidPrice) {
          original.clientPaidPrice = { currency: selectedCurrency, price: 0 };
        }
        original.clientPaidPrice.price = extractNumericValue(
          formattedValue,
          selectedCurrency
        );
      };

      const handleCurrencyChange = (
        e: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);

        // Update the price object with the new currency
        if (!original.clientPaidPrice) {
          original.clientPaidPrice = {
            currency: newCurrency,
            price: 0
          };
        } else {
          original.clientPaidPrice.currency = newCurrency;
        }

        // Update the formatted display value with the new currency
        setPaymentStringValue(
          formatCurrency(
            original.clientPaidPrice.price?.toString() || '',
            newCurrency
          )
        );
      };

      if (isEditing) {
        return (
          <CurrencyInput
            value={paymentStringValue}
            onChange={handlePaymentChange}
            onBlur={handlePaymentBlur}
            selectedCurrency={selectedCurrency}
            currencies={currencies}
            onCurrencyChange={handleCurrencyChange}
            loadingCurrencies={loadingCurrencies}
          />
        );
      }

      return (
        <ReadOnlyCurrency
          price={original.clientPaidPrice?.price}
          currency={original.clientPaidPrice?.currency}
        />
      );
    },
    meta: {
      cellProps: {
        className: 'ps-3 fs-9 text-body white-space-nowrap py-2',
        style: { width: '120px', minWidth: '120px' }
      },
      headerProps: {
        style: { width: '120px', minWidth: '120px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'Supplier Invoice',
    accessorKey: '5---',
    cell: ({ row: { original } }) => {
      // Get editing state and currencies from context
      const { editingPiId, currencies, loadingCurrencies } =
        useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [invoiceValue, setInvoiceValue] = useState<number | undefined>(
        original.supplierPaidPrice?.price
      );
      const [invoiceStringValue, setInvoiceStringValue] = useState<string>(
        formatCurrency(
          original.supplierPaidPrice?.price?.toString() || '',
          original.supplierPaidPrice?.currency || 'USD'
        )
      );
      const [selectedCurrency, setSelectedCurrency] = useState<string>(
        original.supplierPaidPrice?.currency || 'USD'
      );

      // Update the selected invoice value and currency when edit mode changes or when data changes
      useEffect(() => {
        setInvoiceValue(original.supplierPaidPrice?.price);
        setInvoiceStringValue(
          formatCurrency(
            original.supplierPaidPrice?.price?.toString() || '',
            original.supplierPaidPrice?.currency || 'USD'
          )
        );
        setSelectedCurrency(original.supplierPaidPrice?.currency || 'USD');
      }, [isEditing, original.supplierPaidPrice]);

      const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Handle backspace/delete
        if (inputValue === '') {
          setInvoiceStringValue('');
          if (!original.supplierPaidPrice) {
            original.supplierPaidPrice = {
              currency: selectedCurrency,
              price: 0
            };
          }
          original.supplierPaidPrice.price = 0;
          return;
        }

        // Process only digits and decimal point
        let value = inputValue.replace(/[^0-9.]/g, '');

        // Format the value
        let formattedValue = formatCurrency(value, selectedCurrency);
        setInvoiceStringValue(formattedValue);

        // Extract numeric value and update the data object
        if (!original.supplierPaidPrice) {
          original.supplierPaidPrice = {
            currency: selectedCurrency,
            price: 0
          };
        }
        original.supplierPaidPrice.price = extractNumericValue(
          formattedValue,
          selectedCurrency
        );
      };

      const handleInvoiceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === '') {
          setInvoiceStringValue('');
          if (!original.supplierPaidPrice) {
            original.supplierPaidPrice = {
              currency: selectedCurrency,
              price: 0
            };
          }
          original.supplierPaidPrice.price = 0;
          return;
        }

        // Process only digits and decimal point
        let value = inputValue.replace(/[^0-9.]/g, '');

        // Format with blur option to append .00 if needed
        let formattedValue = formatCurrency(value, selectedCurrency, 'blur');
        setInvoiceStringValue(formattedValue);

        // Extract numeric value and update the data object
        if (!original.supplierPaidPrice) {
          original.supplierPaidPrice = {
            currency: selectedCurrency,
            price: 0
          };
        }
        original.supplierPaidPrice.price = extractNumericValue(
          formattedValue,
          selectedCurrency
        );
      };
      const handleCurrencyChange = (
        e: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);

        // Update the invoice object with the new currency
        if (!original.supplierPaidPrice) {
          original.supplierPaidPrice = {
            currency: newCurrency,
            price: 0
          };
        } else {
          original.supplierPaidPrice.currency = newCurrency;
        }

        // Update the formatted display value with the new currency
        setInvoiceStringValue(
          formatCurrency(
            original.supplierPaidPrice.price?.toString() || '',
            newCurrency
          )
        );
      };

      if (isEditing) {
        return (
          <CurrencyInput
            value={invoiceStringValue}
            onChange={handleInvoiceChange}
            onBlur={handleInvoiceBlur}
            selectedCurrency={selectedCurrency}
            currencies={currencies}
            onCurrencyChange={handleCurrencyChange}
            loadingCurrencies={loadingCurrencies}
          />
        );
      }

      return (
        <ReadOnlyCurrency
          price={original.supplierPaidPrice?.price}
          currency={original.supplierPaidPrice?.currency}
        />
      );
    },
    meta: {
      cellProps: {
        className: 'ps-3 fs-9 text-body white-space-nowrap py-2',
        style: { width: '120px', minWidth: '120px' }
      },
      headerProps: {
        style: { width: '120px', minWidth: '120px' },
        className: 'ps-3'
      }
    }
  },
  {
    id: 'bank',
    accessorKey: '6---',
    header: 'Bank',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [selectedBank, setSelectedBank] = useState(
        original.piBank || 'OTHER'
      );

      const bankOptions = ['OTHER', 'EK', 'FB', 'RUS', 'NUROL'];

      const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedBank(newValue);
        original.piBank = newValue;
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
            width: '90px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {original.piBank || 'OTHER'}
        </div>
      );
    },
    meta: {
      headerProps: { style: { width: '100px', minWidth: '100px' } }
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
        original.piBankType || 'NONE'
      );

      const bankTypeOptions = ['NONE', 'TRANSIT', 'EXPORT', 'IMPORTS'];

      const handleBankTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
      ) => {
        const newValue = e.target.value;
        setSelectedBankType(newValue);
        original.piBankType = newValue;
      };

      if (isEditing) {
        return (
          <Form.Select
            size="sm"
            value={selectedBankType}
            onChange={handleBankTypeChange}
            style={{ minWidth: '90px' }}
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
            widows: '90px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {original.piBank || 'OTHER'}
        </div>
      );
    },
    meta: {
      headerProps: { style: { width: '120px', minWidth: '120px' } }
    }
  },
  {
    accessorKey: 'poRequestedDate',
    header: 'PO Date',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '100px', minWidth: '100px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'PI Date',
    accessorKey: 'piDate',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '100px', minWidth: '100px' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: '9---',
    header: 'C. Payment Date',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [selectedDate, setSelectedDate] = useState<string>(
        original.clientPaidDate
          ? formatDateForInput(original.clientPaidDate)
          : ''
      );

      // Update the selected date when edit mode changes or when data changes
      useEffect(() => {
        setSelectedDate(
          original.clientPaidDate
            ? formatDateForInput(original.clientPaidDate)
            : ''
        );
      }, [isEditing, original.clientPaidDate]);

      const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSelectedDate(newValue);

        // Update the original data with the new date or null if empty
        original.clientPaidDate = newValue
          ? formatDateForBackend(newValue)
          : null;
      };

      if (isEditing) {
        return (
          <Form.Control
            type="date"
            size="sm"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ minWidth: '100px' }}
          />
        );
      }

      return (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            width: '100px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {original.clientPaidDate || '-'}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '120px', minWidth: '120px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'S. Paid Date',
    accessorKey: '11---',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [selectedDate, setSelectedDate] = useState<string>(
        original.supplierPaidDate
          ? formatDateForInput(original.supplierPaidDate)
          : ''
      );

      // Update the selected date when edit mode changes or when data changes
      useEffect(() => {
        setSelectedDate(
          original.supplierPaidDate
            ? formatDateForInput(original.supplierPaidDate)
            : ''
        );
      }, [isEditing, original.supplierPaidDate]);

      const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSelectedDate(newValue);

        // Update the original data with the new date or null if empty
        original.supplierPaidDate = newValue
          ? formatDateForBackend(newValue)
          : null;
      };

      if (isEditing) {
        return (
          <Form.Control
            type="date"
            size="sm"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ minWidth: '110px' }}
          />
        );
      }

      return (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            width: '100px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {original.supplierPaidDate || '-'}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '120px', minWidth: '120px' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: '22---',
    header: 'LT Days',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [leadTimeDays, setDaysValue] = useState<number | undefined>(
        original.leadTimeDays
      );

      const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.valueAsNumber;
        setDaysValue(isNaN(newValue) ? undefined : newValue);

        // Update the original data with the new value
        // Store as null instead of undefined to ensure it's included in the API request
        original.leadTimeDays = isNaN(newValue) ? null : newValue;
      };

      if (isEditing) {
        return (
          <Form.Control
            type="number"
            size="sm"
            value={leadTimeDays === undefined ? '' : leadTimeDays}
            onChange={handleDaysChange}
            min="0"
            style={{ width: '80px' }}
          />
        );
      }

      return (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            width: '60px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {original.leadTimeDays !== undefined ? original.leadTimeDays : '-'}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '80px', minWidth: '80px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'LT Deadline',
    accessorKey: 'leadTimeDeadline',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '100px', minWidth: '100px' },
        className: 'ps-3'
      }
    }
  },
  {
    accessorKey: '44---',
    header: 'OP Supplier',
    cell: ({ row: { original } }) => {
      // Get editing state from context
      const { editingPiId } = useContext(PiListTableContext);
      const isEditing = editingPiId === original.piId;
      const [supplierValue, setSupplierValue] = useState<string>(
        original.opSupplier || ''
      );

      const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSupplierValue(newValue);
        original.opSupplier = newValue;
      };

      if (isEditing) {
        return (
          <Form.Control
            type="text"
            size="sm"
            value={supplierValue}
            onChange={handleSupplierChange}
            style={{ minWidth: '150px' }}
          />
        );
      }

      return (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            width: '150px',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            background: '#f8f9fa',
            minHeight: '31px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {original.opSupplier || '-'}
        </div>
      );
    },
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: {
        style: { width: '150px', minWidth: '150px' },
        className: 'ps-3'
      }
    }
  },
  {
    header: 'Supplier',
    accessorKey: 'supplier',
    cell: ({ row: { original } }) => {
      if (
        !original.supplier ||
        !Array.isArray(original.supplier) ||
        original.supplier.length < 1
      ) {
        return '-';
      }

      const parts = original.supplier;
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

// Export an alias for backward compatibility with other files
export const PiTableColumns = PiTableColumnsStatic;

type SearchColumn = {
  label: string;
  value:
    | 'all'
    | 'piId'
    | 'quoteID'
    | 'contractNo'
    | 'company'
    | 'partNumber'
    | 'partName';
};

const searchColumns: SearchColumn[] = [
  // { label: 'No Filter', value: 'all' },
  { label: 'PI ID', value: 'piId' },
  { label: 'Quote ID', value: 'quoteID' },
  { label: 'Contract No', value: 'contractNo' },
  { label: 'Company', value: 'company' },
  { label: 'Part Number', value: 'partNumber' },
  { label: 'Part Name', value: 'partName' }
];

interface QuoteListTableProps {
  activeView: string;
}

// Add this function before the EditableAdvanceTable component
const getStatusBackgroundColor = (status: string): string => {
  switch (status) {
    case 'PI_CREATED':
    case 'PO_SENT_TO_SUPPLIER':
    case 'PO_APPROVED_BY_SUPPLIER':
    case 'PI_SENT_TO_CLIENT':
      return 'rgba(255, 255, 255, 1)';
    case 'PENDING_PAYMENT_FROM_CLIENT':
    case 'PAYMENT_TRANSFERRED_FROM_CLIENT':
    case 'PAYMENT_RECEIVED_FROM_CLIENT_FULLY':
    case 'PAYMENT_RECEIVED_FROM_CLIENT_PARTIALLY':
    case 'PAYMENT_REQUEST_SENT_TO_ACCOUNTING':
    case 'PAID_TO_SUPPLIER_FULLY':
    case 'PAID_TO_SUPPLIER_PARTIALLY':
    case 'PAYMENT_CONFIRMED_BY_SUPPLIER':
      return 'rgba(0,151,235, 0.3)';
    case 'LT_PENDING_BY_SUPPLIER':
    case 'LOT_CREATED':
    case 'LOT_SENT_TO_FFs':
    case 'FF_ARRANGED_FOR_LOT':
    case 'READY_FOR_PICKUP_AT_SUPPLIER':
    case 'SUPPLIER_PREPARING_TO_SEND_BY_OWN_FFs':
    case 'SUPPLIER_CONTACT_SENT_TO_OUR_FF':
    case 'PICK_UP_PENDING_BY_OUR_FF':
    case 'PART_ON_THE_WAY_TO_TRANSIT':
    case 'SENT_TO_CLIENT_PARTIALLY':
      return 'rgba(229,120,11, 0.3)';
    case 'OFFICIAL_INVOICE_REQUESTED_SENT_TO_ACCOUNTING':
    case 'AWB_TO_TRANSIT_AND_INVOICES_SENT_TO_CUSTOMS_AGENT':
    case 'PART_IN_TURKEY':
    case 'CUSTOMS_PROCEDURE_STARTED':
    case 'AWB_TO_DESTINATION_SENT_TO_CLIENT_FOR_APPROVAL':
    case 'AWB_APPROVED_BY_CLIENT':
    case 'ORDER_ON_THE_WAY_TO_DESTINATION':
      return 'rgba(45, 219, 2, 0.3)';
    case 'FINAL_AWB_AND_OFFICIAL_INVOICE_SENT_TO_CLIENT':
    case 'SENT_TO_CLIENT_FULLY':
    case 'DELIVERY_CONFIRMED_BY_CLIENT':
      return 'rgba(68, 218, 31, 0.64)';
    case 'CANCELED_PO_BEFORE_PAYMENT_BY_CLIENT':
    case 'CANCELED_PO_AFTER_PAYMENT_REFUNDED_TO_CUSTOMERS_ACCOUNT':
    case 'CANCELED_PO_AFTER_PAYMENT_REFUNDED_TO_CUSTOMERS_BALANCE':
      return 'rgba(236,31,0, 0.3)';
    default:
      return '';
  }
};

// Modify the EditableAdvanceTable component
const EditableAdvanceTable = ({
  tableProps,
  editingId,
  errorId
}: {
  tableProps: any;
  editingId: string | null;
  errorId: string | null;
}) => {
  return (
    <AdvanceTable
      tableProps={{
        ...tableProps,
        className: 'phoenix-table border-top border-translucent fs-9'
      }}
      getRowProps={(row: any) => {
        // Önce edit ve error durumu kontrolü
        if (row.original.piId === editingId) {
          const isError = errorId && errorId === editingId;
          return {
            'data-piid': editingId,
            style: {
              border: isError ? '2px solid #dc3545' : '2px solid #f3a21c',
              backgroundColor: isError
                ? 'rgba(220, 53, 69, 0.05)'
                : 'rgba(243, 162, 28, 0.05)',
              boxShadow: isError
                ? '0 0 8px rgba(220, 53, 69, 0.3)'
                : '0 0 8px rgba(255, 157, 0, 0.3)'
            }
          };
        }
        // Statüye göre background
        return {
          style: {
            backgroundColor: getStatusBackgroundColor(row.original.piStatus)
          }
        };
      }}
    />
  );
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

const PiListTable: FC<QuoteListTableProps> = ({ activeView }) => {
  const [data, setData] = useState<PiListData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number | 'all'>('all');
  const [editingPiId, setEditingPiId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);
  const [filterOption, setFilterOption] = useState<
    'all' | 'active' | 'my-issues'
  >('all');
  const [dropdownOption, setDropdownOption] = useState<string>('All Statuses');
  const [dropdownBackendValue, setDropdownBackendValue] = useState<string>('');

  const tabOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'My Issues', value: 'MY_ISSUES' },
    { label: 'Trade Confirmation', value: 'TRADE' },
    { label: 'Payment', value: 'PAYMENT' },
    { label: 'Delivery to Transit', value: 'DELIVERY_TO_TRANSIT' },
    { label: 'Custom', value: 'CUSTOM_STAGES' },
    { label: 'Delivery to Client', value: 'DELIVERY_TO_CLIENT' },
    {
      label: 'Cancellation and Refund',
      value: 'CANCELLATION_AND_REFUND_STAGES'
    }
  ];

  const [selectedTab, setSelectedTab] = useState('ALL');

  // Status options for dropdown (must be inside the component)

  // Add resize listener to update the Actions column width
  // useEffect(() => {
  //   const handleResize = () => {
  //     setActionsColumnWidth(window.innerWidth < 2500 ? '80%' : '40%');
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // Function to handle edit mode
  const handleEditToggle = (piId: string) => {
    // Store current scroll position
    const scrollPosition = window.scrollY;

    // Reset states when starting to edit
    if (!editingPiId) {
      setSaveError(null);
      setSaveSuccess(false);
    }

    if (editingPiId && editingPiId !== piId) {
      // Show warning if trying to edit a different PI
      setWarningMessage(
        'Another PI is currently being edited. Please save or cancel that edit first.'
      );
      setShowWarning(true);
      return;
    }

    if (editingPiId === piId) {
      saveChanges(piId);
    } else {
      setLoading(true);
      // Fetch currencies when entering edit mode
      fetchCurrencies();
      postOpenEditMode(piId)
        .then((response: any) => {
          console.log('Edit mode response:', response);
          if (response && response.data && response.data.isAvailable === true) {
            setEditingPiId(piId);
            // Restore scroll position after state update
            setTimeout(() => {
              window.scrollTo(0, scrollPosition);
            }, 0);
          } else {
            setWarningMessage(
              response && response.data && response.data.message
                ? response.data.message + ' Please try again later.'
                : 'This PI is currently being edited by another user. Please try again later.'
            );
            setShowWarning(true);
          }
        })
        .catch(error => {
          console.error('Error checking edit status:', error);
          setWarningMessage(
            'Unable to enter edit mode. Please try again later.'
          );
          setShowWarning(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // Function to fetch currencies from the backend
  const fetchCurrencies = async () => {
    setLoadingCurrencies(true);
    try {
      const response = await getAllCurrenciesFromDB();
      if (response && response.data) {
        setCurrencies(response.data);
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoadingCurrencies(false);
    }
  };

  // Function to save changes
  const saveChanges = (piId: string) => {
    // Store current scroll position
    const scrollPosition = window.scrollY;

    // Reset save status
    setSaveError(null);
    setSaveSuccess(false);

    // Find the PI in the data
    const pi = data.find(item => item.piId === piId);
    if (!pi) {
      setWarningMessage('Cannot find PI data to save.');
      setShowWarning(true);
      return;
    }
    const validBanks = ['OTHER', 'EK', 'FB', 'RUS', 'NUROL'] as const;
    let piBank: 'OTHER' | 'EK' | 'FB' | 'RUS' | 'NUROL' = 'OTHER';
    if (pi.piBank && validBanks.includes(pi.piBank as any)) {
      piBank = pi.piBank as 'OTHER' | 'EK' | 'FB' | 'RUS' | 'NUROL';
    }
    const validBankTypes = ['NONE', 'TRANSIT', 'EXPORT', 'IMPORTS'] as const;
    let piBankType: 'NONE' | 'TRANSIT' | 'EXPORT' | 'IMPORTS' = 'NONE';
    if (pi.piBankType && validBankTypes.includes(pi.piBankType as any)) {
      piBankType = pi.piBankType as 'NONE' | 'TRANSIT' | 'EXPORT' | 'IMPORTS';
    }

    // Format dates to dd.MM.yyyy only if they have values, otherwise send null
    const clientPaidDate = pi.clientPaidDate
      ? formatDateForBackend(pi.clientPaidDate)
      : null;
    const supplierPaidDate = pi.supplierPaidDate
      ? formatDateForBackend(pi.supplierPaidDate)
      : null;

    // Ensure leadTimeDays is properly included even if it's null
    // The API expects a number, so convert null/undefined to 0
    const leadTimeDays =
      pi.leadTimeDays !== null && pi.leadTimeDays !== undefined
        ? pi.leadTimeDays
        : 0;

    const updateData: PiUpdateOthers = {
      piId: pi.piId,
      piStatus: pi.piStatus,
      piBank: piBank,
      piBankType: piBankType,
      clientPaidPrice: pi.clientPaidPrice || { currency: 'USD', price: 0 },
      clientPaidDate: clientPaidDate,
      supplierPaidPrice: pi.supplierPaidPrice || { currency: 'USD', price: 0 },
      supplierPaidDate: supplierPaidDate,
      leadTimeDays: leadTimeDays,
      opSupplierId: pi.opSupplierId || '',
      clientPONumber: pi.clientPONumber || ''
    };

    setIsSaving(true);

    console.log('Sending data to server:', updateData);

    // Call the API to save changes
    postPiUpdate(updateData)
      .then(response => {
        console.log('Save response:', response);
        // Check if the response indicates success
        if (response && response.success === true) {
          // Successfully saved
          setEditingPiId(null); // Exit edit mode
          // Show success message
          setWarningMessage('Changes saved successfully.');
          setShowWarning(true);
          setSaveSuccess(true);

          // Refresh table data instead of updating locally
          const effectivePageIndex = pageSize === 'all' ? 0 : pageIndex;
          const effectiveTerm = searchTerm.trim();
          const searchParam = effectiveTerm
            ? `${selectedColumn.value}=${effectiveTerm}`
            : '';
          fetchData(effectivePageIndex, searchParam);

          // Restore scroll position after state updates
          setTimeout(() => {
            window.scrollTo(0, scrollPosition);
          }, 0);
        } else {
          // Save failed
          const errorMessage =
            response && response.message
              ? response.message
              : 'Failed to save changes. Please try again.';

          setWarningMessage(errorMessage);
          setShowWarning(true);
          setSaveError(errorMessage);
          // Keep edit mode open
        }
      })
      .catch(error => {
        console.error('Error saving changes:', error);
        setWarningMessage('Error saving changes. Please try again.');
        setShowWarning(true);
        setSaveError('Error saving changes. Please try again.');
        // Keep edit mode open
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // Add a new helper function to refresh table data
  const refreshTableData = () => {
    const effectivePageIndex = pageSize === 'all' ? 0 : pageIndex;
    const effectiveTerm = searchTerm.trim();
    const searchParam = effectiveTerm
      ? `${selectedColumn.value}=${effectiveTerm}`
      : '';
    fetchData(effectivePageIndex, searchParam);
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
        cellProps: { className: 'ps-3 fs-9 text-body  py-2' },
        headerProps: {
          className: 'ps-3',
          style: {
            width: '300px'
            // minWidth: '300px'
          }
        }
      }
    });

    // Find and modify the Customer Payment column
    const customerPaymentColumnIndex = modifiedColumns.findIndex(col => {
      if ('accessorKey' in col) {
        return col.accessorKey === '4---';
      }
      return false;
    });

    if (customerPaymentColumnIndex !== -1) {
      modifiedColumns[customerPaymentColumnIndex] = {
        accessorKey: '4---',
        header: 'Customer Payment',
        cell: ({ row: { original } }) => {
          // Get editing state from context
          const { editingPiId, currencies, loadingCurrencies } =
            useContext(PiListTableContext);
          const isEditing = editingPiId === original.piId;
          const [paymentValue, setPaymentValue] = useState<number | undefined>(
            original.clientPaidPrice?.price
          );
          const [paymentStringValue, setPaymentStringValue] = useState<string>(
            formatCurrency(
              original.clientPaidPrice?.price?.toString() || '',
              original.clientPaidPrice?.currency || 'USD'
            )
          );
          const [selectedCurrency, setSelectedCurrency] = useState<string>(
            original.clientPaidPrice?.currency || 'USD'
          );

          // Update the selected payment value and currency when edit mode changes or when data changes
          useEffect(() => {
            setPaymentValue(original.clientPaidPrice?.price);
            setPaymentStringValue(
              formatCurrency(
                original.clientPaidPrice?.price?.toString() || '',
                original.clientPaidPrice?.currency || 'USD'
              )
            );
            setSelectedCurrency(original.clientPaidPrice?.currency || 'USD');
          }, [isEditing, original.clientPaidPrice]);

          const handlePaymentChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const inputValue = e.target.value;

            // Handle backspace/delete
            if (inputValue === '') {
              setPaymentStringValue('');
              if (!original.clientPaidPrice) {
                original.clientPaidPrice = {
                  currency: selectedCurrency,
                  price: 0
                };
              }
              original.clientPaidPrice.price = 0;
              return;
            }

            // Process only digits and decimal point
            let value = inputValue.replace(/[^0-9.]/g, '');

            // Format the value
            let formattedValue = formatCurrency(value, selectedCurrency);
            setPaymentStringValue(formattedValue);

            // Extract numeric value and update the data object
            if (!original.clientPaidPrice) {
              original.clientPaidPrice = {
                currency: selectedCurrency,
                price: 0
              };
            }
            original.clientPaidPrice.price = extractNumericValue(
              formattedValue,
              selectedCurrency
            );
          };

          const handlePaymentBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            if (inputValue === '') {
              setPaymentStringValue('');
              if (!original.clientPaidPrice) {
                original.clientPaidPrice = {
                  currency: selectedCurrency,
                  price: 0
                };
              }
              original.clientPaidPrice.price = 0;
              return;
            }

            // Process only digits and decimal point
            let value = inputValue.replace(/[^0-9.]/g, '');

            // Format with blur option to append .00 if needed
            let formattedValue = formatCurrency(
              value,
              selectedCurrency,
              'blur'
            );
            setPaymentStringValue(formattedValue);

            // Extract numeric value and update the data object
            if (!original.clientPaidPrice) {
              original.clientPaidPrice = {
                currency: selectedCurrency,
                price: 0
              };
            }
            original.clientPaidPrice.price = extractNumericValue(
              formattedValue,
              selectedCurrency
            );
          };

          const handleCurrencyChange = (
            e: React.ChangeEvent<HTMLSelectElement>
          ) => {
            const newCurrency = e.target.value;
            setSelectedCurrency(newCurrency);

            // Update the price object with the new currency
            if (!original.clientPaidPrice) {
              original.clientPaidPrice = {
                currency: newCurrency,
                price: 0
              };
            } else {
              original.clientPaidPrice.currency = newCurrency;
            }

            // Update the formatted display value with the new currency
            setPaymentStringValue(
              formatCurrency(
                original.clientPaidPrice.price?.toString() || '',
                newCurrency
              )
            );
          };

          if (isEditing) {
            return (
              <CurrencyInput
                value={paymentStringValue}
                onChange={handlePaymentChange}
                onBlur={handlePaymentBlur}
                selectedCurrency={selectedCurrency}
                currencies={currencies}
                onCurrencyChange={handleCurrencyChange}
                loadingCurrencies={loadingCurrencies}
              />
            );
          }

          return (
            <ReadOnlyCurrency
              price={original.clientPaidPrice?.price}
              currency={original.clientPaidPrice?.currency}
            />
          );
        },
        meta: {
          cellProps: {
            className: 'ps-3 fs-9 text-body white-space-nowrap py-2'
          },
          headerProps: {
            style: { width: '130px', minWidth: '130px' },
            className: 'ps-3'
          }
        }
      };
    }

    // Find and modify the Supplier Invoice column
    const supplierInvoiceColumnIndex = modifiedColumns.findIndex(col => {
      if ('accessorKey' in col) {
        return col.accessorKey === '5---';
      }
      return false;
    });

    if (supplierInvoiceColumnIndex !== -1) {
      modifiedColumns[supplierInvoiceColumnIndex] = {
        header: 'Supplier Invoice',
        accessorKey: '5---',
        cell: ({ row: { original } }) => {
          // Get editing state and currencies from context
          const { editingPiId, currencies, loadingCurrencies } =
            useContext(PiListTableContext);
          const isEditing = editingPiId === original.piId;
          const [invoiceValue, setInvoiceValue] = useState<number | undefined>(
            original.supplierPaidPrice?.price
          );
          const [invoiceStringValue, setInvoiceStringValue] = useState<string>(
            formatCurrency(
              original.supplierPaidPrice?.price?.toString() || '',
              original.supplierPaidPrice?.currency || 'USD'
            )
          );
          const [selectedCurrency, setSelectedCurrency] = useState<string>(
            original.supplierPaidPrice?.currency || 'USD'
          );

          // Update the selected invoice value and currency when edit mode changes or when data changes
          useEffect(() => {
            setInvoiceValue(original.supplierPaidPrice?.price);
            setInvoiceStringValue(
              formatCurrency(
                original.supplierPaidPrice?.price?.toString() || '',
                original.supplierPaidPrice?.currency || 'USD'
              )
            );
            setSelectedCurrency(original.supplierPaidPrice?.currency || 'USD');
          }, [isEditing, original.supplierPaidPrice]);

          const handleInvoiceChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const inputValue = e.target.value;

            // Handle backspace/delete
            if (inputValue === '') {
              setInvoiceStringValue('');
              if (!original.supplierPaidPrice) {
                original.supplierPaidPrice = {
                  currency: selectedCurrency,
                  price: 0
                };
              }
              original.supplierPaidPrice.price = 0;
              return;
            }

            // Process only digits and decimal point
            let value = inputValue.replace(/[^0-9.]/g, '');

            // Format the value
            let formattedValue = formatCurrency(value, selectedCurrency);
            setInvoiceStringValue(formattedValue);

            // Extract numeric value and update the data object
            if (!original.supplierPaidPrice) {
              original.supplierPaidPrice = {
                currency: selectedCurrency,
                price: 0
              };
            }
            original.supplierPaidPrice.price = extractNumericValue(
              formattedValue,
              selectedCurrency
            );
          };

          const handleInvoiceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            if (inputValue === '') {
              setInvoiceStringValue('');
              if (!original.supplierPaidPrice) {
                original.supplierPaidPrice = {
                  currency: selectedCurrency,
                  price: 0
                };
              }
              original.supplierPaidPrice.price = 0;
              return;
            }

            // Process only digits and decimal point
            let value = inputValue.replace(/[^0-9.]/g, '');

            // Format with blur option to append .00 if needed
            let formattedValue = formatCurrency(
              value,
              selectedCurrency,
              'blur'
            );
            setInvoiceStringValue(formattedValue);

            // Extract numeric value and update the data object
            if (!original.supplierPaidPrice) {
              original.supplierPaidPrice = {
                currency: selectedCurrency,
                price: 0
              };
            }
            original.supplierPaidPrice.price = extractNumericValue(
              formattedValue,
              selectedCurrency
            );
          };
          const handleCurrencyChange = (
            e: React.ChangeEvent<HTMLSelectElement>
          ) => {
            const newCurrency = e.target.value;
            setSelectedCurrency(newCurrency);

            // Update the invoice object with the new currency
            if (!original.supplierPaidPrice) {
              original.supplierPaidPrice = {
                currency: newCurrency,
                price: 0
              };
            } else {
              original.supplierPaidPrice.currency = newCurrency;
            }

            // Update the formatted display value with the new currency
            setInvoiceStringValue(
              formatCurrency(
                original.supplierPaidPrice.price?.toString() || '',
                newCurrency
              )
            );
          };

          if (isEditing) {
            return (
              <CurrencyInput
                value={invoiceStringValue}
                onChange={handleInvoiceChange}
                onBlur={handleInvoiceBlur}
                selectedCurrency={selectedCurrency}
                currencies={currencies}
                onCurrencyChange={handleCurrencyChange}
                loadingCurrencies={loadingCurrencies}
              />
            );
          }

          return (
            <ReadOnlyCurrency
              price={original.supplierPaidPrice?.price}
              currency={original.supplierPaidPrice?.currency}
            />
          );
        },
        meta: {
          cellProps: {
            className: 'ps-3 fs-9 text-body white-space-nowrap py-2'
          },
          headerProps: {
            style: {
              width: '130px',
              minWidth: '130px',
              justifyContent: 'center'
            },
            className: 'ps-3'
          }
        }
      };
    }

    // ... existing column modifications ...

    return modifiedColumns;
  }, [
    // actionsColumnWidth,
    editingPiId,
    isSaving,
    currencies,
    loadingCurrencies
  ]);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<PiListData>();
  const navigate = useNavigate();

  const fetchData = async (currentPage: number, searchParam: string = '') => {
    setLoading(true);
    try {
      const piStatusToSend = dropdownBackendValue || '';
      const response = await searchByPiList(
        searchParam,
        piStatusToSend,
        currentPage + 1,
        pageSize
      );
      if (
        response?.statusCode === 451 ||
        (response?.data === 'Error' && response?.statusCode === 451)
      ) {
        console.log(
          'CompanyListTable - 451 detected, navigating to error page'
        );
        navigate('/451');
        return;
      }
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
  }, [pageIndex, pageSize, filterOption, dropdownOption]);

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

  // Add new states for unsaved changes handling
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [refreshRequested, setRefreshRequested] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Add this effect after your other useEffect hooks
  useEffect(() => {
    if (!editingPiId) return;

    // Handle navigation attempts
    const handleNavigation = (event: PopStateEvent | BeforeUnloadEvent) => {
      if (editingPiId) {
        // For PopStateEvent (browser back/forward)
        if (event.type === 'popstate') {
          event.preventDefault();
          setShowUnsavedWarning(true);
          // Push the current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
        // For BeforeUnloadEvent (page refresh/close)
        else {
          event.preventDefault();
          event.returnValue = '';
        }
      }
    };

    // Handle clicks on any link or button
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      const button = target.closest('button');

      if (
        (link || button) &&
        !target.closest('[data-editing-allowed="true"]')
      ) {
        const href = link?.getAttribute('href');
        const isNavbarLink = target.closest('.navbar') !== null;
        const isInternalLink = href?.startsWith('/') || href?.startsWith('#');

        if (isNavbarLink || isInternalLink) {
          e.preventDefault();
          e.stopPropagation();
          setShowUnsavedWarning(true);
          setPendingAction(() => () => {
            if (href) window.location.href = href;
          });
        }
      }
    };

    // Handle F5 and browser refresh
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        setRefreshRequested(true);
        setPendingAction(() => () => window.location.reload());
        setShowUnsavedWarning(true);
      }
    };

    // Push initial state to enable popstate handling
    window.history.pushState(null, '', window.location.href);

    // Add event listeners
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('beforeunload', handleNavigation);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('beforeunload', handleNavigation);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingPiId]);

  // Execute pending action after confirmation
  const executePendingAction = () => {
    setShowUnsavedWarning(false);
    setRefreshRequested(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // Update the UnsavedChangesModal component
  const UnsavedChangesModal = () => (
    <Modal
      show={showUnsavedWarning}
      onHide={() => setShowUnsavedWarning(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {refreshRequested ? 'Page Refresh' : 'Unsaved Changes'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You have unsaved changes. If you continue, these changes will be lost.
        Would you like to continue without saving?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setRefreshRequested(false);
            setShowUnsavedWarning(false);
            // Reset any pending actions
            setPendingAction(null);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={async () => {
            if (editingPiId) {
              await saveChanges(editingPiId);
              setShowUnsavedWarning(false);
              if (pendingAction) {
                pendingAction();
              }
            }
          }}
        >
          Save Changes
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            if (editingPiId) {
              postCloseEditMode(editingPiId)
                .then(() => {
                  setEditingPiId(null);
                  refreshTableData(); // Refresh table data
                  executePendingAction();
                })
                .catch(error => {
                  console.error('Error closing edit mode:', error);
                })
                .finally(() => {
                  setShowUnsavedWarning(false);
                });
            }
          }}
        >
          Exit Without Saving
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="position-relative">
      {/* Add Unsaved Changes Modal */}
      <UnsavedChangesModal />

      {/* Add overlay when editing */}
      {editingPiId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            pointerEvents: 'none'
          }}
        />
      )}

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
          bg={saveSuccess ? 'success' : saveError ? 'danger' : 'warning'}
          className="text-white"
        >
          <Toast.Header>
            <strong className="me-auto text-white">
              {saveSuccess ? 'Success' : saveError ? 'Error' : 'Warning'}
            </strong>
          </Toast.Header>
          <Toast.Body>{warningMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="">
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
        {/* Yeni: Filtre butonları ve dropdown */}
        <Row className="g-2 mt-2 align-items-center">
          <Nav variant="underline" className=" d-flex align-items-center">
            {tabOptions.map((tab, index) => (
              <React.Fragment key={tab.value}>
                <Nav.Item>
                  <Nav.Link
                    eventKey={tab.value}
                    active={selectedTab === tab.value}
                    onClick={() => {
                      setSelectedTab(tab.value);
                      setDropdownOption(tab.label);
                      setDropdownBackendValue(tab.value);
                    }}
                    className="tab-link-text-size"
                    style={{ cursor: 'pointer' }}
                  >
                    {tab.label}
                  </Nav.Link>
                </Nav.Item>
                {index === 2 && (
                  <>
                    <div className="vr mx-2" style={{ height: '40px' }} />
                    <span className=" me-2 align-self-center">Stages:</span>
                  </>
                )}
              </React.Fragment>
            ))}
          </Nav>
        </Row>
      </div>

      <div className="border-bottom border-translucent">
        {loading ? (
          <div>
            <LoadingAnimation />
          </div>
        ) : isSaving ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Saving changes...</span>
            </div>
            <div className="mt-2">Saving changes...</div>
          </div>
        ) : (
          <PiListTableContext.Provider
            value={{
              editingPiId,
              handleEditToggle,
              currencies,
              loadingCurrencies,
              setShowUnsavedWarning,
              setRefreshRequested,
              setPendingAction,
              refreshTableData
            }}
          >
            <div style={{ width: '100%', overflow: 'auto' }}>
              <div style={{ minWidth: '2000px' }}>
                <EditableAdvanceTable
                  tableProps={{
                    className:
                      'phoenix-table border-top border-translucent fs-9',
                    data: data,
                    columns: columns
                  }}
                  editingId={editingPiId}
                  errorId={saveError ? editingPiId : null}
                />
              </div>
            </div>
            <AdvanceTableFooter
              pagination
              className="py-1"
              totalItems={totalItems}
              pageIndex={pageIndex}
              setPageIndex={setPageIndex}
              pageSize={pageSize === 'all' ? totalItems : pageSize}
              setPageSize={setPageSize}
            />
          </PiListTableContext.Provider>
        )}
      </div>
    </div>
  );
};

export default PiListTable;
