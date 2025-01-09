import { cl } from '@fullcalendar/core/internal-common';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { isOpenRFQMail } from 'smt-v1-app/services/MailTrackingService';

interface RFQActionButtonsProps {
  statusType: string;
  rfqMailId: string;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
}

const RFQActionButtons: React.FC<RFQActionButtonsProps> = ({
  statusType,
  rfqMailId,
  setIsShow,
  setMessageHeader,
  setMessageBodyText,
  setVariant
}) => {
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const openRFQMail = async () => {
    setIsLoading(true);
    const response = await isOpenRFQMail(rfqMailId);
    console.log(response);
    // 200
    if (response.statusCode === 200) {
      if (response.data) {
        toastError('Invalid Operation', 'Already RFQMail opened');
      } else {
        navigation('/rfqs/rfq?rfqMailId=' + rfqMailId);
      }
    }
    setIsLoading(false);
  };

  function toastError(messageHeader: string, message: string) {
    setVariant('danger');
    setMessageHeader(messageHeader);
    setMessageBodyText(message);
    setIsShow(true);
  }
  function toastInfo(messageHeader: string, message: string) {
    setVariant('info');
    setMessageHeader(messageHeader);
    setMessageBodyText(message);
    setIsShow(true);
  }

  const renderActionButtons = () => {
    switch (statusType) {
      case 'UNREAD':
        return (
          <Button
            variant="outline-primary"
            onClick={openRFQMail}
            disabled={isLoading}
          >
            {isLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
          </Button>
        );
      case 'OPEN':
        return (
          <>
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={openRFQMail}
              disabled={isLoading}
            >
              {isLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
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
              onClick={openRFQMail}
              disabled={isLoading}
            >
              Open RFQ Mail
            </Button>
            <Button variant="outline-success">Convert to Quote</Button>
          </>
        );
      case 'NO_QUOTE':
        return <Button variant="outline-secondary">There is a Quote</Button>;
      case 'SPAM':
        return <Button variant="outline-secondary">No Spam</Button>;
      case 'NOT_RFQ':
        return <Button variant="outline-secondary">It is a RFQ</Button>;
      default:
        return null;
    }
  };

  return <>{renderActionButtons()}</>;
};

export default RFQActionButtons;
