import React, { useEffect } from 'react';
import { Form, Table } from 'react-bootstrap';
import { PiParts } from 'smt-v1-app/containers/PoDetailContainer/QuoteContainerTypes';

interface PiPartListProps {
  parts: PiParts[];
  setSelectedParts: React.Dispatch<React.SetStateAction<string[]>>;
  selectedParts: string[];
  refreshData?: () => void;
}

const PoPartList: React.FC<PiPartListProps> = ({
  parts,
  setSelectedParts,
  selectedParts
}) => {
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
  const formatPrice = (
    price: number | { price: number | null; currency: string } | undefined,
    currency: string | undefined
  ) => {
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

  return (
    <div>
      <div className="d-flex align-items-center">
        <h3 className="mt-3">Parts</h3>
      </div>
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
              {/* <th style={{ minWidth: '150px' }}>Stage Of Part</th> */}
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
            {parts.map((part, index) => (
              <tr key={`${part.piPartId}-${index}`}>
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
                {/* <td>

                </td> */}
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
                <td>{part.dgPackagingCost ? 'Yes' : 'No'}</td>
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

export default PoPartList;
