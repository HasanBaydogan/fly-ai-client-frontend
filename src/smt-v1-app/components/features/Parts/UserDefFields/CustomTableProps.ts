import { TableProps as BootstrapTableProps } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { UDFData } from 'smt-v1-app/types/PartTypes';

export interface CustomTableProps extends BootstrapTableProps {
  data: UDFData[];
  columns: ColumnDef<UDFData>[];
}
