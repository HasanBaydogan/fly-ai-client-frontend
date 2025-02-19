import PhoenixDocCard from 'components/base/PhoenixDocCard';
import PaginationExample from 'pages/modules/components/PaginationExample';
import { WizardFormData } from 'pages/modules/forms/WizardExample';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PartHistoryListSection, {
  FormattedContactData
} from './HistoryList/PartHistoryListSection';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import PartTimelineGraph from './TimelineGraph/PartTimelineGraph';
import { postPartCreate } from 'smt-v1-app/services/PartServices';
import CustomButton from '../../../../components/base/Button';
import { TooltipComponent } from 'echarts/components';
import { TreeNode } from '../SupplierDetailSegmentTreeSelect/SupplierDetailSegmentTreeSelect';
import SegmentSelection from '../GlobalComponents/SegmentSelection';
import { Certypes, getbySegmentList } from 'smt-v1-app/services/GlobalServices';

interface SegmentSelectionProps {
  data: TreeNode[];
  setSegmentIds: (selectedIds: string[]) => void;
  setSegments: (segments: TreeNode[]) => void;
}

const PartWizardItemFiledsForm = ({ id }: { id: string }) => {
  const navigate = useNavigate();
  const [partNumber, setPartNumber] = useState<string>('');
  const [partName, setPartName] = useState<string>('');
  const [segmentIds, setSegmentIds] = useState<string[]>([]);
  const [aircraftModel, setAircraftModel] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [oem, setOem] = useState<string>('');
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');

  const [hsCode, setHsCode] = useState<string>('');
  const methods = useWizardFormContext<WizardFormData>();
  const { formData, onChange, validation } = methods;
  const [contacts, setContacts] = useState<FormattedContactData[]>([]);
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const [segments, setSegments] = useState<TreeNode[]>([]);
  // Sonuç modalı için state'ler
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState('');
  const [resultModalMessage, setResultModalMessage] = useState('');
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Alerts & modals
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

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

    // if (!clientCompanyName.trim()) {
    //   setAlertMessage('Company Name cannot be empty.');
    //   setIsSuccess(false);
    //   setShowAlert(true);
    //   return;
    // }

    // if (!segmentIds || segmentIds.length === 0) {
    //   setAlertMessage('Please select at least one Segment.');
    //   setIsSuccess(false);
    //   setShowAlert(true);
    //   return;
    // }

    // if (!legalAddress) {
    //   setAlertMessage('Legal Address cannot be empty..');
    //   setIsSuccess(false);
    //   setShowAlert(true);
    //   return;
    // }

    // if (!selectedStatus) {
    //   setAlertMessage('Please select a Status.');
    //   setIsSuccess(false);
    //   setShowAlert(true);
    //   return;
    // }

    const partPayload = {
      partNumber: partNumber,
      partName: partName,
      aircraft: selectedAircraft,
      segmentIdList: segmentIds,
      aircraftModel: aircraftModel,
      comment: comment,
      oem: oem
      // hsCode: hsCode
    };
    console.log('Client Payload', partPayload);

    setLoadingSave(true);
    try {
      const response = await postPartCreate(partPayload);

      if (response && response.statusCode === 200) {
        setResultModalTitle('Client addition successful');
        setResultModalMessage(
          'Client information has been successfully saved!'
        );
        setShowResultModal(true);

        // 2 saniye sonra yönlendirme
        setTimeout(() => {
          navigate('/part/list');
        }, 2000);
      } else {
        setResultModalTitle('Undefined');
        setResultModalMessage('An error occurred while saving Client info.');
        setShowResultModal(true);
      }
    } catch (error) {
      setResultModalTitle('Error');
      setResultModalMessage('An error occurred while saving Client info.');
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
      {/* Sonuç Modalı */}
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
            onChange={e => setSelectedAircraft(e.target.value)} // Update the selected aircraft
          >
            <option value="AIRCRAFT_1">Aircraft 1</option>
            <option value="AIRCRAFT_2">Aircraft 2</option>
            <option value="AIRCRAFT_3">Aircraft 3</option>
            <option value="AIRCRAFT_4">Aircraft 4</option>
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
          <Form.Group className="mb-2">
            <Form.Label>OEM</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="OEM"
              value={oem}
              onChange={handleOEM}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
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
      {/* Buttons ve Loading Overlay */}
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
      {/*
      <PartTimelineGraph /> */}
    </>
  );
};

export default PartWizardItemFiledsForm;
