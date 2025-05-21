import { useEffect, useState } from 'react';
import Header from '../../components/features/PiDetail/PiDetailHeader';
import PiOthers from '../../components/features/PiDetail/PiOthers';
import PiComments from '../../components/features/PiDetail/PiComments';
import {
  MailItemMoreDetail,
  Pi,
  AlternativePiPart,
  PiParts
} from './QuoteContainerTypes';
import PiPartList from 'smt-v1-app/components/features/PiDetail/PiPartList';
import QuoteListAlternativeParts from 'smt-v1-app/components/features/PiDetail/PiDetailAlternativeParts/PiAlternativeParts';
import CustomButton from '../../../components/base/Button';
import { getPiDetails, getPiWizard } from 'smt-v1-app/services/PIServices';
import { useSearchParams } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import POModal from 'smt-v1-app/components/features/POWizard/POModal';
import PIWizard from 'smt-v1-app/components/features/PIWizard/PIWizard';
import POWizard from 'smt-v1-app/components/features/POWizard/POWizard';

const QuoteContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalOnSecondPage, setOpenModalOnSecondPage] = useState(false);

  // State for PIWizard
  const [showPIWizard, setShowPIWizard] = useState(false);
  const [piWizardData, setPiWizardData] = useState(null);
  const [isPIWizardLoading, setIsPIWizardLoading] = useState(false);

  // State for POWizard
  const [showPOWizard, setShowPOWizard] = useState(false);
  const [poWizardData, setPoWizardData] = useState(null);
  const [isPOWizardLoading, setIsPOWizardLoading] = useState(false);

  const closeModal = (shouldHide = true, openOnSecondPage = false) => {
    if (shouldHide) {
      setIsModalOpen(false);
    } else {
      setOpenModalOnSecondPage(openOnSecondPage);
      setIsModalOpen(true);
    }
  };
  const openModal = () => {
    setOpenModalOnSecondPage(false);
    setIsModalOpen(true);
  };

  const [searchParams] = useSearchParams();
  const piId = searchParams.get('piId');

  const [mailItemMoreDetailResponse, setMailItemMoreDetailResponse] =
    useState<MailItemMoreDetail>();
  const [parts, setParts] = useState<PiParts[]>([]);
  const [alternativeParts, setAlternativeParts] = useState<AlternativePiPart[]>(
    []
  );
  const [piData, setpiData] = useState<Pi>();

  const [companyNameAddress, setCompanyNameAddress] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedComments, setHasUnsavedComments] = useState(false);

  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectedAlternativeParts, setSelectedAlternativeParts] = useState<
    string[]
  >([]);

  const handleOpenPIWizard = () => setShowPIWizard(true);
  const handleClosePIWizard = () => setShowPIWizard(false);

  const handleOpenPOWizard = () => setShowPOWizard(true);
  const handleClosePOWizard = () => setShowPOWizard(false);

  const fetchPIWizardData = async () => {
    setIsPIWizardLoading(true);
    try {
      const response = await getPiWizard(piId);
      if (response && response.statusCode === 200) {
        setPiWizardData(response.data);
        handleOpenPIWizard();
      } else {
        console.error('Failed to fetch PI Wizard data');
      }
    } catch (error) {
      console.error('Error fetching PI Wizard data:', error);
    } finally {
      setIsPIWizardLoading(false);
    }
  };

  // Function to fetch PO Wizard data and open the wizard
  const fetchPOWizardData = async () => {
    setIsPOWizardLoading(true);
    try {
      // Use the same data structure as PI Wizard initially
      const response = await getPiWizard(piId);
      if (response && response.statusCode === 200) {
        setPoWizardData(response.data);
        handleOpenPOWizard();
      } else {
        console.error('Failed to fetch PO Wizard data');
      }
    } catch (error) {
      console.error('Error fetching PO Wizard data:', error);
    } finally {
      setIsPOWizardLoading(false);
    }
  };

  useEffect(() => {
    const fetchQuoteValues = async () => {
      const response = await getPiDetails(piId);
      if (response && response.statusCode == 200) {
        setIsLoading(true);
        setpiData(response.data);
        setParts(response.data.piParts);
        setAlternativeParts(response.data.piAlternativeParts);
        setIsLoading(false);
      }
    };
    fetchQuoteValues();
  }, []);

  const handleCancel = () => {
    if (hasUnsavedComments) {
      if (
        !window.confirm(
          'You have unsaved comments. Do you want to leave without saving?'
        )
      ) {
        return;
      }
    }

    window.location.assign('/pi/list');
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="rfq-container">
          <div className="pi-detail-right">
            <div>
              {
                <Header
                  poRequestedDate={piData && piData.poRequestedDate}
                  revisionNumber={piData.revisionNumber}
                  piNumberId={piData && piData.piNumberId}
                  quoteNumberId={piData && piData.quoteNumberId}
                  clientRFQId={piData && piData.clientRFQId}
                  clientName={piData && piData.clientName}
                  companyNameAddress={piData.companyNameAddress}
                  setCompanyNameAddress={setCompanyNameAddress}
                  attachments={
                    mailItemMoreDetailResponse &&
                    mailItemMoreDetailResponse.mailItemAttachmentResponses
                  }
                />
              }
            </div>
            <div>
              <PiOthers piData={piData} />
            </div>
            <div>
              <PiPartList
                parts={parts}
                selectedParts={selectedParts}
                setSelectedParts={setSelectedParts}
              />
              <QuoteListAlternativeParts
                alternativeParts={alternativeParts}
                selectedAlternativeParts={selectedAlternativeParts}
                setSelectedAlternativeParts={setSelectedAlternativeParts}
              />
              <hr className="custom-line w-100 m-0" />
            </div>

            <div>
              <PiComments
                piData={piData}
                onCommentsChange={updatedComments => {
                  if (piData) {
                    const hasUnsaved = updatedComments.some(
                      comment => comment.isNew || comment.isEdited
                    );
                    setHasUnsavedComments(hasUnsaved);

                    setpiData(prevPiData => {
                      if (!prevPiData) return prevPiData;
                      return {
                        ...prevPiData,
                        userComments: updatedComments
                      };
                    });
                  }
                }}
              />
            </div>

            <div
              className="d-flex mt-3 mb-3"
              style={{
                justifyContent: 'space-between'
              }}
            >
              <div>
                <CustomButton
                  variant="danger"
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Cancel
                </CustomButton>
              </div>
              <div>
                <div>
                  <CustomButton
                    variant="secondary"
                    onClick={() => {
                      openModal();
                    }}
                    style={{ marginRight: '10px' }}
                  >
                    PO Wizard
                  </CustomButton>

                  <CustomButton
                    variant="info"
                    onClick={() => {
                      fetchPIWizardData();
                    }}
                  >
                    PI Wizard
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>

          <POModal
            show={isModalOpen}
            onHide={closeModal}
            rfqNumberId={piData?.clientRFQId}
            quoteId={piData?.quoteId || piId}
            piId={piId}
            openOnSecondPage={openModalOnSecondPage}
            onCreatePO={() => {
              fetchPOWizardData();
              closeModal();
            }}
          />

          {/* Show PI Wizard when data is loaded */}
          {showPIWizard && piWizardData && (
            <PIWizard
              handleOpen={handleOpenPIWizard}
              handleClose={handleClosePIWizard}
              showTabs={showPIWizard}
              selectedParts={selectedParts}
              selectedAlternativeParts={selectedAlternativeParts}
              quoteId={piData?.quoteId || piId}
              quoteComment=""
              piResponseData={piWizardData}
            />
          )}

          {/* Show PO Wizard when data is loaded */}
          {showPOWizard && poWizardData && (
            <POWizard
              handleOpen={handleOpenPOWizard}
              handleClose={handleClosePOWizard}
              showTabs={showPOWizard}
              selectedParts={selectedParts}
              selectedAlternativeParts={selectedAlternativeParts}
              quoteId={piData?.quoteId || piId}
              quoteComment=""
              piResponseData={poWizardData}
            />
          )}

          {(isPIWizardLoading || isPOWizardLoading) && (
            <div
              className="position-fixed top-0 left-0 d-flex justify-content-center align-items-center w-100 h-100 bg-white bg-opacity-75"
              style={{ zIndex: 1050 }}
            >
              <LoadingAnimation />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuoteContainer;
