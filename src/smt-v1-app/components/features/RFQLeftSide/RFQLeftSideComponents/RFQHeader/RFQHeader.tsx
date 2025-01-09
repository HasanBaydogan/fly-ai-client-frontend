import React from 'react';
import userIcon from '../../../../../../assets/img/icons/user-icon.svg';

const RFQHeader = ({ subject, companyName, from, date }) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-end fw-bold rfq-mail-sent-date me-lg-6 me-3 mb-3">
        Date : {date}
      </div>
      <h2 className="rfq-mail-detail-subject">{subject}</h2>
      <div className="d-flex align-items-center rfq-mail-detail-header flex-xxl-row flex-column">
        <img src={userIcon} alt="" className="rfq-mail-detail-icon" />
        <div className="d-flex flex-xxl-row flex-column">
          <div className="rfq-mail-company-name mt-3 ms-2">{companyName}</div>
          <a className="rfq-mail-company-email mt-3 ms-2">{`<${from}>`}</a>
        </div>
      </div>
    </>
  );
};

export default RFQHeader;
