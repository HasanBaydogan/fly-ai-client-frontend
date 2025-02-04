import React, { useEffect, useState } from 'react';
import RFQHeader from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQHeader/RFQHeader';
import RFQContent from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQContent/RFQContent';
import RFQAttachments from '../../components/features/RFQLeftSide/RFQLeftSideComponents/RFQAttachments/RFQAttachments';
import StatusButtonGroup from '../../components/features/RFQLeftSide/RFQLeftSideComponents/StatusButtonGroup/StatusButtonGroup';
import Header from '../../components/features/QuoteList/QuoteListHeader';
import Client from '../../components/features/RFQRightSide/RFQRightSideComponents/Client/Client';
import AlternativePartList from '../../components/features/RFQRightSide/RFQRightSideComponents/AlternativePartList/AlternativePartList';
import RFQRightSideFooter from '../../components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideFooter/RFQRightSideFooter';
import { MailItemMoreDetail, Contact, Quote, AlternativeQuotePart, QuotePart } from './QuoteContainerTypes';

import {
  RFQPart,
  AlternativeRFQPart
} from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import QuoteContactsList from '../../components/features/QuoteList/QuoteListRightComponents/QuoteContactList/QuoteContactsList';
import QuotePartList from '../../components/features/QuoteList/QuoteListRightComponents/QuotePartList/QuotePartList';
import QuoteListAlternativeParts from '../../components/features/QuoteList/QuoteListRightComponents/QuoteListAlternativeParts/QuoteListAlternativeParts';
import CustomButton from '../../../components/base/Button';
import QuoteWizard from '../../components/features/QuoteWizard/QuoteWizard';
import { getQuoteDetailsById } from 'smt-v1-app/services/QuoteService';
import { useSearchParams } from 'react-router-dom';

const QuoteContainer = ({

}: {

}) => {
   const [searchParams] = useSearchParams();
   const quoteId = searchParams.get('quoteId');
    
  const [mailItemMoreDetailResponse, setMailItemMoreDetailResponse] = useState<MailItemMoreDetail>();
    const [parts, setParts] = useState<QuotePart[]>([]);
    const [alternativeParts, setAlternativeParts] = useState<AlternativeQuotePart[]>([]);
  const [quoteData, setQuoteData] = useState<Quote>()
  const [contacts, setContacts] = useState<Contact[]>( []);


  const [showQuoteWizardTabs, setShowQuoteWizardTabs] = useState(false);

  const handleOpen = () => setShowQuoteWizardTabs(true);
  const handleClose = () => setShowQuoteWizardTabs(false);

  const handleDeletePart = (partNumber: string) => {
    setParts(prevParts =>
      prevParts.filter(part => part.partNumber !== partNumber)
    );
  };

  const handleAddPart = (rfqPart: QuotePart) => {
    setParts(prevParts => [...prevParts, rfqPart]);
  };

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  useEffect(() => {
    const fetchQuoteValues = async () => {
     const response = await getQuoteDetailsById(quoteId);
     if(response && response.statusCode == 200) {
      setMailItemMoreDetailResponse(response.data.mailItemMoreDetailResponse);
      setQuoteData(response.data)
      setContacts(response.data.clientContacts)
      setParts(response.data.quotePartResponses);
      setAlternativeParts(response.data.alternativeQuotePartResponses)
      console.log(response.data)
     }
    
     
    }
    fetchQuoteValues();

  },[])

  return (
    <div className="rfq-container d-flex flex-wrap justify-content-around">
      <div className="rfq-left">
        <RFQHeader
          subject={mailItemMoreDetailResponse && mailItemMoreDetailResponse.subject}
          companyName={mailItemMoreDetailResponse && mailItemMoreDetailResponse.senderCompanyName}
          from={mailItemMoreDetailResponse && mailItemMoreDetailResponse.from}
          date={mailItemMoreDetailResponse && mailItemMoreDetailResponse.mailDate}
        />
        <RFQContent content={mailItemMoreDetailResponse && mailItemMoreDetailResponse.mailContentItemResponses} />
        <RFQAttachments attachments={mailItemMoreDetailResponse && mailItemMoreDetailResponse.mailItemAttachmentResponses} />
      </div>
      <div className="rfq-right">
        <div>
         {
          <Header
            date={quoteData && quoteData.lastModifiedDate}
            rfqNumberId={quoteData &&quoteData.rfqNumberId}
            quoteId={quoteData &&quoteData.quoteId}
            clientRFQId={quoteData &&quoteData.clientRFQId}
            clientName={quoteData &&quoteData.client}
            bgColor="#f57c00"
            textColor="#ffffff"
            status={"WFS"}
          /> }
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
            handleDeletePart={handleDeletePart}
            handleAddPart={handleAddPart}
            alternativeParts={alternativeParts}
            setAlternativeParts={setAlternativeParts}
          />
          <QuoteListAlternativeParts alternativeParts={alternativeParts} />
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
                console.log('Go to RFQ Mail clicked');
              }}
            >
              Go to RFQ Mail
            </CustomButton>
          </div>
          <div>
            <div>
              <CustomButton
                variant="secondary"
                onClick={() => {
                  // Handle Go to RFQ Mail click
                  console.log('Go to RFQ Mail clicked');
                }}
              >
                Go to RFQ Mail
              </CustomButton>
            </div>
            <div className="mt-3">
              <CustomButton
                variant="success"
                onClick={() => {
                  // Handle Quote Wizard click
                  setShowQuoteWizardTabs(true);
                }}
              >
                Quote Wizard
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      {showQuoteWizardTabs ? <QuoteWizard
        handleOpen={handleOpen}
        handleClose={handleClose}
        showTabs={showQuoteWizardTabs}
      ></QuoteWizard> : null}
      
    </div>
  );
};

export default QuoteContainer;
