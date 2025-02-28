import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { PartHistoryItem } from './PartHistoryListSection';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface HistoryFormModalProps {
  show: boolean;
  onHide: () => void;
  editItem?: PartHistoryItem;
}

const HistoryFormModal: React.FC<HistoryFormModalProps> = ({
  show,
  onHide
}) => {
  // Form alanları; PartHistoryItem modeline uygun
  const [entryDate, setEntryDate] = useState('');
  const [suppCompany, setSuppCompany] = useState('');
  const [fndQty, setFndQty] = useState<number>(0);
  const [fndPartCondition, setFndPartCondition] = useState('');
  const [unitCost, setUnitCost] = useState<number>(0);
  const [historyOrderStatus, setHistoryOrderStatus] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [partDesc, setPartDesc] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!entryDate.trim()) newErrors.entryDate = 'Entry date is required';
    if (!suppCompany.trim()) newErrors.suppCompany = 'Company is required';
    if (fndQty <= 0) newErrors.fndQty = 'Quantity must be greater than 0';
    if (!fndPartCondition.trim())
      newErrors.fndPartCondition = 'Condition is required';
    if (unitCost <= 0) newErrors.unitCost = 'Unit cost must be greater than 0';
    if (!historyOrderStatus.trim())
      newErrors.historyOrderStatus = 'Order status is required';
    if (!partNumber.trim()) newErrors.partNumber = 'Part Number is required';
    if (!partDesc.trim()) newErrors.partDesc = 'Part Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setEntryDate('');
    setSuppCompany('');
    setFndQty(0);
    setFndPartCondition('');
    setUnitCost(0);
    setHistoryOrderStatus('');
    setPartNumber('');
    setPartDesc('');
    setErrors({});
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Entry Date*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entry Date"
              value={entryDate}
              onChange={e => setEntryDate(e.target.value)}
              isInvalid={!!errors.entryDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.entryDate}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Company*</Form.Label>
            <Form.Control
              placeholder="Company"
              value={suppCompany}
              onChange={e => setSuppCompany(e.target.value)}
              isInvalid={!!errors.suppCompany}
            />
            <Form.Control.Feedback type="invalid">
              {errors.suppCompany}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity*</Form.Label>
            <Form.Control
              type="number"
              placeholder="Quantity"
              value={fndQty}
              onChange={e => setFndQty(Number(e.target.value))}
              isInvalid={!!errors.fndQty}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fndQty}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Condition*</Form.Label>
            <Form.Control
              placeholder="Condition"
              value={fndPartCondition}
              onChange={e => setFndPartCondition(e.target.value)}
              isInvalid={!!errors.fndPartCondition}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fndPartCondition}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Unit Cost*</Form.Label>
            <Form.Control
              type="number"
              placeholder="Unit Cost"
              value={unitCost}
              onChange={e => setUnitCost(Number(e.target.value))}
              isInvalid={!!errors.unitCost}
            />
            <Form.Control.Feedback type="invalid">
              {errors.unitCost}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Order Status*</Form.Label>
            <Form.Control
              placeholder="Order Status"
              value={historyOrderStatus}
              onChange={e => setHistoryOrderStatus(e.target.value)}
              isInvalid={!!errors.historyOrderStatus}
            />
            <Form.Control.Feedback type="invalid">
              {errors.historyOrderStatus}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Part Number*</Form.Label>
            <Form.Control
              placeholder="Part Number"
              value={partNumber}
              onChange={e => setPartNumber(e.target.value)}
              isInvalid={!!errors.partNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.partNumber}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Part Description*</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Part Description"
              value={partDesc}
              onChange={e => setPartDesc(e.target.value)}
              isInvalid={!!errors.partDesc}
            />
            <Form.Control.Feedback type="invalid">
              {errors.partDesc}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default HistoryFormModal;
