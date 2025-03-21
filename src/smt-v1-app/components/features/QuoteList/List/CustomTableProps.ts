import { TableProps as BootstrapTableProps } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { QuoteData } from 'smt-v1-app/types/QuoteTypes';

export interface CustomTableProps extends BootstrapTableProps {
  data: QuoteData[];
  columns: ColumnDef<QuoteData>[];
}
