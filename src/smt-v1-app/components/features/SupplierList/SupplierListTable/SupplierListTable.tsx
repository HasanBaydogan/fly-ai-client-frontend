import React, {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FC,
  useRef
} from 'react';

import { ColumnDef } from '@tanstack/react-table';
// import AdvanceTable from '../AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import Badge from 'components/base/Badge';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { Col, Row, Dropdown, Modal, Button, Form } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import {
  searchBySupplierList,
  deleteSupplier,
  getAllSupplier,
  transformToSupplier
} from 'smt-v1-app/services/SupplierServices';
import { SupplierData2 } from 'smt-v1-app/types/SupplierTypes';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { faQuestionCircle as faQuestionCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { usePopper } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTable';
import SupplierActions from './SupplierActions';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';

/* ***********************
   TABLO KOLON TANIMLAMALARI
   *********************** */
const getProjectListTableColumns = (
  handleTransferClick: (id: string, companyName: string) => void,
  handleDeleteClick: (id: string) => void
): ColumnDef<SupplierData2>[] => [
  {
    accessorKey: 'companyName',
    header: 'Supplier Company',

    cell: ({ row }) => (
      <a href={`/supplier/edit?supplierId=${row.original.id}`}>
        {row.original.companyName}
      </a>
    ),
    meta: {
      cellProps: { className: 'text-start ' },
      headerProps: { style: { width: 150 }, className: 'text-start' }
    }
  },
  {
    accessorKey: 'segments',
    header: 'Segments',
    // cell: ({ row: { original } }) => (
    //   <div>{original.segments?.map(seg => seg.segmentName).join(', ')}</div>
    // ),
    cell: ({ row: { original } }) => {
      if (
        !original.segments?.map(seg => seg.segmentName) ||
        !Array.isArray(original.segments?.map(seg => seg.segmentName)) ||
        original.segments?.map(seg => seg.segmentName).length < 1
      ) {
        return '-';
      }

      const parts = original.segments?.map(seg => seg.segmentName);
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
    accessorKey: 'brands',
    header: 'Brand',
    cell: ({ row: { original } }) => {
      if (
        !original.brands ||
        !Array.isArray(original.brands) ||
        original.brands.length < 1
      ) {
        return '-';
      }

      const parts = original.brands;
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
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'country',
    header: 'Legal Country',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'address',
    header: 'Pickup Address',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'mail',
    header: 'E-Mails',
    cell: ({ row: { original } }) => original.mail || original.mail,
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: 100 }, className: 'ps-3' }
    }
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: ({ status }) => status?.label || '',
    cell: ({ row: { original } }) => {
      const { status } = original;
      if (!status) return null;

      // Statüye göre renk belirle
      let badgeBg: 'success' | 'warning' | 'danger' = 'warning';
      if (status.label?.toLowerCase() === 'contacted') badgeBg = 'success';
      else if (status.label?.toLowerCase() === 'not_contacted')
        badgeBg = 'warning';
      else if (status.label?.toLowerCase() === 'black_listed')
        badgeBg = 'danger';

      return (
        <Badge variant="phoenix" bg={badgeBg}>
          {status.label || ''}
        </Badge>
      );
    },
    meta: {
      cellProps: { className: 'ps-8 py-2' },
      headerProps: { style: { width: 100 }, className: 'ps-8' }
    }
  },
  {
    accessorKey: 'workingDetails',
    header: 'Working Details',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'telephone',
    header: 'Telephone',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  // {
  //   accessorKey: 'certificateType',
  //   header: 'Certificates',
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
        'Created At': original.createdOn || '-',
        'Last Modified By': original.lastModifiedBy || '-',
        'Last Modified At': original.lastModifiedOn || '-'
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
      headerProps: { style: { width: '10%' }, className: 'text-center' },
      cellProps: { className: 'text-end' }
    }
  },
  {
    id: 'action',
    header: 'Actions',
    cell: ({ row: { original } }) => (
      <div className="text-end">
        <button
          type="button"
          className="btn btn-link text-primary p-0 me-2"
          style={{ fontSize: '1rem' }}
          onClick={() => handleTransferClick(original.id, original.companyName)}
          title="Transfer"
        >
          ⇄
        </button>
        <button
          type="button"
          className="btn btn-link text-danger p-0"
          style={{ fontSize: '1.2rem' }}
          onClick={() => handleDeleteClick(original.id)}
          title="Delete"
        >
          ×
        </button>
      </div>
    ),
    meta: {
      headerProps: { style: { width: 50 }, className: 'text-end' },
      cellProps: { className: 'text-end' }
    }
  }
];

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

