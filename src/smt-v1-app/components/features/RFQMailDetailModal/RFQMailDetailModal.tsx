import React, { useEffect } from 'react';
import { CloseButton, Form, Modal } from 'react-bootstrap';
import { getRfqMailDetailFromDB } from 'smt-v1-app/services/MailTrackingService';

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
  useEffect(() => {
    const getRFQMailDetail = async () => {
      const response = await getRfqMailDetailFromDB(rfqMailId);
      console.log(response);
    };
    getRFQMailDetail();
  });
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
            RFQ : {/*props.rfqProps.rfqId*/}
          </Modal.Title>
          <CloseButton onClick={() => setIsDetailShow(false)} />
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between">
            <div className="me-3">
              <div className="py-1">
                <span className="fw-bold">From : </span>{' '}
                <a href="#">rfq@abc.company.com</a>
              </div>

              <div className="py-1">
                <span className="fw-bold">Subject : </span>{' '}
                <span>RFQ {/*props.rfqProps.rfqId */}</span>
              </div>

              <div className="py-1 d-flex">
                <span className="fw-bold me-1">Content :</span>{' '}
                <span
                  className="rfq-mail-detail-content"
                  style={{ width: '435px' }}
                >
                  {' '}
                  {`Dear Simp sons,
Something in a thirty-acre thermal thicket of thorns and thistles thumped and thundered threatening the three-D thoughts of Matthew the thug - although, theatrically, it was only the thirteen-thousand thistles and thorns through the underneath of his thigh that the thirty year old thug thought of that morning.
How much caramel can a canny canonball cram in a camel if a canny canonball can cram caramel in a camel? If practice makes perfect and perfect needs practice, I’m perfectly practiced and practically perfect.
Best regards,\n\n
            Give me the price of this part numbers:
            234234234 : Wheel
            12314124 : SPace
            23423423 : Aveoind

`}
                </span>
              </div>
            </div>
            <div className="ms-3">
              <div>
                <div className="d-flex justify-content-end">
                  <span className="text-danger deadline-font-size me-2">
                    Deadline:
                  </span>{' '}
                  <span className="deadline-font-size">12.03.2025</span>
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
                      {/*props.rfqProps.statusType*/}
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
                <Form.Select aria-label="Default select example">
                  <option disabled>Select Assigned User</option>
                  <option value="1">Ahmet Durmaz</option>
                  <option value="2">Kadir Belirgin</option>
                  <option value="3">Fatih Kadir Bulaklı</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Block To</Form.Label>
                <Form.Select aria-label="Default select example">
                  <option disabled>Select Blocked User</option>
                  <option value="1">Ahmet Durmaz</option>
                  <option value="2">Kadir Belirgin</option>
                  <option value="3">Fatih Kadir Bulaklı</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end">
              {/* <RFQActionButtons statusType={props.rfqProps.statusType} /> */}
            </div>
          </div>
          {/* showLogs && (
            <div>
              <p className="ms-2">LOGS</p>
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="ASSIGN"
                date="02/12/2023"
                time="12.02"
                assignedOrBlockedSubject="Kadir Bulut"
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="BLOCK"
                date="02/12/2023"
                time="12.02"
                assignedOrBlockedSubject="Kadir Bulut"
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="CANCEL"
                date="02/12/2023"
                time="12.02"
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="SAVE"
                date="02/12/2023"
                time="12.02"
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="ENTER"
                date="02/12/2023"
                time="12.02"
                enterItemsNumber={3}
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="CREATE"
                date="02/12/2023"
                time="12.02"
                quoteValues={{
                  quoteId: '123',
                  quoteVisibleId: 'QUOTE-12',
                  statusFrom: { statusType: 'UNREAD' },
                  statusTo: { statusType: 'WFS' }
                }}
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="CREATE"
                date="02/12/2023"
                time="12.02"
                quoteValues={{
                  quoteId: '123',
                  quoteVisibleId: 'QUOTE-12',
                  statusFrom: { statusType: 'WFS' },
                  statusTo: { statusType: 'PQ' }
                }}
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="CREATE"
                date="02/12/2023"
                time="12.02"
                quoteValues={{
                  quoteId: '123',
                  quoteVisibleId: 'QUOTE-12',
                  statusFrom: { statusType: 'WFS' },
                  statusTo: { statusType: 'FQ' }
                }}
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="POINT"
                date="02/12/2023"
                time="12.02"
                pointValues={{ statusTo: 'SPAM' }}
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="POINT"
                date="02/12/2023"
                time="12.02"
                pointValues={{ statusTo: 'NO QUOTE' }}
              />
              <RFQMailLog
                userFullName="Ahmet Durmaz"
                actionType="POINT"
                date="02/12/2023"
                time="12.02"
                pointValues={{ statusTo: 'NOT RFQ' }}
              />
            </div>
          ) */}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RFQMailDetailModal;
