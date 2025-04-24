import React, { useEffect, useState } from 'react';
import RFQHeader from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';

import Header from '../../components/features/PiDetail/PiDetailHeader';
import PiOthers from '../../components/features/PiDetail/PiOthers';
import PiComments from '../../components/features/PiDetail/PiComments';

import {
  MailItemMoreDetail,
  Contact,
  Pi,
  AlternativePiPart,
  PiParts
} from './QuoteContainerTypes';

import QuoteContactsList from '../../components/features/QuoteList/QuoteListRightComponents/QuoteContactList/QuoteContactsList';
import PiPartList from 'smt-v1-app/components/features/PiDetail/PiPartList';
import QuoteListAlternativeParts from 'smt-v1-app/components/features/PiDetail/QuoteListAlternativeParts/PiAlternativeParts';
import CustomButton from '../../../components/base/Button';
import QuoteWizard from '../../components/features/QuoteWizard/QuoteWizard';
import {
  getQuoteDetailsById,
  getRFQMailIdToGoToRFQMail
} from 'smt-v1-app/services/QuoteService';
import { getPiDetails, getPiWizard } from 'smt-v1-app/services/PIServices';
import { useSearchParams } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getColorStyles } from 'smt-v1-app/components/features/RfqMailRowItem/RfqMailRowHelper';
import POModal from 'smt-v1-app/components/features/PıModal/PIModal';
import PIWizard from 'smt-v1-app/components/features/PIWizard/PIWizard';

const QuoteContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalOnSecondPage, setOpenModalOnSecondPage] = useState(false);

  // State for PIWizard
  const [showPIWizard, setShowPIWizard] = useState(false);
  const [piWizardData, setPiWizardData] = useState(null);
  const [isPIWizardLoading, setIsPIWizardLoading] = useState(false);

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
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [userComments, setUserComments] = useState('');

  const [showQuoteWizardTabs, setShowQuoteWizardTabs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedComments, setHasUnsavedComments] = useState(false);
  // const [statusColors, setStatusColors] = useState<{
  //   bgColor: string;
  //   textColor: string;
  // }>();

  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectedAlternativeParts, setSelectedAlternativeParts] = useState<
    string[]
  >([]);

  const handleOpenPIWizard = () => setShowPIWizard(true);
  const handleClosePIWizard = () => setShowPIWizard(false);

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

  useEffect(() => {
    const fetchQuoteValues = async () => {
      const response = await getPiDetails(piId);
      if (response && response.statusCode == 200) {
        setIsLoading(true);
        // setMailItemMoreDetailResponse(response.data.mailItemMoreDetailResponse);
        setpiData(response.data);
        // setContacts(response.data.clientContacts);
        setParts(response.data.piParts);
        setAlternativeParts(response.data.piAlternativeParts);
        // const returnedColor = getColorStyles(response.data.rfqMailStatus);
        // setStatusColors({
        //   bgColor: returnedColor.bgColor,
        //   textColor: returnedColor.textColor
        // });

        setIsLoading(false);
      }
      // else {
      //   window.location.assign('/404');
      // }
    };
    fetchQuoteValues();
  }, []);

  const handleQuoteWizardTabs = () => {
    setShowQuoteWizardTabs(true);
  };

  const handleGoToRFQMail = async () => {
    // Check for unsaved comments
    if (hasUnsavedComments) {
      if (
        !window.confirm(
          'You have unsaved comments. Do you want to leave without saving?'
        )
      ) {
        return;
      }
    }

    const response = await getRFQMailIdToGoToRFQMail(piId);
    if (response && response.statusCode === 200) {
      window.location.assign('/rfqs/rfq?rfqMailId=' + response.data.rfqMailId);
    } else {
      // console.log('An error occurs when Go To RFQ Mail');
    }
  };

  const handleCancel = () => {
    // Check for unsaved comments
    if (hasUnsavedComments) {
      if (
        !window.confirm(
          'You have unsaved comments. Do you want to leave without saving?'
        )
      ) {
        return;
      }
    }

    window.location.assign('/mail-tracking');
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="rfq-container">
          {/* <div className="rfq-left">
            <RFQHeader
              subject={
                mailItemMoreDetailResponse && mailItemMoreDetailResponse.subject
              }
              companyName={
                mailItemMoreDetailResponse &&
                mailItemMoreDetailResponse.senderCompanyName
              }
              from={
                mailItemMoreDetailResponse && mailItemMoreDetailResponse.from
              }
              date={
                mailItemMoreDetailResponse &&
                mailItemMoreDetailResponse.mailDate
              }
            />
            <RFQContent
              content={
                mailItemMoreDetailResponse &&
                mailItemMoreDetailResponse.mailContentItemResponses
              }
            />
            <RFQAttachments
              attachments={
                mailItemMoreDetailResponse &&
                mailItemMoreDetailResponse.mailItemAttachmentResponses
              }
            />
          </div> */}
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
                  // bgColor={statusColors.bgColor}
                  // textColor={statusColors.textColor}
                  userComments={userComments}
                  setUserComments={setUserComments}
                  // status={'FQ'} //{piData && piData.rfqMailStatus}
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
            {/* <div>
              <QuoteContactsList
                contacts={contacts}
                handleAddContact={handleAddContact}
                handleDeleteContact={handleDeleteContact}
              />
            </div> */}
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
                  // Use functional state update to avoid dependency on current piData
                  if (piData) {
                    // Check if there are any unsaved comments
                    const hasUnsaved = updatedComments.some(
                      comment => comment.isNew || comment.isEdited
                    );
                    setHasUnsavedComments(hasUnsaved);

                    // Update piData with the new comments - use functional update
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
                    // Handle Go to RFQ Mail click
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
                      // PO Wizard is currently inactive
                      // console.log(
                      //   'PO Wizard functionality is not available yet'
                      // );
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

          {isPIWizardLoading && (
            <div
              className="position-fixed top-0 left-0 d-flex justify-content-center align-items-center w-100 h-100 bg-white bg-opacity-75"
              style={{ zIndex: 1050 }}
            >
              <LoadingAnimation />
            </div>
          )}

          {/* {showQuoteWizardTabs ? (
            <QuoteWizard
              selectedParts={selectedParts}
              selectedAlternativeParts={selectedAlternativeParts}
              quoteId={quoteData.quoteId}
              handleOpen={handleOpen}
              handleClose={handleClose}
              showTabs={showQuoteWizardTabs}
              quoteComment={quoteComment}
            ></QuoteWizard>
          ) : null} */}
        </div>
      )}
    </>
  );
};

export default QuoteContainer;
