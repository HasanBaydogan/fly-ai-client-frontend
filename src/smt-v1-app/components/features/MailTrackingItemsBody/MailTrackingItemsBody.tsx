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
    <>
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
    </>
  );
};

export default MailTrackingItemsBody;
