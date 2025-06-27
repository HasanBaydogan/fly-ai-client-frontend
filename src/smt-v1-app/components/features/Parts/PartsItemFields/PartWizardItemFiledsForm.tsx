import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PartHistoryListSection, {
  FormattedHistoryItem
} from './HistoryList/PartHistoryListSection';
import PartTimelineGraph, {
  PartGraphItem
} from '../TimelineGraph/PartTimelineGraph';
import {
  postPartCreate,
  putPartUpdate
} from 'smt-v1-app/services/PartServices';
import CustomButton from '../../../../../components/base/Button';
import { TreeNode } from 'smt-v1-app/types/index';
import SegmentSelection from '../../GlobalComponents/Segments/SegmentSelection';
import { getbySegmentList } from 'smt-v1-app/services/GlobalServices';

const getInitialSelectedIds = (nodes: any[] = []): string[] => {
  return nodes.reduce((acc: string[], node: any) => {
    if ((node.isSelected ?? false) === true) {
      acc.push(node.segmentId);
    }
    if (node.subSegments && Array.isArray(node.subSegments)) {
      acc.push(...getInitialSelectedIds(node.subSegments));
    }
    return acc;
  }, []);
};

interface PartWizardItemFiledsFormProps {
  partData?: any;
  onPartCreated?: (data: any) => void;
}

