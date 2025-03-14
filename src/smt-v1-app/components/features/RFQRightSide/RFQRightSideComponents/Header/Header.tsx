import React, { useState } from 'react';
import POModal from 'smt-v1-app/components/features/PoModal/POModal';

const Header = ({
  date,
  rfqNumberId,
  clientRFQId,
  status,
  bgColor,
  textColor
}: {
  date: string;
  rfqNumberId: string;
  clientRFQId: string;
  status:
    | 'UNREAD'
    | 'OPEN'
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'SPAM';
  bgColor: string;
  textColor: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div>
        {/* Last Modified Date */}
        <div className="d-flex justify-content-end me-6">
          <span className="last-modified">Last Modified Date:</span>
          <span className="last-modified-date">{' ' + date}</span>
        </div>

        {/* RFQ Header */}
        <div
          className="d-flex mt-6 align-items-center justify-content-between"
          style={{ gap: '250px' }}
        >
          <div
            className="d-flex justify-content-between"
            style={{ gap: '50px' }}
          >
            <h3>
              RFQ Id:{' '}
              <button
                className="valueRFQ-id"
                onClick={openModal}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'blue',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {rfqNumberId}
              </button>
            </h3>
          </div>
          <div>
            <div className="px-2 rounded" style={{ backgroundColor: bgColor }}>
              <span
                className="fw-bold"
                style={{ color: textColor, fontSize: '14px' }}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* React Bootstrap Modal */}
        <POModal
          show={isModalOpen}
          onHide={closeModal}
          rfqNumberId={rfqNumberId}
        />
      </div>
    </>
  );
};

export default Header;
