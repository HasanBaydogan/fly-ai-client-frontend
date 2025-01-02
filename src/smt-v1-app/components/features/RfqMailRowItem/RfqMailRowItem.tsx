import React, { useEffect, useState } from 'react'
import rightHalfArrow from "../../../../assets/img/icons/right-half-arrow.svg";
import NotRfqIcon from "../../../../assets/img/icons/not_rfq_icon.svg";
import NoQuoteIcon from "../../../../assets/img/icons/no_quote_icon.svg";
import SpamIcon from "../../../../assets/img/icons/spam_icon.svg";
import userIcon from "../../../../assets/img/icons/user-icon.svg";
import { getColorStyles } from './CustomBadgeHelper';
import completetionIcon from "../../../../assets/img/icons/completetionIcon.svg";
import "./RfqMailRowItem.css";

const RfqMailRowItem = ({rfqMail} : {rfqMail : RFQMail}) => {
    const [isDetailShow, setIsDetailShow] = useState(false);
    const [bgColor, setBgColor] = useState('');
    const [textColor, setTextColor] = useState('');
    useEffect(() => {
        const returnColors = getColorStyles(rfqMail.rfqMailStatus);
        setBgColor(returnColors.bgColor);
        setTextColor(returnColors.textColor);
      });

  return (
    <>
      <tr>
        <td>
          <img
            src={rightHalfArrow}
            alt="rigth_Arrow"
            className="rfq-mail-item-rigth-arrow"
            onClick={() => setIsDetailShow(true)}
          />
        </td>
        <td>{rfqMail.rfqNumberId}</td>
        <td>
          <div className="d-flex mt-3">
            <img
              src={NotRfqIcon}
              alt="Not RFQ Icon"
              className="me-2 rfq-mail-listing-icon-hover"
            />
            <img
              src={NoQuoteIcon}
              alt="No Quote Icon"
              className="me-2 rfq-mail-listing-icon-hover"
            />
            <img
              src={SpamIcon}
              alt="Spam Icon"
              className="me-2 rfq-mail-listing-icon-hover"
            />
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
                {rfqMail.rfqMailStatus}
              </span>
            </div>
          </div>
        </td>
        <td>
          <div className="mt-3">
            <a href="#">{rfqMail.assignTo == null ? "" : rfqMail.assignTo}</a>
          </div>
        </td>
        <td>
          <div className="mt-3">
            <p>{rfqMail.comment == null ? "" : rfqMail.comment}</p>
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

     {/* <RFQMailDetailModal
        isDetailShow={isDetailShow}
        setIsDetailShow={setIsDetailShow}
        rfqProps={props}
        bgColor={bgColor}
        textColor={textColor}
      /> */}
    </>
  )
}

export default RfqMailRowItem
