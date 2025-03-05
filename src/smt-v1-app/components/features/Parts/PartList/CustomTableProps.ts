import { TableProps as BootstrapTableProps } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { PartData } from 'smt-v1-app/services/PartServices';

export interface CustomTableProps extends BootstrapTableProps {
  data: PartData[];
  columns: ColumnDef<PartData>[];
}
