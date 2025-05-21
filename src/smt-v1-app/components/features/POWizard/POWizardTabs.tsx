import WizardSetupForm from './forms/WizardSetupForm';
import WizardSendMailForm from './forms/WizardSendMailForm';
import WizardFormFooter from './wizard/WizardFormFooter';
import WizardForm from './wizard/WizardForm';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import { Card, Tab, Tabs } from 'react-bootstrap';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { MailProvider } from './forms/MailContext';
import ReviewMail from './forms/ReviewMail';
import { defaultMailTemplate } from './forms/defaultMailTemplate';
import {
  partRow,
  QuoteWizardData,
  PIResponseData,
  POResponseData,
  SetupOtherProps
} from './POWizard';
import WizardPreviewForm from './forms/WizardPreviewForm';
import QuoteWizardNav from './wizard/POWizardNav';
import { sendQuoteEmail } from 'smt-v1-app/services/PIServices';

export interface partRequest {
  partId: string;
  partNumber: string;
  quotePartName: string;
  reqCnd: string;
  fndCnd: string;
  leadTime: number;
  qty: number;
  unitPrice: number;
}
interface QuoteOtherValue {
  key: string;
  value: number;
}

interface WizardTabsProps {
  quoteWizardData: QuoteWizardData;
  currencies: string[];
  selectedParts: string[];
  selectedAlternativeParts: string[];
  quoteComment: string;
  piResponseData?: PIResponseData;
  poResponseData?: POResponseData;
  onClose?: () => void;
}