/* ***********************
   YARDIMCI FONKSİYONLAR
   *********************** */
const handleNullValue = (value: string) => {
  return value === 'null null' ? '' : value;
};

type SearchColumn = {
  label: string;
  value:
    | 'companyName'
    | 'brand'
    | 'pickUpCountry'
    | 'legalCountry'
    | 'pickUpAddress'
    | 'legalAddress'
    | 'email'
    | 'all';
};

const searchColumns: SearchColumn[] = [
  // { label: 'No Filter', value: 'all' },
  { label: 'Company Name', value: 'companyName' },
  { label: 'Brand', value: 'brand' },
  { label: 'Pick Up Country', value: 'pickUpCountry' },
  { label: 'Legal Country', value: 'legalCountry' },
  { label: 'Pick Up Address', value: 'pickUpAddress' },
  { label: 'Legal Address', value: 'legalAddress' },
  { label: 'Email', value: 'email' }
];

/* ***********************
   ANA BİLEŞEN: SupplierList
   *********************** */
interface SupplierListProps {
  activeView: string;
}

interface Supplier {
  supplierId: string;
  supplierName: string;
}

const SupplierList: FC<SupplierListProps> = ({ activeView }) => {
  const [data, setData] = useState<SupplierData2[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );

  // pageSize artık number veya 'all' alabiliyor
  const [pageSize, setPageSize] = useState<number | 'all'>(10);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );
  const [modalState, setModalState] = useState<
    'confirm' | 'deleting' | 'result'
  >('confirm');
  const [resultSuccess, setResultSuccess] = useState<boolean | null>(null);

  // Transfer modal states
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferModalState, setTransferModalState] = useState<
    'select' | 'confirming' | 'transferring' | 'result'
  >('select');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedToSupplierId, setSelectedToSupplierId] = useState<string>('');
  const [transferResult, setTransferResult] = useState<boolean | null>(null);
  const [fromSupplierName, setFromSupplierName] = useState<string>('');
  const [searchTermTransfer, setSearchTermTransfer] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Transfer işlemi fonksiyonları
  const handleTransferClick = (supplierId: string, companyName: string) => {
    setSelectedSupplierId(supplierId);
    setFromSupplierName(companyName);
    setShowTransferModal(true);
    setTransferModalState('select');
    setTransferResult(null);
    setSearchTermTransfer('');
    setSelectedToSupplierId('');
  };

  // Silme işlemi fonksiyonları
  const handleDeleteClick = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setModalState('confirm');
    setShowDeleteModal(true);
    setResultSuccess(null);
  };

  // Columns'u tanımla
  const columns = useMemo(
    () => getProjectListTableColumns(handleTransferClick, handleDeleteClick),
    [handleTransferClick, handleDeleteClick]
  );

  // Tablo instance'ını oluştur
  const table = useAdvanceTable({
    data,
    columns,
    pageSize: pageSize === 'all' ? data.length : pageSize,
    pagination: true,
    sortable: true
  });

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
        const mappedData: SupplierData2[] = suppliers.map((item: any) => ({
          id: item.id,
          companyName: item.supplierCompany,
          segments: Array.isArray(item.segments)
            ? item.segments.map((seg: any) => ({
                segmentName: seg.segmentName || ''
              }))
            : [],
          brands: item.brands,
          country: item.supplierLegalAddressDetail?.country?.countryName,
          address: item.supplierPickupAddressDetail?.pickUpAddress,
          mail: item.mail,
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
        const effectiveTerm = term.trim();
        if (pageSize !== 'all') {
          table.setGlobalFilter(undefined);
          table.setColumnFilters([{ id: column.value, value: effectiveTerm }]);
        } else {
          table.setGlobalFilter(effectiveTerm || undefined);
          table.setColumnFilters([]);
        }
        setPageIndex(0);
        fetchData(term, 0, column);
      }, 300),
    [table, pageSize]
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

  const handleDelete = async (supplierId: string): Promise<boolean> => {
    try {
      const response = await deleteSupplier(supplierId);
      if (response?.success) {
        // Refresh the table data
        fetchData(searchTerm, pageIndex, selectedColumn);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting supplier:', error);
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplierId) {
      setModalState('deleting');
      try {
        const success = await handleDelete(selectedSupplierId);
        setResultSuccess(success);
      } catch (error) {
        setResultSuccess(false);
      } finally {
        setModalState('result');
        setTimeout(() => {
          setShowDeleteModal(false);
          setSelectedSupplierId(null);
          setResultSuccess(null);
          setModalState('confirm');
        }, 1500);
      }
    }
  };

  const handleCloseModal = () => {
    if (modalState === 'confirm') {
      setShowDeleteModal(false);
      setSelectedSupplierId(null);
    }
  };

  // Transfer işlemi fonksiyonları
  const handleTransferConfirm = async () => {
    if (!selectedSupplierId || !selectedToSupplierId) return;

    setTransferModalState('transferring');
    const startTime = Date.now();

    try {
      const transformData = {
        fromId: selectedSupplierId,
        toId: selectedToSupplierId
      };

      await transformToSupplier(transformData);

      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
      }

      setTransferResult(true);
      setTransferModalState('result');

      setTimeout(() => {
        window.location.href = '/supplier/list';
      }, 1500);
    } catch (error) {
      console.error('Error transferring supplier:', error);
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
      }

      setTransferResult(false);
      setTransferModalState('result');
    }
  };

  // Transfer için supplier listesini getir
  useEffect(() => {
    if (showTransferModal && transferModalState === 'select') {
      getAllSuppliers();
    }
  }, [showTransferModal, transferModalState]);

  const getAllSuppliers = async () => {
    try {
      const response = await getAllSupplier();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const filteredSuppliers = suppliers
    .filter(s => s.supplierId !== selectedSupplierId)
    .filter(s =>
      s.supplierName.toLowerCase().includes(searchTermTransfer.toLowerCase())
    );

  useEffect(() => {
    fetchData(searchTerm, pageIndex, selectedColumn);
  }, [pageIndex, pageSize]);

  return (
    <AdvanceTableProvider {...table}>
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
                  {pageSize === 'all'
                    ? 'All Suppliers'
                    : `${pageSize} Suppliers`}
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
                        {size === 'all' ? 'All Suppliers' : `${size} Suppliers`}
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
                  columns: columns
                }}
              />
              <SupplierActions
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                selectedSupplierId={selectedSupplierId}
                modalState={modalState}
                resultSuccess={resultSuccess}
                handleCloseModal={handleCloseModal}
                handleConfirmDelete={handleConfirmDelete}
                showTransferModal={showTransferModal}
                setShowTransferModal={setShowTransferModal}
                transferModalState={transferModalState}
                setTransferModalState={setTransferModalState}
                fromSupplierName={fromSupplierName}
                searchTermTransfer={searchTermTransfer}
                setSearchTermTransfer={setSearchTermTransfer}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                filteredSuppliers={filteredSuppliers}
                selectedToSupplierId={selectedToSupplierId}
                setSelectedToSupplierId={setSelectedToSupplierId}
                handleTransferConfirm={handleTransferConfirm}
                transferResult={transferResult}
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
    </AdvanceTableProvider>
  );
};

export default SupplierList;
