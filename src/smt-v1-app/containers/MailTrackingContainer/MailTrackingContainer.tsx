import React, { useEffect, useState } from 'react';
import { Nav, Tab, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import MailTrackingHeader from 'smt-v1-app/components/features/MailTrackingHeader/MailTrackingHeader';
import { deleteRfqMails, putRfqMails } from 'smt-v1-app/redux/rfqMailSlice';
import {
  getAllRFQMails,
  searchByRfqNumberId
} from 'smt-v1-app/services/MailTrackingService';
import { getActiveStatusFromStringStatus } from './MailTrackingHelper';
import './MailTrackingContainer.css';
import CustomPagination from 'smt-v1-app/components/common/CustomPagination/CustomPagination';
import MailTrackingItemsBody from 'smt-v1-app/components/features/MailTrackingItemsBody/MailTrackingItemsBody';

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
const links = [
  'All',
  'My Issues',
  'Unread',
  'Open',
  'WFS',
  'PQ',
  'FQ',
  'NOT RFQ',
  'NO Quote',
  'Released 120 Hours'
];
type StatusType =
  | 'UNREAD'
  | 'OPEN'
  | 'WFS'
  | 'PQ'
  | 'FQ'
  | 'NOT RFQ'
  | 'NO QUOTE'
  | 'SPAM';

type filterType =
  | 'ALL'
  | 'MY_ISSUES'
  | 'UNREAD'
  | 'OPEN'
  | 'WFS'
  | 'PQ'
  | 'FQ'
  | 'NOT_RFQ'
  | 'NO_QUOTE'
  | 'RELEASED_120_HOURS';

const MailTrackingContainer = () => {
  const dispatch = useDispatch();

  // loading until everything ready (state)
  const [loading, setLoading] = useState(false);
  // date since from (state)
  const [sinceFromDate, setSinceFromDate] = useState(new Date());
  // refresh spin active (state),
  const [isActiveRefreshSpin, setIsActiveRefreshSprin] = useState(false);

  // page no (state)
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  // page size (state)
  const [pageSize, setPageSize] = useState(10);
  const [totalRFQMail, setTotalRFQMail] = useState(0);

  // page activestatus(state)
  const [filterType, setFilterType] = useState<filterType>('ALL');
  const [stringActiveStatus, setStringActiveStatus] = useState('All');
  // data (state)
  const [rfqMails, setRfMails] = useState<RFQMailRow[]>();

  const [isTextSearch, setIsTextSearch] = useState(true);
  const [searchText, setSearchText] = useState('');
  // search text RFQ Number (state)

  const [statusType, setStatusType] = useState();
  // statusType (state)

  // useEffect data fetch
  useEffect(() => {
    const getRFQMailsFromDB = async () => {
      setLoading(true);
      const formattedDate = sinceFromDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const response = await getAllRFQMails(
        pageNo,
        pageSize,
        filterType,
        formattedDate
      );
      dispatch(deleteRfqMails());
      console.log(response);
      dispatch(putRfqMails(response.data.rfqMailPreviewResponses));
      setTotalRFQMail(response.data.totalItems);
      setTotalPage(response.data.totalPage);
      setLoading(false);
    };
    getRFQMailsFromDB();
  }, [pageNo, pageSize, filterType, sinceFromDate]);

  // handle Not RFQ , No Quote and Spam icons
  // handle refresh button
  // onSelect data fetching

  const handleRFQNumberIdSearch = async (rfqNumberId: string) => {
    setLoading(true);
    const response = await searchByRfqNumberId(rfqNumberId, 1, 10);

    //console.log(response);

    setLoading(false);
  };

  const handleTabSelect = (stringStatus: string | null) => {
    if (stringStatus) {
      setStringActiveStatus(stringStatus); // Update the active tab key
      const filterType = getActiveStatusFromStringStatus(stringStatus);
      setPageNo(1);
      setFilterType(filterType);
    }
  };

  return (
    <>
      <MailTrackingHeader
        loading={loading}
        sinceFromDate={sinceFromDate}
        setSinceFromDate={setSinceFromDate}
        handleRFQNumberIdSearch={handleRFQNumberIdSearch}
        setPageNo={setPageNo}
      />

      <Tab.Container
        id="rfq-mails-tabs"
        defaultActiveKey="All"
        onSelect={handleTabSelect}
      >
        <Nav variant="underline" className="mb-3">
          {links.map(tab => (
            <Nav.Item key={tab}>
              <Nav.Link eventKey={tab} className="tab-link-text-size">
                {tab}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={stringActiveStatus}>
            {loading ? <LoadingAnimation /> : <MailTrackingItemsBody />}
            <CustomPagination
              pageNo={pageNo}
              setPageNo={setPageNo}
              totalPage={totalPage}
              totalItem={totalRFQMail}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default MailTrackingContainer;
