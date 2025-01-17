import React, { useEffect, useState } from 'react';
import RFQMailLog from '../RFQMailLog/RFQMailLog';
import { getRFQMailLogsFromDB } from 'smt-v1-app/services/MailTrackingService';

const RFQMailLogs = ({ rfqMailId }: { rfqMailId: string }) => {
  const [rfqMailLogs, setRFQMailLogs] = useState<RFQMailLog[]>(); // Logs array
  const [error, setError] = useState<string | null>(null);

  const fetchRfqMails = async (id: string) => {
    try {
      const response = await getRFQMailLogsFromDB(id);
      setRFQMailLogs(response.data); // Gelen veriyi state'e yaz
    } catch (err) {
      setError('Error fetching RFQ Mail Logs');
      console.error(err);
    }
  };

  useEffect(() => {
    if (rfqMailId) {
      fetchRfqMails(rfqMailId);
    }
  }, [rfqMailId]); // Bağımlılık olarak sadece rfqMailId

  return (
    <div>
      <p className="ms-2">LOGS</p>
      {rfqMailLogs &&
        rfqMailLogs.map((rfqMailLog, key) => (
          <RFQMailLog
            key={key}
            userFullName={rfqMailLog.userFullName}
            actionType={rfqMailLog.actionType}
            date={rfqMailLog.date}
            changeValues={rfqMailLog.changeValues}
            enterItemsNumber={rfqMailLog.enterItemsNumber}
            pointValues={rfqMailLog.pointValues}
            quoteValues={rfqMailLog.quoteValues}
            userId={rfqMailLog.userId}
            assignedOrBlockedSubject={rfqMailLog.assignedOrBlockedSubject}
          />
        ))}
    </div>
  );
};

export default RFQMailLogs;
