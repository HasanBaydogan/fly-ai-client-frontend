import { cl } from '@fullcalendar/core/internal-common';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import {
  convertOpenToWFS,
  isOpenRFQMail,
  reverseRFQMail,
  point
} from 'smt-v1-app/services/MailTrackingService';
import { convertRFQToQuote } from 'smt-v1-app/services/QuoteService';
import { mapPointTypeToRfqMailStatus } from '../RfqMailRowItem/RfqMailRowHelper';

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
      | 'WFS'
      | 'PQ'
      | 'FQ'
      | 'UNREAD'
      | 'OPEN'
      | 'SPAM'
      | 'NOT_RFQ'
      | 'NO_QUOTE'
      | 'Hide Not RFQ'
    >
  >;
  handleStatusColor: (rfqMailStatus: string) => void;
  onCancel: () => void; // Cancel butonu için
}

const RFQActionButtons: React.FC<RFQActionButtonsProps> = ({
  rfqMailDetail,
  rfqMailId,
  setIsShow,
  setMessageHeader,
  setMessageBodyText,
  setVariant,
  setRfqMailRowStatus,
  handleStatusColor,
  onCancel
}) => {
  const navigation = useNavigate();
  const [statusType, setStatusType] = useState<
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'UNREAD'
    | 'OPEN'
    | 'SPAM'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'Hide Not RFQ'
  >(rfqMailDetail.rfqMailStatus);

  const [isLoading, setIsLoading] = useState(false);
  const [openIsLoading, setOpenIsLoading] = useState(false);
  const [convertWFSIsLoading, setConvertWFSIsLoading] = useState(false);
  const [convertToQuoteIsLoading, setConvertToQuoteIsLoading] = useState(false);

  // disable durumlarını tanımlıyoruz: Belirtilen durumlarda No Quote ve Spam butonları gizlenecek.
  const disableNoQuote =
    statusType === 'FQ' ||
    statusType === 'PQ' ||
    statusType === 'NOT_RFQ' ||
    statusType === 'NO_QUOTE' ||
    statusType === 'SPAM';
  const disableSpam =
    statusType === 'FQ' ||
    statusType === 'PQ' ||
    statusType === 'WFS' ||
    statusType === 'NOT_RFQ' ||
    statusType === 'NO_QUOTE' ||
    statusType === 'SPAM';

  const openRFQMail = async () => {
    setIsLoading(true);
    setOpenIsLoading(true);
    const response = await isOpenRFQMail(rfqMailId);
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
    // console.log('Resp', resp);
    // console.log('rfqMailId', rfqMailId);
    // debugger;
    if (resp && resp.statusCode === 200) {
      setStatusType('WFS');
      setRfqMailRowStatus('WFS');
      handleStatusColor('WFS');
      toastSuccess(
        'Success WFS Conversation',
        'RFQ Mail is converted WFS successfully'
      );
    } else if (resp?.statusCode === 422) {
      toastError('Error', 'First open and save RFQMail then convert to WFS');
    } else {
      toastError('Unknown Error', 'An Unknown error occurs');
    }
    setIsLoading(false);
    setConvertWFSIsLoading(false);
  };

  const handleReverseStatus = async () => {
    const response = await reverseRFQMail(rfqMailDetail.rfqMailId);
    if (response && response.statusCode === 200) {
      toastSuccess('Success', 'RFQMail is converted to UNREAD');
      setStatusType('UNREAD');
      setRfqMailRowStatus('UNREAD');
      handleStatusColor('UNREAD');
    } else {
      toastError('Error', 'Unknown Error');
    }
  };

  const handleConvertToQuote = async () => {
    setIsLoading(true);
    setConvertToQuoteIsLoading(true);
    const response = await convertRFQToQuote(rfqMailDetail.rfqMailId);
    if (response && response.statusCode === 200) {
      toastSuccess(
        'Successful Quote',
        rfqMailDetail.rfqMailNumberRefId + ' is converted to Quote'
      );
      setTimeout(() => {
        navigation('/quotes/quote?quoteId=' + response.data.quoteId);
        setIsLoading(false);
        setConvertToQuoteIsLoading(false);
      }, 1500);
    } else {
      toastError('Unknown Error', 'There is unknown error');
      setIsLoading(false);
      setConvertToQuoteIsLoading(false);
    }
  };

  const handlePoint = async (pointType: 'SPAM' | 'NO_QUOTE') => {
    const response = await point(rfqMailId, pointType);
    if (response && response.statusCode === 200) {
      const mappedStatus = mapPointTypeToRfqMailStatus(pointType);
      setStatusType(mappedStatus);
      setRfqMailRowStatus(mappedStatus);
      handleStatusColor(mappedStatus);
      toastSuccess('Success', 'RFQMail pointed as ' + pointType);
    } else if (response && response.statusCode === 406) {
      toastError(
        'RFQMail Point Error',
        'Priced RFQMail cannot be pointed as ' + pointType
      );
    } else {
      toastError('Unknown Error', 'There is unknown error');
    }
  };

  function toastError(messageHeader: string, message: string) {
    setVariant('danger');
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

  return (
    <>
      {/* Üst Div: Sadece Cancel Butonu, sola yaslı */}
      <div
        style={{
          marginBottom: '0.5rem',
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'flex-start'
        }}
      >
        <Button variant="danger" style={{ color: 'white' }} onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {/* Alt Div: İki sütuna bölünmüş */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Sol Kolon: No Quote ve Spam Butonları, sola yaslı */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-start'
          }}
        >
          {!disableNoQuote && (
            <Button
              variant="outline-secondary"
              onClick={() => handlePoint('NO_QUOTE')}
            >
              No Quote
            </Button>
          )}
          {!disableSpam && (
            <Button
              variant="outline-secondary"
              onClick={() => handlePoint('SPAM')}
            >
              Spam
            </Button>
          )}
        </div>
        {/* Sağ Kolon: Diğer Butonlar, sağa yaslı */}
        <div
          style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}
        >
          {statusType === 'UNREAD' && (
            <Button
              variant="outline-primary"
              onClick={openRFQMail}
              disabled={isLoading}
            >
              {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
            </Button>
          )}
          {statusType === 'OPEN' && (
            <>
              <Button
                variant="outline-primary"
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
          )}
          {(statusType === 'WFS' ||
            statusType === 'PQ' ||
            statusType === 'FQ') && (
            <>
              <Button
                variant="outline-primary"
                onClick={openRFQMail}
                disabled={isLoading}
              >
                {openIsLoading ? <LoadingAnimation /> : 'Open RFQ Mail'}
              </Button>
              <Button
                variant="outline-success"
                onClick={handleConvertToQuote}
                disabled={isLoading}
              >
                {convertToQuoteIsLoading ? (
                  <LoadingAnimation />
                ) : (
                  'Convert to Quote'
                )}
              </Button>
            </>
          )}
          {(statusType === 'NO_QUOTE' ||
            statusType === 'SPAM' ||
            statusType === 'NOT_RFQ') && (
            <Button variant="outline-secondary" onClick={handleReverseStatus}>
              {statusType === 'NO_QUOTE'
                ? 'There is a Quote'
                : statusType === 'SPAM'
                ? 'No Spam'
                : 'It is a RFQ'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default RFQActionButtons;
