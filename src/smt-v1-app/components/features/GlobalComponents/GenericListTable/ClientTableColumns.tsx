import { ColumnDef } from '@tanstack/react-table';
import { ClientData } from 'smt-v1-app/types/ClientTypes';

export const ClientTableColumns: ColumnDef<ClientData>[] = [
  {
    header: 'Company Name',
    accessorKey: 'companyName'
  },
  {
    header: 'Currency',
    accessorKey: 'currencyPreference'
  },
  {
    header: 'Website',
    accessorKey: 'website'
  },
  {
    header: 'Legal Address',
    accessorKey: 'legalAddress'
  }
];
