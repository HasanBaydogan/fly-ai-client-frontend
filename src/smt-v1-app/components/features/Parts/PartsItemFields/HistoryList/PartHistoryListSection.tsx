import { useState, useEffect, useRef } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
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
  initialContacts = []
}: PartHistoryListSectionProps) => {
  // Artık yerel state yerine doğrudan initialContacts değerini kullanıyoruz
  const historyItems = initialContacts;

  // Eğer ebeveynin güncel veriye ihtiyacı varsa, sadece bir kez bildirebilirsiniz:
  // useEffect(() => {
  //   onContactsChange(historyItems);
  // }, [historyItems, onContactsChange]);

  const columns: ColumnDef<PartHistoryItem>[] = [
    { accessorKey: 'entryDate', header: 'Entry Date' },
    { accessorKey: 'suppCompany', header: 'Company' },
    { accessorKey: 'fndQty', header: 'Qty' },
    { accessorKey: 'fndPartCondition', header: 'Condition' },
    {
      accessorKey: 'unitCost',
      header: 'Unit Cost',
      cell: info => {
        const cost = info.getValue() as number;
        const formattedCost =
          '$' +
          cost.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        return <span>{formattedCost}</span>;
      }
    },
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

  // Pagination entegrasyonu: pagination true olarak ayarlanıp, sayfa başına 10 kayıt gösteriliyor.
  const table = useAdvanceTable({
    data: historyItems,
    columns,
    selection: false,
    sortable: true,
    pagination: true,
    pageSize: 10
  });

  return (
    <div className="p-5 mb-5">
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

        {/* Basit Pagination Kontrolleri */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </Col>
    </div>
  );
};

export default PartHistoryListSection;
