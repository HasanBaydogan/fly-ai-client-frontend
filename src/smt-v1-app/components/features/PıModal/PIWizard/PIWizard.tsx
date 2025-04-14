import WizardSetupForm from './Tabs/WizardAccountForm';
import WizardBillingForm from 'components/forms/WizardBillingForm';
import WizardPersonalForm from 'components/forms/WizardPersonalForm';
import WizardFormFooter from 'components/wizard/WizardFormFooter';
import WizardForm from 'components/wizard/WizardForm';
import WizardNav from 'components/wizard/WizardNav';
import WizardSuccessStep from 'components/wizard/WizardSuccessStep';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import { Card, Tab, Modal } from 'react-bootstrap';
import classNames from 'classnames';
import { useState } from 'react';

interface PIFormData {
  companyName: string;
  address: string;
  contractNo: string;
  isInternational: boolean;
  items: Array<{
    partNumber: string;
    description: string;
    quantity: number;
    ld: string;
    unitPrice: number;
    total: number;
  }>;
}
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

interface PIWizardProps {
  onClose: () => void;
}

const ProgressTabExample = ({
  onClose,
  currencies,
  quoteWizardData
}: {
  quoteWizardData: QuoteWizardData;
  currencies: string[];
  onClose: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [subTotalValues, setSubTotalValues] = useState<number[]>([0, 0, 0, 0]);
  const [quotePartRows, setQuotePartRows] = useState<QuotePartRow[]>([]);
  const [currency, setCurrency] = useState(quoteWizardData.currency);
  const [checkedStates, setCheckedStates] = useState([
    false,
    false,
    false,
    false
  ]);

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
  const form = useWizardForm<PIFormData>({
    totalStep: 4
  });
  return (
    <Modal show={true} onHide={onClose} centered size="xl">
      <WizardFormProvider {...form}>
        <Card className="theme-wizard">
          <Card.Header className="bg-body-highlight pt-3 pb-2 border-bottom-0">
            <WizardNav />
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
              {/* <Tab.Pane eventKey={2}>
                <WizardForm step={2}>
                  <WizardPersonalForm />
                </WizardForm>
              </Tab.Pane>
              <Tab.Pane eventKey={3}>
                <WizardForm step={3}>
                  <WizardBillingForm />
                </WizardForm>
              </Tab.Pane>
              <Tab.Pane eventKey={4}>
                <WizardSuccessStep />
              </Tab.Pane> */}
            </Tab.Content>
          </Card.Body>
          <Card.Footer className="border-top-0">
            <WizardFormFooter
              className={classNames({ 'd-none': !form.getCanNextPage })}
            />
          </Card.Footer>
        </Card>
      </WizardFormProvider>
    </Modal>
  );
};

export default ProgressTabExample;
