import WizardAccountForm from '../formsQuote/WizardSetupForm';
import WizardBillingForm from '../formsQuote/WizardSendMailForm';
import WizardFormFooter from '../wizardQuote/WizardFormFooter';
import WizardForm from '../wizardQuote/WizardForm';
import WizardNav from '../wizardQuote/WizardNav';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import { Card, Tab } from 'react-bootstrap';
import classNames from 'classnames';
import WizardPersonalForm from '../formsQuote/WizardPreviewForm';

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

const WizardTabs: React.FC = () => {
  const form = useWizardForm<WizardFormData>({
    totalStep: 4
  });

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
                <WizardAccountForm id="progress" />
              </WizardForm>
            </Tab.Pane>
            <Tab.Pane eventKey={2}>
              <WizardForm step={2}>
                <WizardPersonalForm />
              </WizardForm>
            </Tab.Pane>
            <Tab.Pane eventKey={3}>
              <WizardForm step={3}>
                <WizardBillingForm />
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
