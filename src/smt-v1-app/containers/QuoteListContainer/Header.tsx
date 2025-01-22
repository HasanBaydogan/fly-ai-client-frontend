import React from 'react';

const Header = ({
  date,
  rfqNumberId,
  clientRFQId,
  status,
  quoteId,
  bgColor,
  textColor
}: {
  date: string;
  rfqNumberId: string;
  quoteId: string;
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
          className="d-flex mt-6 align-item-center justify-content-between"
          style={{ gap: '250px' }}
        >
          <div className="flex-column" style={{ gap: '50px' }}>
            <h3>
              Quote Id: <span className="valueRFQ-id">{' ' + quoteId}</span>
            </h3>
            <h3>
              RFQ Id: <span className="valueRFQ-id">{' ' + rfqNumberId}</span>
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
      </div>
    </>
  );
};

export default Header;
