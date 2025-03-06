import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'components/base/DatePicker';
import SearchBox from 'components/common/SearchBox';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const MailTrackingHeader = ({
  loading,
  sinceFromDate,
  setSinceFromDate,
  handleRFQNumberIdSearch,
  setPageNo,
  pageSize,
  handlePageSizeChange,
  handleSubjectSearch
}: {
  loading: boolean;
  sinceFromDate: Date;
  setSinceFromDate: React.Dispatch<React.SetStateAction<Date>>;
  handleRFQNumberIdSearch: (rfqNumberId: string) => void;
  setPageNo: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
  handleSubjectSearch: (subject: string) => void;
}) => {
  return (
    <Row className="mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-center">
          <Form.Group as={Col} xs={9}>
            <Form.Label>SINCE</Form.Label>
            <DatePicker
              placeholder="Select Date"
              hideIcon
              value={sinceFromDate} // Pass the initial date
              onChange={selectedDates => {
                // `selectedDates` is an array, and the first element is the selected date
                setPageNo(1);
                const selectedDate = selectedDates[0];
                setSinceFromDate(selectedDate); // Pass the Date object to the state
              }}
            />
          </Form.Group>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <SearchBox
            placeholder="Search by RFQ Id"
            className="pt-3"
            inputClassName="rounded-pill my-4"
            onChange={e => handleRFQNumberIdSearch(e.target.value)}
            style={{ width: '160px', marginRight: '12px' }}
          />
          <SearchBox
            placeholder="Search by Subject"
            className="pt-3"
            inputClassName="rounded-pill my-4"
            onChange={e => handleSubjectSearch(e.target.value)}
            style={{ width: '200px' }}
          />
          <Form.Select
            size="sm"
            style={{
              width: '70px',
              height: '40px',
              padding: '0px',
              paddingLeft: '10px',
              marginLeft: '10px',
              marginTop: '11px'
            }}
            value={pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Select>
        </div>
      </div>
    </Row>
  );
};

export default MailTrackingHeader;