const WizardTabs: React.FC<WizardTabsProps> = ({
  quoteWizardData,
  currencies,
  selectedParts,
  selectedAlternativeParts,
  quoteComment,
  piResponseData,
  poResponseData,
  onClose
}) => {
  const form = useWizardForm({
    totalStep: 4
  });

  const [activeTab, setActiveTab] = useState('setup');
  const [quotePartRows, setQuotePartRows] = useState<partRow[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [subTotalValues, setSubTotalValues] = useState<number[]>([]);
  const [currency, setCurrency] = useState(quoteWizardData.currency);
  const [checkedStates, setCheckedStates] = useState<boolean[]>([]);
  const [clientLocation, setClientLocation] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [requisitioner, setRequisitioner] = useState('');
  const [shipVia, setShipVia] = useState('');
  const [fob, setFob] = useState<string>('');
  const [shippingTerms, setShippingTerms] = useState<string>('');
  const [contractNo, setContractNo] = useState<string>('');
  const [isInternational, setIsInternational] = useState<boolean>(false);
  const [validityDay, setValidityDay] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<
    PIResponseData['allBanks'][0] | null
  >(null);
  const [percentageValue, setPercentageValue] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  const calculateSubTotal = () => {
    return quotePartRows.reduce((acc, row) => acc + row.qty * row.price, 0);
  };

  const calculateTaxAmount = (percentage: number) => {
    const subTotal = calculateSubTotal();
    const tax = (subTotal * percentage) / 100;
    setTaxAmount(tax);
    return tax;
  };

  useEffect(() => {
    if (percentageValue > 0) {
      calculateTaxAmount(percentageValue);
    }
  }, [percentageValue, quotePartRows]);

  const setupOtherProps: SetupOtherProps = {
    clientLocation,
    setClientLocation,
    shipTo,
    setShipTo,
    requisitioner,
    setRequisitioner,
    shipVia,
    setShipVia,
    fob,
    setFob,
    shippingTerms,
    setShippingTerms,
    contractNo,
    setContractNo,
    isInternational,
    setIsInternational,
    validityDay,
    setValidityDay,
    selectedBank,
    setSelectedBank
  };

  const [base64Pdf, setBase64Pdf] = useState<string>('');
  const [base64PdfFileName, setBase64PdfFileName] = useState<string>('');

  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);

  const [toEmails, setToEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>(defaultMailTemplate);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isPdfConvertedToBase64, setIsPdfConvertedToBase64] = useState(true);
  const [from, setFrom] = useState('');

  const emailProps = {
    toEmails,
    setToEmails,
    ccEmails,
    setCcEmails,
    bccEmails,
    setBccEmails,
    subject,
    setSubject,
    content,
    setContent,
    base64Files,
    setBase64Files,
    inputValue,
    setInputValue,
    error,
    setError
  };

  const [isEmailSendLoading, setEmailSendLoading] = useState(false);
  const [isSendEmailSuccess, setIsSendEmailSuccess] = useState(false);

  const handleSendQuoteEmail = async () => {
    setEmailSendLoading(true);
    const attachments: {
      filename: string;
      data: string;
    }[] = base64Files.map(attach => {
      return { filename: attach.name, data: attach.base64 };
    });
    //console.log(quotePartRows);
    // const alreadySavedPart: partRow[] = quotePartRows.filter(
    //   partRow => !partRow.alternativeTo.trim()
    // );
    // const partRequests: partRequest[] = alreadySavedPart.map(quotePart => {
    //   return {
    //     partId: quotePart.id,
    //     partNumber: quotePart.partNumber,
    //     quotePartName: quotePart.description,
    //     leadTime: quotePart.leadTime,
    //     qty: quotePart.qty,
    //     unitPrice: quotePart.price
    //   };
    // });

    // const alreadySavedAlternativeQuotePart: partRow[] = quotePartRows.filter(
    //   partRow => partRow.alternativeTo.trim()
    // );
    // const quoteAlternativePartRequests: partRequest[] =
    //   alreadySavedAlternativeQuotePart.map(quotePart => {
    //     return {
    //       partId: quotePart.id,
    //       partNumber: quotePart.partNumber,
    //       quotePartName: quotePart.description,
    //       reqCnd: quotePart.reqCondition,
    //       fndCnd: quotePart.fndCondition,
    //       leadTime: quotePart.leadTime,
    //       qty: quotePart.qty,
    //       unitPrice: quotePart.unitPrice
    //     };
    //   });

    //console.log(partRequests);
    //console.log(quoteAlternativePartRequests);
    // console.log('xxx', piResponseData);
    const payload = {
      to: toEmails,
      cc: ccEmails,
      subject: subject,
      attachments: attachments,
      body: content,
      PIId: piResponseData.piId,
      // selectedPIParts: partRequests.map(part => ({
      //   piPartId: part.partId,
      //   partNumber: part.partNumber,
      //   description: part.quotePartName,
      //   qty: part.qty,
      //   leadTime: part.leadTime,
      //   unitPrice: part.unitPrice
      // })),
      clientLegalAddress: setupOtherProps.clientLocation,
      contractNo: contractNo,
      isInternational: isInternational,
      paymentTerm: shippingTerms,
      deliveryTerm: fob,
      validityDay: validityDay,
      bankDetail: {
        bankName: piResponseData.allBanks[0].bankName,
        branchName: piResponseData.allBanks[0].branchName,
        branchCode: piResponseData.allBanks[0].branchCode,
        swiftCode: piResponseData.allBanks[0].swiftCode,
        ibanNo: piResponseData.allBanks[0].ibanNo,
        currency: piResponseData.allBanks[0].currency
      },
      piTax: {
        taxRate: percentageValue
      },
      airCargoToX: {
        airCargoToX: subTotalValues[1],
        isIncluded: checkedStates[1] || false
      },
      sealineToX: {
        sealineToX: subTotalValues[2],
        isIncluded: checkedStates[2] || false
      },
      truckCarriageToX: {
        truckCarriageToX: subTotalValues[3],
        isIncluded: checkedStates[3] || false
      }
    };

    // console.log('Sending payload:', payload);

    const response = await sendQuoteEmail(payload);
    // console.log('sendQuoteEmail', response);
    if (response && response.statusCode === 200) {
      setFrom(response.data.from);
      setIsSendEmailSuccess(true);
    } else {
      // console.log(response);
    }

    setEmailSendLoading(false);
  };

  return (
    <MailProvider>
      <WizardFormProvider {...form}>
        <Card className="theme-wizard">
          <Card.Header className="bg-body-highlight pt-3 pb-2 border-bottom-0">
            <QuoteWizardNav />
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey={1}>
                <WizardForm step={1}>
                  <WizardSetupForm
                    id="setup"
                    currencies={currencies}
                    quoteWizardData={quoteWizardData}
                    quotePartRows={quotePartRows}
                    setQuotePartRows={setQuotePartRows}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                    subTotalValues={subTotalValues}
                    setSubTotalValues={setSubTotalValues}
                    setCurrency={setCurrency}
                    currency={currency}
                    checkedStates={checkedStates}
                    setCheckedStates={setCheckedStates}
                    percentageValue={percentageValue}
                    setPercentageValue={setPercentageValue}
                    taxAmount={taxAmount}
                    setTaxAmount={setTaxAmount}
                    setupOtherProps={setupOtherProps}
                    piResponseData={piResponseData}
                    poResponseData={poResponseData}
                  />
                </WizardForm>
              </Tab.Pane>
              <Tab.Pane eventKey={2} unmountOnExit>
                <WizardForm step={2}>
                  {
                    <WizardPreviewForm
                      setBase64Pdf={setBase64Pdf}
                      setIsPdfConvertedToBase64={setIsPdfConvertedToBase64}
                      setBase64PdfFileName={setBase64PdfFileName}
                      settings={quoteWizardData.quoteWizardSetting}
                      quotePartRows={quotePartRows}
                      subTotalValues={subTotalValues}
                      selectedDate={selectedDate}
                      checkedStates={checkedStates}
                      quoteNumber={quoteWizardData.quoteNumberId}
                      currency={currency}
                      percentageValue={percentageValue}
                      taxAmount={taxAmount}
                      setupOtherProps={setupOtherProps}
                      piResponseData={piResponseData}
                      poResponseData={poResponseData}
                    />
                  }
                </WizardForm>
              </Tab.Pane>

              <Tab.Pane eventKey={3}>
                <WizardForm step={3}>
                  {
                    <WizardSendMailForm
                      emailProps={emailProps}
                      isPdfConvertedToBase64={isPdfConvertedToBase64}
                      base64Pdf={base64Pdf}
                      base64PdfFileName={base64PdfFileName}
                      poId={poResponseData.poId}
                    />
                  }
                </WizardForm>
              </Tab.Pane>

              <Tab.Pane eventKey={4}>
                <WizardForm step={4}>
                  {
                    <ReviewMail
                      emailProps={emailProps}
                      quoteNumberId={quoteWizardData.quoteNumberId}
                      rfqNumberId={quoteWizardData.rfqNumberId}
                      isSendEmailSuccess={isSendEmailSuccess}
                      from={from}
                      handleSendQuoteEmail={handleSendQuoteEmail}
                      isEmailSendLoading={isEmailSendLoading}
                    />
                  }
                </WizardForm>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
          <Card.Footer className="border-top-0">
            <WizardFormFooter
              handleSendQuoteEmail={handleSendQuoteEmail}
              isEmailSendLoading={isEmailSendLoading}
              setEmailSendLoading={setEmailSendLoading}
              // onClose={onClose}
            />
          </Card.Footer>
        </Card>
      </WizardFormProvider>
    </MailProvider>
  );
};

export default WizardTabs;
