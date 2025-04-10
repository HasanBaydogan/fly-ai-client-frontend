import { Table, Badge, Button, Modal } from 'react-bootstrap';
import { flexRender } from '@tanstack/react-table';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import classNames from 'classnames';
import { CustomTableProps } from './CustomTableProps';
import { useState } from 'react';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

interface AdvanceTableProps {
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  tableProps?: CustomTableProps;
  hasFooter?: boolean;
  onDelete?: (supplierId: string) => Promise<boolean>;
}

type ModalState = 'confirm' | 'deleting' | 'result';

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

  const handleDeleteClick = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setModalState('confirm'); // İlk aşama: onay
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSupplierId && onDelete) {
      setModalState('deleting'); // Loading aşaması
      try {
        const success = await onDelete(selectedSupplierId);
        setResultSuccess(success);
      } catch (error) {
        setResultSuccess(false);
      } finally {
        setModalState('result'); // Sonuç aşamasına geç
        // Sonuç 1500ms görüntülendikten sonra modalı otomatik kapat
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
    </>
  );
};

export default AdvanceTable;
