import React from 'react';
import { useMail } from '../formsQuote/MailContext';
import FeatherIcon from 'feather-icons-react';

const ReviewMail: React.FC = () => {
  const { to, cc, bcc, subject, content, attachments, quoteId, rfqId } =
    useMail();

  return (
    <div className="p-4">
      <div className="text-center mb-5">
        <FeatherIcon icon="check-circle" size={60} className="text-success" />
        <h5>Email is sent successfully!</h5>
      </div>
      <p>
        <strong>From:</strong> username@company.com
      </p>
      <p>
        <strong>To:</strong> {to.length > 0 ? to.join(', ') : 'Not Provided'}
      </p>
      <p>
        <strong>CC:</strong> {cc.length > 0 ? cc.join(', ') : 'Not Provided'}
      </p>
      <p>
        <strong>BCC:</strong> {bcc.length > 0 ? bcc.join(', ') : 'Not Provided'}
      </p>
      <p>
        <strong>Quote ID:</strong> {quoteId || 'Not Provided'}
      </p>
      <p>
        <strong>RFQ ID:</strong> {rfqId || 'Not Provided'}
      </p>
      <p>
        <strong>Content:</strong>
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: content || '<p>Not Provided</p>' }}
      />
      <div>
        <strong>Attachments:</strong>
        <ul>
          {attachments.length > 0
            ? attachments.map((file, index) => <li key={index}>{file.name}</li>)
            : 'No Attachments'}
        </ul>
      </div>
    </div>
  );
};

export default ReviewMail;
