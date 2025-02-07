import { TableProps as BootstrapTableProps } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import { SupplierData } from 'smt-v1-app/services/SupplierServices';

export interface CustomTableProps extends BootstrapTableProps {
  data: SupplierData[];
  columns: ColumnDef<SupplierData>[];
}
