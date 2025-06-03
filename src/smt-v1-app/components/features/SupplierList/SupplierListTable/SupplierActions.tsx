import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

interface Supplier {
  supplierId: string;
  supplierName: string;
}

interface SupplierActionsProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  selectedSupplierId: string | null;
  modalState: 'confirm' | 'deleting' | 'result';
  resultSuccess: boolean | null;
  handleCloseModal: () => void;
  handleConfirmDelete: () => void;
  showTransferModal: boolean;
  setShowTransferModal: (show: boolean) => void;
  transferModalState: 'select' | 'confirming' | 'transferring' | 'result';
  setTransferModalState: (
    state: 'select' | 'confirming' | 'transferring' | 'result'
  ) => void;
  fromSupplierName: string;
  searchTermTransfer: string;
  setSearchTermTransfer: (term: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  filteredSuppliers: Supplier[];
  selectedToSupplierId: string;
  setSelectedToSupplierId: (id: string) => void;
  handleTransferConfirm: () => void;
  transferResult: boolean | null;
}

const SupplierActions: React.FC<SupplierActionsProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  selectedSupplierId,
  modalState,
  resultSuccess,
  handleCloseModal,
  handleConfirmDelete,
  showTransferModal,
  setShowTransferModal,
  transferModalState,
  setTransferModalState,
  fromSupplierName,
  searchTermTransfer,
  setSearchTermTransfer,
  isDropdownOpen,
  setIsDropdownOpen,
  filteredSuppliers,
  selectedToSupplierId,
  setSelectedToSupplierId,
  handleTransferConfirm,
  transferResult
}) => {
  return (
    <>
      {/* Delete Modal */}
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
              <p className="mt-3 mb-0">
                <LoadingAnimation />
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
                  value={searchTermTransfer}
                  onChange={e => {
                    setSearchTermTransfer(e.target.value);
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
                          setSearchTermTransfer(supplier.supplierName);
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

export default SupplierActions;
