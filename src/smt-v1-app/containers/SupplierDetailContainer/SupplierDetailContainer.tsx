import { Row, Col, Alert, Modal, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierInfo from '../../components/features/SupplierDetail/SupplierDetailComponents/SupplierInfo';
import SegmentSelection from '../../components/features/GlobalComponents/Segments/SegmentSelection';
import AddressDetails from '../../components/features/SupplierDetail/SupplierDetailComponents/AddressDetails';
import RatingSection, {
  RatingData
} from '../../components/features/SupplierDetail/SupplierDetailComponents/RatingComponent';
import WorkingDetails from '../../components/features/SupplierDetail/SupplierDetailComponents/WorkingDetails';
import FileUpload from '../../components/features/GlobalComponents/FileUpload';
import AccountInfo from '../../components/features/SupplierDetail/SupplierDetailComponents/AccountInfo';
import ContactListSection, {
  FormattedContactData
} from '../../components/features/SupplierDetail/SupplierDetailComponents/ContactListSection';
import CustomButton from '../../../components/base/Button';
import './SupplierDetailContainer.css';
import {
  getbySegmentList,
  getbyCountryList,
  postSupplierCreate
} from '../../services/SupplierServices';
import { TreeNode } from 'smt-v1-app/types/index';
import {
  SupplierStatus,
  Certypes
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';
import { Attachment } from 'data/project-management/todoListData';
import AttachmentPreview, {
  FileAttachment
} from 'components/common/AttachmentPreview';
import { getAttachedFile } from 'smt-v1-app/services/GlobalServices';

const openFileInNewTab = (file: {
  data: string;
  contentType: string;
  fileName: string;
}) => {
  try {
    const base64Index = file.data.indexOf('base64,');
    const base64String =
      base64Index !== -1 ? file.data.substring(base64Index + 7) : file.data;
    const binaryData = atob(base64String);
    const length = binaryData.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: file.contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    console.error('Error opening file:', error);
  }
};

const SupplierDetailContainer = () => {
  const navigate = useNavigate();

  // Data states
  const [companyName, setCompanyName] = useState<string>('');
  const [segmentIds, setSegmentIds] = useState<string[]>([]);
  const [telephoneInput, setTelephoneInput] = useState('');
  const [mailInput, setMailInput] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [pickUpAddress, setPickUpAddress] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<SupplierStatus | ''>('');
  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);
  const [workingDetails, setWorkingDetails] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contacts, setContacts] = useState<FormattedContactData[]>([]);
  const [certificateTypes, setCertificateTypes] = useState<Certypes[]>([]);

  const [ratings, setRatings] = useState<RatingData>({
    easeOfSupply: 0,
    dialogSpeed: 0,
    dialogQuality: 0,
    supplyCapability: 0,
    euDemandOfParts: 0
  });

  // Initialized data
  const [segments, setSegments] = useState<TreeNode[]>([]);
  const [countryList, setCountryList] = useState<any>([]);

  // Alerts & modals
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState('');
  const [resultModalMessage, setResultModalMessage] = useState('');
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [initialAttachments, setInitialAttachments] = useState<
    (FileAttachment & { id: string; contentType: string })[]
  >([]);
  const [attachmentToDelete, setAttachmentToDelete] = useState<
    null | (FileAttachment & { id: string; contentType: string })
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [legalAddress, setLegalAddress] = useState('');
  const [legalCity, setLegalCity] = useState('');
  const [legalCountryId, setLegalCountryId] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupCountryId, setPickupCountryId] = useState('');

  const handleRatingsChange = (updatedRatings: RatingData) => {
    setRatings(updatedRatings);
  };
  const attachmentsPayload = [
    ...initialAttachments.map(att => ({
      id: att.id,
      fileName: att.name,
      data: (att as any).url
    })),
    ...base64Files.map(file => ({
      id: null,
      fileName: file.name,
      data: file.base64
    }))
  ];
  const handleDeleteClick = (att: any) => {
    setAttachmentToDelete(att);
    setShowDeleteModal(true);
  };

  const handleAttachmentClick = async (att: any) => {
    try {
      const fileResponse = await getAttachedFile(att.id);
      if (fileResponse && fileResponse.data) {
        const fileData = fileResponse.data.data;
        const fileContentType =
          fileResponse.data.contentType || att.contentType;
        const fileName = fileResponse.data.fileName || att.name;
        openFileInNewTab({
          data: fileData,
          contentType: fileContentType,
          fileName: fileName
        });
      }
    } catch (error) {
      console.error('Error fetching attachment for id:', att.id, error);
    }
  };

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
    };
    fetchSegments();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await getbyCountryList();
        if (response?.data) {
          setCountryList(response);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCountries();
  }, []);

  const handleFilesUpload = (files: { name: string; base64: string }[]) => {
    setBase64Files(files);
  };

  const confirmCancel = () => {
    setShowCancelModal(true);
  };

  const handleCancel = () => {
    setShowCancelModal(false);
    setAlertMessage('Changes have been discarded.');
    setIsSuccess(false);
    setShowAlert(true);
    setTimeout(() => {
      navigate('/supplier/list');
    }, 1000);
  };

  const confirmSave = () => {
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    setShowSaveModal(false);

    if (!companyName.trim()) {
      setAlertMessage('Company Name cannot be empty.');
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    if (!selectedCountryId) {
      setAlertMessage('Please select a Country.');
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    if (!selectedStatus) {
      setAlertMessage('Please select a Status.');
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    const payload = {
      supplierCompanyName: companyName,
      segmentIds: segmentIds,
      telephone: telephoneInput,
      mail: mailInput,
      countryId: selectedCountryId,
      pickUpAddress: pickUpAddress,
      supplierStatus: selectedStatus,
      attachments: base64Files.map(file => ({
        fileName: file.name,
        data: file.base64
      })),
      workingDetails: workingDetails,
      username: username,
      password: password,
      contacts: contacts,
      certificateTypes: certificateTypes,
      dialogSpeed: ratings.dialogSpeed,
      dialogQuality: ratings.dialogQuality,
      easeOfSupply: ratings.easeOfSupply,
      supplyCapability: ratings.supplyCapability,
      euDemandParts: ratings.euDemandOfParts
    };
    // console.log(payload);
    setLoadingSave(true);
    try {
      const response = await postSupplierCreate(payload);

      if (response && response.statusCode === 200) {
        setResultModalTitle('Supplier addition successful');
        setResultModalMessage(
          'Supplier information has been successfully saved!'
        );
        setShowResultModal(true);
        setTimeout(() => {
          navigate('/supplier/list');
        }, 2000);
      } else {
        setResultModalTitle('Undefined');
        setResultModalMessage('An error occurred while saving supplier info.');
        setShowResultModal(true);
      }
    } catch (error) {
      setResultModalTitle('Error');
      setResultModalMessage('An error occurred while saving supplier info.');
      setShowResultModal(true);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as unknown as SupplierStatus);
  };

  const handleCertificateTypesChange = (values: string[]) => {
    setCertificateTypes(
      values as (
        | 'CERTIFICATE_1'
        | 'CERTIFICATE_2'
        | 'CERTIFICATE_3'
        | 'CERTIFICATE_4'
      )[]
    );
  };

  const handleLegalCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLegalCountryId(e.target.value);
  };

  const handlePickupCountryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPickupCountryId(e.target.value);
  };

  const handleLegalCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLegalCity(e.target.value);
  };

  const handlePickupCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupCity(e.target.value);
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
      {/* Supplier Info */}
      <SupplierInfo
        setCompanyName={setCompanyName}
        companyName={companyName}
        setTelephoneInput={setTelephoneInput}
        telephoneInput={telephoneInput}
        mailInput={mailInput}
        setMailInput={setMailInput}
      />
      <AddressDetails
        onStatusChange={handleStatusChange}
        getbyCountryList={countryList}
        pickUpAddress={pickUpAddress}
        setPickUpAddress={setPickUpAddress}
        legalAddress={legalAddress}
        setLegalAddress={setLegalAddress}
        legalCity={legalCity}
        setLegalCity={setLegalCity}
        legalCountryId={legalCountryId}
        setLegalCountryId={setLegalCountryId}
        pickupCity={pickupCity}
        setPickupCity={setPickupCity}
        pickupCountryId={pickupCountryId}
        setPickupCountryId={setPickupCountryId}
        onCertificateTypes={handleCertificateTypesChange}
      />
      <AccountInfo
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />

      <Row className="mt-3">
        <Col md={8}>
          <SegmentSelection
            data={segments}
            setSegmentIds={setSegmentIds}
            setSegments={setSegments}
          />
        </Col>
        <Col md={4}>
          <div className="pt-6">
            <WorkingDetails
              workingDetails={workingDetails}
              setWorkingDetails={setWorkingDetails}
            />
            <h5> Existing Attachments</h5>
            {initialAttachments.map(att => (
              <div
                key={att.id}
                onClick={() => handleAttachmentClick(att)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <AttachmentPreview
                  handleRemove={() => handleDeleteClick(att)}
                  attachment={att}
                />
              </div>
            ))}
            <FileUpload onFilesUpload={handleFilesUpload} />
          </div>
        </Col>
      </Row>

      {/* Segment Selection
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
      )} */}
      {/* Other Sections */}
      <Row className="mt-3">
        <Col md={7}></Col>
        <Col
          md={5}
          className="d-flex justify-content-center align-items-center"
        >
          <RatingSection
            onRatingsChange={handleRatingsChange}
            ratings={ratings}
          />
        </Col>
      </Row>
      <WorkingDetails
        workingDetails={workingDetails}
        setWorkingDetails={setWorkingDetails}
      />
      <FileUpload onFilesUpload={handleFilesUpload} />

      <ContactListSection onContactsChange={setContacts} />
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
    </>
  );
};

export default SupplierDetailContainer;
