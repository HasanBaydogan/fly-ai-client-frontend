import { useState, useEffect, useRef } from 'react';
import { Col, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './HistoryAdvanceTable';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import HistoryFormModal from './HistoryFormModal';

// PartHistoryItem arayüzü: partHistoryItems verilerini temsil eder
export interface PartHistoryItem {
  id: string;
  entryDate: string;
  suppCompany: string;
  fndQty: number;
  fndPartCondition: string;
  unitCost: number;
  historyOrderStatus: string;
  partNumber: string;
  partDesc: string;
}

// Parent’a gönderilecek format (aynı yapı kullanılabilir)
export interface FormattedHistoryItem {
  id: string;
  entryDate: string;
  suppCompany: string;
  fndQty: number;
  fndPartCondition: string;
  unitCost: number;
  historyOrderStatus: string;
  partNumber: string;
  partDesc: string;
}

// → Props tanımı: initialContacts artık partHistoryItems verisini temsil eder
interface PartHistoryListSectionProps {
  onContactsChange: (historyItems: FormattedHistoryItem[]) => void;
  initialContacts?: FormattedHistoryItem[];
}

const PartHistoryListSection = ({
  onContactsChange,
  initialContacts
}: PartHistoryListSectionProps) => {
  // İlk başta initialContacts ile state başlatılıyor.
  const [historyItems, setHistoryItems] = useState<PartHistoryItem[]>(() => {
    if (initialContacts && initialContacts.length > 0) {
      return initialContacts.map(item => ({
        id: item.id,
        entryDate: item.entryDate,
        suppCompany: item.suppCompany,
        fndQty: item.fndQty,
        fndPartCondition: item.fndPartCondition,
        unitCost: item.unitCost,
        historyOrderStatus: item.historyOrderStatus,
        partNumber: item.partNumber,
        partDesc: item.partDesc
      }));
    }
    return [];
  });

  // Bir ref kullanarak önceki initialContacts değerini saklıyoruz.
  const prevInitialContactsRef = useRef<FormattedHistoryItem[] | undefined>();

  useEffect(() => {
    // Eğer initialContacts tanımlıysa ve önceki değerden farklıysa state güncellemesi yapıyoruz.
    if (
      initialContacts &&
      JSON.stringify(initialContacts) !==
        JSON.stringify(prevInitialContactsRef.current)
    ) {
      setHistoryItems(initialContacts);
      prevInitialContactsRef.current = initialContacts;
    }
  }, [initialContacts]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PartHistoryItem | undefined>(
    undefined
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PartHistoryItem | null>(
    null
  );

  // Parent bileşene güncellenmiş veriyi gönderiyoruz
  useEffect(() => {
    const formatted = historyItems.map(item => ({
      id: item.id,
      entryDate: item.entryDate,
      suppCompany: item.suppCompany,
      fndQty: item.fndQty,
      fndPartCondition: item.fndPartCondition,
      unitCost: item.unitCost,
      historyOrderStatus: item.historyOrderStatus,
      partNumber: item.partNumber,
      partDesc: item.partDesc
    }));
    onContactsChange(formatted);
  }, [historyItems, onContactsChange]);

  // Tablo kolonları: partHistoryItems verilerinin alanlarına göre
  const columns: ColumnDef<PartHistoryItem>[] = [
    { accessorKey: 'entryDate', header: 'Entry Date' },
    { accessorKey: 'suppCompany', header: 'Company' },
    { accessorKey: 'fndQty', header: 'Qty' },
    { accessorKey: 'fndPartCondition', header: 'Condition' },
    { accessorKey: 'unitCost', header: 'Unit Cost' },
    { accessorKey: 'historyOrderStatus', header: 'Order Status' },
    { accessorKey: 'partNumber', header: 'PN' },
    { accessorKey: 'partDesc', header: 'PN Description' }
  ];

  const table = useAdvanceTable({
    data: historyItems,
    columns,
    selection: false,
    sortable: true
  });

  return (
    <Form className="p-5 mb-5">
      <Col md={12}>
        <div className="d-flex justify-content-between">
          <Form.Group className="mt-2">
            <Form.Label className="fw-bold fs-7">History</Form.Label>
          </Form.Group>
          {/* İsteğe bağlı: Yeni history item ekleme butonu */}
          {/* <Button variant="primary" onClick={() => setShowModal(true)}>
            New History Item
          </Button> */}
        </div>

        <AdvanceTableProvider {...table}>
          <AdvanceTable
            tableProps={{
              size: 'sm',
              className: 'phoenix-table fs-9 mb-0 border-top border-translucent'
            }}
            rowClassName="hover-actions-trigger btn-reveal-trigger position-static"
          />
        </AdvanceTableProvider>

        <HistoryFormModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setEditingItem(undefined);
          }}
        />
      </Col>
    </Form>
  );
};

export default PartHistoryListSection;
