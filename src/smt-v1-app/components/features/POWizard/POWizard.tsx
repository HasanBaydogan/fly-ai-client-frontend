import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import WizardTabs from './POWizardTabs';
import { quoteWizardIntro } from 'smt-v1-app/services/QuoteService';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getAllCurrenciesFromDB } from 'smt-v1-app/services/RFQService';

export interface partRow {
  no: number;
  currency: string;
  description: string;
  leadTime: number;
  partNumber: string;
  qty: number;
  poPartId: string;
  price: number;
  priceString: string;
  tempId: number | undefined;
  id: string;
  poPartSuppliers: {
    supplier: string;
  };
}

export interface QuoteWizardSetting {
  addressRow1: string;
  addressRow2: string;
  commentsSpecialInstruction: string;
  contactInfo: string;
  companyName: string;
  companyAddress: string;
  companyTelephone: string;
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
  quoteWizardPartResponses: partRow[];
  quoteWizardSetting: QuoteWizardSetting;
  revisionNumber: number;
}

export interface PIResponseData {
  airCargoToX: { airCargoToX: number; included: boolean };
  allBanks: Array<{
    bankName: string;
    branchName: string;
    branchCode: string;
    swiftCode: string;
    ibanNo: string;
    currency: string | null;
  }>;
  clientLegalAddress: string;
  clientName: string;
  companyName: string;
  companyAddress: string;
  companyTelephone: string;
  contractNo: string;
  deliveryTerm: string;
  isInternational: boolean;
  logo: string;
  paymentTerm: string;
  piId: string;
  piNumberId: string;
  piParts: any[];
  revisionNumber: number;
  sealineToX: { sealineToX: number; isIncluded: boolean };
  subTotal: number;
  tax: { tax: number; taxRate: number };
  total: number;
  truckCarriageToX: { truckCarriageToX: number; isIncluded: boolean };
  validityDay: number;
}

export interface SetupOtherProps {
  clientLocation: string;
  setClientLocation: React.Dispatch<React.SetStateAction<string>>;
  shipTo: string;
  setShipTo: React.Dispatch<React.SetStateAction<string>>;
  requisitioner: string;
  setRequisitioner: React.Dispatch<React.SetStateAction<string>>;
  shipVia: string;
  setShipVia: React.Dispatch<React.SetStateAction<string>>;
  fob: string;
  setFob: React.Dispatch<React.SetStateAction<string>>;
  shippingTerms: string;
  setShippingTerms: React.Dispatch<React.SetStateAction<string>>;
  contractNo: string;
  setContractNo: React.Dispatch<React.SetStateAction<string>>;
  isInternational: boolean;
  setIsInternational: React.Dispatch<React.SetStateAction<boolean>>;
  validityDay: number;
  setValidityDay: React.Dispatch<React.SetStateAction<number>>;
  selectedBank: PIResponseData['allBanks'][0] | null;
  setSelectedBank: React.Dispatch<
    React.SetStateAction<PIResponseData['allBanks'][0] | null>
  >;
}

export interface POResponseData {
  airCargoToX: { airCargoToX: number; isIncluded: boolean };
  companyAddress: string;
  companyName: string;
  companyTelephone: string;
  fob: string;
  logo: string;
  poId: string;
  poNumberId: string;
  poParts: any[];
  requisitoner: string;
  revisionNumber: number;
  sealineToX: { sealineToX: number; isIncluded: boolean };
  shipTo: string;
  shipVia: string;
  shippingTerms: string;
  subTotal: number;
  suppliers: any[];
  tax: { tax: number; taxRate: number; isIncluded: boolean };
  total: number;
  truckCarriageToX: { truckCarriageToX: number; isIncluded: boolean };
}

// Create a union type for the data we'll use
type WizardData = PIResponseData | QuoteWizardData | POResponseData;

interface PIWizardProps {
  handleOpen: () => void;
  handleClose: () => void;
  showTabs: boolean;
  selectedParts: string[];
  selectedAlternativeParts: string[];
  quoteId: string;
  quoteComment: string;
  initialData?: WizardData;
  piResponseData?: PIResponseData;
  poResponseData?: POResponseData;
}

