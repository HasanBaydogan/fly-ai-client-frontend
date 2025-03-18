import React from 'react';
import RfqMailRowItem from '../RfqMailRowItem/RfqMailRowItem';
import { Table } from 'react-bootstrap';

interface RFQMail {
  rfqMailId: string;
  rfqNumberId: string;
  rfqMailStatus:
    | 'UNREAD'
    | 'OPEN'
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'Hide Not RFQ'
    | 'SPAM';
  assignTo: string | null;
  comment: string | null;
  emailSender: string;
  subject: string;
  isNoQuote: boolean;
  isNotRFQ: boolean;
  isHideNotRFQ: boolean;
  isSpam: boolean;
  mailSentDate: string;
  pricedProductCount: number;
  totalProductCount: number;
  shortEmailContent: string;
}

const RFQMailRfqNumberIdSearch = ({
  rfqNumberSearchrfqMails,
  setIsShow,
  setMessageHeader,
  setMessageBodyText,
  setVariant
}: {
  rfqNumberSearchrfqMails: RFQMail[];
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="table-scroll-container">
      <Table responsive>
        <thead className="sticky-top-table-header-rfq">
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
          {rfqNumberSearchrfqMails &&
            rfqNumberSearchrfqMails.map(rfqMail => (
              <RfqMailRowItem
                key={rfqMail.rfqMailId}
                rfqMail={rfqMail}
                setIsShow={setIsShow}
                setMessageHeader={setMessageHeader}
                setMessageBodyText={setMessageBodyText}
                setVariant={setVariant}
              />
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RFQMailRfqNumberIdSearch;
