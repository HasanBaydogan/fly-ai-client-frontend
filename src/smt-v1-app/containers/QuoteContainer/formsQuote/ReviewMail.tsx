import React from 'react';
import { useMail } from '../formsQuote/MailContext';
import FeatherIcon from 'feather-icons-react';
import { EmailProps } from './WizardSendMailForm';

interface ReviewMailProps {
  emailProps: EmailProps;
}

const ReviewMail: React.FC<ReviewMailProps> = ({ emailProps }) => {
  const {
    toEmails,
    setToEmails,
    ccEmails,
    setCcEmails,
    bccEmails,
    setBccEmails,
    subject,
    setSubject,
    content,
    setContent,
    attachments,
    setAttachments,
    inputValue,
    setInputValue,
    error,
    setError
  } = emailProps;

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
        <strong>To:</strong>{' '}
        {toEmails.length > 0 ? toEmails.join(', ') : 'Not Provided'}
      </p>
      <p>
        <strong>CC:</strong>{' '}
        {ccEmails.length > 0 ? ccEmails.join(', ') : 'Not Provided'}
      </p>
      <p>
        <strong>BCC:</strong>{' '}
        {bccEmails.length > 0 ? bccEmails.join(', ') : 'Not Provided'}
      </p>
      <p>
        <strong>Quote ID:</strong> {'2551'}
      </p>
      <p>
        <strong>RFQ ID:</strong> {'2342'}
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
