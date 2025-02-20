import React, { useEffect, useState } from 'react';
import { CloseButton, Form, Modal } from 'react-bootstrap';
import './RFQMailDetailModal.css';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getRfqMailDetailFromDB } from 'smt-v1-app/services/MailTrackingService';
import RFQActionButtons from '../RFQActionButton/RFQActionButton';
import RFQMailLogs from '../RFQMailLogs/RFQMailLogs';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';

const RFQMailDetailModal = ({
  isDetailShow,
  setIsDetailShow,
  bgColor,
  textColor,
  rfqMailId,
  setRfqMailStatus,
  rfqMailStatus,
  handleStatusColor
}: {
  isDetailShow: boolean;
  setIsDetailShow: React.Dispatch<React.SetStateAction<boolean>>;
  bgColor: string;
  textColor: string;
  rfqMailId: string;
  setRfqMailStatus: React.Dispatch<
    React.SetStateAction<
      'UNREAD' | 'OPEN' | 'WFS' | 'PQ' | 'FQ' | 'NOT_RFQ' | 'NO_QUOTE' | 'SPAM'
    >
  >;
  rfqMailStatus:
    | 'UNREAD'
    | 'OPEN'
    | 'WFS'
    | 'PQ'
    | 'FQ'
    | 'NOT_RFQ'
    | 'NO_QUOTE'
    | 'SPAM';
  handleStatusColor: (rfqMailStatus: string) => void;
}) => {
  const [rfqMailDetail, setRfqMailDetail] = useState<RFQMailDetail>();
  const [isLoading, setIsLoading] = useState(true);
  const [isShowLogs, setIsShowLogs] = useState(false);

  const [isShowToast, setIsShowToast] = useState(false);
  const [messageHeader, setMessageHeader] = useState('');
  const [messageBodyText, setMessageBodyText] = useState('');
  const [variant, setVariant] = useState('danger');

  useEffect(() => {
    const getRFQMailDetail = async () => {
      setIsLoading(true);
      try {
        const response = await getRfqMailDetailFromDB(rfqMailId);
        if (response.statusCode === 200) {
          setRfqMailDetail(response.data);
        } else {
          console.error('An error occurred while fetching data detail');
        }
      } catch (error) {
        console.error('Error fetching RFQ Mail Detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isDetailShow) {
      getRFQMailDetail();
    }
  }, [rfqMailId, isDetailShow]);

  return (
    <>
      <Modal
        size="lg"
        show={isDetailShow}
        onHide={() => setIsDetailShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="example-modal-sizes-title-lg">
            RFQ :{rfqMailDetail && rfqMailDetail.rfqMailNumberRefId}
          </Modal.Title>
          <CloseButton onClick={() => setIsDetailShow(false)} />
        </Modal.Header>

        <Modal.Body>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
              }}
            >
              <LoadingAnimation />
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-between">
                <div className="me-3">
                  <div className="py-1">
                    <span className="fw-bold">From : </span>{' '}
                    <a href="#">{rfqMailDetail.from} </a>
                  </div>

                  <div className="py-1">
                    <span className="fw-bold">Subject : </span>
                    <span>{` ${rfqMailDetail.subject}`}</span>
                  </div>

                  <div className="py-1 d-flex">
                    <span className="fw-bold me-1">Content :</span>
                    <div
                      className="rfq-mail-detail-content"
                      style={{
                        maxWidth: '460px',

                        overflowY: 'auto', // Yüksekliği aşan içerik için dikey kaydırma ekler
                        overflowX: 'auto' // Yatay kaydırmayı gizler
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `${rfqMailDetail.content}`
                      }}
                    ></div>
                  </div>
                </div>
                <div className="ms-3">
                  <div>
                    <div className="d-flex justify-content-end">
                      <span className="text-danger deadline-font-size me-2">
                        Deadline:
                      </span>
                      <span className="deadline-font-size">
                        {rfqMailDetail.deadline}
                      </span>
                    </div>
                    <div className="d-flex mt-3 justify-content-end">
                      <div
                        className="px-2 rounded"
                        style={{ backgroundColor: bgColor }}
                      >
                        <span
                          className="fw-bold"
                          style={{ color: textColor, fontSize: '12px' }}
                        >
                          {rfqMailStatus}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <a
                        className="rfq-detail-logs-time-spent-text"
                        onClick={() => setIsShowLogs(!isShowLogs)}
                      >
                        View Logs , Time Spent
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <div className="d-flex justify-content-end">
                  {
                    <RFQActionButtons
                      rfqMailDetail={rfqMailDetail}
                      setRfqMailDetail={setRfqMailDetail}
                      rfqMailId={rfqMailDetail.rfqMailId}
                      setIsShow={setIsShowToast}
                      setMessageHeader={setMessageHeader}
                      setMessageBodyText={setMessageBodyText}
                      setVariant={setVariant}
                      setRfqMailRowStatus={setRfqMailStatus}
                      handleStatusColor={handleStatusColor}
                    />
                  }
                </div>
              </div>
            </>
          )}
          {isShowLogs ? (
            <RFQMailLogs rfqMailId={rfqMailDetail.rfqMailId} />
          ) : null}

          <ToastNotification
            isShow={isShowToast}
            setIsShow={setIsShowToast}
            position="bottom-end"
            messageBodyText={messageBodyText}
            messageHeader={messageHeader}
            variant={variant}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RFQMailDetailModal;
