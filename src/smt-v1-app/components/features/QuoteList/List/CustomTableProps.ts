import { TableProps as BootstrapTableProps } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { QuoteData } from 'smt-v1-app/services/QuoteService';

export interface CustomTableProps extends BootstrapTableProps {
  data: QuoteData[];
  columns: ColumnDef<QuoteData>[];
}
