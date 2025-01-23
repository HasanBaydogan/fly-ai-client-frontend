import React, { useState } from 'react';
import RFQHeader from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import StatusButtonGroup from '../../components/features/RFQLeftSide/RFQLeftSideComponents/StatusButtonGroup/StatusButtonGroup';
import Header from '../../components/features/QuoteList/QuoteListHeader';
import Client from '../../components/features/RFQRightSide/RFQRightSideComponents/Client/Client';
import AlternativePartList from '../../components/features/RFQRightSide/RFQRightSideComponents/AlternativePartList/AlternativePartList';
import RFQRightSideFooter from '../../components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideFooter/RFQRightSideFooter';
import { MailItemMoreDetail, RFQ, Contact } from './RfqContainerTypes';
import {
  mockMailItem,
  mockRFQ
} from '../../components/features/QuoteList/mockData';
import {
  RFQPart,
  AlternativeRFQPart
} from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import QuoteContactsList from '../../components/features/QuoteList/QuoteListRightComponents/QuoteContactList/QuoteContactsList';
import QuotePartList from '../../components/features/QuoteList/QuoteListRightComponents/QuotePartList/QuotePartList';
import QuoteListAlternativeParts from '../../components/features/QuoteList/QuoteListRightComponents/QuoteListAlternativeParts/QuoteListAlternativeParts';
import CustomButton from '../../../components/base/Button';

const QuoteListContainer = ({
  mailItem = mockMailItem,
  rfq = mockRFQ
}: {
  mailItem?: MailItemMoreDetail;
  rfq?: RFQ;
}) => {
  const [parts, setParts] = useState<RFQPart[]>(rfq?.savedRFQItems || []);
  const [alternativeParts, setAlternativeParts] = useState<
    AlternativeRFQPart[]
  >(rfq?.alternativeRFQPartResponses || []);
  const [contacts, setContacts] = useState(rfq?.contacts || []);

  if (!mailItem || !rfq) return null;

  const handleDeletePart = (partNumber: string) => {
    setParts(prevParts =>
      prevParts.filter(part => part.partNumber !== partNumber)
    );
  };

  const handleAddPart = (rfqPart: RFQPart) => {
    setParts(prevParts => [...prevParts, rfqPart]);
  };

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  return (
    <div className="rfq-container d-flex flex-wrap justify-content-around">
      <div className="rfq-left">
        <RFQHeader
          subject={mailItem.subject}
          companyName={mailItem.senderCompanyName}
          from={mailItem.from}
          date={mailItem.mailDate}
        />
        <RFQContent content={mailItem.mailContentItemResponses} />
        <RFQAttachments attachments={mailItem.mailItemAttachmentResponses} />
        <StatusButtonGroup />
      </div>
      <div className="rfq-right">
        <div>
          <Header
            date={rfq.lastModifiedDate}
            rfqNumberId={rfq.rfqNumberId}
            quoteId={rfq.quoteId}
            clientRFQId={rfq.clientRFQNumberId}
            clientName={rfq.client}
            bgColor="#f57c00"
            textColor="#ffffff"
            status={rfq.rfqMailStatus}
          />
        </div>
        <div>
          <QuoteContactsList
            contacts={contacts}
            handleAddContact={handleAddContact}
            handleDeleteContact={handleDeleteContact}
          />
        </div>
        <div>
          <QuotePartList
            parts={parts}
            handleDeletePart={handleDeletePart}
            handleAddPart={handleAddPart}
            alternativeParts={alternativeParts}
            setAlternativeParts={setAlternativeParts}
          />
          <QuoteListAlternativeParts alternativeParts={alternativeParts} />
          <hr className="custom-line w-100 m-0" />
        </div>
        <div
          className="d-flex mt-3 mb-3"
          style={{
            justifyContent: 'space-between'
          }}
        >
          <div>
            <CustomButton
              variant="danger"
              onClick={() => {
                // Handle Go to RFQ Mail click
                console.log('Go to RFQ Mail clicked');
              }}
            >
              Go to RFQ Mail
            </CustomButton>
          </div>
          <div>
            <div>
              <CustomButton
                variant="secondary"
                onClick={() => {
                  // Handle Go to RFQ Mail click
                  console.log('Go to RFQ Mail clicked');
                }}
              >
                Go to RFQ Mail
              </CustomButton>
            </div>
            <div className="mt-3">
              <CustomButton
                variant="success"
                onClick={() => {
                  // Handle Quote Wizard click
                  console.log('Quote Wizard clicked');
                }}
              >
                Quote Wizard
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteListContainer;
