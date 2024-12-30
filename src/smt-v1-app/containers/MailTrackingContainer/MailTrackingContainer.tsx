import React, { useEffect, useState } from 'react';
import { getAllRFQMails } from 'smt-v1-app/services/MailTrackingService';

interface RFQMailRow {
  rfqMailId: string;
  rfqNumberId: string;
  isNotRFQ: boolean;
  isNoQuote: boolean;
  isSpam: boolean;
  emailSender: string;
  shortEmailContent: string;
  rfqMailStatus: StatusType;
  assignTo: string;
  comment: string;
  mailSentDate: string;
  totalProductCount: number;
  pricedProductCount: number;
}
type StatusType =
  | 'UNREAD'
  | 'OPEN'
  | 'WFS'
  | 'PQ'
  | 'FQ'
  | 'NOT RFQ'
  | 'NO QUOTE'
  | 'SPAM';

const MailTrackingContainer = () => {
  // loading until everything ready (state)
  const [loading, setLoading] = useState(false);
  // date since from (state)
  const [sinceFromDate, setSinceFromDate] = useState(new Date());
  // refresh spin active (state),
  const [isActiveRefreshSpin, setIsActiveRefreshSprin] = useState(false);

  // page no (state)
  const [pageNo, setPageNo] = useState(1);
  // page size (state)
  const [pageSize, setPageSize] = useState(10);

  // page activestatus(state)
  const [activeStatus, setActiveStatus] = useState('All');
  // data (state)
  const [rfqMails, setRfMails] = useState<RFQMailRow[]>();

  const [searchText, setSearchText] = useState('');
  // search text RFQ Number (state)

  const [statusType, setStatusType] = useState();
  // statusType (state)

  // useEffect data fetch
  useEffect(() => {
    const getRFQMailsFromDB = async () => {
      const response = await getAllRFQMails(pageNo,pageSize,"ALL",sinceFromDate.toDateString());
      console.log(response);
    }
    getRFQMailsFromDB();
  },[])
  
  // handle Not RFQ , No Quote and Spam icons
  // handle refresh button
  // onSelect data fetching

  return (
    <div className="d-flex justify-content-center align-items-center">
      Mail Tracking Container
    </div>
  );
};

export default MailTrackingContainer;
