import React, { useEffect } from 'react';
import FeatherIcon from 'feather-icons-react';
import { EmailProps } from './WizardSendMailForm';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { useNavigate } from 'react-router-dom';

interface ReviewMailProps {
  emailProps: EmailProps;
  quoteNumberId: string;
  rfqNumberId: string;
  from: string;
  isSendEmailSuccess: boolean;
  handleSendQuoteEmail: () => void;
  isEmailSendLoading: boolean;
}

const ReviewMail: React.FC<ReviewMailProps> = ({
  emailProps,
  quoteNumberId,
  rfqNumberId,
  from,
  isSendEmailSuccess,
  handleSendQuoteEmail,
  isEmailSendLoading
}) => {
  const navigate = useNavigate();
  const { toEmails, subject, ccEmails, bccEmails, content, base64Files } =
    emailProps;

  return (
    <div className="p-4" style={{ position: 'relative' }}>
      {/* Sağ üst köşeye "Go Mail Tracking" butonu ekledik */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Button variant="primary" onClick={() => navigate('/pi/list')}>
          Go PI List
        </Button>
      </div>

      {isSendEmailSuccess ? (
        <>
          <div className="text-center mb-5">
            <FeatherIcon
              icon="check-circle"
              size={60}
              className="text-success"
            />
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
            dangerouslySetInnerHTML={{
              __html: content || '<p>Not Provided</p>'
            }}
          />
          <div>
            <strong>Attachments:</strong>
            <ul>
              {base64Files.length > 0
                ? base64Files.map((file, index) => {
                    // Get MIME type based on file name extension.
                    const ext = file.name.split('.').pop()?.toLowerCase();
                    const mimeType =
                      ext === 'jpg' || ext === 'jpeg'
                        ? 'image/jpeg'
                        : ext === 'png'
                        ? 'image/png'
                        : ext === 'gif'
                        ? 'image/gif'
                        : ext === 'pdf'
                        ? 'application/pdf'
                        : 'application/octet-stream';

                    // Use the base64 data URL directly since it's already in the correct format
                    const dataUrl = file.base64;

                    return (
                      <li key={index}>
                        {/* Show a preview if the file is an image */}
                        {mimeType.startsWith('image/') && (
                          <div
                            style={{ marginBottom: '5px', marginTop: '30px' }}
                          >
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
        </>
      ) : (
        <>
          <div className="text-center mb-5">
            <FeatherIcon
              icon="x-circle"
              size={60}
              className="text-danger mb-2"
            />
            <h5>Email is not sent!</h5>
            <p className="mt-3">An Error Occurs when sending an email</p>

            <Button
              variant="phoenix-primary"
              id="pdf-button"
              onClick={handleSendQuoteEmail}
              disabled={isEmailSendLoading}
            >
              {isEmailSendLoading ? (
                <LoadingAnimation />
              ) : (
                <>
                  <FeatherIcon icon="refresh-ccw" />
                  <span className="ms-2">Resend Email</span>
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewMail;
