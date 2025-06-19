import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ProspectSuppliersModalProps {
  show: boolean;
  onHide: () => void;
  partNumber: string | null;
}

const relationBadge = (relation: string) => {
  let color = '';
  let textColor = '#333';
  switch (relation) {
    case 'Sold':
      color = '#b6ffb6';
      break;
    case 'Quoted':
      color = '#ffe066';
      break;
    case 'Brand':
      color = '#ffd6b6';
      break;
    case 'Segment':
      color = '#e6e6e6';
      textColor = '#888';
      break;
    default:
      color = '#f8f9fa';
  }
  return (
    <span
      style={{
        background: color,
        color: textColor,
        borderRadius: 16,
        padding: '2px 14px',
        fontWeight: 600,
        fontSize: '0.95em',
        display: 'inline-block',
        minWidth: 70,
        textAlign: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }}
    >
      {relation}
    </span>
  );
};

const mockRows = [
  {
    supplier: 'A',
    relation: 'Sold',
    date: '15.03.2025',
    sale: '150',
    purchase: '140',
    qty: '15',
    margin: '7%',
    client: 'A',
    quote: true,
    badge: 'Sold',
    badgeColor: '#b6ffb6',
    checked: false
  },
  {
    supplier: 'B',
    relation: 'Sold',
    date: '12.01.2025',
    sale: '132',
    purchase: '125',
    qty: '25',
    margin: '6%',
    client: 'B',
    quote: true,
    badge: 'Sold',
    badgeColor: '#eaffb6',
    checked: false
  },
  {
    supplier: 'C',
    relation: 'Quoted',
    date: '22.05.2025',
    sale: '125',
    purchase: '120',
    qty: '30',
    margin: '4%',
    client: 'C',
    quote: true,
    badge: 'Quoted',
    badgeColor: '#ffe066',
    checked: false
  },
  {
    supplier: 'D',
    relation: 'Quoted',
    date: '5.12.2024',
    sale: '130',
    purchase: '123',
    qty: '12',
    margin: '6%',
    client: 'D',
    quote: true,
    badge: 'Quoted',
    badgeColor: '#ffe066',
    checked: false
  },
  {
    supplier: 'E',
    relation: 'Quoted',
    date: '18.03.2023',
    sale: '102',
    purchase: '95',
    qty: '8',
    margin: '7%',
    client: 'E',
    quote: true,
    badge: 'Quoted',
    badgeColor: '#ffeab6',
    checked: false
  },
  {
    supplier: 'F',
    relation: 'Brand',
    date: 'N/A',
    sale: 'N/A',
    purchase: 'N/A',
    qty: 'N/A',
    margin: 'N/A',
    client: 'F',
    quote: false,
    badge: 'Brand',
    badgeColor: '#ffd6b6',
    checked: false
  },
  {
    supplier: 'G',
    relation: 'Segment',
    date: 'N/A',
    sale: 'N/A',
    purchase: 'N/A',
    qty: 'N/A',
    margin: 'N/A',
    client: 'G',
    quote: false,
    badge: 'Segment',
    badgeColor: '#e6e6e6',
    checked: false
  },
  {
    supplier: 'H',
    relation: 'Segment',
    date: 'N/A',
    sale: 'N/A',
    purchase: 'N/A',
    qty: 'N/A',
    margin: 'N/A',
    client: 'H',
    quote: false,
    badge: 'Segment',
    badgeColor: '#e6e6e6',
    checked: false
  }
];

const ProspectSuppliersModal: React.FC<ProspectSuppliersModalProps> = ({
  show,
  onHide,
  partNumber
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      dialogClassName="rounded-4"
    >
      <Modal.Header closeButton className="  text-white rounded-top-4">
        <Modal.Title className="fw-bold">Prospect Suppliers</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ background: '#ffff', borderRadius: '0 0 1rem 1rem' }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table
            className="table table-bordered align-middle mb-0"
            style={{
              minWidth: '1000px',
              tableLayout: 'fixed',
              borderRadius: 12,
              overflow: 'hidden'
            }}
          >
            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th
                  colSpan={10}
                  className="text-center bg-light fs-5 fw-semibold"
                  style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                >
                  Prospect Suppliers for PN:{' '}
                  <span className="text-primary">{partNumber}</span>
                </th>
              </tr>
              <tr className="bg-secondary bg-opacity-10 text-dark">
                <th style={{ width: '100px' }}>ALL</th>
                <th style={{ width: '100px' }}>Supplier</th>
                <th style={{ width: '100px' }}>Relation</th>
                <th style={{ width: '100px' }}>Date</th>
                <th style={{ width: '100px' }}>Sale/Quote</th>
                <th style={{ width: '100px' }}>Purchase</th>
                <th style={{ width: '100px' }}>Quantity</th>
                <th style={{ width: '100px' }}>Margin</th>
                <th style={{ width: '100px' }}>Client</th>
                <th style={{ width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {mockRows.map((row, idx) => (
                <tr
                  key={row.supplier}
                  className="table-row"
                  style={{
                    transition: 'background 0.2s',
                    cursor: row.quote ? 'pointer' : 'default'
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = '#f0f6ff')
                  }
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td className="text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="fw-semibold">{row.supplier}</td>
                  <td>{relationBadge(row.relation)}</td>
                  <td>{row.date}</td>
                  <td>{row.sale}</td>
                  <td>{row.purchase}</td>
                  <td>{row.qty}</td>
                  <td>{row.margin}</td>
                  <td>{row.client}</td>
                  <td>
                    {row.quote && (
                      <button
                        className="btn  btn-sm px-3 fw-bold shadow-sm"
                        style={{
                          background: ' #0d6efd ',
                          color: 'white',
                          border: 'none',
                          borderRadius: 20
                        }}
                      >
                        Quote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 d-flex justify-content-end">
          <button
            className="btn btn-info btn-lg px-4 fw-bold shadow-sm"
            style={{
              background: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: 24
            }}
          >
            Send RFQ
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          borderTop: 'none',
          background: '#f7fafd',
          borderRadius: '0 0 1rem 1rem'
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onHide}
          className="fw-semibold px-4 rounded-pill"
        >
          Kapat
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProspectSuppliersModal;
