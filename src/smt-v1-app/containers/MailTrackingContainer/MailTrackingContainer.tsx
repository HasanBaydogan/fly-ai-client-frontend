import React, { useEffect, useState } from 'react';
import { Nav, Tab, Table } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import MailTrackingHeader from 'smt-v1-app/components/features/MailTrackingHeader/MailTrackingHeader';
import RfqMailRowItem from 'smt-v1-app/components/features/RfqMailRowItem/RfqMailRowItem';
import {
  deleteRfqMails,
  putRfqMails,
  useRFQMailsSelector
} from 'smt-v1-app/redux/rfqMailSlice';
import {
  getAllRFQMails,
  searchByRfqNumberId
} from 'smt-v1-app/services/MailTrackingService';
import { getActiveStatusFromStringStatus } from './MailTrackingHelper';
import './MailTrackingContainer.css';

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
  const reduxRfqMails = useRFQMailsSelector();

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
  const [filterType, setFilterType] = useState<filterType>('ALL');
  const [stringActiveStatus, setStringActiveStatus] = useState('All');
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
      console.log(response);
      dispatch(deleteRfqMails());
      dispatch(putRfqMails(response.data));
    };
    getRFQMailsFromDB();
    setLoading(false);
  }, [pageNo, pageSize, filterType, sinceFromDate]);

  // handle Not RFQ , No Quote and Spam icons
  // handle refresh button
  // onSelect data fetching

  const handleRFQNumberIdSearch = async (rfqNumberId: string) => {
    setLoading(true);
    const response = await searchByRfqNumberId(rfqNumberId, 1, 10);

    console.log(response);

    setLoading(false);
  };

  const handleTabSelect = (stringStatus: string | null) => {
    if (stringStatus) {
      setStringActiveStatus(stringStatus); // Update the active tab key
      const filterType = getActiveStatusFromStringStatus(stringStatus);
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
            {loading ? (
              <LoadingAnimation />
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th></th>
                    <th>RFQ Id</th>
                    <th></th>
                    <th></th>
                    <th>Status</th>
                    <th>Assign To</th>
                    <th>Comments</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reduxRfqMails &&
                    reduxRfqMails.map(rfqMail => (
                      <RfqMailRowItem rfqMail={rfqMail} />
                    ))}
                </tbody>
              </Table>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default MailTrackingContainer;
