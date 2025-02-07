import React from 'react';
import pdfIcon from '../../../../../../assets/img/icons/pdf_icon.svg';
import attachmentIcon from '../../../../../../assets/img/icons/attachment-icon.svg';
import { openAttachment } from 'smt-v1-app/services/AttachmentService';
import { MailItemAttachment } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';

const RFQAttachments = ({
  attachments
}: {
  attachments: MailItemAttachment[];
}) => {
  const openAttachmentFromDB = async (attachmentId: string) => {
    const resp = await openAttachment(attachmentId);
    openPdfInNewTab(resp.data);
  };

  const openPdfInNewTab = file => {
    // Decode the Base64 string
    const binaryData = atob(file.data);
    // Convert the binary data to a Uint8Array
    const arrayBuffer = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      arrayBuffer[i] = binaryData.charCodeAt(i);
    }

    // Create a Blob object
    const blob = new Blob([arrayBuffer], { type: file.contentType });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and simulate a click
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName; // Set the file name
    link.target = '_blank'; // Open in a new tab
    document.body.appendChild(link); // Append to the DOM
    link.click(); // Trigger the click
    document.body.removeChild(link); // Remove the link after download
  };

  return (
    <>
      <div className="d-flex d-flex align-items-center my-2 mt-4">
        <img
          src={attachmentIcon}
          alt=""
          className="rfq-mail-attachment-icon mt-1"
        />
        <h3 className="rfq-mail-attachment-header ms-3">Attachments</h3>
      </div>
      <hr className="custom-line w-100 m-0" />

      <div className="d-flex justify-content-start rfq-mail-attachments-container mt-3">
        {/* PDF Component Start */}
        {attachments &&
          attachments.map(mailAttach => (
            <a
              key={mailAttach.attachmentId}
              //href="path/to/RFQ022.pdf" // Update with the actual path to your PDF
              rel="noopener noreferrer"
              className="d-flex flex-column justify-content-center align-items-center mx-3"
              onClick={() => openAttachmentFromDB(mailAttach.attachmentId)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={pdfIcon}
                className="rfq-product-mail-detail-file-icon"
                alt=""
              />
              <span className="rfq-product-mail-detail-file-name text-center mt-2">
                {mailAttach.fileName}
              </span>
            </a>
          ))}

        {/* PDF Component End */}
      </div>
    </>
  );
};

export default RFQAttachments;
