import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { AlternativeRFQPart } from '../../../../../containers/RFQContainer/RfqContainerTypes';
import './QuoteListAlternativeParts';
import { AlternativeQuotePart } from 'smt-v1-app/containers/QuoteContainer/QuoteContainerTypes';
interface QuoteListAlternativePartsProps {
  alternativeParts: AlternativeQuotePart[];
  selectedAlternativeParts: string[];
  setSelectedAlternativeParts: React.Dispatch<React.SetStateAction<string[]>>;
}

const QuoteListAlternativeParts: React.FC<QuoteListAlternativePartsProps> = ({
  alternativeParts,
  selectedAlternativeParts,
  setSelectedAlternativeParts
}) => {
  const [selectAll, setSelectAll] = useState(true);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAlternativeParts(
        alternativeParts.map(part => part.quotePartId)
      );
      setSelectAll(true);
    } else {
      setSelectedAlternativeParts([]);
      setSelectAll(false);
    }
  };
  useEffect(() => {
    if (alternativeParts && alternativeParts.length > 0) {
      setSelectedAlternativeParts(
        alternativeParts.map(part => part.quotePartId)
      );
    }
  }, [alternativeParts]);

  const handleSelectPart = (quotePartId: string) => {
    setSelectedAlternativeParts(prev => {
      const newSelection = prev.includes(quotePartId)
        ? prev.filter(num => num !== quotePartId)
        : [...prev, quotePartId];

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
              <tr key={part.quotePartId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedAlternativeParts.includes(
                      part.quotePartId
                    )}
                    onChange={() => handleSelectPart(part.quotePartId)}
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

export default QuoteListAlternativeParts;
