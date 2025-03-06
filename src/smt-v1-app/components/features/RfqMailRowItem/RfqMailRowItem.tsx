import React, { useEffect, useState } from 'react';
import rightHalfArrow from '../../../../assets/img/icons/right-half-arrow.svg';
import NotRfqIcon from '../../../../assets/img/icons/not_rfq_icon.svg';
import NoQuoteIcon from '../../../../assets/img/icons/no_quote_icon.svg';
import SpamIcon from '../../../../assets/img/icons/spam_icon.svg';
import userIcon from '../../../../assets/img/icons/user-icon.svg';
import {
  getColorStyles,
  INACTIVE_STATUS,
  mapPointTypeToRfqMailStatus
} from './RfqMailRowHelper';
import completetionIcon from '../../../../assets/img/icons/completetionIcon.svg';
import './RfqMailRowItem.css';
import { point } from 'smt-v1-app/services/MailTrackingService';
import RFQMailDetailModal from '../RFQMailDetailModal/RFQMailDetailModal';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const RfqMailRowItem = ({
  rfqMail,
  setIsShow,
  setMessageHeader,
  setMessageBodyText,
  setVariant
}: {
  rfqMail: RFQMail;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isDetailShow, setIsDetailShow] = useState(false);
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [isNotRFQActive, setIsNotRFQActive] = useState(false);
  const [isNoQuoteActive, setIsNoQuoteActive] = useState(false);
  const [isSpamActive, setSpamActive] = useState(false);
  const [componentKey, setComponentKey] = useState(0);
  const [rfqMailStatus, setRfqMailStatus] = useState(rfqMail.rfqMailStatus);

  const forceReRender = () => {
    setComponentKey(prevKey => prevKey + 1);
  };

  const handleStatusColor = (rfqMailStatus: string) => {
    const returnColors = getColorStyles(rfqMailStatus);
    setBgColor(returnColors.bgColor);
    setTextColor(returnColors.textColor);
  };

  useEffect(() => {
    handleStatusColor(rfqMailStatus);
    // Default olarak hepsini aktif yapıyoruz
    setIsNotRFQActive(false);
    setIsNoQuoteActive(false);
    setSpamActive(false);

    if (INACTIVE_STATUS.includes(rfqMailStatus as 'PQ' | 'FQ')) {
      setIsNotRFQActive(true);
      setIsNoQuoteActive(true);
      setSpamActive(true);
      return;
    } else if (rfqMailStatus === 'WFS') {
      setIsNotRFQActive(true);
      setIsNoQuoteActive(false);
      setSpamActive(true);
      return;
    } else if (rfqMailStatus === 'PQ') {
      setIsNotRFQActive(true);
      setIsNoQuoteActive(true);
      setSpamActive(true);
      return;
    }
    // Sadece aktif olanı `true` yapıyoruz
    if (rfqMail.isNotRFQ) {
      setIsNotRFQActive(true); // Not_RFQ aktif
    } else if (rfqMail.isNoQuote) {
      setIsNoQuoteActive(true); // No_Quote aktif
    } else if (rfqMail.isSpam) {
      setSpamActive(true); // Spam aktif
    }
  }, [rfqMail]);

  const handlePoint = async (
    pointType: 'SPAM' | 'NOT_RFQ' | 'NO_QUOTE' | 'UNREAD'
  ) => {
    const response = await point(rfqMail.rfqMailId, pointType);
    if (response && response.statusCode === 200) {
      switch (pointType) {
        case 'SPAM':
          setIsNotRFQActive(false);
          setIsNoQuoteActive(false);
          setSpamActive(true);
          break;
        case 'NOT_RFQ':
          setIsNotRFQActive(true);
          setIsNoQuoteActive(false);
          setSpamActive(false);
          break;
        case 'NO_QUOTE':
          setIsNotRFQActive(false);
          setIsNoQuoteActive(true);
          setSpamActive(false);
          break;
      }
      forceReRender();
      const mappedStatus = mapPointTypeToRfqMailStatus(pointType);
      setRfqMailStatus(mappedStatus);
      handleStatusColor(mappedStatus);
      setVariant('success');
      setMessageHeader('Success');
      setMessageBodyText('RFQMail pointed as ' + pointType);
      setIsShow(true);
    } else if (response && response.statusCode === 406) {
      setVariant('danger');
      setMessageHeader('RFQMail Point Error');
      setMessageBodyText('Priced RFQMail cannot be pointed as ' + pointType);
      setIsShow(true);
    } else {
      setVariant('danger');
      setMessageHeader('Unknown Error');
      setMessageBodyText('There is unknown error');
      setIsShow(true);
    }
  };

  return (
    <>
      <tr>
        <td>
          <img
            src={rightHalfArrow}
            alt="right_Arrow"
            className="rfq-mail-item-rigth-arrow"
            onClick={() => setIsDetailShow(true)}
          />
        </td>
        <td>{rfqMail.rfqNumberId}</td>
        <td>
          <div className="d-flex mt-3">
            {/* Not RFQ Icon */}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-not-rfq">Mark as Not RFQ</Tooltip>}
            >
              <img
                src={NotRfqIcon}
                alt="Not RFQ Icon"
                className={`me-2 ${
                  isNotRFQActive
                    ? 'rfq-mail-listing-icon-opacity'
                    : 'rfq-mail-listing-icon-hover'
                }`}
                onClick={
                  isNotRFQActive ? undefined : () => handlePoint('NOT_RFQ')
                }
              />
            </OverlayTrigger>

            {/* No Quote Icon */}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-no-quote">Mark as No Quote</Tooltip>
              }
            >
              <img
                src={NoQuoteIcon}
                alt="No Quote Icon"
                className={`me-2 ${
                  isNoQuoteActive
                    ? 'rfq-mail-listing-icon-opacity'
                    : 'rfq-mail-listing-icon-hover'
                }`}
                onClick={
                  isNoQuoteActive ? undefined : () => handlePoint('NO_QUOTE')
                }
              />
            </OverlayTrigger>

            {/* Spam Icon */}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-spam">Mark as Spam</Tooltip>}
            >
              <img
                src={SpamIcon}
                alt="Spam Icon"
                className={`me-2 ${
                  isSpamActive
                    ? 'rfq-mail-listing-icon-opacity'
                    : 'rfq-mail-listing-icon-hover'
                }`}
                onClick={isSpamActive ? undefined : () => handlePoint('SPAM')}
              />
            </OverlayTrigger>
          </div>
        </td>
        <td>
          <div className="d-flex">
            <img src={userIcon} alt="user-icon" className="me-2" />
            <span className="fw-bold">{rfqMail.emailSender}</span>
          </div>
          <div className="mt-1">
            <span>{rfqMail.shortEmailContent}</span>
          </div>
        </td>
        <td>
          <div className="d-flex mt-3 justify-content-start">
            <div className="px-2 rounded" style={{ backgroundColor: bgColor }}>
              <span
                className="fw-bold"
                style={{ color: textColor, fontSize: '12px' }}
              >
                {rfqMailStatus}
              </span>
            </div>
          </div>
        </td>
        <td>
          <div className="mt-3">
            <a href="#">{rfqMail.assignTo == null ? '' : rfqMail.assignTo}</a>
          </div>
        </td>
        <td>
          <div className="mt-3">
            <p>{rfqMail.comment == null ? '' : rfqMail.comment}</p>
          </div>
        </td>
        <td>
          <div className="d-flex flex-column align-items-end">
            <span className="fw-bold" style={{ fontSize: '12px' }}>
              {rfqMail.mailSentDate}
            </span>
            <div className="d-flex mt-1 ">
              <span className="fw-bold me-2">
                {rfqMail.pricedProductCount}/{rfqMail.totalProductCount}
              </span>
              <img src={completetionIcon} alt="" />
            </div>
          </div>
        </td>
      </tr>

      {isDetailShow ? (
        <RFQMailDetailModal
          rfqMailStatus={rfqMailStatus}
          setRfqMailStatus={setRfqMailStatus}
          isDetailShow={isDetailShow}
          setIsDetailShow={setIsDetailShow}
          bgColor={bgColor}
          textColor={textColor}
          rfqMailId={rfqMail.rfqMailId}
          handleStatusColor={handleStatusColor}
        />
      ) : null}
    </>
  );
};

export default RfqMailRowItem;
