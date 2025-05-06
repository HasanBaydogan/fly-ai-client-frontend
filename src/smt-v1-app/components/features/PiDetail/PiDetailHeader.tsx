import React, { useState, useEffect } from 'react';
import { Badge, Form } from 'react-bootstrap';
import POModal from 'smt-v1-app/components/features/PıModal/PIModal';
import { Link, useLocation } from 'react-router-dom';
import RFQAttachments from '../RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import { MailItemMoreDetail } from 'smt-v1-app/containers/PiDetailContainer/QuoteContainerTypes';
import PiAttachments from './PiAttachments';
import { MailItemAttachment } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';

interface HeaderProps {
  poRequestedDate: string;
  piNumberId: string;
  quoteNumberId: string;
  clientName: string;
  clientRFQId: string;
  revisionNumber: number;
  companyNameAddress: string;
  setCompanyNameAddress: React.Dispatch<React.SetStateAction<string>>;
  // status:
  //   | 'UNREAD'
  //   | 'OPEN'
  //   | 'WFS'
  //   | 'PQ'
  //   | 'FQ'
  //   | 'NOT_RFQ'
  //   | 'NO_QUOTE'
  //   | 'SPAM';
  attachments?: MailItemAttachment[];
}

const Header: React.FC<HeaderProps> = ({
  poRequestedDate,
  quoteNumberId,
  piNumberId,
  quoteNumberId: initialQuoteId,
  clientName,
  clientRFQId,
  revisionNumber,
  companyNameAddress,
  setCompanyNameAddress,
  attachments
}) => {
  // useLocation ile URL'e erişip query parametrelerini alıyoruz.
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlQuoteId = queryParams.get('quoteNumberId');
  const [mailItemMoreDetailResponse, setMailItemMoreDetailResponse] =
    useState<MailItemMoreDetail>();

  // Eğer URL'den quoteNumberId varsa onu state'e atıyoruz, yoksa parent'dan gelen değeri kullanıyoruz.
  const [currentQuoteId, setCurrentQuoteId] = useState<string>(
    urlQuoteId ?? initialQuoteId
  );

  // Eğer URL değişirse state güncellensin.
  useEffect(() => {
    if (urlQuoteId && urlQuoteId !== currentQuoteId) {
      setCurrentQuoteId(urlQuoteId);
    }
  }, [urlQuoteId, currentQuoteId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div>
        {/* Last Modified Date */}
        <div className="d-flex justify-content-end me-1"></div>
        {/* RFQ Header */}
        <h2 className="mt-2 text-info bolt">PI Detail</h2>
        <div
          className="d-flex mt-4 align-item-center justify-content-between"
          style={{ gap: '250px' }}
        >
          <div className="flex-column" style={{ gap: '50px' }}>
            <h4 className="mb-3">
              PI Id: <span className="valueRFQ-id"> {' ' + piNumberId}</span>
            </h4>
            <h4 className="mb-3 ">
              Quote Id:{' '}
              <span className="valueRFQ-id">{' ' + quoteNumberId}</span>
            </h4>
          </div>
          <div>
            <div className="px-2 rounded">
              <h5 className="last-modified-poRequestedDate mb-3">
                PO Requested Date:{' ' + poRequestedDate}
              </h5>
              <h4>
                Revision:{' '}
                <Badge bg="primary" className="small mb-3">
                  REVISION {revisionNumber}
                </Badge>
              </h4>

              <h5 className="last-modified-poRequestedDate"></h5>

              {/* <span
                className="fw-bold"
                style={{ color: textColor, fontSize: '14px' }}
              >
                {status}
              </span> */}
            </div>
          </div>
        </div>
        <hr className="custom-line m-0 mb-4" />
        {/* <h4 className="mb-4">
          ClientRFQ Id: <span className="valueRFQ-id">{' ' + clientRFQId}</span>
        </h4> */}
        <div className="d-flex mt-4 align-item-center justify-content-between">
          <div>
            <h3 className="mb-4">
              Client: <span className="valueRFQ-id">{' ' + clientName}</span>
            </h3>

            <h4>
              Company Name Address:
              <Form.Group
                className="my-3 px-3"
                controlId="exampleForm.ControlTextarea1"
                style={{ width: '400px' }}
              >
                <Form.Control
                  as="textarea"
                  rows={4}
                  disabled
                  value={companyNameAddress}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCompanyNameAddress(e.target.value)
                  }
                />
              </Form.Group>
            </h4>
          </div>
          <div>
            {attachments && <PiAttachments attachments={attachments} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
