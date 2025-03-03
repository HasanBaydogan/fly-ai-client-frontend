import React from 'react';
import { Badge, Form } from 'react-bootstrap';

const Header = ({
  date,
  rfqNumberId,
  revisionNumber,
  clientRFQId,
  status,
  quoteId,
  bgColor,
  clientName,
  textColor,
  quoteComment,
  setQuoteComment
}: {
  date: string;
  rfqNumberId: string;
  quoteId: string;
  clientName: string;
  clientRFQId: string;
  revisionNumber: number;
  quoteComment: string;
  setQuoteComment: React.Dispatch<React.SetStateAction<string>>;
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
        <div className="d-flex justify-content-end me-1">
          <span className="last-modified">Last Modified Date:</span>
          <span className="last-modified-date">{' ' + date}</span>
        </div>

        {/* RFQ Header */}
        <div
          className="d-flex mt-6 align-item-center justify-content-between"
          style={{ gap: '250px' }}
        >
          <div className="flex-column" style={{ gap: '50px' }}>
            <h4 className="mb-3 ">
              Quote Id: <span className="valueRFQ-id">{' ' + quoteId}</span>
            </h4>
            <h4>
              Revision:{' '}
              <Badge bg="primary" className="small mb-3">
                REVISION {revisionNumber}
              </Badge>
            </h4>
            <h4 className="mb-3">
              RFQ Id: <span className="valueRFQ-id">{' ' + rfqNumberId}</span>
            </h4>
            <h4 className="mb-4">
              ClientRFQ Id:{' '}
              <span className="valueRFQ-id">{' ' + clientRFQId}</span>
            </h4>
            <h3 className="mb-4">
              Client: <span className="valueRFQ-id">{' ' + clientName}</span>
            </h3>
            <h4 className="d-flex ">
              Comment:
              <Form.Group
                className="mb-3 px-3"
                controlId="exampleForm.ControlTextarea1"
                style={{ width: '400px' }}
              >
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={quoteComment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setQuoteComment(e.target.value)
                  }
                />
              </Form.Group>
            </h4>
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
