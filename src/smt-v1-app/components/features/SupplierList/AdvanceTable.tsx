import { Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { flexRender } from '@tanstack/react-table';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import classNames from 'classnames';
import { CustomTableProps } from './CustomTableProps';
import { useState, useEffect } from 'react';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import {
  transformToSupplier,
  getAllSupplier
} from 'smt-v1-app/services/SupplierServices';

interface Supplier {
  supplierId: string;
  supplierName: string;
}

interface TransformSupplier {
  fromId: string;
  toId: string;
}

interface AdvanceTableProps {
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  tableProps?: CustomTableProps;
  hasFooter?: boolean;
  onDelete?: (supplierId: string) => Promise<boolean>;
}

type ModalState = 'confirm' | 'deleting' | 'result';
type TransferModalState = 'select' | 'confirming' | 'transferring' | 'result';

const AdvanceTable = ({
  headerClassName,
  bodyClassName,
  rowClassName,
  tableProps,
  hasFooter,
  onDelete
}: AdvanceTableProps) => {
  const table = useAdvanceTableContext();
  const { getFlatHeaders, getFooterGroups } = table;
  const { data = [], columns, ...tablePropsWithoutCustom } = tableProps || {};

  // Modal kontrolü ve durumları
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );
  const [modalState, setModalState] = useState<ModalState>('confirm');
  const [resultSuccess, setResultSuccess] = useState<boolean | null>(null);

  // New states for transfer functionality
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferModalState, setTransferModalState] =
    useState<TransferModalState>('select');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedToSupplierId, setSelectedToSupplierId] = useState<string>('');
  const [transferResult, setTransferResult] = useState<boolean | null>(null);
  const [fromSupplierName, setFromSupplierName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch suppliers for transfer modal
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

  const handleDeleteClick = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setModalState('confirm'); // İlk aşama: onay
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplierId && onDelete) {
      setModalState('deleting');
      try {
        const success = await onDelete(selectedSupplierId);
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

  // Sadece onay aşamasındayken kapatma izni verilsin.
  const handleCloseModal = () => {
    if (modalState === 'confirm') {
      setShowDeleteModal(false);
      setSelectedSupplierId(null);
    }
  };

  const handleTransferClick = (supplierId: string, companyName: string) => {
    setSelectedSupplierId(supplierId);
    setFromSupplierName(companyName);
    setTransferModalState('select');
    setShowTransferModal(true);
  };

  const handleTransferConfirm = async () => {
    if (!selectedSupplierId || !selectedToSupplierId) return;

    setTransferModalState('transferring');
    const startTime = Date.now();

    try {
      const transformData: TransformSupplier = {
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

  const renderSegments = (segments: { segmentName: string }[]) => {
    if (!segments || segments.length === 0) return '';
    if (segments.length === 1) {
      return <div>• {segments[0].segmentName}</div>;
    } else if (segments.length === 2) {
      return (
        <>
          <div>• {segments[0].segmentName}</div>
          <div>• {segments[1].segmentName}</div>
        </>
      );
    } else {
      return (
        <>
          <div>• {segments[0].segmentName}</div>
          <div>• {segments[1].segmentName}</div>
          <div>• ...</div>
        </>
      );
    }
  };

  const filteredSuppliers = suppliers
    .filter(s => s.supplierId !== selectedSupplierId)
    .filter(s =>
      s.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="scrollbar ms-n1 ps-1">
        <Table {...tablePropsWithoutCustom}>
          <thead className={headerClassName}>
            <tr>
              {getFlatHeaders().map(header => (
                <th
                  key={header.id}
                  {...header.column.columnDef.meta?.headerProps}
                  className={classNames(
                    header.column.columnDef.meta?.headerProps?.className
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {data.map(row => (
              <tr key={row.id} className={rowClassName}>
                <td>
                  <a href={`/supplier/edit?supplierId=${row.id}`}>
                    {row.companyName}
                  </a>
                </td>
                <td>{renderSegments(row.segments)}</td>
                <td>{row.brand}</td>
                <td>{row.country}</td>
                <td>{row.address}</td>
                <td>{row.contacts?.[0]?.email || row.email}</td>
                <td>
                  <Badge
                    bg={
                      row.status?.label.toLowerCase() === 'contacted'
                        ? 'success'
                        : row.status?.label.toLowerCase() === 'not_contacted'
                        ? 'warning'
                        : row.status?.label.toLowerCase() === 'black_listed'
                        ? 'danger'
                        : 'default'
                    }
                  >
                    {row.status?.label}
                  </Badge>
                </td>
                <td className="text-end">
                  <Button
                    variant="link"
                    className="text-primary p-0 me-2"
                    style={{ fontSize: '1rem' }}
                    onClick={() => handleTransferClick(row.id, row.companyName)}
                  >
                    ⇄
                  </Button>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    style={{ fontSize: '1.2rem' }}
                    onClick={() => handleDeleteClick(row.id)}
                  >
                    ×
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          {hasFooter && (
            <tfoot>
              {getFooterGroups().map(footerGroup => (
                <tr
                  key={footerGroup.id}
                  className="border-0 border-translucent"
                >
                  {footerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      {...header.column.columnDef.meta?.footerProps}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </Table>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton={modalState === 'confirm'}>
          <Modal.Title>
            {modalState === 'confirm' && 'Confirm Delete'}
            {modalState === 'deleting' && 'Deleting Supplier...'}
            {modalState === 'result' && (resultSuccess ? 'Success' : 'Error')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalState === 'confirm' &&
            'Are you sure you want to delete this supplier? This action cannot be undone.'}
          {modalState === 'deleting' && (
            <>
              <LoadingAnimation />
              <p className="mt-3 mb-0">
                <LoadingAnimation></LoadingAnimation>
              </p>
            </>
          )}
          {modalState === 'result' &&
            (resultSuccess
              ? 'Supplier has been successfully deleted.'
              : 'An unknown error occurred while deleting the supplier.')}
        </Modal.Body>
        {modalState === 'confirm' && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      {/* Transfer Modal */}
      <Modal
        show={showTransferModal}
        onHide={() =>
          transferModalState === 'select' && setShowTransferModal(false)
        }
        centered
      >
        <Modal.Header closeButton={transferModalState === 'select'}>
          <Modal.Title>
            {transferModalState === 'select' && 'Transfer Supplier'}
            {transferModalState === 'confirming' && 'Confirm Transfer'}
            {transferModalState === 'transferring' &&
              'Transferring Supplier...'}
            {transferModalState === 'result' &&
              (transferResult ? 'Success' : 'Error')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transferModalState === 'select' && (
            <>
              <p>
                Select the supplier to transfer{' '}
                <strong>{fromSupplierName}</strong> to:
              </p>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type="text"
                  placeholder="Select a supplier..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      border: '1px solid #ced4da',
                      borderRadius: '0.25rem',
                      zIndex: 1000,
                      marginTop: '2px'
                    }}
                  >
                    {filteredSuppliers.map(supplier => (
                      <div
                        key={supplier.supplierId}
                        onClick={() => {
                          setSelectedToSupplierId(supplier.supplierId);
                          setSearchTerm(supplier.supplierName);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #ced4da'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        {supplier.supplierName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {transferModalState === 'confirming' && (
            <p>
              Are you sure you want to transfer{' '}
              <strong>{fromSupplierName}</strong> to the selected supplier? This
              action cannot be undone.
            </p>
          )}
          {transferModalState === 'transferring' && (
            <div className="text-center">
              <LoadingAnimation />
              <p className="mt-3 mb-0">Transferring supplier data...</p>
            </div>
          )}
          {transferModalState === 'result' && (
            <p>
              {transferResult
                ? 'Supplier has been successfully transferred.'
                : 'An error occurred while transferring the supplier.'}
            </p>
          )}
        </Modal.Body>
        {transferModalState === 'select' && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowTransferModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setTransferModalState('confirming')}
              disabled={!selectedToSupplierId}
            >
              Next
            </Button>
          </Modal.Footer>
        )}
        {transferModalState === 'confirming' && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setTransferModalState('select')}
            >
              Back
            </Button>
            <Button variant="primary" onClick={handleTransferConfirm}>
              Transfer
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default AdvanceTable;
