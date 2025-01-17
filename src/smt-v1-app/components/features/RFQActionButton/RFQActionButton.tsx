import { cl } from '@fullcalendar/core/internal-common';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import {
  convertOpenToWFS,
  isOpenRFQMail
} from 'smt-v1-app/services/MailTrackingService';

interface RFQActionButtonsProps {
  rfqMailDetail: RFQMailDetail;
  rfqMailId: string;
  setRfqMailDetail: React.Dispatch<React.SetStateAction<RFQMailDetail>>;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
  setRfqMailRowStatus: React.Dispatch<
    React.SetStateAction<
      'WFS' | 'PQ' | 'FQ' | 'UNREAD' | 'OPEN' | 'SPAM' | 'NOT_RFQ' | 'NO_QUOTE'
    >
  >;
  handleStatusColor: (rfqMailStatus: string) => void;
}

const RFQActionButtons: React.FC<RFQActionButtonsProps> = ({
  rfqMailDetail,
  rfqMailId,
  setIsShow,
  setMessageHeader,
  setMessageBodyText,
  setVariant,
  setRfqMailRowStatus,
  handleStatusColor
}) => {
  const navigation = useNavigate();
  const [statusType, setStatusType] = useState(rfqMailDetail.rfqMailStatus);

  const [isLoading, setIsLoading] = useState(false);
  const [openIsLoading, setOpenIsLoading] = useState(false);
  const [convertWFSIsLoading, setConvertWFSIsLoading] = useState(false);
  const [convertToQuoteIsLoading, setConvertToQuoteIsLoading] = useState(false);

  const openRFQMail = async () => {
    setIsLoading(true);
    setOpenIsLoading(true);
    const response = await isOpenRFQMail(rfqMailId);
    // 200
    if (response.statusCode === 200) {
      if (response.data) {
        toastError('Invalid Operation', 'Already RFQMail opened');
      } else {
        navigation('/rfqs/rfq?rfqMailId=' + rfqMailId);
      }
    }
    setOpenIsLoading(false);
    setIsLoading(false);
  };

  const convertToWFS = async () => {
    setIsLoading(true);
    setConvertWFSIsLoading(true);
    const resp = await convertOpenToWFS(rfqMailId);
    if (resp && resp.statusCode === 200) {
      setStatusType('WFS');
      setRfqMailRowStatus('WFS');
      handleStatusColor('WFS');
      toastSuccess(
        'Success WFS Conversation',
        'RFQ Mail is converted WFS successfully'
      );
    } else {
      toastError('An Unknown error', 'An Unknown error occurs');
    }
    setIsLoading(false);
    setConvertWFSIsLoading(false);
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
  function toastSuccess(messageHeader: string, message: string) {
    setVariant('success');
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
            {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
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
              {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
            </Button>
            <Button
              variant="outline-warning"
              onClick={convertToWFS}
              disabled={isLoading}
            >
              {convertWFSIsLoading ? <LoadingAnimation /> : 'Convert to WFS'}
            </Button>
          </>
        );
      case 'WFS':
        return (
          <>
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={openRFQMail}
              disabled={isLoading}
            >
              {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
            </Button>
            <Button variant="outline-success" disabled={isLoading}>
              {convertToQuoteIsLoading ? (
                <LoadingAnimation />
              ) : (
                'Convert to Quote'
              )}
            </Button>
          </>
        );
      case 'PQ':
        return (
          <>
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={openRFQMail}
              disabled={isLoading}
            >
              {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
            </Button>
            <Button variant="outline-success" disabled={isLoading}>
              {convertToQuoteIsLoading ? (
                <LoadingAnimation />
              ) : (
                'Convert to Quote'
              )}
            </Button>
          </>
        );
      case 'FQ':
        return (
          <>
            <Button
              variant="outline-primary"
              className="me-3"
              onClick={openRFQMail}
              disabled={isLoading}
            >
              {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
            </Button>
            <Button variant="outline-success" disabled={isLoading}>
              {convertToQuoteIsLoading ? (
                <LoadingAnimation />
              ) : (
                'Convert to Quote'
              )}
            </Button>
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
