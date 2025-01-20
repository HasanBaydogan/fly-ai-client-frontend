import WizardSetupForm from '../formsQuote/WizardSetupForm';
import WizardSendMailForm from '../formsQuote/WizardSendMailForm';
import WizardFormFooter from '../wizardQuote/WizardFormFooter';
import WizardForm from '../wizardQuote/WizardForm';
import WizardNav from '../wizardQuote/WizardNav';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import { Card, Tab } from 'react-bootstrap';
import classNames from 'classnames';
import WizardPersonalForm from '../formsQuote/WizardPreviewForm';
import { useState } from 'react';
import { MailProvider } from '../formsQuote/MailContext';
import ReviewMail from '../formsQuote/ReviewMail';

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

interface WizardFormData {
  name: string;
  accept_terms: boolean;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  dob: string;
  address: string;
  country: string;
  zip: number;
  date_of_expire: string;
  cvv: number;
}
interface TableRow {
  partNumber: string;
  alternativeTo: string;
  description: string;
  leadTime: string;
  qty: number;
  unitPrice: number;
  isNew?: boolean;
}
const WizardTabs: React.FC = () => {
  const form = useWizardForm<WizardFormData>({
    totalStep: 4
  });

  const [subTotalValues, setSubTotalValues] = useState<number[]>([0, 0, 0, 0]);

  // Fake Data
  const [data, setData] = useState<TableRow[]>([
    {
      partNumber: '4122-006009',
      alternativeTo: '',
      description: 'PUMP-PROPELLER FEATHERING',
      leadTime: '18',
      qty: 1,
      unitPrice: 4634.71
    },
    {
      partNumber: '4122-006009',
      alternativeTo: '',
      description: 'SENSOR (CONDITION REQ. = NE FOUND = TST)',
      leadTime: '18',
      qty: 1,
      unitPrice: 4634.71
    },
    {
      partNumber: '3116499-04',
      alternativeTo: '4122-006009',
      description: 'SENSOR',
      leadTime: '18',
      qty: 3,
      unitPrice: 2795.0
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currency, setCurrency] = useState('USD');

  const settings = {
    adress: {
      row1: 'Bahcelievler Mah. 274/1. Sokak No:1 Ofis:16 06830 Golbasi / Ankara TURKEY',
      row2: 'Phone: 0090 (312) 809 66 90',
      row3: 'Mobile: 0090 (507) 900 90 77'
    },
    quotaNumber: '2753498',
    RevisionNumber: '17',
    ClientLocation: 'Destination',
    ShipTo: '',
    Requisitioner: '',
    ShipVia: '',
    CPT: '',
    ShippingTerms: 'EXW IST',
    CoSI: "All parts are FACTORY NEW (FN), unless indicated. Our Manufacturer's Certificate of Conformance is included with our Packing List / Invoice. Valid for 10 Days TBD (To Be Determined): The costs indicated as TBD will be calculated when the quantities and items of quote is approved by the customer. LT (Lead Time): Lead times start on the day the invoice of this quote is paid.",
    ST1: 'Customs in Turkey',
    ST2: 'Aircargo to TURKEY',
    ST3: 'Aircargo to Destination',
    ST4: 'Aircargo to Destination',
    CoSI2:
      'Delivery: Destination Custom and related TAX and costs shall be paid by Client',
    CoSI3: {
      CoSIRow1: 'If you have any questions about this quote, please contact:',
      CoSIRow2:
        'info@rekaglobal.com | Tel: +90 312 809 66 90 | Mobile: +90 507 900 90 77'
    },
    reqQTY: 1,
    currency: currency
  };

  return (
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
                  settings={settings}
                  data={data}
                  setData={setData}
                  setSelectedDate={setSelectedDate}
                  subTotalValues={subTotalValues}
                  setSubTotalValues={setSubTotalValues}
                  setCurrency={setCurrency}
                />
              </WizardForm>
            </Tab.Pane>
            <Tab.Pane eventKey={2}>
              <WizardForm step={2}>
                <WizardPersonalForm
                  settings={settings}
                  data={data}
                  selectedDate={selectedDate}
                  subTotalValues={subTotalValues}
                />
              </WizardForm>
            </Tab.Pane>

            <Tab.Pane eventKey={3}>
              <WizardForm step={3}>
                <WizardSendMailForm />
              </WizardForm>
            </Tab.Pane>
            <Tab.Pane eventKey={4}>
              <WizardForm step={4}>
                <ReviewMail />
              </WizardForm>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
        <Card.Footer className="border-top-0">
          <WizardFormFooter
            className={classNames({ 'd-none': !form.getCanNextPage })}
          />
        </Card.Footer>
      </Card>
    </WizardFormProvider>
  );
};

export default WizardTabs;
