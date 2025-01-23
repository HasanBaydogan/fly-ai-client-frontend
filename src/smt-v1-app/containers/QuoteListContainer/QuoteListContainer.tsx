import React, { useState } from 'react';
import RFQHeader from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import StatusButtonGroup from '../../components/features/RFQLeftSide/RFQLeftSideComponents/StatusButtonGroup/StatusButtonGroup';
import Header from './QuoteListHeader';
import Client from '../../components/features/RFQRightSide/RFQRightSideComponents/Client/Client';
import PartList from '../../components/features/RFQRightSide/RFQRightSideComponents/PartList/PartList';
import AlternativePartList from '../../components/features/RFQRightSide/RFQRightSideComponents/AlternativePartList/AlternativePartList';
import RFQRightSideFooter from '../../components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideFooter/RFQRightSideFooter';
import { MailItemMoreDetail, RFQ, Contact } from './RfqContainerTypes';
import { mockMailItem, mockRFQ } from './mockData';
import {
  RFQPart,
  AlternativeRFQPart
} from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import QuoteContactsList from './QuoteContactsList';

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
  >([]);
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

  const handleDeleteAlternativePartAccordingToParentRFQNumber = (
    alternPartNumber: string
  ) => {
    setAlternativeParts(prevParts =>
      prevParts.filter(
        part => part.parentRFQPart.partNumber !== alternPartNumber
      )
    );
  };

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  return (
    <div className="rfq-container d-flex flex-wrap justify-content-around ">
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
          <PartList
            parts={parts}
            handleDeletePart={handleDeletePart}
            handleAddPart={handleAddPart}
            alternativeParts={alternativeParts}
            handleDeleteAlternativePartAccordingToParentRFQNumber={
              handleDeleteAlternativePartAccordingToParentRFQNumber
            }
            setAlternativeParts={setAlternativeParts}
          />
          <hr className="custom-line w-100 m-0" />
        </div>
      </div>
    </div>
  );
};

export default QuoteListContainer;
