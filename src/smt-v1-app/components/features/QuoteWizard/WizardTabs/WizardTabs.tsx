import WizardSetupForm from '../formsQuote/WizardSetupForm';
import WizardSendMailForm from '../formsQuote/WizardSendMailForm';
import WizardFormFooter from '../wizardQuote/WizardFormFooter';
import WizardForm from '../wizardQuote/WizardForm';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider, {
  useWizardFormContext
} from 'providers/WizardFormProvider';
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

interface WizardSetupFormProps {
  id: string;
  settings: {
    adress: { row1: string; row2: string; row3: string };
    quotaNumber: string;
    ClientLocation: string;
    ShipTo: string;
    Requisitioner: string;
    ShipVia: string;
    CPT: string;
    ShippingTerms: string;
    CoSI: string;
    ST1: string;
    ST2: string;
    ST3: string;
    ST4: string;
    CoSI2: string;
    CoSI3: { CoSIRow1: string; CoSIRow2: string };
    currency: string;
  };
}

const WizardTabs = ({
  quoteWizardData,
  currencies
}: {
  quoteWizardData: QuoteWizardData;
  currencies: string[];
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

  const handleSendQuoteEmail = async () => {
    const attachments: {
      filename: string;
      data: string;
    }[] = base64Files.map(attach => {
      return { filename: attach.name, data: attach.base64 };
    });
    const payload = {
      to: toEmails,
      cc: ccEmails,
      subject: subject,
      attachments: attachments,
      body: content
    };
    console.log(payload);

    const response = await sendQuoteEmail(payload);
    console.log(response);
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
                  {<ReviewMail emailProps={emailProps} />}
                </WizardForm>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
          <Card.Footer className="border-top-0">
            <WizardFormFooter
              className={classNames({ 'd-none': !form.getCanNextPage })}
              handleSendQuoteEmail={handleSendQuoteEmail}
            />
          </Card.Footer>
        </Card>
      </WizardFormProvider>
    </MailProvider>
  );
};

export default WizardTabs;
