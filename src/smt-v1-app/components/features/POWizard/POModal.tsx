import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import PIWizard from '../PIWizard/PIWizard';
import { postPi } from 'smt-v1-app/services/PIServices';
import { ColumnDef } from '@tanstack/react-table';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import ActionDropdownItems from 'components/common/ActionDropdownItems';
import useAdvanceTable from 'hooks/useAdvanceTable';
import { Link } from 'react-router-dom';
import { QuoteWizardData } from '../PIWizard/PIWizard';
import {
  getPreWizardCompanys,
  postSelectCompany
} from 'smt-v1-app/services/PoServices';

interface RFQModalProps {
  show: boolean;
  onHide: (shouldHide?: boolean, openOnSecondPage?: boolean) => void;
  rfqNumberId: string;
  quoteId: string;
  piId: string;
  openOnSecondPage?: boolean;
  onCreatePO?: (response: any) => void;
}

// Tablo veri tipi
type Data = {
  name: string;
  email: string;
  age: number;
};

// Tabloya eklenecek örnek veriler
const data: Data[] = [
  { name: 'Anna', email: 'anna@example.com', age: 18 },
  { name: 'Homer', email: 'homer@example.com', age: 35 },
  { name: 'Oscar', email: 'oscar@example.com', age: 52 },
  { name: 'Emily', email: 'emily@example.com', age: 30 },
  { name: 'Jara', email: 'jara@example.com', age: 25 },
  { name: 'Clark', email: 'clark@example.com', age: 39 }
];

// Tablo kolon tanımları
const columns: ColumnDef<Data>[] = [
  {
    accessorKey: 'name'
  },
  {
    accessorKey: 'email',
    cell: ({ row: { original } }) => (
      <Link to={`mailto:${original.email}`}>{original.email}</Link>
    )
  },
  {
    accessorKey: 'age'
  },
  {
    id: 'action',
    cell: () => (
      <RevealDropdownTrigger>
        <RevealDropdown>
          <ActionDropdownItems />
        </RevealDropdown>
      </RevealDropdownTrigger>
    ),
    meta: {
      headerProps: { style: { width: '7%' } },
      cellProps: { className: 'text-end' }
    }
  }
];

interface Company {
  companyName: string;
  id: string;
  selected?: boolean;
}

// Yardımcı: Tarihi dd.MM.yyyy formatına çeviren fonksiyon
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
};

const RFQModal: React.FC<RFQModalProps> = ({
  show,
  onHide,
  rfqNumberId,
  quoteId,
  piId,
  openOnSecondPage = false,
  onCreatePO
}) => {
  const [activeTab, setActiveTab] = useState<'message' | 'mail'>('message');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState<'first' | 'second'>('first');

  // Shared files state for both tabs
  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [showPIWizard, setShowPIWizard] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [piResponseData, setPiResponseData] = useState<QuoteWizardData | null>(
    null
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getPreWizardCompanys(piId);
        if (response?.success && response.data?.prePOCompanyResponses) {
          setCompanies(response.data.prePOCompanyResponses);

          // Eğer seçili bir şirket varsa, onu otomatik olarak seç
          const selectedCompany = response.data.prePOCompanyResponses.find(
            company => company.selected
          );
          if (selectedCompany) {
            setSelectedCompanyId(selectedCompany.id);
          }
        } else {
          setCompanies([]);
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      }
    };

    if (piId) {
      fetchCompanies();
    }
  }, [piId]);

  useEffect(() => {
    if (show) {
      setStep(openOnSecondPage ? 'second' : 'first');
    }
  }, [show, openOnSecondPage]);

  // File upload handler - shared between tabs
  const handleFilesUpload = (files: { name: string; base64: string }[]) => {
    setBase64Files(files);
  };

  // Tablo için hook
  const table = useAdvanceTable({
    data,
    columns,
    pageSize: 5,
    pagination: true,
    selection: true,
    sortable: true
  });

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    table.setGlobalFilter(e.target.value || undefined);
  };

  const handleNext = () => {
    setStep('second');
  };

  const handleBack = () => {
    setStep('first');
  };

  // Function to show the PIModal when called from PIWizard
  const handleOpenPIModal = () => {
    // We call onHide with false to tell the parent we want to show the modal again
    // Pass true as the second parameter to indicate opening on the second page
    onHide(false, true);
  };

  const handleClosePIWizard = () => {
    setShowPIWizard(false);
  };

  const handleCreatePO = async () => {
    try {
      if (!selectedCompanyId || !piId) {
        alert('Please select a company first');
        return;
      }

      const response = await postSelectCompany(piId, selectedCompanyId);
      if (response?.success) {
        onHide(true); // Close the modal

        // Response'u PO Wizard'a aktarıyoruz
        if (onCreatePO && typeof onCreatePO === 'function') {
          onCreatePO(response);
        }
      } else {
        alert('Failed to process company selection');
      }
    } catch (error) {
      console.error('Error while selecting company:', error);
      alert('An error occurred while processing your request');
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Select Company for PO Creation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Select
                value={selectedCompanyId}
                onChange={e => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Select Company</option>
                {Array.isArray(companies) &&
                  companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.companyName}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </div>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end">
          <>
            <Button
              variant="primary"
              style={{ backgroundColor: '#0000FF' }}
              onClick={handleCreatePO}
            >
              Create & Prepare PO Form
            </Button>
          </>
        </Modal.Footer>
      </Modal>
      {showPIWizard && piResponseData && (
        <PIWizard
          handleOpen={handleOpenPIModal}
          handleClose={handleClosePIWizard}
          showTabs={true}
          selectedParts={[]}
          selectedAlternativeParts={[]}
          quoteId={quoteId}
          quoteComment=""
          initialData={piResponseData}
        />
      )}
    </>
  );
};

export default RFQModal;
