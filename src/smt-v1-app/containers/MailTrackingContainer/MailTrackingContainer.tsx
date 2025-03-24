import React, { useState, useEffect } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import MailTrackingHeader from 'smt-v1-app/components/features/MailTracking/MailTrackingHeader/MailTrackingHeader';
import { deleteRfqMails, putRfqMails } from 'smt-v1-app/redux/rfqMailSlice';
import {
  getAllRFQMails,
  searchByRfqNumberId,
  searchRFQMailBySubject,
  searchByFilterParameters // API key: searchByFilterParameters
} from 'smt-v1-app/services/MailTrackingService';
import './MailTrackingContainer.css';
import { getActiveStatusFromStringStatus } from './MailTrackingHelper';
import CustomPagination from 'smt-v1-app/components/common/CustomPagination/CustomPagination';
import MailTrackingItemsBody from 'smt-v1-app/components/features/MailTracking/MailTrackingItemsBody/MailTrackingItemsBody';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import { ToastPosition } from 'react-bootstrap/esm/ToastContainer';
import RFQMailRfqNumberIdSearch from 'smt-v1-app/components/features/RFQMailRfqNumberIdSearch/RFQMailRfqNumberIdSearch';
import MailListFilterAccordion, {
  FilterKeys
} from 'smt-v1-app/components/features/MailTracking/MailListFilterAccordion';

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
  'Hide Not RFQ',
  'Released 120 Hours'
];

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
  | 'HIDE_NOT_RFQ'
  | 'RELEASED_120_HOURS';

