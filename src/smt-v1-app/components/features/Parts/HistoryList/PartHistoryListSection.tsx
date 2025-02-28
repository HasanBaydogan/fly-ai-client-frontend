import { useState, useEffect, useRef } from 'react';
import { Col, Form } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './HistoryAdvanceTable';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';

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

interface PartHistoryListSectionProps {
  onContactsChange: (historyItems: FormattedHistoryItem[]) => void;
  initialContacts?: FormattedHistoryItem[];
}

const PartHistoryListSection = ({
  onContactsChange,
  initialContacts
}: PartHistoryListSectionProps) => {
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

  const prevInitialContactsRef = useRef<FormattedHistoryItem[] | undefined>();

  useEffect(() => {
    if (
      initialContacts &&
      JSON.stringify(initialContacts) !==
        JSON.stringify(prevInitialContactsRef.current)
    ) {
      setHistoryItems(initialContacts);
      prevInitialContactsRef.current = initialContacts;
    }
  }, [initialContacts]);

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

  const columns: ColumnDef<PartHistoryItem>[] = [
    { accessorKey: 'entryDate', header: 'Entry Date' },
    { accessorKey: 'suppCompany', header: 'Company' },
    { accessorKey: 'fndQty', header: 'Qty' },
    { accessorKey: 'fndPartCondition', header: 'Condition' },
    { accessorKey: 'unitCost', header: 'Unit Cost' },
    {
      accessorKey: 'historyOrderStatus',
      header: 'Order Status',
      cell: info => {
        const status = info.getValue() as string;
        let badgeClass = '';
        let displayText = status;
        if (status === 'ORDER') {
          badgeClass = 'badge bg-success';
        } else if (status === 'FOLLOW_UP') {
          badgeClass = 'badge bg-warning';
          displayText = 'FOLLOW UP';
        }
        return <span className={badgeClass}>{displayText}</span>;
      }
    },

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
      </Col>
    </Form>
  );
};

export default PartHistoryListSection;
