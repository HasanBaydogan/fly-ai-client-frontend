import React, { useEffect, useState } from 'react';
import { CloseButton, Form, Modal } from 'react-bootstrap';
import './RFQMailDetailModal.css';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getRfqMailDetailFromDB } from 'smt-v1-app/services/MailTrackingService';
import RFQActionButtons from '../RFQActionButton/RFQActionButton';

const RFQMailDetailModal = ({
  isDetailShow,
  setIsDetailShow,
  bgColor,
  textColor,
  rfqMailId
}: {
  isDetailShow: boolean;
  setIsDetailShow: React.Dispatch<React.SetStateAction<boolean>>;
  bgColor: string;
  textColor: string;
  rfqMailId: string;
}) => {
  const [rfqMailDetail, setRfqMailDetail] = useState<RFQMailDetail>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getRFQMailDetail = async () => {
      setIsLoading(true);
      try {
        const response = await getRfqMailDetailFromDB(rfqMailId);
        if (response.statusCode === 200) {
          setRfqMailDetail(response.data);
          console.log(response.data);
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
                          {rfqMailDetail.rfqMailStatus}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      <a
                        className="rfq-detail-logs-time-spent-text"
                        //onClick={handleLog}
                      >
                        View Logs , Time Spent
                      </a>
                    </div>
                  </div>

                  <Form.Group className="mt-2">
                    <Form.Label>Assing To</Form.Label>
                    <Form.Select aria-label="User Selection">
                      <option disabled>Select Assigned User</option>
                      {rfqMailDetail.allUsers.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.userFullName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label>Block To</Form.Label>
                    <Form.Select aria-label="Default select example">
                      <option disabled>Select Assigned User</option>
                      {rfqMailDetail.allUsers.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.userFullName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <div className="d-flex justify-content-end">
                  {
                    <RFQActionButtons
                      statusType={rfqMailDetail.rfqMailStatus}
                    />
                  }
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RFQMailDetailModal;
