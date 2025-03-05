import React, { useEffect, useState } from 'react';
import { Button, Card, Modal, Tab } from 'react-bootstrap';
import WizardNav from 'smt-v1-app/components/features/Parts/PartWizardNav';
import WizardForm from 'components/wizard/WizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import PartWizardItemFiledsForm from 'smt-v1-app/components/features/Parts/PartsItemFields/PartWizardItemFiledsForm';
import PartWizardUserDefFieldsForm from 'smt-v1-app/components/features/Parts/UserDefFields/PartWizardUserDefFieldsForm';
import PartWizardNotesForm from 'smt-v1-app/components/features/Parts/PartsNotes/PartWizardNotesForm';
import PartWizardFilesForm from 'smt-v1-app/components/features/Parts/PartsFiles/PartWizardFilesForm';
import PartWizardAlternativesForm from 'smt-v1-app/components/features/Parts/PartAlternatives/PartWizardAlternativesForm';
import useWizardForm from 'hooks/useWizardForm';
import { getByItemFields } from 'smt-v1-app/services/PartServices';

const PartContainer = () => {
  const form = useWizardForm({ totalStep: 5 });
  const [lgShow, setLgShow] = useState(false);
  const [partData, setPartData] = useState<any>(null);
  const [loadingPartData, setLoadingPartData] = useState(false);

  useEffect(() => {
    if (lgShow) {
      setLoadingPartData(true);
      getByItemFields('7000-00')
        .then(response => {
          if (response.success && response.data && response.data.partId) {
            setPartData(response.data);
          } else {
            setPartData(null);
          }
        })
        .catch(err => {
          console.error('Error fetching part data:', err);
          setPartData(null);
        })
        .finally(() => setLoadingPartData(false));
    } else {
      setPartData(null);
    }
  }, [lgShow]);

  const isEditMode = partData && partData.partId;

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
              <WizardNav disableOtherSteps={!isEditMode} />
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey={1}>
                  <WizardForm step={1}>
                    <PartWizardItemFiledsForm
                      partData={partData}
                      onPartCreated={data => setPartData(data)}
                    />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={2}>
                  <WizardForm step={2}>
                    <PartWizardUserDefFieldsForm />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={3}>
                  <WizardForm step={3}>
                    <PartWizardNotesForm partId={partData?.partId} />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={4}>
                  <WizardForm step={4}>
                    <PartWizardFilesForm partId={partData?.partId} />
                  </WizardForm>
                </Tab.Pane>
                <Tab.Pane eventKey={5}>
                  <WizardForm step={5}>
                    <PartWizardAlternativesForm partId={partData?.partId} />
                  </WizardForm>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
            <Card.Footer className="border-top-0">
              {/* Footer düzenlemeleri */}
            </Card.Footer>
          </Card>
        </WizardFormProvider>
      </Modal>
    </div>
  );
};

export default PartContainer;
