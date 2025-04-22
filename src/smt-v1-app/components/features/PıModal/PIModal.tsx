import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal, Button, Tab, Nav, Form } from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import FileUpload from 'smt-v1-app/components/features/Client/NewClient/NewClientAttachment/FileUpload';
import PIWizard from '../PIWizard/PIWizard';
import { postPi, getAllCompany } from 'smt-v1-app/services/PIServices';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'components/base/AdvanceTable';
import AdvanceTableFooter from 'components/base/AdvanceTableFooter';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import ActionDropdownItems from 'components/common/ActionDropdownItems';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import SearchBox from 'components/common/SearchBox';
import { partRow, QuoteWizardData } from '../PIWizard/PIWizard';

interface RFQModalProps {
  show: boolean;
  onHide: (shouldHide?: boolean, openOnSecondPage?: boolean) => void;
  rfqNumberId: string;
  quoteId: string;
  openOnSecondPage?: boolean;
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
  companyId: string;
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
  openOnSecondPage = false
}) => {
  const [activeTab, setActiveTab] = useState<'message' | 'mail'>('message');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState<'first' | 'second'>('first');
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
        const response = await getAllCompany();
        if (response.success) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (show) {
      setStep(openOnSecondPage ? 'second' : 'first');
    }
  }, [show, openOnSecondPage]);

  // FileUpload'dan gelecek base64 dosyalarını burada tutabilirsiniz
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

  const handlePreparePI = async () => {
    try {
      const formattedDate = selectedDate ? formatDate(selectedDate) : '';
      const requestData = {
        receivedDate: formattedDate,
        attachments: base64Files.map(file => ({ data: file.base64 })),
        receivedPOMethod: (activeTab === 'message' ? 'MESSAGE' : 'MAIL') as
          | 'MESSAGE'
          | 'MAIL',
        selectedCompanyId,
        quoteId
      };

      const response = await postPi(requestData);
      if (response.success) {
        setPiResponseData(response.data);
        setShowPIWizard(true);
        onHide(true); // Close the PIModal without second page parameter
      }
    } catch (error) {
      console.error('Error submitting PI:', error);
    }
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

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === 'first'
              ? 'The way of PO received'
              : 'Select Invoice Company'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {step === 'first' ? (
            <Tab.Container
              activeKey={activeTab}
              onSelect={k => setActiveTab(k as 'message' | 'mail')}
            >
              {/* Sekme Başlıkları */}
              <Nav
                variant="tabs"
                className="mb-3 justify-content-center border-bottom"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="message"
                    className={`px-4 border-0 ${
                      activeTab === 'message'
                        ? 'text-primary border-bottom border-2 border-primary'
                        : 'text-body-tertiary'
                    }`}
                  >
                    <i className="fas fa-comment me-2"></i>
                    Requested By Message
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="mail"
                    className={`px-4 border-0 ${
                      activeTab === 'mail'
                        ? 'text-primary border-bottom border-2 border-primary'
                        : 'text-body-tertiary'
                    }`}
                  >
                    <i className="fas fa-envelope me-2"></i>
                    Requested By Mail
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/* 1. Sekme: Requested By Message */}
                <Tab.Pane eventKey="message">
                  <div className="mb-3 text-center">
                    <label className="d-block fw-bold mb-2">
                      Message Date:
                    </label>
                    <div style={{ margin: '0 auto', width: '25%' }}>
                      <DatePicker
                        placeholder="Select a date"
                        value={selectedDate}
                        onChange={selectedDates => {
                          setSelectedDate(selectedDates[0]);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <FileUpload onFilesUpload={handleFilesUpload} />
                  </div>
                </Tab.Pane>

                {/* 2. Sekme: Requested By Mail */}
                <Tab.Pane eventKey="mail">
                  <div className="mb-3 text-center">
                    <label className="d-block fw-bold mb-2">Mail Date:</label>
                    <div style={{ margin: '0 auto', width: '25%' }}>
                      <DatePicker
                        placeholder="Select a date"
                        value={selectedDate}
                        onChange={selectedDates => {
                          setSelectedDate(selectedDates[0]);
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <FileUpload onFilesUpload={handleFilesUpload} />
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          ) : (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Company</Form.Label>
                <Form.Select
                  value={selectedCompanyId}
                  onChange={e => setSelectedCompanyId(e.target.value)}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          {step === 'first' ? (
            <>
              <Button variant="secondary" onClick={() => onHide(true)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleBack}>
                Previous
              </Button>
              <Button
                variant="primary"
                style={{ backgroundColor: '#0000FF' }}
                onClick={handlePreparePI}
              >
                Create & Prepare PI Form
              </Button>
            </>
          )}
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
