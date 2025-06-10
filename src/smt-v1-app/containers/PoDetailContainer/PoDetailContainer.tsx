import React, { useEffect, useState } from 'react';
import Header from '../../components/features/PoDetail/PoDetailHeader';
import PiComments from '../../components/features/PiDetail/PiComments';

import {
  MailItemMoreDetail,
  Contact,
  Pi,
  AlternativePiPart,
  PiParts
} from './QuoteContainerTypes';

import PiPartList from 'smt-v1-app/components/features/PoDetail/PoPartList';
import QuoteListAlternativeParts from 'smt-v1-app/components/features/PoDetail/PoDetailAlternativeParts/PoListAlternativeParts';
import CustomButton from '../../../components/base/Button';
import { getRFQMailIdToGoToRFQMail } from 'smt-v1-app/services/QuoteService';
import { getPiWizard } from 'smt-v1-app/services/PIServices';
import { useSearchParams } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import PIWizard from 'smt-v1-app/components/features/PIWizard/PIWizard';
import POWizard from 'smt-v1-app/components/features/POWizard/POWizard';
import { getPoDetails } from 'smt-v1-app/services/PoServices';
import { PODetailData } from 'smt-v1-app/types/PoTypes';

const PoDetailContainer = () => {
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
  const poId = searchParams.get('poId');

  const [mailItemMoreDetailResponse, setMailItemMoreDetailResponse] =
    useState<MailItemMoreDetail>();
  const [parts, setParts] = useState<PiParts[]>([]);
  const [alternativeParts, setAlternativeParts] = useState<AlternativePiPart[]>(
    []
  );
  const [piData, setpiData] = useState<PODetailData>();
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [companyNameAddress, setCompanyNameAddress] = useState('');

  const [showQuoteWizardTabs, setShowQuoteWizardTabs] = useState(false);
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

  const handleOpen = () => setShowQuoteWizardTabs(true);
  const handleClose = () => setShowQuoteWizardTabs(false);

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  // Function to fetch PI Wizard data and open the wizard
  const fetchPIWizardData = async () => {
    setIsPIWizardLoading(true);
    try {
      const response = await getPiWizard(poId);
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
      const response = await getPiWizard(poId);
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
      const response = await getPoDetails(poId);
      if (response && response.statusCode === 200) {
        setIsLoading(true);
        setpiData(response.data);
        setParts(response.data.poParts || []);
        setAlternativeParts(response.data.alternativePOParts || []);
        setIsLoading(false);
      }
    };
    fetchQuoteValues();
  }, [poId]);

  const handleQuoteWizardTabs = () => {
    setShowQuoteWizardTabs(true);
  };

  const handleGoToRFQMail = async () => {
    if (hasUnsavedComments) {
      if (
        !window.confirm(
          'You have unsaved comments. Do you want to leave without saving?'
        )
      ) {
        return;
      }
    }

    const response = await getRFQMailIdToGoToRFQMail(poId);
    if (response && response.statusCode === 200) {
      window.location.assign('/rfqs/rfq?rfqMailId=' + response.data.rfqMailId);
    }
  };

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
                  poRequestedDate={piData?.poRequestedDate || ''}
                  poNumberId={piData?.poNumberId || ''}
                  quoteReferenceId={piData?.quoteReferenceId || ''}
                  clientName={piData?.selectedCompany || ''}
                  clientRFQId={piData?.quoteReferenceId || ''}
                  revisionNumber={piData?.revisionNumber || 0}
                  companyNameAddress={piData?.shipTo || ''}
                  setCompanyNameAddress={setCompanyNameAddress}
                  requisitioner={piData?.requsitioner}
                  shipVia={piData?.shipVia}
                  fob={piData?.fob}
                  shippingTerms={piData?.shippingTerms}
                  attachments={
                    mailItemMoreDetailResponse?.mailItemAttachmentResponses
                  }
                  poStatus={piData?.poStatus}
                />
              }
            </div>
            {/* <div>
              <PiOthers piData={piData} />
            </div> */}
            <div>
              <PiPartList
                parts={parts || []}
                selectedParts={selectedParts}
                setSelectedParts={setSelectedParts}
              />
              <QuoteListAlternativeParts
                alternativeParts={alternativeParts || []}
                selectedAlternativeParts={selectedAlternativeParts}
                setSelectedAlternativeParts={setSelectedAlternativeParts}
              />
              <hr className="custom-line w-100 m-0" />
            </div>

            <div>
              {/* <PiComments
                piData={piData}
                userComments={
                  piData?.comments
                    ? [{ comment: piData.comments, severity: 'info' }]
                    : []
                }
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
                        comments: updatedComments[0]?.comment || ''
                      };
                    });
                  }
                }}
              /> */}
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
                    disabled
                    onClick={() => {
                      fetchPOWizardData();
                    }}
                    style={{ marginRight: '10px' }}
                  >
                    PO Wizard
                  </CustomButton>

                  <CustomButton
                    variant="info"
                    disabled
                    onClick={() => {
                      fetchPIWizardData();
                    }}
                  >
                    LOT Form
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>

          {/* Show PI Wizard when data is loaded */}
          {showPIWizard && piWizardData && (
            <PIWizard
              handleOpen={handleOpenPIWizard}
              handleClose={handleClosePIWizard}
              showTabs={showPIWizard}
              selectedParts={selectedParts}
              selectedAlternativeParts={selectedAlternativeParts}
              quoteId={piData?.quoteReferenceId || poId}
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
              quoteId={piData?.quoteReferenceId || poId}
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

export default PoDetailContainer;
