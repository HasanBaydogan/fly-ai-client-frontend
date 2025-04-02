import { Row, Col, Alert, Modal, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientInfo from '../../../components/features/Client/NewClient/ClientInfo';
import SegmentSelection from '../../../components/features/GlobalComponents/Segments/SegmentSelection';
import AddressDetails from 'smt-v1-app/components/features/Client/NewClient/ClientMidPart';
import RatingSection from '../../../components/features/Client/NewClient/RatingComponent';
import { RatingData } from 'smt-v1-app/components/features/Client/NewClient/RatingComponent';
import FileUpload from '../../../components/features/GlobalComponents/FileUpload';
import ContactListSection, {
  FormattedContactData
} from '../../../components/features/Client/NewClient/NewClientContact/ContactListSection'; //
import CustomButton from '../../../../components/base/Button'; //
import {
  getByClientId,
  updateClient,
  getbyCurrencyController
} from '../../../services/ClientServices'; //
import {
  getbySegmentList,
  getAttachedFile
} from 'smt-v1-app/services/GlobalServices';
import { TreeNode, Status, Certypes } from 'smt-v1-app/types';

import { FileAttachment } from '../../../components/features/Client/NewClient/NewClientAttachment/AttachmentPreview';
import AttachmentPreview from '../../../components/features/Client/NewClient/NewClientAttachment/AttachmentPreview';
import ClientBottomSection from 'smt-v1-app/components/features/Client/NewClient/ClientBottomSection';

/**
 * Dosyayı base64 verisinden açmak / indirmek için fonksiyon.
 * Gelen dosya objesi; url (base64 data), contentType ve fileName alanlarını içermelidir.
 */
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

const ClientEditContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  const [phone, setPhone] = useState('');
  const [clientWebsite, setClientWebsite] = useState('');
  const [userComments, setUserComments] = useState([
    { comment: '', severity: '', isEditing: true }
  ]);
  const [clientMail, setClientMail] = useState<string>('');
  const [clientDetail, setClientDetail] = useState('');

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [clientCompanyName, setCompanyName] = useState<string>('');
  const [segmentIds, setSegmentIds] = useState<string[]>([]);
  const [subCompany, setSubCompany] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [pickUpAddress, setPickUpAddress] = useState('');
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [base64Files, setBase64Files] = useState<
    { id: string; name: string; base64: string }[]
  >([]);
  const [priceMargins, setMarginTable] = useState({});

  const [workingDetails, setWorkingDetails] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [certificateTypes, setCertificateTypes] = useState<Certypes[]>([]);
  const [contacts, setContacts] = useState<FormattedContactData[]>([]);
  const [ratings, setRatings] = useState<RatingData>({
    dialogQuality: 0,
    volumeOfOrder: 0,
    continuityOfOrder: 0,
    easeOfPayment: 0,
    easeOfDelivery: 0
  });

  const [segments, setSegments] = useState<TreeNode[]>([]);
  // Attachment metadata'larını tutuyoruz.
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
  // Client verisi yüklenirken kullanılan loading state.
  const [loadingClient, setLoadingClient] = useState<boolean>(true);
  // PUT isteği sırasında loading state.
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  // Yeni: silinmek istenen attachment bilgisini ve modal gösterim durumunu tutan state'ler
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
    const fetchCurrencies = async () => {
      try {
        const response = await getbyCurrencyController();
        if (
          response &&
          response.statusCode === 200 &&
          Array.isArray(response.data)
        ) {
          setCurrencies(response.data);
          if (response.data.length > 0) {
            setSelectedCurrency(response.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

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
    const fetchClientData = async () => {
      try {
        setLoadingClient(true);
        const response = await getByClientId(clientId!);
        if (response && response.data) {
          const client = response.data;
          // console.log('Client data:', client);
          setCompanyName(client.companyName);
          setSubCompany(client.subCompanyName);
          setLegalAddress(client.legalAddress);
          setClientMail(client.mail);
          setClientWebsite(client.website);
          setClientDetail(client.details);
          setPhone(client.phone);
          setUserComments(client.userComments);
          setMarginTable(client.marginTable);
          const selectedSupplierSegmentIds = getInitialSelectedIds(
            client.segments
          );
          setSegmentIds(selectedSupplierSegmentIds);
          setSegments(client.segments);
          setPickUpAddress(client.details);
          setSelectedStatus(client.clientStatus);
          setSelectedCurrency(client.currencyPreference);
          setWorkingDetails(client.workingDetails);
          setContacts(client.contacts);
          if (client.clientRatings) {
            setRatings(client.clientRatings);
          }
          if (
            client.attachmentResponses &&
            client.attachmentResponses.length > 0
          ) {
            setInitialAttachments(
              client.attachmentResponses.map((att: any) => ({
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
        // console.error('Error fetching client data:', error);
        // setAlertMessage('Client data could not be loaded.');
        setIsSuccess(false);
        // setShowAlert(true);
      } finally {
        setLoadingClient(false);
      }
    };

    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const confirmCancel = () => setShowCancelModal(true);
  const handleCancel = () => {
    setShowCancelModal(false);
    setAlertMessage('Changes have been discarded.');
    setIsSuccess(false);
    setShowAlert(true);
    setTimeout(() => navigate('/Client/list'), 1000);
  };

  const confirmSave = () => setShowSaveModal(true);

  const handleSave = async () => {
    setShowSaveModal(false);

    if (!clientCompanyName.trim()) {
      setAlertMessage('Company Name cannot be empty.');
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    if (!clientMail) {
      setAlertMessage('Please select a Mail.');
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    if (!legalAddress) {
      setAlertMessage('Legal Address cannot be empty..');
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

    if (selectedStatus === 'CONTACTED' && contacts.length === 0) {
      setAlertMessage(
        'When status is CONTACTED, you must add at least one contact.'
      );
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    const attachmentsPayload = [
      ...initialAttachments.map(att => ({
        id: att.id,
        fileName: att.name,
        data: (att as any).url // Eğer url varsa
      })),
      ...base64Files.map(file => ({
        id: file.id,
        fileName: file.name,
        data: file.base64
      }))
    ];

    const numericMarginTable = Object.fromEntries(
      Object.entries(priceMargins).map(([key, value]) => {
        // Virgülü nokta ile değiştirip Number'a dönüştürüyoruz.
        const numericValue = Number(value.toString().replace(',', '.'));
        return [key, isNaN(numericValue) ? 0 : numericValue];
      })
    );

    const editPayload = {
      clientId: clientId,
      companyName: clientCompanyName,
      legalAddress: legalAddress,
      subCompanyName: subCompany,
      currencyPreference: selectedCurrency,
      segmentIdList: segmentIds,
      details: clientDetail,
      clientStatus: selectedStatus as unknown as Status,
      phone: phone,
      website: clientWebsite,
      mail: clientMail,
      contactRequests: contacts,
      attachmentRequests: base64Files.map(file => ({
        fileName: file.name,
        data: file.base64
      })),
      userComments: userComments.map(item => ({
        comment: item.comment,
        severity: item.severity
      })),
      clientPriceMarginTableRequest: numericMarginTable,
      clientRatings: {
        dialogQuality: ratings.dialogQuality,
        volumeOfOrder: ratings.volumeOfOrder,
        continuityOfOrder: ratings.continuityOfOrder,
        easeOfPayment: ratings.easeOfPayment,
        easeOfDelivery: ratings.easeOfDelivery
      }
    };

    // console.log('Payload to be sent:', editPayload);

    setLoadingSave(true);
    try {
      const response = await updateClient(editPayload);
      // console.log('Response from updateClient:', response);
      if (response && response.statusCode === 200) {
        setResultModalTitle('Client update successful');
        setResultModalMessage(
          'Client information has been successfully updated!'
        );
        setShowResultModal(true);
        setTimeout(() => {
          navigate('/client/list');
        }, 2000);
      } else {
        setResultModalTitle('Error');
        setResultModalMessage('An error occurred while updating Client info.');
        setShowResultModal(true);
      }
    } catch (error) {
      console.error('Error updating Client data:', error);
      setResultModalTitle('Error');
      setResultModalMessage('An error occurred while updating Client info.');
      setShowResultModal(true);
    } finally {
      // İstek tamamlandığında loading state'i false yapıyoruz.
      setLoadingSave(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as unknown as string);
  };

  const handleFilesUpload = (
    files: { id: string; name: string; base64: string }[]
  ) => {
    setBase64Files(files);
  };

  // Tıklama: Attachment container'a tıklandığında dosya indirilir.
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

  // Silme butonuna tıklanırsa: Modalı aç.
  const handleDeleteClick = (att: any) => {
    setAttachmentToDelete(att);
    setShowDeleteModal(true);
  };

  // Delete confirmation modal'da onay verildiğinde attachment'i listeden kaldırıyoruz.
  const confirmDelete = () => {
    if (attachmentToDelete) {
      setInitialAttachments(prev =>
        prev.filter(att => att.id !== attachmentToDelete.id)
      );
    }
    setShowDeleteModal(false);
    setAttachmentToDelete(null);
  };

  if (loadingClient) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Client data...</span>
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
          Are you sure you want to update the Client information?
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
      <ClientInfo
        setCompanyName={setCompanyName}
        companyName={clientCompanyName}
        setSubCompany={setSubCompany}
        subCompany={subCompany}
        setLegalAddress={setLegalAddress}
        legalAddress={legalAddress}
        currencies={currencies}
        currency={selectedCurrency}
        setCurrency={setSelectedCurrency}
      />
      <SegmentSelection
        data={segments}
        setSegmentIds={setSegmentIds}
        setSegments={setSegments}
      />
      <Row className="mt-3">
        <Col md={7}>
          <AddressDetails
            onStatusChange={handleStatusChange}
            defaultStatus={selectedStatus}
            clientDetail={clientDetail}
            setClientDetail={setClientDetail}
            setClientMail={setClientMail}
            clientMail={clientMail}
            setClientWebsite={setClientWebsite}
            clientWebsite={clientWebsite}
            phone={phone}
            setPhone={setPhone}
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
      <ClientBottomSection
        priceMargins={priceMargins}
        setMarginTable={setMarginTable}
        userComments={userComments}
        setUserComments={setUserComments}
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
          {/* Normal içerik buraya gelebilir */}
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

export default ClientEditContainer;
