// PartWizardModal.tsx
import React from 'react';
import { Modal, Card, Tab } from 'react-bootstrap';
import WizardFormProvider from 'providers/WizardFormProvider';
import WizardForm from 'components/wizard/WizardForm';
import WizardNav from 'smt-v1-app/components/features/Parts/PartWizardNav';
import PartWizardItemFiledsForm from 'smt-v1-app/components/features/Parts/PartsItemFields/NewPartsItemFields/PartWizardItemFiledsForm';
import PartWizardUserDefFieldsForm from 'smt-v1-app/components/features/Parts/UserDefFields/PartWizardUserDefFieldsForm';
import PartWizardNotesForm from 'smt-v1-app/components/features/Parts/PartsNotes/PartWizardNotesForm';
import PartWizardFilesForm from 'smt-v1-app/components/features/Parts/PartsFiles/PartWizardFilesForm';
import PartWizardAlternativesForm from 'smt-v1-app/components/features/Parts/PartAlternatives/PartWizardAlternativesForm';

interface PartWizardModalProps {
  show: boolean;
  onHide: () => void;
  form: any; // Wizard form instance
  selectedPart: any; // RFQPart | null
}

const PartWizardModal: React.FC<PartWizardModalProps> = ({
  show,
  onHide,
  form,
  selectedPart
}) => {
  const handlePartCreated = (data: any) => {
    // Close the modal after 1500ms when part is successfully created/updated
    setTimeout(() => {
      onHide();
    }, 1500);
  };

  return (
    <Modal
      size="xl"
      className="Parts-NewPart-Modal"
      show={show}
      onHide={onHide}
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
                  <PartWizardItemFiledsForm
                    partData={selectedPart}
                    onPartCreated={handlePartCreated}
                  />
                </WizardForm>
              </Tab.Pane>
              {/* <Tab.Pane eventKey={2}>
                <WizardForm step={2}>
                  <PartWizardUserDefFieldsForm />
                </WizardForm>
              </Tab.Pane> */}
              <Tab.Pane eventKey={3}>
                <WizardForm step={3}>
                  <PartWizardNotesForm partId={selectedPart?.partId} />
                </WizardForm>
              </Tab.Pane>
              <Tab.Pane eventKey={4}>
                <WizardForm step={4}>
                  <PartWizardFilesForm partId={selectedPart?.partId} />
                </WizardForm>
              </Tab.Pane>
              <Tab.Pane eventKey={5}>
                <WizardForm step={5}>
                  <PartWizardAlternativesForm partId={selectedPart?.partId} />
                </WizardForm>
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
          <Card.Footer className="border-top-0"></Card.Footer>
        </Card>
      </WizardFormProvider>
    </Modal>
  );
};

export default PartWizardModal;
