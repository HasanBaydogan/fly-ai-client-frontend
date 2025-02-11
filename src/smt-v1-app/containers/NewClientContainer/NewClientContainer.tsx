import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Modal, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormattedContactData } from 'smt-v1-app/components/features/SupplierDetail/SupplierDetailComponents/ContactListSection';
import { RatingData } from 'smt-v1-app/components/features/SupplierDetail/SupplierDetailComponents/RatingComponent';
import SegmentSelection from 'smt-v1-app/components/features/SupplierDetail/SupplierDetailComponents/SegmentSelection';
import SupplierInfo from 'smt-v1-app/components/features/NewClient/ClientInfo';
import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';
import {
  getbyCurrencyController,
  getByMarginTable,
  postClientCreate
} from 'smt-v1-app/services/ClientServices';
import {
  getbyCountryList,
  getbySegmentList,
  postSupplierCreate,
  TreeNode
} from 'smt-v1-app/services/SupplierServices';
import CustomButton from '../../../components/base/Button';

import AddressDetails from 'smt-v1-app/components/features/NewClient/ClientMidPart';
import RatingSection from 'smt-v1-app/components/features/NewClient/RatingComponent';
import FileUpload from 'smt-v1-app/components/features/NewClient/NewClientAttachment/FileUpload';
import ContactListSection from 'smt-v1-app/components/features/NewClient/NewClientContact/ContactListSection';
import ClientBottomSection from 'smt-v1-app/components/features/NewClient/ClientBottomSection';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

// const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
// const [errorSegments, setErrorSegments] = useState<string | null>(null);
// const [segments, setSegments] = useState<TreeNode[]>([]);
// const [segmentIds, setSegmentIds] = useState<string[]>([]);

