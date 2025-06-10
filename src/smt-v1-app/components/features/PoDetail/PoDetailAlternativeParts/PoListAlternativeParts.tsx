import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import './PoListAlternativeParts';
import { AlternativePiPart } from 'smt-v1-app/containers/PoDetailContainer/QuoteContainerTypes';
import { patchRequest } from 'smt-v1-app/services/ApiCore/GlobalApiCore';
import { toast } from 'react-toastify';

interface PiListAlternativePartsProps {
  alternativeParts: AlternativePiPart[];
  selectedAlternativeParts: string[];
  setSelectedAlternativeParts: React.Dispatch<React.SetStateAction<string[]>>;
}

const PoListAlternativeParts: React.FC<PiListAlternativePartsProps> = ({
  alternativeParts,
  selectedAlternativeParts,
  setSelectedAlternativeParts
}) => {
  const [selectAll, setSelectAll] = useState(true);

  const formatPrice = (
    price: number | { price: number | null; currency: string } | undefined,
    currency: string | undefined
  ): string => {
    if (price === undefined) return '-';

    // Handle case where price is an object
    if (typeof price === 'object' && price !== null) {
      if (price.price === null) return '-';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency
      }).format(price.price);
    }

    // Handle case where price is a number
    if (currency === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Number(price));
  };

  const formatCurrency = (
    currency: string | { currency: string } | undefined
  ): string => {
    if (currency === undefined) return '-';
    if (
      typeof currency === 'object' &&
      currency !== null &&
      'currency' in currency
    ) {
      return currency.currency || '-';
    }
    return typeof currency === 'string' ? currency : '-';
  };

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
      <div className="d-flex align-items-center">
        <h3 className="mt-3">Alternative Parts</h3>
      </div>
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
              {/* <th style={{ minWidth: '150px' }}>Stage Of Part</th> */}
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
            {alternativeParts.map((part, index) => (
              <tr key={`${part.piPartId}-${index}`}>
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
                {/* <td>{part} </td> */}
                <td>{part.parentPartNumber}</td>
                <td>{part.reqQTY}</td>
                <td>{part.fndQTY}</td>
                <td>{part.reqCND}</td>
                <td>{part.fndCND}</td>
                <td>{part.supplierLT}</td>
                <td>{part.clientLT}</td>
                <td>{formatPrice(part.price, part.currency)}</td>
                <td>{formatCurrency(part.currency)}</td>
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

export default PoListAlternativeParts;
