import { Row, Col, Alert, Modal, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import {
  getBySupplierId,
  putBySupplierUpdate,
  getbyCountryList
} from '../../services/SupplierServices';
import {
  getbySegmentList,
  getAttachedFile
} from 'smt-v1-app/services/GlobalServices';
import { TreeNode, Certypes } from 'smt-v1-app/types';

import { FileAttachment } from '../../components/features/SupplierDetail/SupplierDetailComponents/AttachmentPreview';
import AttachmentPreview from '../../components/features/SupplierDetail/SupplierDetailComponents/AttachmentPreview';

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

const SupplierEditContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get('supplierId');

  const [companyName, setCompanyName] = useState<string>('');
  const [segmentIds, setSegmentIds] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [pickUpAddress, setPickUpAddress] = useState('');
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const [countryList, setCountryList] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [base64Files, setBase64Files] = useState<
    { id: string; name: string; base64: string }[]
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
  const [segments, setSegments] = useState<TreeNode[]>([]);
  const [initialAttachments, setInitialAttachments] = useState<
    (FileAttachment & { id: string; contentType: string })[]
  >([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState('');
  const [resultModalMessage, setResultModalMessage] = useState('');
  const [loadingSupplier, setLoadingSupplier] = useState<boolean>(true);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<
    null | (FileAttachment & { id: string; contentType: string })
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRatingsChange = (updatedRatings: RatingData) => {
    setRatings(updatedRatings);
  };

  const getInitialSelectedIds = (nodes: any[]): string[] => {
    return nodes.reduce((acc: string[], node: any) => {
      if ((node.isSelected ?? false) === true) {
        acc.push(node.segmentId);
      }
      if (node.subSegments && node.subSegments.length > 0) {
        acc.push(...getInitialSelectedIds(node.subSegments));
      }
      return acc;
    }, []);
  };

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const response = await getbySegmentList();
        setSegments(Array.isArray(response.data) ? response.data : []);
        setLoadingSegments(false);
      } catch (error) {
        console.error('Error fetching segments:', error);
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
        console.error('Error fetching country list:', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        setLoadingSupplier(true);
        const response = await getBySupplierId(supplierId!);
        if (response && response.data) {
          const supplier = response.data;
          // console.log('Supplier data:', supplier);
          setCompanyName(supplier.supplierCompanyName);
          setBrandInput(supplier.brand);
          const selectedSupplierSegmentIds = getInitialSelectedIds(
            supplier.segments
          );
          setSegmentIds(selectedSupplierSegmentIds);
          setSegments(supplier.segments);
          setSelectedCountryId(supplier.country.id);
          setPickUpAddress(supplier.pickUpAddress);
          setSelectedStatus(supplier.supplierStatus);
          setWorkingDetails(supplier.workingDetails);
          setUsername(supplier.username);
          setPassword(supplier.password);
          setContacts(supplier.contacts);
          setCertificateTypes(supplier.certificateTypes);
          setRatings({
            dialogSpeed: supplier.dialogSpeed,
            dialogQuality: supplier.dialogQuality,
            easeOfSupply: supplier.easeOfSupply,
            supplyCapability: supplier.supplyCapability,
            euDemandOfParts: supplier.euDemandParts
          });
          if (supplier.attachments && supplier.attachments.length > 0) {
            setInitialAttachments(
              supplier.attachments.map((att: any) => ({
                id: att.attachmentId,
                name: att.fileName,
                contentType: att.contentType || 'application/octet-stream',
                date: att.date || ''
              }))
            );
          }
        } else {
          window.location.assign('/404');
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
        setAlertMessage('Supplier data could not be loaded.');
        setIsSuccess(false);
        setShowAlert(true);
      } finally {
        setLoadingSupplier(false);
      }
    };

    if (supplierId) {
      fetchSupplierData();
    }
  }, [supplierId]);

  const confirmCancel = () => setShowCancelModal(true);
  const handleCancel = () => {
    setShowCancelModal(false);
    setAlertMessage('Changes have been discarded.');
    setIsSuccess(false);
    setShowAlert(true);
    setTimeout(() => navigate('/supplier/list'), 1000);
  };

  const confirmSave = () => setShowSaveModal(true);

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

    const payload = {
      supplierId,
      supplierCompanyName: companyName,
      segmentIds: segmentIds,
      brand: brandInput,
      countryId: selectedCountryId,
      pickUpAddress: pickUpAddress,
      status: selectedStatus,
      attachments: attachmentsPayload,
      workingDetails: workingDetails,
      username: username,
      password: password,
      contacts: contacts.map(contact => ({
        id: contact.id,
        fullName: contact.fullName,
        email: contact.email,
        title: contact.title,
        phone: contact.phone,
        cellPhone: contact.cellPhone
      })),
      certificateTypes: certificateTypes,
      dialogSpeed: ratings.dialogSpeed,
      dialogQuality: ratings.dialogQuality,
      easeOfSupply: ratings.easeOfSupply,
      supplyCapability: ratings.supplyCapability,
      euDemandParts: ratings.euDemandOfParts
    };

    // console.log('Payload to be sent:', payload);

    setLoadingSave(true);
    try {
      const response = await putBySupplierUpdate(payload);
      // console.log('Response from putBySupplierUpdate:', response);
      if (response && response.statusCode === 200) {
        setResultModalTitle('Supplier update successful');
        setResultModalMessage(
          'Supplier information has been successfully updated!'
        );
        setShowResultModal(true);
        setTimeout(() => {
          navigate('/supplier/list');
        }, 2000);
      } else {
        setResultModalTitle('Error');
        setResultModalMessage(
          'An error occurred while updating supplier info.'
        );
        setShowResultModal(true);
      }
    } catch (error) {
      console.error('Error updating supplier data:', error);
      setResultModalTitle('Error');
      setResultModalMessage('An error occurred while updating supplier info.');
      setShowResultModal(true);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as unknown as string);
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

  const handleFilesUpload = (
    files: { id: string; name: string; base64: string }[]
  ) => {
    setBase64Files(files);
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

  const handleDeleteClick = (att: any) => {
    setAttachmentToDelete(att);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (attachmentToDelete) {
      setInitialAttachments(prev =>
        prev.filter(att => att.id !== attachmentToDelete.id)
      );
    }
    setShowDeleteModal(false);
    setAttachmentToDelete(null);
  };

  if (loadingSupplier) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading supplier data...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
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
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to update the supplier information?
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
      {/* Silme onay modalı */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this attachment?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <SupplierInfo
        setCompanyName={setCompanyName}
        companyName={companyName}
        setBrandInput={setBrandInput}
        brandInput={brandInput}
      />
      <SegmentSelection
        data={segments}
        setSegmentIds={setSegmentIds}
        setSegments={setSegments}
      />
      <Row className="mt-3">
        <Col md={7}>
          <AddressDetails
            onCountryChange={setSelectedCountryId}
            onStatusChange={handleStatusChange}
            getbyCountryList={countryList}
            pickUpAddress={pickUpAddress}
            setPickUpAddress={setPickUpAddress}
            onCertificateTypes={handleCertificateTypesChange}
            defaultCountry={selectedCountryId}
            defaultStatus={selectedStatus}
            defaultCertificateTypes={certificateTypes}
          />
        </Col>
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
      <div className="mt-5">
        <h5 className="mb-3"> Existing Attachments</h5>
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
      <AccountInfo
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
      <ContactListSection
        onContactsChange={setContacts}
        initialContacts={contacts}
      />
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ position: 'relative', minHeight: '70px' }}
      >
        <div className="w-25 p-3"></div>
        <div
          className="d-flex justify-content-center align-items-center d-inline-block w-25 p-3"
          style={{ position: 'relative', minWidth: '200px', minHeight: '70px' }}
        >
          {loadingSave && (
            <div
              className="loading-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Saving data...</span>
              </Spinner>
              <p>Saving data, please wait...</p>
            </div>
          )}
        </div>
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

export default SupplierEditContainer;
