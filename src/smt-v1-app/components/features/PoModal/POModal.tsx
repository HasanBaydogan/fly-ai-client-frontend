import React, { useState, ChangeEvent } from 'react';
import { Modal, Button, Tab, Nav } from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import FileUpload from 'smt-v1-app/components/features/Client/NewClient/NewClientAttachment/FileUpload';

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

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>The way of PO received</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tab.Container
          activeKey={activeTab}
          onSelect={k => setActiveTab(k as 'message' | 'mail')}
        >
          {/* Sekme Başlıkları */}
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="message">Requested By Message</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mail">Requested By Mail</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* 1. Sekme: Requested By Message */}
            <Tab.Pane eventKey="message">
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

            {/* 2. Sekme: Requested By Mail */}
            <Tab.Pane eventKey="mail">
              {/* Burada tabloyu ekliyoruz */}
              <AdvanceTableProvider {...table}>
                <SearchBox
                  placeholder="Search..."
                  size="sm"
                  onChange={handleSearchInputChange}
                  className="mx-auto mb-4"
                />
                <AdvanceTable
                  tableProps={{
                    size: 'sm',
                    className:
                      'phoenix-table fs-9 mb-0 border-top border-translucent'
                  }}
                  rowClassName="hover-actions-trigger btn-reveal-trigger position-static"
                />
                <AdvanceTableFooter navBtn />
              </AdvanceTableProvider>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary">Prepare PI Form</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RFQModal;
