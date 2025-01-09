import React, { useEffect } from 'react';
import RFQHeader from './RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from './RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from './RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import StatusButtonGroup from './RFQLeftSideComponents/StatusButtonGroup/StatusButtonGroup';

const RFQLeftSide = ({ mailItem }: { mailItem: MailItemMoreDetail }) => {
  return (
    <>
      <div className="rfq-left">
        {/* RFQ Header */}
        <RFQHeader
          subject={mailItem.subject}
          companyName={mailItem.senderCompanyName}
          from={mailItem.from}
          date={mailItem.mailDate}
        />

        {/* RFQ Content */}
        <RFQContent content={mailItem.mailContentItemResponses} />

        {/* RFQ Attachments */}
        <RFQAttachments attachments={mailItem.mailItemAttachmentResponses} />

        {/* Status Buttons */}
        <StatusButtonGroup />
      </div>
    </>
  );
};

export default RFQLeftSide;