const NewClientContainer = () => {
  const navigate = useNavigate();

  // Data states
  const [userComments, setUserComments] = useState([
    { comment: '', severity: '', isEditing: true }
  ]);
  const [clientCompanyName, setCompanyName] = useState<string>('');
  const [clientMail, setClientMail] = useState<string>('');
  const [segmentIds, setSegmentIds] = useState<string[]>([]);
  const [subCompany, setSubCompany] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [clientDetail, setClientDetail] = useState('');
  const [phone, setPhone] = useState('');

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [clientWebsite, setClientWebsite] = useState('');

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
  const [isLoading, setIsLoading] = useState(true);

  // Alerts & modals
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [loadingSegments, setLoadingSegments] = useState<boolean>(true);
  const [errorSegments, setErrorSegments] = useState<string | null>(null);
  const commentPayload = {
    comment: userComments.length > 0 ? userComments[0].comment : '',
    severity: userComments.length > 0 ? userComments[0].severity : ''
  };
  const [priceMargins, setMarginTable] = useState({});

  // Sonuç modalı için state'ler
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalTitle, setResultModalTitle] = useState('');
  const [resultModalMessage, setResultModalMessage] = useState('');

  // Yeni: Save işleminde loading göstergesi için state
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const handleRatingsChange = (updatedRatings: RatingData) => {
    setRatings(updatedRatings);
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await getbyCurrencyController();
        // Adjust the next lines according to your API response structure.
        if (
          response &&
          response.statusCode === 200 &&
          Array.isArray(response.data)
        ) {
          setCurrencies(response.data);
          // Optionally set the default selected currency:
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
    const fetchMarginTable = async () => {
      try {
        const response = await getByMarginTable();

        // API'den dönen verinin nesne olduğunu varsayalım.
        if (
          response &&
          response.statusCode === 200 &&
          typeof response.data === 'object'
        ) {
          setMarginTable(response.data);
        }
      } catch (error) {
        console.error('Error fetching Margin Table:', error);
      }
    };

    fetchMarginTable();
  }, []);

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

    if (!clientCompanyName.trim()) {
      setAlertMessage('Company Name cannot be empty.');
      setIsSuccess(false);
      setShowAlert(true);
      return;
    }

    // if (!segmentIds || segmentIds.length === 0) {
    //   setAlertMessage('Please select at least one Segment.');
    //   setIsSuccess(false);
    //   setShowAlert(true);
    //   return;
    // }

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

    const numericMarginTable = Object.fromEntries(
      Object.entries(priceMargins).map(([key, value]) => {
        // Virgülü nokta ile değiştirip Number'a dönüştürüyoruz.
        const numericValue = Number(value.toString().replace(',', '.'));
        return [key, isNaN(numericValue) ? 0 : numericValue];
      })
    );

    const clientPayload = {
      companyName: clientCompanyName,
      legalAddress: legalAddress,
      subCompanyName: subCompany,
      currencyPreference: selectedCurrency,
      segmentIdList: segmentIds,
      details: clientDetail,
      clientStatus: selectedStatus,
      phone: phone,
      website: clientWebsite,
      mail: clientMail,
      contactRequests: contacts,
      attachmentRequests: base64Files.map(file => ({
        fileName: file.name,
        data: file.base64
      })),
      workingDetails: workingDetails,
      username: username,
      password: password,
      // contacts: contacts,

      userComments: userComments.map(item => ({
        comment: item.comment,
        severity: item.severity
      })),
      clientPriceMarginTableRequest: numericMarginTable,

      dialogSpeed: ratings.dialogSpeed,
      dialogQuality: ratings.dialogQuality,
      easeOfSupply: ratings.easeOfSupply,
      supplyCapability: ratings.supplyCapability,
      euDemandParts: ratings.euDemandOfParts
    };
    // console.log('Client Payload', clientPayload);

    setLoadingSave(true);
    try {
      const response = await postClientCreate(clientPayload);

      if (response && response.statusCode === 200) {
        setResultModalTitle('Client addition successful');
        setResultModalMessage(
          'Client information has been successfully saved!'
        );
        setShowResultModal(true);

        // 2 saniye sonra yönlendirme
        setTimeout(() => {
          navigate('/client/list');
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

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          {' '}
          {/* Alert */}
          {showAlert && (
            <div className="alert-overlay">
              <Alert
                variant={isSuccess ? 'success' : 'danger'}
                className="text-white alert-center"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                <Alert.Heading>
                  {isSuccess ? 'Success!' : 'Notice!'}
                </Alert.Heading>
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
            <Modal.Body>
              Are you sure you want to discard all changes?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
              >
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
              Are you sure you want to save the client information?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowSaveModal(false)}
              >
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
              <Button
                variant="primary"
                onClick={() => setShowResultModal(false)}
              >
                OK
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Client Info */}
          <SupplierInfo
            setCompanyName={setCompanyName}
            companyName={clientCompanyName}
            setSubCompany={setSubCompany}
            subCompany={subCompany}
            setLegalAddress={setLegalAddress}
            legalAddress={legalAddress}
            currencies={currencies}
            currency={selectedCurrency}
            setCurrency={setSelectedCurrency} // new prop to update currency
          />
          {/* Segment Selection */}
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
          {/* Other Sections */}
          <Row className="mt-3">
            <Col md={7}>
              <AddressDetails
                onStatusChange={handleStatusChange}
                clientDetail={clientDetail}
                setClientDetail={setClientDetail}
                setClientMail={setClientMail}
                clientMail={clientMail}
                setClientWebsite={setClientWebsite}
                clientWebsite={clientWebsite}
                phone={phone} // Phone state prop olarak ekleniyor
                setPhone={setPhone} // Phone güncelleme fonksiyonu da gönderiliyor
              />
            </Col>
            <Col
              md={5}
              className="d-flex justify-content-center align-items-center mt-1"
            >
              <RatingSection
                onRatingsChange={handleRatingsChange}
                ratings={ratings}
              />
            </Col>
          </Row>
          <FileUpload onFilesUpload={handleFilesUpload} />
          <ClientBottomSection
            priceMargins={priceMargins}
            setMarginTable={setMarginTable}
            userComments={userComments}
            setUserComments={setUserComments}
          />
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
      )}
    </>
  );
};

export default NewClientContainer;
