import React from 'react';
import { Table } from 'react-bootstrap';
import RfqMailRowItem from 'smt-v1-app/components/features/RfqMailRowItem/RfqMailRowItem';
import { useRFQMailsSelector } from 'smt-v1-app/redux/rfqMailSlice';

const MailTrackingItemsBody = ({
  setIsShow,
  setMessageHeader,
  setMessageBodyText,
  setVariant
}: {
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const reduxRfqMails = useRFQMailsSelector();

  return (
    <div className="table-scroll-container">
      <Table responsive>
        <thead className="sticky-top-table-header-rfq">
          <tr>
            <th style={{ width: '2%' }}></th>
            <th style={{ width: '6%' }}>ID</th>
            <th style={{ width: '7%' }}>Actions</th>
            <th style={{ width: '35%' }}>Mails</th>
            <th style={{ width: '8%' }}>Status</th>
            <th style={{ width: '7%' }}>Assignments</th>
            <th style={{ width: '20%' }}>Comments</th>
            <th style={{ width: '10%' }}>Date/Parts</th>
          </tr>
        </thead>

        <tbody>
          {reduxRfqMails &&
            reduxRfqMails.map((rfqMail, key) => (
              <RfqMailRowItem
                key={key}
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

export default MailTrackingItemsBody;
