import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface RFQActionButtonsProps {
  statusType: string;
  rfqMailId: string;
}

const RFQActionButtons: React.FC<RFQActionButtonsProps> = ({
  statusType,
  rfqMailId
}) => {
  const navigation = useNavigate();

  const renderActionButtons = () => {
    switch (statusType) {
      case 'UNREAD':
        return (
          <Button
            variant="outline-primary"
            onClick={() => navigation('/rfqs/rfq?rfqMailId=' + rfqMailId)}
          >
            Open RFQ Mail
          </Button>
        );
      case 'OPEN':
        return (
          <>
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={() => navigation('/test/rfq-creation')}
            >
              Open RFQ Mail
            </Button>
            <Button variant="outline-warning">Convert to WFS</Button>
          </>
        );
      case 'WFS':
      case 'PQ':
      case 'FQ':
        return (
          <>
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={() => navigation('/test/rfq-creation')}
            >
              Open RFQ Mail
            </Button>
            <Button variant="outline-success">Convert to Quote</Button>
          </>
        );
      case 'NO QUOTE':
        return <Button variant="outline-secondary">There is a Quote</Button>;
      case 'SPAM':
        return <Button variant="outline-secondary">No Spam</Button>;
      case 'NOT RFQ':
        return <Button variant="outline-secondary">It is a RFQ</Button>;
      default:
        return null;
    }
  };

  return <>{renderActionButtons()}</>;
};

export default RFQActionButtons;
