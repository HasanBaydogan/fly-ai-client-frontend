import React, { useEffect, useState } from 'react';
import { Form, Table, Modal, Button, Spinner } from 'react-bootstrap';
import { PiParts } from 'smt-v1-app/containers/PiDetailContainer/QuoteContainerTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { patchRequest } from 'smt-v1-app/services/ApiCore/GlobalApiCore';
import { toast } from 'react-toastify';

interface PiPartListProps {
  parts: PiParts[];
  setSelectedParts: React.Dispatch<React.SetStateAction<string[]>>;
  selectedParts: string[];
  refreshData?: () => void;
}

const PiPartList: React.FC<PiPartListProps> = ({
  parts,
  setSelectedParts,
  selectedParts,
  refreshData
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stageOptions = [
    'NONE',
    'PO_WAITING_FROM_CLIENT',
    'PO_RECEIVED_FROM_CLIENT',
    'PI_CREATED',
    'PI_SENT_TO_CLIENT',
    'PI_R_SENT_TO_CLIENT',
    'PENDING_PAYMENT_FROM_CUSTOMER',
    'PAYMENT_SENT_FROM_CUSTOMER',
    'PAYMENT_TO_R_RECEIVED_FROM_CUSTOMER',
    'PAYMENT_TO_TURKEY_RECEIVED_FROM_CUSTOMER',
    'PO_NEED_TO_SENT_SUPPLIER',
    'PO_SENT_TO_SUPPLIER',
    'PO_APPROVED_BY_SUPPLIER',
    'TO_BE_PAID_TO_SUPPLIER',
    'PAYMENT_REQUEST_SENT_TO_ACCOUNTING',
    'PAID_TO_SUPPLIER',
    'PAYMENT_APPROVED_BY_SUPPLIER',
    'LT_PENDING_BY_SUPPLIER',
    'READY_FOR_PICKUP_AT_SUPPLIER',
    'SUPPLIER_PREPARING_TO_SEND_BY_SUPP_FF',
    'SUPPLIER_CONTACT_SENT_TO_OUR_FF',
    'PICK_UP_PENDING_BY_OUR_FF',
    'PART_ON_THE_WAY_TO_TURKEY_BY_OUR_FF',
    'PART_ON_THE_WAY_TO_TURKEY_BY_SUPPLIERS_FF',
    'E_INVOICE_REQUEST_SENT_TO_ACCOUNTING',
    'PART_IN_TURKEY',
    'CUSTOMS_PROCEDURE_STARTED',
    'AWB_SENT_TO_CUSTOMER_FOR_APPROVAL',
    'WB_APPROVED_BY_CUSTOMER',
    'PART_ON_THE_WAY_TO_FINAL_DESTINATION',
    'DELIVERED',
    'PI_RECEIVED_BUT_PI_NOT_CREATED',
    'PO_CREATED',
    'PO_PARTIALLY_SENT',
    'PO_FULLY_SENT',
    'LOT_CREATED',
    'LOT_PARTIALLY_SENT',
    'LOT_FULLY_SENT',
    'CANCELED',
    'REFUNDED_TO_CUSTOMERS_ACCOUNT',
    'REFUNDED_TO_CUSTOMERS_BALANCE'
  ] as const;

  type StageType = (typeof stageOptions)[number] | '';

  const stageDisplayTexts: Record<StageType, string> = {
    '': 'Select Stage',
    NONE: 'None',
    PO_WAITING_FROM_CLIENT: 'PO Waiting from Client',
    PO_RECEIVED_FROM_CLIENT: 'PO Received from Client',
    PI_CREATED: 'PI Created',
    PI_SENT_TO_CLIENT: 'PI Sent to Client',
    PI_R_SENT_TO_CLIENT: 'PI R Sent to Client',
    PENDING_PAYMENT_FROM_CUSTOMER: 'Pending Payment from Customer',
    PAYMENT_SENT_FROM_CUSTOMER: 'Payment Sent from Customer',
    PAYMENT_TO_R_RECEIVED_FROM_CUSTOMER: 'Payment to R Received from Customer',
    PAYMENT_TO_TURKEY_RECEIVED_FROM_CUSTOMER:
      'Payment to Turkey Received from Customer',
    PO_NEED_TO_SENT_SUPPLIER: 'PO Need to Sent Supplier',
    PO_SENT_TO_SUPPLIER: 'PO Sent to Supplier',
    PO_APPROVED_BY_SUPPLIER: 'PO Approved by Supplier',
    TO_BE_PAID_TO_SUPPLIER: 'To be Paid to Supplier',
    PAYMENT_REQUEST_SENT_TO_ACCOUNTING: 'Payment Request Sent to Accounting',
    PAID_TO_SUPPLIER: 'Paid to Supplier',
    PAYMENT_APPROVED_BY_SUPPLIER: 'Payment Approved by Supplier',
    LT_PENDING_BY_SUPPLIER: 'LT Pending by Supplier',
    READY_FOR_PICKUP_AT_SUPPLIER: 'Ready for Pickup at Supplier',
    SUPPLIER_PREPARING_TO_SEND_BY_SUPP_FF:
      'Supplier Preparing to Send by Supp FF',
    SUPPLIER_CONTACT_SENT_TO_OUR_FF: 'Supplier Contact Sent to Our FF',
    PICK_UP_PENDING_BY_OUR_FF: 'Pick up Pending by Our FF',
    PART_ON_THE_WAY_TO_TURKEY_BY_OUR_FF: 'Part on the Way to Turkey by Our FF',
    PART_ON_THE_WAY_TO_TURKEY_BY_SUPPLIERS_FF:
      'Part on the Way to Turkey by Suppliers FF',
    E_INVOICE_REQUEST_SENT_TO_ACCOUNTING:
      'E-Invoice Request Sent to Accounting',
    PART_IN_TURKEY: 'Part in Turkey',
    CUSTOMS_PROCEDURE_STARTED: 'Customs Procedure Started',
    AWB_SENT_TO_CUSTOMER_FOR_APPROVAL: 'AWB Sent to Customer for Approval',
    WB_APPROVED_BY_CUSTOMER: 'AWB Approved by Customer',
    PART_ON_THE_WAY_TO_FINAL_DESTINATION:
      'Part on the Way to Final Destination',
    DELIVERED: 'Delivered',
    PI_RECEIVED_BUT_PI_NOT_CREATED: 'PI Received but PI not Created',
    PO_CREATED: 'PO Created',
    PO_PARTIALLY_SENT: 'PO Partially Sent',
    PO_FULLY_SENT: 'PO Fully Sent',
    LOT_CREATED: 'Lot Created',
    LOT_PARTIALLY_SENT: 'Lot Partially Sent',
    LOT_FULLY_SENT: 'Lot Fully Sent',
    CANCELED: 'Canceled',
    REFUNDED_TO_CUSTOMERS_ACCOUNT: 'Refunded to Customers Account',
    REFUNDED_TO_CUSTOMERS_BALANCE: 'Refunded to Customers Balance'
  };

  const formatStageDisplay = (stage: string) => {
    if (!stage) return '';
    return stageDisplayTexts[stage as StageType] || stage;
  };

  const [modifiedParts, setModifiedParts] = useState<Map<string, StageType>>(
    new Map()
  );

  // Eğer herhangi bir part'ın stageOfPIPart değeri null ise, Edit/Save butonu disable olacak
  const hasNullStage = parts.some(part => part.stageOfPIPart == null);

  useEffect(() => {
    if (parts && parts.length > 0) {
      setSelectedParts(parts.map(part => part.piPartId));
    }
  }, [parts]);

  const allSelected = selectedParts.length === parts.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedParts(parts.map(part => part.piPartId));
    } else {
      setSelectedParts([]);
    }
  };

  const handleSelectPart = (piPartId: string) => {
    setSelectedParts(prev => {
      return prev.includes(piPartId)
        ? prev.filter(id => id !== piPartId)
        : [...prev, piPartId];
    });
  };

  const handleStageChange = (piPartId: string, newStage: string) => {
    if (newStage === '') {
      const updated = new Map(modifiedParts);
      updated.set(piPartId, '');
      setModifiedParts(updated);
      return;
    }

    // Verify if the newStage is a valid StageType
    if (stageOptions.includes(newStage as any)) {
      const updated = new Map(modifiedParts);
      updated.set(piPartId, newStage as StageType);
      setModifiedParts(updated);
    }
  };

  const handleSaveChanges = async () => {
    console.log('handleSaveChanges called', modifiedParts);

    if (modifiedParts.size === 0) {
      setIsEditing(false);
      setShowConfirmModal(false);
      return;
    }

    setIsLoading(true); // Start loading animation

    try {
      const piPartStatuses = Array.from(modifiedParts.entries())
        .filter(([_, stageOfPIPart]) => stageOfPIPart !== '') // Filter out empty stage values
        .map(([piPartId, stageOfPIPart]) => ({
          piPartId,
          stageOfPIPart: stageOfPIPart as Exclude<StageType, ''>
        }));

      console.log('piPartStatuses to send:', piPartStatuses);

      // Always make the API request if we have modified parts
      const response = await patchRequest('/pi-part', { piPartStatuses });
      console.log('API response:', response);

      if (response && response.statusCode === 200) {
        toast.success('Changes saved successfully', {
          position: 'bottom-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });

        // Refresh the entire page after successful update
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to save changes', {
          position: 'bottom-right',
          autoClose: 3000
        });
        setShowConfirmModal(false);
        setIsLoading(false); // Stop loading animation on error
      }
    } catch (error) {
      console.error('Error updating parts:', error);
      toast.error('Failed to update parts', {
        position: 'bottom-right',
        autoClose: 3000
      });
      setShowConfirmModal(false);
      setIsLoading(false); // Stop loading animation on error
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <h3 className="mt-3">Parts</h3>
      </div>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => !isLoading && setShowConfirmModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <div className="mt-3">Saving changes...</div>
            </div>
          ) : (
            'Are you sure you want to save these changes?'
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={isLoading}
          >
            {isLoading ? <>Processing...</> : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>

      <hr className="custom-line m-0" />

      <div className="mx-2" style={{ minHeight: '150px', overflowY: 'auto' }}>
        <Table responsive style={{ marginBottom: '0' }}>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1
            }}
          >
            <tr>
              <th style={{ minWidth: '50px' }}>
                <Form.Check
                  type="checkbox"
                  checked={allSelected}
                  disabled
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ minWidth: '120px' }}>Part Number</th>
              <th style={{ minWidth: '150px' }}>Part Name</th>
              <th style={{ minWidth: '150px' }}>Part Description</th>
              {/* Stage Of Part sütunu sadece tüm stageOfPIPart değerleri null değilse gösterilecek */}
              {!hasNullStage && (
                <th style={{ minWidth: '150px' }}>Stage Of Part</th>
              )}
              <th style={{ minWidth: '100px' }}>Req QTY</th>
              <th style={{ minWidth: '100px' }}>Fnd QTY</th>
              <th style={{ minWidth: '100px' }}>Req CND</th>
              <th style={{ minWidth: '100px' }}>Fnd CND</th>
              <th style={{ minWidth: '120px' }}>Supplier LT</th>
              <th style={{ minWidth: '120px' }}>Client LT</th>
              <th style={{ minWidth: '120px' }}>Unit Price</th>
              <th style={{ minWidth: '100px' }}>Currency</th>
              <th style={{ minWidth: '150px' }}>Supplier</th>
              <th style={{ minWidth: '150px' }}>Comment</th>
              <th style={{ minWidth: '150px' }}>DG Packaging Cost</th>
              <th style={{ minWidth: '120px' }}>Tag Date</th>
              <th style={{ minWidth: '120px' }}>Cert Type</th>
              <th style={{ minWidth: '100px' }}>MSN</th>
              <th style={{ minWidth: '120px' }}>Warehouse</th>
              <th style={{ minWidth: '100px' }}>Stock</th>
              <th style={{ minWidth: '150px' }}>Stock Location</th>
              <th style={{ minWidth: '150px' }}>Airline Company</th>
              <th style={{ minWidth: '100px' }}>MSDS</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.piPartId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    disabled
                    checked={selectedParts.includes(part.piPartId)}
                    onChange={() => handleSelectPart(part.piPartId)}
                    style={{ marginLeft: '10px' }}
                  />
                </td>
                <td>{part.partNumber}</td>
                <td>{part.partName}</td>
                <td>{part.partDescription}</td>
                {/* Stage Of Part hücresi sadece tüm stageOfPIPart değerleri null değilse gösterilecek */}
                {!hasNullStage && (
                  <td>
                    {isEditing ? (
                      <Form.Select
                        size="sm"
                        value={
                          modifiedParts.has(part.piPartId)
                            ? modifiedParts.get(part.piPartId)
                            : part.stageOfPIPart || ''
                        }
                        onChange={e => {
                          handleStageChange(part.piPartId, e.target.value);
                        }}
                      >
                        <option value="">Select Stage</option>
                        {stageOptions.map(option => (
                          <option key={option} value={option}>
                            {formatStageDisplay(option)}
                          </option>
                        ))}
                      </Form.Select>
                    ) : part.stageOfPIPart ? (
                      formatStageDisplay(part.stageOfPIPart)
                    ) : (
                      ''
                    )}
                  </td>
                )}
                <td>{part.reqQuantity}</td>
                <td>{part.fndQuantity}</td>
                <td>{part.reqCondition}</td>
                <td>{part.fndCondition}</td>
                <td>{part.supplierLT}</td>
                <td>{part.clientLT}</td>
                <td>{part.price}</td>
                <td>{part.currency}</td>
                <td>{String(part.supplier)}</td>
                <td>{part.comment}</td>
                <td>{part.DGPackagingCost ? 'Yes' : 'No'}</td>
                <td>{part.tagDate}</td>
                <td>{part.certificateType}</td>
                <td>{part.MSN}</td>
                <td>{part.wareHouse}</td>
                <td>{part.stock}</td>
                <td>{part.stockLocation}</td>
                <td>{part.airlineCompany}</td>
                <td>{part.MSDS}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PiPartList;