const MailTrackingContainer = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [sinceFromDate, setSinceFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 3); // 3 gün öncesi
    return date;
  });
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRFQMail, setTotalRFQMail] = useState(0);
  const [filterTypeState, setFilterTypeState] = useState<filterType>('ALL');
  const [stringActiveStatus, setStringActiveStatus] = useState('All');

  // Yeni: Uygulanan filtreleri saklamak için state
  const [appliedFilters, setAppliedFilters] = useState<Record<
    FilterKeys,
    string[]
  > | null>(null);

  // RFQ Number Search
  const [rfqNumberSearchrfqMails, setRfqNumberSearchrfqMails] = useState<
    RFQMail[]
  >([]);
  const [isShowRFQNumberSearch, setIsShowRFQNumberSearch] = useState(false);

  // Subject Search
  const [isShowSubjectSearch, setIsShowSubjectSearch] = useState(false);
  const [subjectSearchRFQMails, setSubjectSearchRFQMails] = useState<RFQMail[]>(
    []
  );

  const [isShow, setIsShow] = useState(false);
  const [variant, setVariant] = useState('danger');
  const [messageHeader, setMessageHeader] = useState('');
  const [messageBodyText, setMessageBodyText] = useState('');
  const [position, setPosition] = useState<ToastPosition>('middle-end');

  // refreshRFQMails: Eğer appliedFilters varsa searchByFilterParameters, yoksa getAllRFQMails
  const refreshRFQMails = async () => {
    try {
      setLoading(true);
      const formattedDate = sinceFromDate.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      let response;
      if (
        appliedFilters &&
        Object.values(appliedFilters).some(arr => arr.length > 0)
      ) {
        const params = new URLSearchParams();
        if (appliedFilters.from.length > 0) {
          appliedFilters.from.forEach(val => params.append('froms', val));
        }
        if (appliedFilters.subjects.length > 0) {
          appliedFilters.subjects.forEach(val =>
            params.append('subjects', val)
          );
        }
        if (appliedFilters.nonR.length > 0) {
          appliedFilters.nonR.forEach(val =>
            params.append('rfqIdReferences', val)
          );
        }
        if (appliedFilters.dates.length > 0) {
          params.set('dates', appliedFilters.dates[0]); // sadece ilk seçili tarih gönderiliyor
        }
        if (appliedFilters.activeSales.length > 0) {
          appliedFilters.activeSales.forEach(val =>
            params.append('activeSales', val)
          );
        }
        response = await searchByFilterParameters(
          pageNo,
          pageSize,
          params.toString()
        );
      } else {
        response = await getAllRFQMails(
          pageNo,
          pageSize,
          filterTypeState,
          formattedDate
        );
      }
      if (response && response.success) {
        dispatch(deleteRfqMails());
        dispatch(putRfqMails(response.data.rfqMailPreviewResponses));
        setTotalRFQMail(response.data.totalItems);
        setTotalPage(response.data.totalPage);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Error fetching RFQ mails:', err);
    }
  };

  useEffect(() => {
    refreshRFQMails();
  }, [
    pageNo,
    pageSize,
    filterTypeState,
    sinceFromDate,
    dispatch,
    appliedFilters
  ]);

  const handleRFQNumberIdSearch = async (rfqNumberId: string) => {
    setLoading(true);
    if (rfqNumberId) {
      try {
        const response = await searchByRfqNumberId(rfqNumberId, 1, 10);
        if (response && response.data) {
          setRfqNumberSearchrfqMails(response.data);
          setIsShowRFQNumberSearch(true);
        }
      } catch (error) {
        console.error('Error searching RFQ by number ID:', error);
      }
    } else {
      setIsShowRFQNumberSearch(false);
      setRfqNumberSearchrfqMails([]);
    }
    setLoading(false);
  };

  const handleTabSelect = (stringStatus: string | null) => {
    if (stringStatus) {
      setStringActiveStatus(stringStatus);
      const filter = getActiveStatusFromStringStatus(stringStatus);
      setPageNo(1);
      setFilterTypeState(filter);
      // Eğer yeni bir sekme seçildiyse, appliedFilters temizlenir
      setAppliedFilters(null);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNo(1);
  };

  const handleSubjectSearch = async (subject: string) => {
    setLoading(true);
    if (subject) {
      try {
        const response = await searchRFQMailBySubject(subject, 1, 10);
        if (response && response.data) {
          setSubjectSearchRFQMails(response.data);
          setIsShowSubjectSearch(true);
        }
      } catch (error) {
        console.error('Error searching RFQ by subject:', error);
      }
    } else {
      setIsShowSubjectSearch(false);
      setSubjectSearchRFQMails([]);
    }
    setLoading(false);
  };

  // handleApplyFilters: Filtre akordiyonundan gelen seçili filtreleri alır
  // Eğer herhangi bir filtre seçimi varsa, API isteği yapar ve sonuçları tabloya yansıtır.
  // Ayrıca, appliedFilters state'ine de atar.
  const handleApplyFilters = async (
    selectedFilters: Record<FilterKeys, string[]>
  ) => {
    const hasSelection = Object.values(selectedFilters).some(
      arr => arr.length > 0
    );
    if (!hasSelection) {
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedFilters.from.length > 0) {
        selectedFilters.from.forEach(val => params.append('froms', val));
      }
      if (selectedFilters.subjects.length > 0) {
        selectedFilters.subjects.forEach(val => params.append('subjects', val));
      }
      if (selectedFilters.nonR.length > 0) {
        selectedFilters.nonR.forEach(val =>
          params.append('rfqIdReferences', val)
        );
      }
      if (selectedFilters.dates.length > 0) {
        params.set('dates', selectedFilters.dates[0]);
      }
      if (selectedFilters.activeSales.length > 0) {
        selectedFilters.activeSales.forEach(val =>
          params.append('activeSales', val)
        );
      }
      const response = await searchByFilterParameters(
        pageNo,
        pageSize,
        params.toString()
      );
      if (response && response.success) {
        dispatch(deleteRfqMails());
        dispatch(putRfqMails(response.data.rfqMailPreviewResponses));
        setTotalRFQMail(response.data.totalItems);
        setTotalPage(response.data.totalPage);
        // Filtre uygulandığına dair state güncelleniyor
        setAppliedFilters(selectedFilters);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="sticky-header-mail-tracking">
          <MailTrackingHeader
            loading={loading}
            sinceFromDate={sinceFromDate}
            setSinceFromDate={setSinceFromDate}
            handleRFQNumberIdSearch={handleRFQNumberIdSearch}
            setPageNo={setPageNo}
            pageSize={pageSize}
            handlePageSizeChange={handlePageSizeChange}
            handleSubjectSearch={handleSubjectSearch}
            onRefresh={refreshRFQMails}
          />
        </div>

        {isShowSubjectSearch ? (
          <RFQMailRfqNumberIdSearch
            rfqNumberSearchrfqMails={subjectSearchRFQMails}
            setIsShow={setIsShow}
            setMessageHeader={setMessageHeader}
            setMessageBodyText={setMessageBodyText}
            setVariant={setVariant}
          />
        ) : isShowRFQNumberSearch ? (
          <RFQMailRfqNumberIdSearch
            rfqNumberSearchrfqMails={rfqNumberSearchrfqMails}
            setIsShow={setIsShow}
            setMessageHeader={setMessageHeader}
            setMessageBodyText={setMessageBodyText}
            setVariant={setVariant}
          />
        ) : (
          <Tab.Container
            id="rfq-mails-tabs"
            defaultActiveKey="All"
            onSelect={handleTabSelect}
          >
            <Nav variant="underline" className="mb-3 d-flex align-items-center">
              {links.map(tab => (
                <Nav.Item key={tab}>
                  <Nav.Link eventKey={tab} className="tab-link-text-size">
                    {tab}
                  </Nav.Link>
                </Nav.Item>
              ))}
              <Nav.Item className="ms-auto">
                <MailListFilterAccordion
                  dateFrom={sinceFromDate}
                  onApplyFilters={handleApplyFilters}
                />
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey={stringActiveStatus}>
                {loading ? (
                  <LoadingAnimation />
                ) : (
                  <MailTrackingItemsBody
                    setIsShow={setIsShow}
                    setMessageHeader={setMessageHeader}
                    setMessageBodyText={setMessageBodyText}
                    setVariant={setVariant}
                  />
                )}
                <CustomPagination
                  pageNo={pageNo}
                  setPageNo={setPageNo}
                  totalPage={totalPage}
                  totalItem={totalRFQMail}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        )}

        <ToastNotification
          isShow={isShow}
          setIsShow={setIsShow}
          variant={variant}
          messageHeader={messageHeader}
          messageBodyText={messageBodyText}
          position={position}
        />
      </div>
    </>
  );
};

export default MailTrackingContainer;
