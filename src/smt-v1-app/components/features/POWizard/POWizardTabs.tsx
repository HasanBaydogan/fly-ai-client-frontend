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
import { sendQuoteEmail, POEmailProps } from 'smt-v1-app/services/PoServices';
import { SendEmailProps } from './forms/WizardSendMailForm';
import { bo } from '@fullcalendar/core/internal-common';
import { getPreEmailSendingParameters } from 'smt-v1-app/services/PoServices';
import { returnPdfAsBase64String } from './forms/PDFGeneratorHelper';

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

interface POWizardTabsProps {
  poId: string;
  quoteWizardData: QuoteWizardData;
  currencies: string[];
  selectedParts: string[];
  selectedAlternativeParts: string[];
  quoteComment: string;
  piResponseData?: PIResponseData;
  poResponseData?: POResponseData;
  onClose?: () => void;
}

const POWizardTabs: React.FC<POWizardTabsProps> = ({
  poId,
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

  const [toEmails, setToEmails] = useState<
    {
      to: string[];
      cc: string[];
      subject: string;
      body: string;
      attachments: {
        filename: string;
        data: string;
      }[];
      supplierName: string;
    }[]
  >([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPdfConvertedToBase64, setIsPdfConvertedToBase64] = useState(true);
  const [preEmailParams, setPreEmailParams] = useState<any[]>([]);
  const [from, setFrom] = useState('');

  // Fetch pre-email parameters
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await getPreEmailSendingParameters(poId);
        const params = response.data.preEmailParameters || [];
        setPreEmailParams(params);

        // Initialize email requests
        const emailRequests = params.map(param => ({
          to: param.toEmails || [],
          cc: param.ccEmails || [],
          subject: param.subject || '',
          body: param.body || '',
          attachments: []
        }));
        setToEmails(emailRequests);
      } catch (error) {
        console.error('Error fetching pre-email parameters:', error);
      }
    };
    fetchParams();
  }, [poId]);

  // Update base64Files when PDF changes
  useEffect(() => {
    if (base64Pdf && base64PdfFileName && !isPdfConvertedToBase64) {
      setBase64Files([{ name: base64PdfFileName, base64: base64Pdf }]);
    }
  }, [base64Pdf, base64PdfFileName, isPdfConvertedToBase64]);

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
  const [allSuppliersSelected, setAllSuppliersSelected] = useState(false);

  const handleSendQuoteEmail = async () => {
    setEmailSendLoading(true);
    try {
      // console.log('Current base64Files:', base64Files);
      // console.log('Current toEmails:', toEmails);

      const payload: POEmailProps = {
        poEmailRequests: toEmails.map((email, emailIndex) => {
          // console.log('Processing email for recipients:', email.to);
          // console.log(
          //   'Email attachments for this supplier:',
          //   email.attachments
          // );

          // Update attachment filenames to remove supplier names
          const updatedAttachments = email.attachments.map(attachment => ({
            filename: attachment.filename.includes('-')
              ? `${poResponseData.poNumberId}.pdf`
              : attachment.filename,
            data: attachment.data
          }));

          return {
            to: email.to,
            cc: email.cc,
            subject: email.subject,
            body: email.body,
            attachments: updatedAttachments,
            supplierName:
              preEmailParams[emailIndex]?.poSupplier?.supplier ||
              'Unknown Supplier'
          };
        }),
        POId: poResponseData.poId,
        shipTo: setupOtherProps.shipTo,
        requisitoner: setupOtherProps.requisitioner,
        shipVia: setupOtherProps.shipVia,
        fob: setupOtherProps.fob,
        shippingTerms: setupOtherProps.shippingTerms,
        selectedPOParts: quotePartRows.map(part => ({
          poPartId: part.poPartId || part.id,
          partNumber: part.partNumber,
          description: part.description,
          qty: part.qty,
          leadTime: part.leadTime,
          price: part.price
        })),
        pOTax: {
          taxRate: percentageValue || 0,
          isIncluded: true
        },
        airCargoToX: {
          airCargoToX: subTotalValues[1] || 0,
          isIncluded: checkedStates[1] || false
        },
        sealineToX: {
          sealineToX: subTotalValues[2] || 0,
          isIncluded: checkedStates[2] || false
        },
        truckCarriageToX: {
          truckCarriageToX: subTotalValues[3] || 0,
          isIncluded: checkedStates[3] || false
        }
      };

      const response = await sendQuoteEmail(payload);
      // console.log('Email send response:', response);

      if (response && response.statusCode === 200) {
        setFrom(response.data.from);
        setIsSendEmailSuccess(true);
      } else {
        setIsSendEmailSuccess(false);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setIsSendEmailSuccess(false);
    } finally {
      setEmailSendLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (poResponseData?.suppliers) {
      // Keep existing files that were manually added (don't contain supplier name)
      const existingManualFiles = base64Files.filter(
        file => !file.name.includes('-')
      );
      const newBase64Files: { name: string; base64: string }[] = [
        ...existingManualFiles
      ];

      // Store supplier-specific PDFs mapping
      const supplierPdfMap: {
        [supplierName: string]: { name: string; base64: string };
      } = {};

      for (const supplier of poResponseData.suppliers) {
        try {
          const base64String = await returnPdfAsBase64String(
            quoteWizardData.quoteWizardSetting,
            selectedDate,
            poResponseData.poNumberId,
            currency,
            quotePartRows.filter(
              part => part.poPartSuppliers?.supplier === supplier.supplier
            ),
            subTotalValues,
            checkedStates,
            setupOtherProps.clientLocation,
            setupOtherProps.shipTo,
            setupOtherProps.requisitioner,
            setupOtherProps.shipVia,
            setupOtherProps.fob,
            setupOtherProps.shippingTerms,
            setupOtherProps.contractNo,
            setupOtherProps.isInternational,
            setupOtherProps.validityDay,
            setupOtherProps.selectedBank,
            taxAmount,
            percentageValue,
            supplier
          );

          if (base64String) {
            const pdfFile = {
              name: `${poResponseData.poNumberId}-${supplier.supplier}.pdf`,
              base64: base64String
            };
            newBase64Files.push(pdfFile);
            supplierPdfMap[supplier.supplier] = pdfFile;
          }
        } catch (error) {
          console.error(
            `Error generating PDF for supplier ${supplier.supplier}:`,
            error
          );
        }
      }

      // Update state with both manual and generated PDFs
      setBase64Files(newBase64Files);

      // Update toEmails with supplier-specific attachments
      const updatedToEmails = toEmails.map((email, emailIndex) => {
        // Get the corresponding supplier for this email from preEmailParams
        const correspondingSupplier =
          preEmailParams[emailIndex]?.poSupplier?.supplier;

        if (!correspondingSupplier) {
          console.warn(`No supplier found for email index ${emailIndex}`);
          return {
            ...email,
            attachments: existingManualFiles.map(file => ({
              filename: file.name,
              data: file.base64
            }))
          };
        }

        // Create attachments array for this specific supplier
        const emailAttachments = [];

        // Add manual files (common to all suppliers)
        existingManualFiles.forEach(file => {
          emailAttachments.push({
            filename: file.name,
            data: file.base64
          });
        });

        // Add supplier-specific PDF
        if (supplierPdfMap[correspondingSupplier]) {
          emailAttachments.push({
            filename: `${poResponseData.poNumberId}.pdf`,
            data: supplierPdfMap[correspondingSupplier].base64
          });
        }

        return {
          ...email,
          attachments: emailAttachments
        };
      });

      setToEmails(updatedToEmails);
    }
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
                      poId={poResponseData.poId}
                      poNumberId={poResponseData.poNumberId}
                      base64Pdf={base64Pdf}
                      base64PdfFileName={base64PdfFileName}
                      isPdfConvertedToBase64={isPdfConvertedToBase64}
                      onFilesUpload={files => {
                        setBase64Files(files);
                        setIsPdfConvertedToBase64(false);
                      }}
                      base64Files={base64Files}
                      emailProps={emailProps}
                      settings={quoteWizardData.quoteWizardSetting}
                      quotePartRows={quotePartRows}
                      subTotalValues={subTotalValues}
                      selectedDate={selectedDate}
                      checkedStates={checkedStates}
                      setupOtherProps={{
                        clientLocation,
                        shipTo,
                        requisitioner,
                        shipVia,
                        fob,
                        shippingTerms,
                        contractNo,
                        isInternational,
                        validityDay,
                        selectedBank
                      }}
                      onSupplierSelectionChange={setAllSuppliersSelected}
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
                      from={from}
                      isSendEmailSuccess={isSendEmailSuccess}
                      handleSendQuoteEmail={handleSendQuoteEmail}
                      isEmailSendLoading={isEmailSendLoading}
                      supplierNames={preEmailParams.map(
                        param =>
                          param.poSupplier?.supplier || 'Unknown Supplier'
                      )}
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
              onNextStep={handleNextStep}
              allSuppliersSelected={allSuppliersSelected}
            />
          </Card.Footer>
        </Card>
      </WizardFormProvider>
    </MailProvider>
  );
};

export default POWizardTabs;
