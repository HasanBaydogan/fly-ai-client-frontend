import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import WizardTabs from './WizardTabs/WizardTabs';
import { quoteWizardIntro } from 'smt-v1-app/services/QuoteService';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getAllCurrenciesFromDB } from 'smt-v1-app/services/RFQService';

export interface QuotePartRow {
  alternativeTo: string;
  currency: string;
  description: string;
  fndCondition: string;
  leadTime: number;
  partNumber: string;
  quantity: number;
  quotePartId: string;
  reqCondition: string;
  unitPrice: number;
  isNew: boolean;
  unitPriceString: string;
  tempId: number | undefined;
  id: string;
}
export interface QuoteWizardSetting {
  addressRow1: string;
  addressRow2: string;
  commentsSpecialInstruction: string;
  contactInfo: string;
  logo: string;
  mobilePhone: string;
  otherQuoteValues: string[];
  phone: string;
}

export interface QuoteWizardData {
  currency: string;
  quoteId: string;
  quoteNumberId: string;
  rfqNumberId: string;
  quoteWizardPartResponses: QuotePartRow[];
  quoteWizardSetting: QuoteWizardSetting;
  revisionNumber: number;
}

const QuoteWizard = ({
  handleOpen,
  handleClose,
  showTabs,
  selectedParts,
  selectedAlternativeParts,
  quoteId
}: {
  handleOpen: () => void;
  handleClose: () => void;
  showTabs: boolean;
  selectedParts: string[];
  selectedAlternativeParts: string[];
  quoteId: string;
}) => {
  const [quoteWizardData, setQuoteWizardData] = useState<QuoteWizardData>();
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    const getSelectedQuoteParts = async () => {
      setIsLoading(true);
      const response = await quoteWizardIntro(
        quoteId,
        selectedParts,
        selectedAlternativeParts
      );
      if (response.statusCode == 200) {
        setQuoteWizardData(response.data);
      }
      const allCurrencies = await getAllCurrenciesFromDB();
      if (allCurrencies.statusCode === 200) {
        setCurrencies(allCurrencies.data);
      }
      //getPriceCurrencySymbol()
      setIsLoading(false);
    };
    getSelectedQuoteParts();
  }, [selectedParts, selectedAlternativeParts]);
  return (
    <Modal show={showTabs} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quote Wizard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <WizardTabs
            quoteWizardData={quoteWizardData}
            currencies={currencies}
            selectedParts={selectedParts}
            selectedAlternativeParts={selectedAlternativeParts}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuoteWizard;
