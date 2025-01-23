import React, { useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { AlternativeRFQPart } from '../../../../../containers/RFQContainer/RfqContainerTypes';

interface QuoteListAlternativePartsProps {
  alternativeParts: AlternativeRFQPart[];
  handleDeleteAlternativePart: (alternPartNumber: string) => void;
}

const QuoteListAlternativeParts: React.FC<QuoteListAlternativePartsProps> = ({
  alternativeParts,
  handleDeleteAlternativePart
}) => {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedParts(alternativeParts.map(part => part.partNumber));
      setSelectAll(true);
    } else {
      setSelectedParts([]);
      setSelectAll(false);
    }
  };

  const handleSelectPart = (partNumber: string) => {
    setSelectedParts(prev => {
      const newSelection = prev.includes(partNumber)
        ? prev.filter(num => num !== partNumber)
        : [...prev, partNumber];

      setSelectAll(newSelection.length === alternativeParts.length);
      return newSelection;
    });
  };

  return (
    <div>
      <h3 className="mt-3">Alternative Parts</h3>
      <hr className="custom-line m-0" />

      <div className="mx-2" style={{ height: '250px', overflowY: 'auto' }}>
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
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ minWidth: '120px' }}>Part Number</th>
              <th style={{ minWidth: '150px' }}>Part Name</th>
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
              <tr key={part.partNumber}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedParts.includes(part.partNumber)}
                    onChange={() => handleSelectPart(part.partNumber)}
                  />
                </td>
                <td>{part.partNumber}</td>
                <td>{part.partName}</td>
                <td>{part.parentRFQPart.partNumber}</td>
                <td>{part.reqQTY}</td>
                <td>{part.fndQTY}</td>
                <td>{part.reqCND}</td>
                <td>{part.fndCND}</td>
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

export default QuoteListAlternativeParts;
