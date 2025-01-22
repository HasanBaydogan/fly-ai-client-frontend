import React from 'react';
import RFQHeader from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import StatusButtonGroup from '../../components/features/RFQLeftSide/RFQLeftSideComponents/StatusButtonGroup/StatusButtonGroup';
import Header from './QuoteListHeader';
import Client from '../../components/features/RFQRightSide/RFQRightSideComponents/Client/Client';
import PartList from '../../components/features/RFQRightSide/RFQRightSideComponents/PartList/PartList';
import AlternativePartList from '../../components/features/RFQRightSide/RFQRightSideComponents/AlternativePartList/AlternativePartList';
import RFQRightSideFooter from '../../components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideFooter/RFQRightSideFooter';
import { MailItemMoreDetail, RFQ } from './RfqContainerTypes';
import { mockMailItem, mockRFQ } from './mockData';

const QuoteListContainer = ({
  mailItem = mockMailItem,
  rfq = mockRFQ
}: {
  mailItem?: MailItemMoreDetail;
  rfq?: RFQ;
}) => {
  if (!mailItem || !rfq) return null;

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
    </div>
  );
};

export default QuoteListContainer;
