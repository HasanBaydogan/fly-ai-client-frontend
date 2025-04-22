import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import './PiAlternativeParts';
import { AlternativePiPart } from 'smt-v1-app/containers/PiDetailContainer/QuoteContainerTypes';
interface PiListAlternativePartsProps {
  alternativeParts: AlternativePiPart[];
  selectedAlternativeParts: string[];
  setSelectedAlternativeParts: React.Dispatch<React.SetStateAction<string[]>>;
}

const PiListAlternativeParts: React.FC<PiListAlternativePartsProps> = ({
  alternativeParts,
  selectedAlternativeParts,
  setSelectedAlternativeParts
}) => {
  const [selectAll, setSelectAll] = useState(true);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAlternativeParts(alternativeParts.map(part => part.piPartId));
      setSelectAll(true);
    } else {
      setSelectedAlternativeParts([]);
      setSelectAll(false);
    }
  };
  useEffect(() => {
    if (alternativeParts && alternativeParts.length > 0) {
      setSelectedAlternativeParts(alternativeParts.map(part => part.piPartId));
    }
  }, [alternativeParts]);

  const handleSelectPart = (piPartId: string) => {
    setSelectedAlternativeParts(prev => {
      const newSelection = prev.includes(piPartId)
        ? prev.filter(num => num !== piPartId)
        : [...prev, piPartId];

      setSelectAll(newSelection.length === alternativeParts.length);
      return newSelection;
    });
  };

  return (
    <div>
      <h3 className="mt-3">Alternative Parts</h3>
      <hr className="custom-line m-0" />

      <div className="mx-2" style={{ minHeight: '170px', overflowY: 'auto' }}>
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
                  disabled
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ minWidth: '120px' }}>Part Number</th>
              <th style={{ minWidth: '150px' }}>Part Name</th>
              <th style={{ minWidth: '150px' }}>Additional Info</th>
              <th style={{ minWidth: '150px' }}>Parent Part Number</th>
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
            </tr>
          </thead>
          <tbody>
            {alternativeParts.map(part => (
              <tr key={part.piPartId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    disabled
                    checked={selectedAlternativeParts.includes(part.piPartId)}
                    onChange={() => handleSelectPart(part.piPartId)}
                    style={{ marginLeft: '10px' }}
                  />
                </td>
                <td>{part.partNumber}</td>
                <td>{part.partName}</td>
                <td>{part.partDescription}</td>
                <td>{part.parentPartNumber}</td>
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PiListAlternativeParts;
