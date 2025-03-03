import WizardSetupForm from '../formsQuote/WizardSetupForm';
import WizardSendMailForm from '../formsQuote/WizardSendMailForm';
import WizardFormFooter from '../wizardQuote/WizardFormFooter';
import WizardForm from '../wizardQuote/WizardForm';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import { Card, Tab } from 'react-bootstrap';
import classNames from 'classnames';
import { useState } from 'react';
import { MailProvider } from '../formsQuote/MailContext';
import ReviewMail from '../formsQuote/ReviewMail';
import { defaultMailTemplate } from '../formsQuote/defaultMailTemplate';
import { QuotePartRow, QuoteWizardData } from '../QuoteWizard';
import WizardPreviewForm from '../formsQuote/WizardPreviewForm';
import QuoteWizardNav from '../wizardQuote/QuoteWizardNav';
import { sendQuoteEmail } from 'smt-v1-app/services/QuoteService';

export interface QuotePartRequest {
  quotePartId: string;
  quotePartNumber: string;
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

const WizardTabs = ({
  quoteWizardData,
  currencies,
  selectedParts,
  selectedAlternativeParts,
  quoteComment
}: {
  quoteWizardData: QuoteWizardData;
  currencies: string[];
  selectedParts: string[];
  selectedAlternativeParts: string[];
  quoteComment: string;
}) => {
  const form = useWizardForm({
    totalStep: 4
  });

  const [subTotalValues, setSubTotalValues] = useState<number[]>([0, 0, 0, 0]);
  const [base64Pdf, setBase64Pdf] = useState<string>('');
  const [base64PdfFileName, setBase64PdfFileName] = useState<string>('');

  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState(quoteWizardData.currency);
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

  const [checkedStates, setCheckedStates] = useState([
    false,
    false,
    false,
    false
  ]);

  const [quotePartRows, setQuotePartRows] = useState<QuotePartRow[]>([]);

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
    const alreadySavedQuotePart: QuotePartRow[] = quotePartRows.filter(
      quotePartRow => !quotePartRow.alternativeTo.trim()
    );
    const quotePartRequests: QuotePartRequest[] = alreadySavedQuotePart.map(
      quotePart => {
        return {
          quotePartId: quotePart.id,
          quotePartNumber: quotePart.partNumber,
          quotePartName: quotePart.description,
          reqCnd: quotePart.reqCondition,
          fndCnd: quotePart.fndCondition,
          leadTime: quotePart.leadTime,
          qty: quotePart.quantity,
          unitPrice: quotePart.unitPrice
        };
      }
    );

    const alreadySavedAlternativeQuotePart: QuotePartRow[] =
      quotePartRows.filter(quotePartRow => quotePartRow.alternativeTo.trim());
    const quoteAlternativePartRequests: QuotePartRequest[] =
      alreadySavedAlternativeQuotePart.map(quotePart => {
        return {
          quotePartId: quotePart.id,
          quotePartNumber: quotePart.partNumber,
          quotePartName: quotePart.description,
          reqCnd: quotePart.reqCondition,
          fndCnd: quotePart.fndCondition,
          leadTime: quotePart.leadTime,
          qty: quotePart.quantity,
          unitPrice: quotePart.unitPrice
        };
      });

    //console.log(quotePartRequests);
    //console.log(quoteAlternativePartRequests);

    const payload = {
      to: toEmails,
      cc: ccEmails,
      subject: subject,
      attachments: attachments,
      body: content,
      quoteId: quoteWizardData.quoteId,
      selectedQuoteParts: quotePartRequests,
      selectedAlternativeQuoteParts: quoteAlternativePartRequests,
      clientLocation: clientLocation,
      shipTo: shipTo,
      requisitioner: requisitioner,
      shipVia: shipVia,
      CPT: CPT,
      shippingTerms: shippingTerms,
      quoteOtherValues: [
        {
          key: quoteWizardData.quoteWizardSetting.otherQuoteValues[0],
          value: checkedStates[0] ? subTotalValues[0] : 0
        },
        {
          key: quoteWizardData.quoteWizardSetting.otherQuoteValues[1],
          value: checkedStates[1] ? subTotalValues[1] : 0
        },
        {
          key: quoteWizardData.quoteWizardSetting.otherQuoteValues[2],
          value: checkedStates[2] ? subTotalValues[2] : 0
        },
        {
          key: quoteWizardData.quoteWizardSetting.otherQuoteValues[3],
          value: checkedStates[3] ? subTotalValues[3] : 0
        }
      ],
      comment: quoteComment
    };
    console.log(payload);

    const response = await sendQuoteEmail(payload);
    //console.log(response);
    if (response && response.statusCode === 200) {
      setFrom(response.data.from);
      setIsSendEmailSuccess(true);
    } else {
      //console.log(response);
    }

    setEmailSendLoading(false);
  };

  const [clientLocation, setClientLocation] = useState<string>('');
  const [shipTo, setShipTo] = useState<string>('');
  const [requisitioner, setRequisitioner] = useState<string>('');
  const [shipVia, setShipVia] = useState<string>('');
  const [CPT, setCPT] = useState<string>('');
  const [shippingTerms, setShippingTerms] = useState<string>('');

  const setupOtherProps = {
    clientLocation,
    setClientLocation,
    shipTo,
    setShipTo,
    requisitioner,
    setRequisitioner,
    shipVia,
    setShipVia,
    CPT,
    setCPT,
    shippingTerms,
    setShippingTerms
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
                    id="progress"
                    quotePartRows={quotePartRows}
                    setQuotePartRows={setQuotePartRows}
                    currencies={currencies}
                    quoteWizardData={quoteWizardData}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                    subTotalValues={subTotalValues}
                    setSubTotalValues={setSubTotalValues}
                    currency={currency}
                    setCurrency={setCurrency}
                    checkedStates={checkedStates}
                    setCheckedStates={setCheckedStates}
                    setupOtherProps={setupOtherProps}
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
                      quotePartRows={quotePartRows}
                      settings={quoteWizardData.quoteWizardSetting}
                      quoteNumber={quoteWizardData.quoteNumberId}
                      subTotalValues={subTotalValues}
                      currency={currency}
                      selectedDate={selectedDate}
                      checkedStates={checkedStates}
                      setupOtherProps={setupOtherProps}
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
                      quoteId={quoteWizardData.quoteId}
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
              className={classNames({ 'd-none': !form.getCanNextPage })}
              handleSendQuoteEmail={handleSendQuoteEmail}
              isEmailSendLoading={isEmailSendLoading}
              setEmailSendLoading={setEmailSendLoading}
            />
          </Card.Footer>
        </Card>
      </WizardFormProvider>
    </MailProvider>
  );
};

export default WizardTabs;
