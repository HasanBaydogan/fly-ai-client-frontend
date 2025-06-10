import React, { useState, useEffect } from 'react';
import { Badge, Form } from 'react-bootstrap';
import POModal from 'smt-v1-app/components/features/PıModal/PIModal';
import { Link, useLocation } from 'react-router-dom';
import RFQAttachments from '../RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import { MailItemMoreDetail } from 'smt-v1-app/containers/PiDetailContainer/QuoteContainerTypes';
import PiAttachments from './PoAttachments';
import { MailItemAttachment } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';

interface HeaderProps {
  poRequestedDate: string;
  poNumberId: string;
  quoteReferenceId: string;
  clientName: string;
  clientRFQId: string;
  revisionNumber: number;
  companyNameAddress: string;
  setCompanyNameAddress: React.Dispatch<React.SetStateAction<string>>;
  requisitioner?: string;
  shipVia?: string;
  fob?: string;
  shippingTerms?: string;
  attachments?: MailItemAttachment[];
  poStatus?: string;
}

const Header: React.FC<HeaderProps> = ({
  poRequestedDate,
  quoteReferenceId,
  poNumberId,
  quoteReferenceId: initialQuoteId,
  clientName,
  clientRFQId,
  revisionNumber,
  companyNameAddress,
  setCompanyNameAddress,
  requisitioner = '',
  shipVia = '',
  fob = '',
  shippingTerms = '',
  attachments,
  poStatus = ''
}) => {
  // useLocation ile URL'e erişip query parametrelerini alıyoruz.
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlQuoteId = queryParams.get('quoteReferenceId');
  const [mailItemMoreDetailResponse, setMailItemMoreDetailResponse] =
    useState<MailItemMoreDetail>();

  // Eğer URL'den quoteReferenceId varsa onu state'e atıyoruz, yoksa parent'dan gelen değeri kullanıyoruz.
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
        <h2 className="mt-2 text-info bolt">PO Detail</h2>
        <div
          className="d-flex mt-4 align-item-center justify-content-between"
          style={{ gap: '250px' }}
        >
          <div className="flex-column" style={{ gap: '50px' }}>
            <h4 className="mb-3">
              PO Id: <span className="valueRFQ-id">{poNumberId}</span>
            </h4>
            <h4 className="mb-3 ">
              Quote Id:{' '}
              <span className="valueRFQ-id">{' ' + quoteReferenceId}</span>
            </h4>
          </div>
          <div>
            <div className="px-2 rounded">
              {/* <h5 className="last-modified-poRequestedDate mb-3">
                PO Requested Date:{' ' + poRequestedDate}
              </h5> */}
              {/* <h4>
                Revision:{' '}
                <Badge bg="primary" className="small mb-3">
                  REVISION {revisionNumber}
                </Badge>
              </h4> */}
              <h4 className="status">
                <span
                  className="fw-bold"
                  style={{ color: 'black', fontSize: '14px' }}
                >
                  Status:
                </span>{' '}
                <Badge
                  bg="success"
                  className="small mb-3"
                  style={{ fontSize: '14px' }}
                >
                  {poStatus || 'PI Sent to Client'}
                </Badge>
              </h4>
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
        <div className="">
          <div>
            <h3 className="mb-4">
              Supplier: <span className="valueRFQ-id">{' ' + clientName}</span>
            </h3>

            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <h4>Ship To:</h4>
                <Form.Group className="mb-3">
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

                <h4>Requisitioner:</h4>
                <Form.Group className="mb-3">
                  <Form.Control type="text" disabled value={requisitioner} />
                </Form.Group>
              </div>

              <div className="col-12 col-lg-6">
                <h4>Ship VIA:</h4>
                <Form.Group className="mb-3">
                  <Form.Control type="text" disabled value={shipVia} />
                </Form.Group>

                <h4>FOB:</h4>
                <Form.Group className="mb-3">
                  <Form.Control type="text" disabled value={fob} />
                </Form.Group>

                <h4>Shipping Terms:</h4>
                <Form.Group className="mb-3">
                  <Form.Control type="text" disabled value={shippingTerms} />
                </Form.Group>
              </div>
            </div>
          </div>
          {/* <div className="mt-3">
            {attachments && <PiAttachments attachments={attachments} />}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Header;
