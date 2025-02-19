import WizardAccountForm from 'smt-v1-app/components/features/Parts/PartWizardItemFiledsForm';
import WizardBillingForm from 'components/forms/WizardBillingForm';
import WizardPersonalForm from 'components/forms/WizardPersonalForm';
import WizardFormFooter from 'components/wizard/WizardFormFooter';
import WizardForm from 'components/wizard/WizardForm';
import WizardNav from 'smt-v1-app/components/features/Parts/PartWizardNav';
import WizardSuccessStep from 'components/wizard/WizardSuccessStep';
import useWizardForm from 'hooks/useWizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import { Button, Card, Modal, ModalProps, Tab } from 'react-bootstrap';
import { useState } from 'react';
import classNames from 'classnames';
import PartWizardItemFiledsForm from 'smt-v1-app/components/features/Parts/PartWizardItemFiledsForm';
import PartWizardUserDefFieldsForm from 'smt-v1-app/components/features/Parts/UserDefFields/PartWizardUserDefFieldsForm';
import PartWizardNotesForm from 'smt-v1-app/components/features/Parts/PartWizardNotesForm';

interface PartFormData {
  name: string;
  accept_terms: boolean;
  email: string;
  password: string;
  confirm_password: string;
  gender: string;
  phone: string;
  dob: string;
  address: string;
  card: number;
  country: string;
  zip: number;
  date_of_expire: string;
  cvv: number;
}

const PartContainer = () => {
  const form = useWizardForm<PartFormData>({
    totalStep: 4
  });
  const values: ModalProps['fullscreen'][] = [true, 'xl-down'];
  const [lgShow, setLgShow] = useState(false);

  return (
    <div>
      <Button onClick={() => setLgShow(true)}>Parts Modal</Button>
      <Modal
        size="xl"
        className="Parts-NewPart-Modal"
        show={lgShow}
        onHide={() => setLgShow(false)}
      >
        <WizardFormProvider {...form}>
          <Card className="theme-wi">
            <Card.Header className="bg-body-highlight pt-3 pb-2 border-bottom-0">
              <WizardNav />
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey={1}>
                  <WizardForm step={1}>
                    <PartWizardItemFiledsForm id="progress" />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={2}>
                  <WizardForm step={2}>
                    <PartWizardUserDefFieldsForm />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={3}>
                  <WizardForm step={3}>
                    <PartWizardNotesForm />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={4}>
                  <WizardForm step={4}>
                    <WizardSuccessStep />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={5}>
                  <WizardForm step={5}>
                    <WizardSuccessStep />
                  </WizardForm>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>

            <Card.Footer className="border-top-0">
              {/* <WizardFormFooter
                className={classNames({ 'd-none': !form.getCanNextPage })}
              /> */}
            </Card.Footer>
          </Card>
        </WizardFormProvider>
      </Modal>
    </div>
  );
};

export default PartContainer;
