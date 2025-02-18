import React, { useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import { EmailProps } from './WizardSendMailForm';

interface ReviewMailProps {
  emailProps: EmailProps;
  quoteNumberId: string;
  rfqNumberId: string;
  from: string;
}

// Helper function to determine MIME type based on file extension
const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return 'application/octet-stream';
  }
};

const ReviewMail: React.FC<ReviewMailProps> = ({
  emailProps,
  quoteNumberId,
  rfqNumberId,
  from
}) => {
  const { toEmails, subject, ccEmails, bccEmails, content, base64Files } =
    emailProps;

  return (
    <div className="p-4">
      <div className="text-center mb-5">
        <FeatherIcon icon="check-circle" size={60} className="text-success" />
        <h5>Email is sent successfully!</h5>
      </div>
      <p>
        <strong>From:</strong> {from}
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
        <strong>Quote ID:</strong> {quoteNumberId}
      </p>
      <p>
        <strong>RFQ ID:</strong> {rfqNumberId}
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
          {base64Files.length > 0
            ? base64Files.map((file, index) => {
                // Get MIME type based on file name extension.
                const mimeType = getMimeType(file.name);

                // Construct the data URL using the determined MIME type.
                const dataUrl = file.base64;

                return (
                  <li key={index}>
                    {/* Show a preview if the file is an image */}
                    {mimeType.startsWith('image/') && (
                      <div style={{ marginBottom: '5px', marginTop: '30px' }}>
                        <img
                          src={dataUrl}
                          alt={file.name}
                          style={{ maxWidth: '200px', display: 'block' }}
                        />
                      </div>
                    )}
                    <a
                      href={dataUrl}
                      download={file.name}
                      className="text-primary hover:underline"
                    >
                      {file.name}
                    </a>
                  </li>
                );
              })
            : 'No Attachments'}
        </ul>
      </div>
    </div>
  );
};

export default ReviewMail;
