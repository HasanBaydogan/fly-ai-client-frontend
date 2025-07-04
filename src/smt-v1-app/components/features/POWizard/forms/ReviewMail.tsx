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
  supplierNames?: string[]; // Add supplier names for better display
}

const ReviewMail: React.FC<ReviewMailProps> = ({
  emailProps,
  quoteNumberId,
  rfqNumberId,
  from,
  isSendEmailSuccess,
  handleSendQuoteEmail,
  isEmailSendLoading,
  supplierNames = []
}) => {
  const navigate = useNavigate();
  const { toEmails, subject, ccEmails, bccEmails, content, base64Files } =
    emailProps;

  const handleDownload = (base64Data: string, fileName: string) => {
    try {
      // Remove any data URL prefix if present
      const base64Content = base64Data.replace(/^data:.*?;base64,/, '');

      // Convert base64 to blob
      const byteCharacters = atob(base64Content);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  // Collect all unique attachments from all supplier emails
  const getAllAttachments = () => {
    const allAttachments = [];
    const seenFilenames = new Set();

    // First collect attachments from base64Files
    if (base64Files && base64Files.length > 0) {
      base64Files.forEach(file => {
        // Format the filename to include supplier name if it's not already included
        const formattedName = file.name.includes('-')
          ? file.name
          : `PO_${quoteNumberId}-${supplierNames[0] || 'Supplier'}.pdf`;

        if (!seenFilenames.has(formattedName)) {
          seenFilenames.add(formattedName);
          allAttachments.push({
            name: formattedName,
            base64: file.base64
          });
        }
      });
    }

    // Then collect attachments from toEmails
    toEmails.forEach((email, index) => {
      if (email.attachments && email.attachments.length > 0) {
        email.attachments.forEach(attachment => {
          // Format the filename to include supplier name if it's not already included
          const formattedName = attachment.filename.includes('-')
            ? attachment.filename
            : `PO_${quoteNumberId}-${
                supplierNames[index] || `Supplier ${index + 1}`
              }.pdf`;

          if (!seenFilenames.has(formattedName)) {
            seenFilenames.add(formattedName);
            allAttachments.push({
              name: formattedName,
              base64: attachment.data
            });
          }
        });
      }
    });

    return allAttachments;
  };

  const allAttachments = getAllAttachments();

  return (
    <div className="p-4" style={{ position: 'relative' }}>
      {/* Sağ üst köşeye "Go Mail Tracking" butonu ekledik */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Button
          variant="primary"
          onClick={() => navigate('/po/list')}
          style={{ width: '120px' }}
        >
          Go PO List
        </Button>
      </div>
      <div style={{ position: 'absolute', top: '55px', right: '10px' }}>
        <Button
          variant="primary"
          onClick={() => navigate('/pi/list')}
          style={{ width: '120px' }}
        >
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
            {toEmails.length > 0
              ? toEmails
                  .flatMap(email => email.to)
                  .filter((email, index, arr) => arr.indexOf(email) === index)
                  .join(', ')
              : 'Not Provided'}
          </p>
          <p>
            <strong>CC:</strong>{' '}
            {toEmails.length > 0
              ? toEmails
                  .flatMap(email => email.cc)
                  .filter((email, index, arr) => arr.indexOf(email) === index)
                  .join(', ') || 'Not Provided'
              : 'Not Provided'}
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

          {/* Show subjects for each supplier if they differ */}
          <div>
            <strong>Subjects:</strong>
            <ul>
              {toEmails.map((email, index) => (
                <li key={index}>
                  <strong>
                    {supplierNames[index] || `Supplier ${index + 1}`}:
                  </strong>{' '}
                  {email.subject || 'No subject'}
                </li>
              ))}
            </ul>
          </div>

          {/* Show content for each supplier if they differ */}
          <div>
            <strong>Email Content:</strong>
            {toEmails.map((email, index) => (
              <div key={index} className="mb-3">
                <h6>
                  {supplierNames[index] || `Supplier ${index + 1}`} Content:
                </h6>
                <div
                  dangerouslySetInnerHTML={{
                    __html: email.body || '<p>No content provided</p>'
                  }}
                  className="border p-2 rounded"
                />
              </div>
            ))}
          </div>
          <div>
            <strong>Attachments:</strong>
            {toEmails.length > 0 ? (
              <div className="mt-3">
                {toEmails.map((email, index) => {
                  const supplierName =
                    supplierNames[index] || `Supplier ${index + 1}`;
                  // Prefer attachments from email, fallback to base64Files only if attachments are not present and only for the first supplier
                  let allSupplierAttachments: {
                    name: string;
                    base64: string;
                  }[] = [];
                  if (email.attachments && email.attachments.length > 0) {
                    allSupplierAttachments = email.attachments.map(att => ({
                      name: att.filename,
                      base64: att.data
                    }));
                  } else if (
                    index === 0 &&
                    base64Files &&
                    base64Files.length > 0
                  ) {
                    allSupplierAttachments = base64Files.map(file => ({
                      name: file.name,
                      base64: file.base64
                    }));
                  }
                  // Remove duplicates by filename
                  const uniqueAttachments = allSupplierAttachments.filter(
                    (file, idx, arr) =>
                      arr.findIndex(f => f.name === file.name) === idx
                  );
                  if (uniqueAttachments.length === 0) return null;
                  return (
                    <div key={index} className="mb-3">
                      <h6 className="mb-2">{supplierName}:</h6>
                      <ul className="list-unstyled ms-3">
                        {uniqueAttachments.map((file, fileIndex) => {
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
                          return (
                            <li key={fileIndex} className="mb-2">
                              {mimeType.startsWith('image/') && (
                                <div style={{ marginBottom: '5px' }}>
                                  <img
                                    src={`data:${mimeType};base64,${file.base64}`}
                                    alt={file.name}
                                    style={{
                                      maxWidth: '200px',
                                      display: 'block'
                                    }}
                                  />
                                </div>
                              )}
                              <Button
                                variant="link"
                                className="p-0 text-decoration-none"
                                onClick={() =>
                                  handleDownload(file.base64, file.name)
                                }
                              >
                                {file.name}
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-2">No Attachments</p>
            )}
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
