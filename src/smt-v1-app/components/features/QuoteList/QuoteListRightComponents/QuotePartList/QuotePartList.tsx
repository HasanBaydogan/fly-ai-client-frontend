
import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';

import { QuotePart } from 'smt-v1-app/containers/QuoteContainer/QuoteContainerTypes';

interface QuotePartListProps {
  parts: QuotePart[];
}

const QuotePartList: React.FC<QuotePartListProps> = ({ parts }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  // parts değiştiğinde tüm parçaları seçili duruma getiriyoruz
  useEffect(() => {
    if (parts && parts.length > 0) {
      setSelectedParts(parts.map(part => part.quotePartId));
    }
  }, [parts]);

  // Hepsi seçili mi bilgisini hesaplıyoruz
  const allSelected = selectedParts.length === parts.length;

  // "Tümü seç" checkbox değiştiğinde çalışır
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Tüm id'leri seçili hale getir
      setSelectedParts(parts.map(part => part.quotePartId));
    } else {
      // Seçili dizisini sıfırla
      setSelectedParts([]);
    }
  };

  // Tek bir part checkbox’ı değiştiğinde çalışır
  const handleSelectPart = (quotePartId: string) => {
    setSelectedParts(prev => {
      // Seçili dizide varsa çıkar, yoksa ekle
      return prev.includes(quotePartId)
        ? prev.filter(id => id !== quotePartId)
        : [...prev, quotePartId];
    });
  };

  return (
    <div>
      <h3 className="mt-3">Parts</h3>
      <hr className="custom-line m-0" />

      <div className="mx-2" style={{ minHeight:"150px", overflowY: 'auto' }}>
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
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ minWidth: '120px' }}>Part Number</th>
              <th style={{ minWidth: '150px' }}>Part Name</th>
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
              <tr key={part.quotePartId}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={selectedParts.includes(part.quotePartId)}
                    onChange={() => handleSelectPart(part.quotePartId)}
                    style={{ marginLeft: '10px' }}
                  />
                </td>
                <td>{part.partNumber}</td>
                <td>{part.partName}</td>
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

      {/* Part ekleme modalı buraya gelecek */}
    </div>
  );
};

export default QuotePartList;
