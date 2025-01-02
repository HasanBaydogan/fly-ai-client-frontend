import React, { useEffect, useState } from 'react';
import { Nav, Pagination, Tab, Table } from 'react-bootstrap';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

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
  const [totalPage, setTotalPage] = useState(0);
  // page size (state)
  const [pageSize, setPageSize] = useState(10);
  const [totalRFQMail, setTotalRFQMail] = useState(0);

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
      console.log(response);
      dispatch(deleteRfqMails());
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

  const handlePageChange = (pageNumber: number) => {
    setPageNo(pageNumber);
  };

  const handlePrevPage = () => {
    if (pageNo > 1) {
      setPageNo(pageNo - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNo < totalPage) {
      setPageNo(pageNo + 1);
    }
  };

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
                    reduxRfqMails.map((rfqMail, key) => (
                      <RfqMailRowItem key={key} rfqMail={rfqMail} />
                    ))}
                </tbody>
              </Table>
            )}
            <Pagination className="mb-2 justify-content-end">
              <Pagination.Prev onClick={handlePrevPage} disabled={pageNo === 1}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </Pagination.Prev>

              {/* First 3 Pages */}
              {Array.from({ length: Math.min(3, totalPage) }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === pageNo}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              {/* Ellipsis if necessary */}
              {pageNo > 4 && totalPage > 6 && <Pagination.Ellipsis disabled />}

              {/* Current Page (if not part of the first/last 3) */}
              {pageNo > 3 && pageNo < totalPage - 2 && (
                <Pagination.Item
                  active
                  onClick={() => handlePageChange(pageNo)}
                >
                  {pageNo}
                </Pagination.Item>
              )}

              {/* Ellipsis before last pages */}
              {pageNo < totalPage - 3 && totalPage > 6 && (
                <Pagination.Ellipsis disabled />
              )}

              {/* Last 3 Pages */}
              {Array.from({ length: 3 }, (_, index) => {
                const pageIndex = totalPage - 3 + index;
                if (pageIndex + 1 > 3) {
                  return (
                    <Pagination.Item
                      key={pageIndex + 1}
                      active={pageIndex + 1 === pageNo}
                      onClick={() => handlePageChange(pageIndex + 1)}
                    >
                      {pageIndex + 1}
                    </Pagination.Item>
                  );
                }
                return null;
              })}

              <Pagination.Next
                onClick={handleNextPage}
                disabled={pageNo === totalPage}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </Pagination.Next>
            </Pagination>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default MailTrackingContainer;