const POWizard: React.FC<PIWizardProps> = ({
  handleOpen,
  handleClose,
  showTabs,
  selectedParts,
  selectedAlternativeParts,
  quoteId,
  quoteComment,
  initialData,
  piResponseData,
  poResponseData
}) => {
  // Add console.log to check incoming props
  // console.log('PIWizard Props:', {
  //   piResponseData,
  //   initialData,
  //   quoteId,
  //   selectedParts,
  //   selectedAlternativeParts
  // });

  const [quoteWizardData, setQuoteWizardData] =
    useState<QuoteWizardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [selectedBank, setSelectedBank] = useState<
    PIResponseData['allBanks'][0] | null
  >(null);

  // Function to handle the wizard close and trigger opening the PIModal
  const handleBackToPIModal = () => {
    handleClose(); // Close the PIWizard
    handleOpen(); // Open the PIModal
  };

  const setupOtherProps: SetupOtherProps = {
    clientLocation: '',
    setClientLocation: () => {},
    shipTo: '',
    setShipTo: () => {},
    requisitioner: '',
    setRequisitioner: () => {},
    shipVia: '',
    setShipVia: () => {},
    fob: '',
    setFob: () => {},
    shippingTerms: '',
    setShippingTerms: () => {},
    contractNo: '',
    setContractNo: () => {},
    isInternational: false,
    setIsInternational: () => {},
    validityDay: 0,
    setValidityDay: () => {},
    selectedBank,
    setSelectedBank
  };

  useEffect(() => {
    const getSelectedQuoteParts = async () => {
      setIsLoading(true);
      try {
        // Use initialData as piResponseData or poResponseData if it exists
        const dataToUse = initialData || piResponseData || poResponseData;

        if (dataToUse) {
          // Convert data to QuoteWizardData format
          const convertedData: QuoteWizardData = {
            currency: 'USD', // Default currency, can be updated based on your needs
            quoteId:
              'poId' in dataToUse
                ? dataToUse.poId
                : 'piId' in dataToUse
                ? dataToUse.piId
                : dataToUse.quoteId,
            quoteNumberId:
              'poNumberId' in dataToUse
                ? dataToUse.poNumberId
                : 'piNumberId' in dataToUse
                ? dataToUse.piNumberId
                : dataToUse.quoteNumberId,
            rfqNumberId: '',
            quoteWizardPartResponses:
              'poParts' in dataToUse
                ? dataToUse.poParts.map(part => ({
                    ...part,
                    isNew: false,
                    priceString: part.price?.toString() || '0',
                    tempId: undefined
                  }))
                : 'piParts' in dataToUse
                ? dataToUse.piParts.map(part => ({
                    ...part,
                    isNew: false,
                    priceString: part.price?.toString() || '0',
                    tempId: undefined
                  }))
                : dataToUse.quoteWizardPartResponses,
            quoteWizardSetting: {
              companyTelephone:
                'companyTelephone' in dataToUse
                  ? dataToUse.companyTelephone
                  : '',
              companyName:
                'companyName' in dataToUse
                  ? dataToUse.companyName
                  : dataToUse.quoteWizardSetting.companyName,
              companyAddress:
                'companyAddress' in dataToUse ? dataToUse.companyAddress : '',
              addressRow1:
                'companyAddress' in dataToUse
                  ? dataToUse.companyAddress.split('\n')[0] || ''
                  : dataToUse.quoteWizardSetting.addressRow1,
              addressRow2:
                'companyAddress' in dataToUse
                  ? dataToUse.companyAddress.split('\n')[1] || ''
                  : dataToUse.quoteWizardSetting.addressRow2,
              commentsSpecialInstruction: '',
              contactInfo: '',
              logo:
                'logo' in dataToUse
                  ? dataToUse.logo
                  : dataToUse.quoteWizardSetting.logo,
              mobilePhone:
                'companyTelephone' in dataToUse
                  ? dataToUse.companyTelephone
                  : dataToUse.quoteWizardSetting.mobilePhone,
              otherQuoteValues: [],
              phone:
                'companyTelephone' in dataToUse
                  ? dataToUse.companyTelephone
                  : dataToUse.quoteWizardSetting.phone
            },
            revisionNumber: dataToUse.revisionNumber
          };
          setQuoteWizardData(convertedData);
        } else {
          const response = await quoteWizardIntro(
            quoteId,
            selectedParts,
            selectedAlternativeParts
          );
          if (response.statusCode === 200) {
            setQuoteWizardData(response.data);
          }
        }
        const allCurrencies = await getAllCurrenciesFromDB();
        if (allCurrencies.statusCode === 200) {
          setCurrencies(allCurrencies.data);
        }
      } catch (error) {
        console.error('Error loading wizard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getSelectedQuoteParts();
  }, [
    selectedParts,
    selectedAlternativeParts,
    initialData,
    piResponseData,
    poResponseData,
    quoteId
  ]);

  return (
    <Modal show={showTabs} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Purchase Order Wizard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <LoadingAnimation />
        ) : quoteWizardData ? (
          <WizardTabs
            poId={poResponseData.poId}
            quoteWizardData={quoteWizardData}
            currencies={currencies}
            selectedParts={selectedParts}
            selectedAlternativeParts={selectedAlternativeParts}
            quoteComment={quoteComment}
            piResponseData={(initialData as PIResponseData) || piResponseData}
            poResponseData={(initialData as POResponseData) || poResponseData}
            onClose={handleBackToPIModal}
          />
        ) : (
          <div className="text-center p-4">
            <p>No data available</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default POWizard;