const PartWizardItemFiledsForm: React.FC<PartWizardItemFiledsFormProps> = ({
  partData,
  onPartCreated
}) => {
  const navigate = useNavigate();

  const oemGroups = [
    {
      label: 'Tyres',
      options: [
        { value: 'MICHELIN', name: 'Michelin' },
        { value: 'DUNLOP', name: 'Dunlop' },
        { value: 'BRIDGESTONE', name: 'Bridgestone' },
        { value: 'GOODYEAR', name: 'Goodyear' }
      ]
    },
    {
      label: 'Avionics',
      options: [
        { value: 'A_COLLINS_AEROSPACE', name: 'Collins Aerospace' },
        { value: 'HONEYWELL', name: 'Honeywell' },
        { value: 'THALES_GROUP', name: 'Thales Group' },
        {
          value: 'SAFRAN_ELECTRONICS_DEFENSE',
          name: 'Safran Electronics & Defense'
        },
        { value: 'L3HARRIS_TECHNOLOGIES', name: 'L3Harris Technologies' }
      ]
    },
    {
      label: 'Landing Gear',
      options: [
        { value: 'SAFRAN_LANDING_SYSTEMS', name: 'Safran Landing Systems' },
        { value: 'B_COLLINS_AEROSPACE', name: 'Collins Aerospace' },
        { value: 'LIEBHERR_AEROSPACE', name: 'Liebherr Aerospace' },
        { value: 'HEROUX_DEVTEK', name: 'Heroux-Devtek' }
      ]
    },
    {
      label: 'Actuators & Control Systems',
      options: [
        { value: 'PARKER_AEROSPACE', name: 'Parker Aerospace' },
        { value: 'MOOG_INC', name: 'Moog Inc.' },
        { value: 'SAFRAN_AEROSYSTEMS', name: 'Safran Aerosystems' }
      ]
    },
    {
      label: 'Aerostructures',
      options: [
        { value: 'SPIRIT_AEROSYSTEMS', name: 'Spirit AeroSystems' },
        { value: 'PREMIUM_AEROTEC', name: 'Premium Aerotec' },
        { value: 'GKN_AEROSPACE', name: 'GKN Aerospace' }
      ]
    }
  ];

  const [partNumber, setPartNumber] = useState<string>(
    partData?.partNumber || ''
  );
  const [partName, setPartName] = useState<string>(partData?.partName || '');
  const [segmentIds, setSegmentIds] = useState<string[]>(
    partData ? getInitialSelectedIds(partData.segments ?? []) : []
  );
  const [aircraftModel, setAircraftModel] = useState<string>(
    partData?.aircraftModel || ''
  );
  const [comment, setComment] = useState<string>(partData?.comment || '');
  const [oems, setOems] = useState<string[]>(() => {
    if (partData) {
      if (Array.isArray(partData.oems)) {
        return partData.oems;
      } else if (typeof partData.oem === 'string' && partData.oem) {
        return partData.oem.split(',').filter(item => item.trim() !== '');
      }
    }
    return [];
  });
  const [selectedAircraft, setSelectedAircraft] = useState<string>(
    partData?.aircraft || 'ANY'
  );
  const [hsCode, setHsCode] = useState<string>(partData?.hsCode || '');
  const [contacts, setContacts] = useState<FormattedHistoryItem[]>([]);
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const [segments, setSegments] = useState<TreeNode[]>([]);
  const [showResultAlert, setShowResultAlert] = useState(false);
  const [resultAlertMessage, setResultAlertMessage] = useState('');
  const [resultAlertSuccess, setResultAlertSuccess] = useState(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  useEffect(() => {
    const fetchSegments = async () => {
      if (partData && partData.segments) {
        setSegments(partData.segments);
        setSegmentIds(getInitialSelectedIds(partData.segments));
        setLoadingSegments(false);
      } else {
        try {
          const response = await getbySegmentList();
          setSegments(Array.isArray(response.data) ? response.data : []);
          setLoadingSegments(false);
        } catch (error) {
          setErrorSegments('Failed to load segments.');
          setLoadingSegments(false);
        }
      }
      setIsLoading(false);
    };
    fetchSegments();
  }, [partData]);

  useEffect(() => {
    if (partData && partData.partHistoryItems) {
      setContacts(partData.partHistoryItems);
    } else {
      setContacts([]);
    }
  }, [partData]);

  useEffect(() => {
    if (partData) {
      setPartNumber(partData.partNumber || '');
      setPartName(partData.partName || '');
      setAircraftModel(partData.aircraftModel || '');
      if (Array.isArray(partData.oems)) {
        setOems(partData.oems);
      } else if (typeof partData.oem === 'string' && partData.oem) {
        setOems(partData.oem.split(',').filter(item => item.trim() !== ''));
      } else {
        setOems([]);
      }
      setHsCode(partData.hsCode || '');
      setComment(partData.comment || '');
      setSegmentIds(
        partData.segments ? getInitialSelectedIds(partData.segments) : []
      );
      setSelectedAircraft(partData.aircraft || 'ANY');
    }
  }, [partData]);

  const confirmCancel = () => {
    if (isConfirmMode) {
      handleCancel();
    } else {
      setShowCancelModal(true);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(false);
    setAlertMessage('Changes have been discarded.');
    setIsSuccess(false);
    setShowAlert(true);
    setIsConfirmMode(false);
    setTimeout(() => {
      navigate('/part/list');
    }, 1000);
  };

  const confirmSave = () => {
    if (isConfirmMode) {
      handleSave();
    } else {
      setIsConfirmMode(true);
      setAlertMessage('Please confirm your changes or discard them.');
      setShowAlert(true);
    }
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

  const handleOemCheckboxChange = (oemValue: string) => {
    setOems(prevOems => {
      if (oemValue === 'ANY') {
        return prevOems.includes('ANY') ? [] : ['ANY'];
      }
      const newOems = prevOems.filter(o => o !== 'ANY');
      if (newOems.includes(oemValue)) {
        const filteredOems = newOems.filter(o => o !== oemValue);
        return filteredOems.length === 0 ? ['ANY'] : filteredOems;
      } else {
        return [...newOems, oemValue];
      }
    });
  };

  const getDropdownTitle = () => {
    if (oems.length === 0 || oems[0] === 'ANY') {
      return 'ANY';
    }

    const allOems = oemGroups.flatMap(g => g.options);

    const firstSelectedOem = allOems.find(o => o.value === oems[0]);

    if (!firstSelectedOem) {
      return 'Select Brands';
    }
    if (oems.length === 1) {
      return firstSelectedOem.name;
    }

    const remainingCount = oems.length - 1;
    return `${firstSelectedOem.name} +${remainingCount} Brands`;
  };

  const handleHsCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHsCode(event.target.value);
  };

  const handleComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleSave = async () => {
    setIsConfirmMode(false);
    setShowSaveModal(false);

    setLoadingSave(true);
    try {
      let response;
      const oemArray = oems.length === 0 ? ['ANY'] : oems;

      if (partData && partData.partId) {
        response = await putPartUpdate({
          partId: partData.partId,
          partName,
          aircraft: selectedAircraft,
          segmentIds,
          aircraftModel,
          comment,
          oems: oemArray,
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
          oems: oemArray,
          hsCode
        });
      }

      if (response && response.statusCode === 200) {
        setResultAlertSuccess(true);
        setResultAlertMessage(
          'Part information has been successfully updated!'
        );
        setShowResultAlert(true);

        setTimeout(() => {
          navigate('/part/list');
        }, 2000);

        if (onPartCreated && response.data) {
          onPartCreated(response.data);
        }
      } else {
        setResultAlertSuccess(false);
        setResultAlertMessage('An error occurred while saving Part info.');
        setShowResultAlert(true);
      }
    } catch (error) {
      setResultAlertSuccess(false);
      setResultAlertMessage('An error occurred while saving Part info.');
      setShowResultAlert(true);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <>
      {/* Alert */}
      {/* {showAlert && (
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
      )} */}
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
              type="text"
              name="partName"
              required
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
              name="partAircraftModel"
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
            <Form.Label>OEM / Brands</Form.Label>
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-oem"
                className="w-100 text-start d-flex justify-content-between align-items-center"
              >
                <span className="text-truncate">{getDropdownTitle()}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="w-100 p-0">
                <Dropdown.Item
                  as="div"
                  onClick={() => handleOemCheckboxChange('ANY')}
                >
                  <Form.Check
                    className="p-1 mx-2"
                    type="checkbox"
                    id="oem-any"
                    label="ANY"
                    checked={oems.includes('ANY') || oems.length === 0}
                    onChange={() => {}}
                  />
                </Dropdown.Item>
                {oemGroups.map(group => (
                  <React.Fragment key={group.label}>
                    <Dropdown.Header className="p-2 mx-3">
                      {group.label}
                    </Dropdown.Header>
                    {group.options.map(option => (
                      <Dropdown.Item
                        className="p-1 mx-0"
                        as="div"
                        key={option.value}
                        onClick={() => handleOemCheckboxChange(option.value)}
                      >
                        <Form.Check
                          type="checkbox"
                          id={`oem-${option.value}`}
                          label={option.name}
                          checked={oems.includes(option.value)}
                          onChange={() => {}}
                        />
                      </Dropdown.Item>
                    ))}
                  </React.Fragment>
                ))}
              </Dropdown.Menu>
            </Dropdown>
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
              name="partHSCode"
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
              name="partComment"
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
        {isConfirmMode && (
          <Alert variant="warning" className="mx-5 mt-2">
            Click Confirm to save your changes or Discard to cancel.
          </Alert>
        )}
        {showResultAlert && (
          <Alert
            variant={resultAlertSuccess ? 'success' : 'danger'}
            className="mx-5 mt-2"
            onClose={() => setShowResultAlert(false)}
            dismissible
          >
            <Alert.Heading>
              {resultAlertSuccess ? 'Success!' : 'Error!'}
            </Alert.Heading>
            <p>{resultAlertMessage}</p>
          </Alert>
        )}
        <div className="d-flex mt-3 gap-3 mx-5 justify-content-end">
          <CustomButton
            variant={isConfirmMode ? 'danger' : 'secondary'}
            onClick={confirmCancel}
            disabled={loadingSave}
          >
            {isConfirmMode ? 'Discard' : 'Cancel'}
          </CustomButton>
          <CustomButton
            variant={isConfirmMode ? 'primary' : 'success'}
            onClick={confirmSave}
            disabled={loadingSave}
          >
            {isConfirmMode ? 'Confirm' : 'Save'}
          </CustomButton>
        </div>
      </div>
      <PartHistoryListSection
        onContactsChange={setContacts}
        initialContacts={contacts}
      />
      {partData && partData.partGraphItems && (
        <PartTimelineGraph
          graphData={partData.partGraphItems as PartGraphItem[]}
        />
      )}
    </>
  );
};

export default PartWizardItemFiledsForm;
