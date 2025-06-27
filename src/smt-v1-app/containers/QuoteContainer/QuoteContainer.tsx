import React, { useEffect, useState, useCallback } from 'react';
import RFQHeader from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';

import Header from '../../components/features/QuoteList/QuoteListHeader';

import {
  MailItemMoreDetail,
  Contact,
  Quote,
  AlternativeQuotePart,
  QuotePart
} from './QuoteContainerTypes';

import QuoteContactsList from '../../components/features/QuoteList/QuoteListRightComponents/QuoteContactList/QuoteContactsList';
import QuotePartList from '../../components/features/QuoteList/QuoteListRightComponents/QuotePartList/QuotePartList';
import QuoteListAlternativeParts from '../../components/features/QuoteList/QuoteListRightComponents/QuoteListAlternativeParts/QuoteListAlternativeParts';
import CustomButton from '../../../components/base/Button';
import QuoteWizard from '../../components/features/QuoteWizard/QuoteWizard';
import {
  getQuoteDetailsById,
  getRFQMailIdToGoToRFQMail
} from 'smt-v1-app/services/QuoteService';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getColorStyles } from 'smt-v1-app/components/features/RfqMailRowItem/RfqMailRowHelper';
import POModal from 'smt-v1-app/components/features/PıModal/PIModal';
import { useUnsavedChanges } from 'providers/UnsavedChangesProvider';

const QuoteContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalOnSecondPage, setOpenModalOnSecondPage] = useState(false);

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
  const navigate = useNavigate();
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const quoteId = searchParams.get('quoteId');

  const [mailItemMoreDetailResponse, setMailItemMoreDetailResponse] =
    useState<MailItemMoreDetail>();
  const [parts, setParts] = useState<QuotePart[]>([]);
  const [alternativeParts, setAlternativeParts] = useState<
    AlternativeQuotePart[]
  >([]);
  const [quoteData, setQuoteData] = useState<Quote>();
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [quoteComment, setQuoteComment] = useState('');

  const [showQuoteWizardTabs, setShowQuoteWizardTabs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusColors, setStatusColors] = useState<{
    bgColor: string;
    textColor: string;
  }>();

  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectedAlternativeParts, setSelectedAlternativeParts] = useState<
    string[]
  >([]);

  // Extract currency from parts data
  const getCurrencyFromParts = useCallback(() => {
    if (parts && parts.length > 0) {
      // Get currency from the first part, assuming all parts have the same currency
      return parts[0].currency;
    }
    return '';
  }, [parts]);

  const handleOpen = () => setShowQuoteWizardTabs(true);
  const handleClose = () => setShowQuoteWizardTabs(false);

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  useEffect(() => {
    const fetchQuoteValues = async () => {
      const response = await getQuoteDetailsById(quoteId);
      if (response && response.statusCode == 200) {
        setIsLoading(true);
        setMailItemMoreDetailResponse(response.data.mailItemMoreDetailResponse);
        setQuoteData(response.data);
        setContacts(response.data.clientContacts);
        setParts(response.data.quotePartResponses);
        setAlternativeParts(response.data.alternativeQuotePartResponses);
        const returnedColor = getColorStyles(response.data.rfqMailStatus);
        setStatusColors({
          bgColor: returnedColor.bgColor,
          textColor: returnedColor.textColor
        });

        setIsLoading(false);
      } else {
        window.location.assign('/404');
      }
    };
    fetchQuoteValues();
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [setHasUnsavedChanges]);

  const handleQuoteWizardTabs = () => {
    setShowQuoteWizardTabs(true);
  };

  const handleGoToRFQMail = async () => {
    const response = await getRFQMailIdToGoToRFQMail(quoteId);
    if (response && response.statusCode === 200) {
      window.location.assign('/rfqs/rfq?rfqMailId=' + response.data.rfqMailId);
    } else {
      // console.log('An error occurs when Go To RFQ Mail');
    }
  };

  const handleCancel = () => {
    window.location.assign('/mail-tracking');
  };

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="rfq-container d-flex flex-wrap justify-content-around">
          <div className="rfq-left">
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
          </div>
          <div className="rfq-right">
            <div>
              {
                <Header
                  date={quoteData && quoteData.lastModifiedDate}
                  revisionNumber={quoteData.revisionNumber}
                  rfqNumberId={quoteData && quoteData.rfqNumberId}
                  quoteId={quoteData && quoteData.quoteNumberId}
                  clientRFQId={quoteData && quoteData.clientRFQId}
                  clientName={quoteData && quoteData.client}
                  bgColor={statusColors.bgColor}
                  textColor={statusColors.textColor}
                  quoteComment={quoteComment}
                  setQuoteComment={setQuoteComment}
                  status={'FQ'} //{quoteData && quoteData.rfqMailStatus}
                />
              }
            </div>
            <div>
              <QuoteContactsList
                contacts={contacts}
                handleAddContact={handleAddContact}
                handleDeleteContact={handleDeleteContact}
              />
            </div>
            <div>
              <QuotePartList
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

                <div className="mt-3">
                  <CustomButton
                    variant="info"
                    onClick={() => {
                      openModal();
                    }}
                  >
                    PI Wizard
                  </CustomButton>
                </div>
              </div>
              <div>
                <div>
                  <CustomButton
                    variant="secondary"
                    onClick={() => {
                      // Handle Go to RFQ Mail click
                      handleGoToRFQMail();
                    }}
                  >
                    Go to RFQ Mail
                  </CustomButton>
                </div>
                <div className="mt-3">
                  <CustomButton
                    variant="success"
                    onClick={() => {
                      handleQuoteWizardTabs();
                    }}
                  >
                    Quote Wizard
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>

          <POModal
            show={isModalOpen}
            onHide={closeModal}
            rfqNumberId={quoteData?.rfqNumberId}
            quoteId={quoteData?.quoteId}
            openOnSecondPage={openModalOnSecondPage}
            currency={getCurrencyFromParts()}
            totalAmount={quoteData?.totalAmount}
          />

          {showQuoteWizardTabs ? (
            <QuoteWizard
              selectedParts={selectedParts}
              selectedAlternativeParts={selectedAlternativeParts}
              quoteId={quoteData.quoteId}
              handleOpen={handleOpen}
              handleClose={handleClose}
              showTabs={showQuoteWizardTabs}
              quoteComment={quoteComment}
            ></QuoteWizard>
          ) : null}
        </div>
      )}
    </>
  );
};

export default QuoteContainer;
