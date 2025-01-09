import React from 'react';
import pdfIcon from '../../../../../../assets/img/icons/pdf_icon.svg';
import attachmentIcon from '../../../../../../assets/img/icons/attachment-icon.svg';

const RFQAttachments = ({
  attachments
}: {
  attachments: MailItemAttachment[];
}) => {
  return (
    <>
      <div className="d-flex d-flex align-items-center mb-2">
        <img
          src={attachmentIcon}
          alt=""
          className="rfq-mail-attachment-icon mt-1"
        />
        <h3 className="rfq-mail-attachment-header ms-3">Attachments</h3>
      </div>
      <hr className="custom-line w-60 m-0" />

      <div className="d-flex justify-content-start rfq-mail-attachments-container mt-3">
        {/* PDF Component Start */}
        {attachments &&
          attachments.map(mailAttach => (
            <a
              key={mailAttach.attachmentId}
              //href="path/to/RFQ022.pdf" // Update with the actual path to your PDF
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex flex-column justify-content-center align-items-center mx-3"
            >
              <img
                src={pdfIcon}
                className="rfq-product-mail-detail-file-icon"
                alt=""
              />
              <span className="rfq-product-mail-detail-file-name text-center">
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
