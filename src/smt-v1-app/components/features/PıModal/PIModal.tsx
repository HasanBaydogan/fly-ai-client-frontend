import React, { useState, ChangeEvent } from 'react';
import { Modal, Button, Tab, Nav, Form } from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import FileUpload from 'smt-v1-app/components/features/Client/NewClient/NewClientAttachment/FileUpload';
import PIWizard from './PIWizard/PIWizard';

// Tabloyla ilgili importlar
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

interface RFQModalProps {
  show: boolean;
  onHide: () => void;
  rfqNumberId: string;
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

const RFQModal: React.FC<RFQModalProps> = ({ show, onHide, rfqNumberId }) => {
  const [activeTab, setActiveTab] = useState<'message' | 'mail'>('message');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [step, setStep] = useState<'first' | 'second'>('first');
  const [showPIWizard, setShowPIWizard] = useState(false);
  const [base64Files, setBase64Files] = useState<
    { name: string; base64: string }[]
  >([]);

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

  // Arama kutusu değişimini yönetmek için
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    table.setGlobalFilter(e.target.value || undefined);
  };

  const handleNext = () => {
    setStep('second');
  };

  const handleBack = () => {
    setStep('first');
  };

  const handlePreparePI = () => {
    setShowPIWizard(true);
    onHide();
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
                          // Tek tarih seçimi yaptığınızı varsayarsak:
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
                  {/* Burada tabloyu ekliyoruz */}
                  <div className="mb-3 text-center">
                    <label className="d-block fw-bold mb-2">Mail Date:</label>
                    <div style={{ margin: '0 auto', width: '25%' }}>
                      <DatePicker
                        placeholder="Select a date"
                        value={selectedDate}
                        onChange={selectedDates => {
                          // Tek tarih seçimi yaptığınızı varsayarsak:
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
                <Form.Select>
                  <option>Select Company</option>
                  <option value="1">Company 1</option>
                  <option value="2">Company 2</option>
                  <option value="3">Company 3</option>
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          {step === 'first' ? (
            <>
              <Button variant="secondary" onClick={onHide}>
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
                Prepare PI Form
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      {showPIWizard && (
        <PIWizard
          onClose={handleClosePIWizard}
          quoteWizardData={{
            currency: 'USD',
            quoteId: '',
            quoteNumberId: '',
            rfqNumberId: '',
            quoteWizardPartResponses: [],
            quoteWizardSetting: {
              addressRow1: '',
              addressRow2: '',
              commentsSpecialInstruction: '',
              contactInfo: '',
              logo: '',
              mobilePhone: '',
              otherQuoteValues: [],
              phone: ''
            },
            revisionNumber: 0
          }}
          currencies={['USD', 'EUR']}
        />
      )}
    </>
  );
};

export default RFQModal;
