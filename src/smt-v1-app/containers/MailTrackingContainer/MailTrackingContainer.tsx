import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'components/base/DatePicker';
import SearchBox from 'components/common/SearchBox';
import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import MailTrackingHeader from 'smt-v1-app/components/features/MailTrackingHeader/MailTrackingHeader';
import { getAllRFQMails, searchByRfqNumberId } from 'smt-v1-app/services/MailTrackingService';

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
  const [activeStatus, setActiveStatus] = useState('ALL');
  // data (state)
  const [rfqMails, setRfMails] = useState<RFQMailRow[]>();

  const [searchText, setSearchText] = useState('');
  // search text RFQ Number (state)

  const [statusType, setStatusType] = useState();
  // statusType (state)


  // useEffect data fetch
  useEffect(() => {
    setLoading(true);
    const getRFQMailsFromDB = async () => {
      
      const formattedDate = sinceFromDate.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const response = await getAllRFQMails(pageNo,pageSize,activeStatus,formattedDate);
      console.log(response);
      console.log(formattedDate);
    }
    getRFQMailsFromDB();
    setLoading(false);
  },[pageNo,pageSize,activeStatus,sinceFromDate])
  
  // handle Not RFQ , No Quote and Spam icons
  // handle refresh button
  // onSelect data fetching

  const handleRFQNumberIdSearch = async (rfqNumberId : string) => {
    setLoading(true);
    const response = await searchByRfqNumberId(rfqNumberId,1,10);

    console.log(response);

    setLoading(false);
  }

  return (
    <>
    <MailTrackingHeader 
        loading={loading} 
        sinceFromDate={sinceFromDate} 
        setSinceFromDate={setSinceFromDate}
        handleRFQNumberIdSearch={handleRFQNumberIdSearch}
        />
     
    </>
  );
};

export default MailTrackingContainer;
