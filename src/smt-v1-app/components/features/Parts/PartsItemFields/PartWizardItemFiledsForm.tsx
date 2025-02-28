import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PartHistoryListSection, {
  FormattedHistoryItem
} from '../HistoryList/PartHistoryListSection';

import PartTimelineGraph from '../TimelineGraph/PartTimelineGraph';
import {
  postPartCreate,
  putPartUpdate
} from 'smt-v1-app/services/PartServices';
import CustomButton from '../../../../../components/base/Button';
import { TreeNode } from '../../SupplierDetailSegmentTreeSelect/SupplierDetailSegmentTreeSelect';
import SegmentSelection from '../../GlobalComponents/SegmentSelection';
import { getbySegmentList } from 'smt-v1-app/services/GlobalServices';

interface PartWizardItemFiledsFormProps {
  partData?: any;
  onPartCreated?: (data: any) => void;
}

const PartWizardItemFiledsForm: React.FC<PartWizardItemFiledsFormProps> = ({
  partData,
  onPartCreated
}) => {
  const navigate = useNavigate();

  // Alanların başlangıç değerlerini, varsa partData'dan alıyoruz.
  const [partNumber, setPartNumber] = useState<string>(
    partData?.partNumber || ''
  );
  const [partName, setPartName] = useState<string>(partData?.partName || '');
  const [segmentIds, setSegmentIds] = useState<string[]>(
    partData ? partData.segments?.map((s: any) => s.segmentId) : []
  );
  const [aircraftModel, setAircraftModel] = useState<string>(
    partData?.aircraftModel || ''
  );
  const [comment, setComment] = useState<string>(partData?.comment || '');
  const [oem, setOem] = useState<string>(partData?.oem || 'ANY');
  const [selectedAircraft, setSelectedAircraft] = useState<string>(
    partData?.aircraft || 'ANY'
  );
  const [hsCode, setHsCode] = useState<string>(partData?.hsCode || '');

  // Segment ve tarih, history ile ilgili state'ler
  const [contacts, setContacts] = useState<FormattedHistoryItem[]>([]);
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const [segments, setSegments] = useState<TreeNode[]>([]);

  // Sonuç modalı, alert ve save durumları
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState('');
  const [resultModalMessage, setResultModalMessage] = useState('');
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Segment verilerini çekiyoruz
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await getbySegmentList();
        setSegments(Array.isArray(response.data) ? response.data : []);
        setLoadingSegments(false);
      } catch (error) {
        setErrorSegments('Failed to load segments.');
        setLoadingSegments(false);
      }
      setIsLoading(false);
    };
    fetchSegments();
  }, []);

  useEffect(() => {
    console.log('partData updated:', partData);
    if (partData && partData.partHistoryItems) {
      console.log('Found partHistoryItems:', partData.partHistoryItems);
      setContacts(partData.partHistoryItems);
    } else {
      console.log('No partHistoryItems found in partData');
      setContacts([]);
    }
  }, [partData]);

  // partData güncellendiğinde ilgili alanları güncelle
  useEffect(() => {
    if (partData) {
      setPartNumber(partData.partNumber || '');
      setPartName(partData.partName || '');
      setAircraftModel(partData.aircraftModel || '');
      setOem(partData.oem || 'ANY');
      setHsCode(partData.hsCode || '');
      setComment(partData.comment || '');
      setSegmentIds(partData.segments?.map((s: any) => s.segmentId) || []);
      setSelectedAircraft(partData.aircraft || 'ANY');
    }
  }, [partData]);

  const confirmCancel = () => {
    setShowCancelModal(true);
  };

  const handleCancel = () => {
    setShowCancelModal(false);
    setAlertMessage('Changes have been discarded.');
    setIsSuccess(false);
    setShowAlert(true);
    setTimeout(() => {
      navigate('/Client/list');
    }, 1000);
  };

  const confirmSave = () => {
    setShowSaveModal(true);
  };

  const handlePartName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartName(event.target.value);
  };

  const handlePartNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPartNumber(event.target.value);
  };

  const handleAircraftModel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAircraftModel(event.target.value);
  };

  const handleOEM = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOem(event.target.value);
  };

  const handleHsCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHsCode(event.target.value);
  };

  const handleComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleSave = async () => {
    setShowSaveModal(false);
    const updatePartPayload = {
      partNumber,
      partName,
      aircraft: selectedAircraft,
      segmentIds,
      aircraftModel,
      comment,
      oem,
      hsCode
    };

    setLoadingSave(true);
    try {
      let response;
      if (partData && partData.partId) {
        response = await putPartUpdate({
          partId: partData.partId,
          partName,
          aircraft: selectedAircraft,
          segmentIds,
          aircraftModel,
          comment,
          oem,
          hsCode
        });
      } else {
        response = await postPartCreate({
          partNumber,
          partName,
          aircraft: selectedAircraft,
          segmentIds,
          aircraftModel,
          comment,
          oem,
          hsCode
        });
      }

      if (response && response.statusCode === 200) {
        setResultModalTitle('Part editing successful');
        setResultModalMessage(
          'Part information has been successfully updated!'
        );
        setShowResultModal(true);

        // 2 saniye sonra yönlendirme
        setTimeout(() => {
          navigate('/part/list');
        }, 2000);

        // Eğer onPartCreated callback'ini kullanıyorsanız, yeni part verisini aktarabilirsiniz.
        if (onPartCreated && response.data) {
          onPartCreated(response.data);
        }
      } else {
        setResultModalTitle('Undefined');
        setResultModalMessage('An error occurred while saving Part info.');
        setShowResultModal(true);
      }
    } catch (error) {
      setResultModalTitle('Error');
      setResultModalMessage('An error occurred while saving Part info.');
      setShowResultModal(true);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <>
      {/* Alert */}
      {showAlert && (
        <div className="alert-overlay">
          <Alert
            variant={isSuccess ? 'success' : 'danger'}
            className="text-white alert-center"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <Alert.Heading>{isSuccess ? 'Success!' : 'Notice!'}</Alert.Heading>
            <p>{alertMessage}</p>
          </Alert>
        </div>
      )}
      {/* Cancel Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to discard all changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Changes
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Yes, Discard
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Save Confirmation Modal */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save the supplier information?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            No, Cancel
          </Button>
          <Button variant="success" onClick={handleSave}>
            Yes, Save
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Result Modal */}
      <Modal
        show={showResultModal}
        onHide={() => setShowResultModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{resultModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{resultModalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowResultModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
      <Row className="g-4 mb-3">
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label className="text-body">Part Number*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Part Number"
              value={partNumber}
              onChange={handlePartNumber}
              disabled={partData && partData.partId ? true : false}
            />

            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label>Part Name*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Part Name"
              value={partName}
              onChange={handlePartName}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Label>Aircraft</Form.Label>
          <Form.Select
            aria-label="Select Aircraft"
            value={selectedAircraft}
            onChange={e => setSelectedAircraft(e.target.value)}
          >
            <option value="ANY">ANY</option>
            <option value="AIRBUS">AIRBUS</option>
            <option value="ALBATROSL_39">ALBATROSL_39</option>
            <option value="AGUSTA_WESTLAND">AGUSTA_WESTLAND</option>
            <option value="BEECRAFT">BEECRAFT</option>
            <option value="BOEING">BOEING</option>
            <option value="BOMBARDIER">BOMBARDIER</option>
            <option value="CESSNA">CESSNA</option>
            <option value="DIAMOND">DIAMOND</option>
            <option value="LEONARDO">LEONARDO</option>
            <option value="L410">L410</option>
            <option value="SSJ100">SSJ100</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="g-4 mb-3">
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label className="text-body">Aircraft Model</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Aircraft Model"
              value={aircraftModel}
              onChange={handleAircraftModel}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Label>OEM</Form.Label>
          <Form.Select
            aria-label="OEM"
            value={oem}
            onChange={e => setOem(e.target.value)}
          >
            <option value="ANY">ANY</option>
            <option value="AKZONOBEL">AKZONOBEL</option>
            <option value="BRIDGESTONE">BRIDGESTONE</option>
            <option value="CHAMPION">CHAMPION</option>
            <option value="CHARLATTE">CHARLATTE</option>
            <option value="COLUMBUSJACK">COLUMBUSJACK</option>
            <option value="DAVID_CLARK">DAVID_CLARK</option>
            <option value="DIAMOND_AIRCRAFT">DIAMOND_AIRCRAFT</option>
            <option value="DUNLOP">DUNLOP</option>
            <option value="DYNELL">DYNELL</option>
            <option value="GOODRICH">GOODRICH</option>
            <option value="GOODYEAR">GOODYEAR</option>
            <option value="GROVE">GROVE</option>
            <option value="HEATCON">HEATCON</option>
            <option value="JBT_AEROTECH">JBT_AEROTECH</option>
            <option value="MALABAR">MALABAR</option>
            <option value="MALLAGHAN">MALLAGHAN</option>
            <option value="MANITOWOC">MANITOWOC</option>
            <option value="MICHELIN">MICHELIN</option>
            <option value="MILOCO">MILOCO</option>
            <option value="MULAG">MULAG</option>
            <option value="POTAIN">POTAIN</option>
            <option value="SAFRAN">SAFRAN</option>
            <option value="SAGEPARTS">SAGEPARTS</option>
            <option value="SOURIAU">SOURIAU</option>
            <option value="TESA_PRODUCTS">TESA_PRODUCTS</option>
            <option value="THALES">THALES</option>
            <option value="TRONAIR">TRONAIR</option>
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Select>
        </Col>
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label>HS Code</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="HS Code"
              value={hsCode}
              onChange={handleHsCode}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="g-3 mb-3">
        <Col sm={5}>
          <Form.Group className="mb-2 mb-sm-0">
            <Form.Label className="text-body">Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              type="Comment"
              name="Comment"
              placeholder="Type your comment"
              value={comment}
              onChange={handleComment}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      {loadingSegments ? (
        <p>Loading segments...</p>
      ) : errorSegments ? (
        <p className="text-danger">{errorSegments}</p>
      ) : (
        <SegmentSelection
          data={segments}
          setSegmentIds={setSegmentIds}
          setSegments={setSegments}
        />
      )}
      <div style={{ position: 'relative', minHeight: '70px' }}>
        {loadingSave && (
          <div
            className="loading-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Saving data...</span>
            </Spinner>
            <p>Saving data, please wait...</p>
          </div>
        )}
        <div className="d-flex mt-3 gap-3 mx-5 justify-content-end">
          <CustomButton
            variant="secondary"
            onClick={confirmCancel}
            disabled={loadingSave}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="success"
            onClick={confirmSave}
            disabled={loadingSave}
          >
            Save
          </CustomButton>
        </div>
      </div>
      <PartHistoryListSection
        onContactsChange={setContacts}
        initialContacts={contacts}
      />
      {/* <PartTimelineGraph /> */}
    </>
  );
};

export default PartWizardItemFiledsForm;
