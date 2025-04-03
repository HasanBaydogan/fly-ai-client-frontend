import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Tab } from 'react-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';

import PartTopSection from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/ListTopSection';
import PartListTable, {
  PartTableColumns
} from 'smt-v1-app/components/features/Parts/PartList/PartListTable';
import { ColumnDef } from '@tanstack/react-table';
import {
  searchByPartList,
  getByItemFields
} from 'smt-v1-app/services/PartServices';
import { PartData } from 'smt-v1-app/types/PartTypes';

import WizardNav from 'smt-v1-app/components/features/Parts/PartWizardNav';
import WizardForm from 'components/wizard/WizardForm';
import WizardFormProvider from 'providers/WizardFormProvider';
import PartWizardItemFiledsForm from 'smt-v1-app/components/features/Parts/PartsItemFields/PartWizardItemFiledsForm';
import PartWizardUserDefFieldsForm from 'smt-v1-app/components/features/Parts/UserDefFields/PartWizardUserDefFieldsForm';
import PartWizardNotesForm from 'smt-v1-app/components/features/Parts/PartsNotes/PartWizardNotesForm';
import PartWizardFilesForm from 'smt-v1-app/components/features/Parts/PartsFiles/PartWizardFilesForm';
import PartWizardAlternativesForm from 'smt-v1-app/components/features/Parts/PartAlternatives/PartWizardAlternativesForm';
import useWizardForm from 'hooks/useWizardForm';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const PartManagementContainer = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [lgShow, setLgShow] = useState(false);
  const [partData, setPartData] = useState<any>(null);
  const [loadingPartData, setLoadingPartData] = useState(false);
  const [data, setData] = useState<PartData[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(true);
  const [pageIndex, setPageIndex] = useState<number>(1);

  useEffect(() => {
    const fetchListData = async () => {
      setLoadingList(true);
      try {
        const response = await searchByPartList('', pageIndex, 10);
      } catch (error) {
        console.error('Error fetching list data:', error);
      } finally {
        setLoadingList(false);
      }
    };
    fetchListData();
  }, [pageIndex]);

  // Fetching Part Detail From Backend
  useEffect(() => {
    if (lgShow && selectedPartId) {
      setLoadingPartData(true);
      getByItemFields(selectedPartId)
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
  }, [lgShow, selectedPartId]);

  const table = useAdvanceTable({
    data: data,
    columns: PartTableColumns as ColumnDef<PartData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  const form = useWizardForm({ totalStep: 5 });
  const isEditMode = partData && partData.partId;

  if (loadingList) {
    return (
      <div>
        <LoadingAnimation></LoadingAnimation>
      </div>
    );
  }
  const handlePartSelect = (partId: string) => {
    setSelectedPartId(partId);
    setLgShow(true);
    // console.log('Seçilen partId:', partId);
  };

  return (
    <div>
      {/* Tablo Alanı */}
      <AdvanceTableProvider {...table}>
        <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
          <h2 className="mb-0">
            <span className="me-3">Part List</span>
          </h2>
          <Link className="btn btn-primary px-5" to="/part/new-part">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Part
          </Link>
        </div>
        <PartTopSection activeView="list" />
        <PartListTable activeView={''} onPartSelect={handlePartSelect} />
      </AdvanceTableProvider>

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
                      onPartCreated={data => {
                        setPartData(data);
                        setTimeout(() => {
                          setLgShow(false);
                        }, 2000);
                      }}
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
            <Card.Footer className="border-top-0"></Card.Footer>
          </Card>
        </WizardFormProvider>
      </Modal>
    </div>
  );
};

export default PartManagementContainer;
