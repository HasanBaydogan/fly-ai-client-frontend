import { TableProps as BootstrapTableProps } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { ClientData } from 'smt-v1-app/types/ClientTypes';

export interface CustomTableProps extends BootstrapTableProps {
  data: ClientData[];
  columns: ColumnDef<ClientData>[];
}
