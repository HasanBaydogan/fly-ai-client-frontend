import React, { useState, useEffect } from 'react';
import GenericListTable from './GenericListTable';
import { ColumnDef, ColumnMeta } from '@tanstack/react-table';

interface Client {
  id: string | number;
  company: string;
  details: string;
  currency: string;
  website: string;
  legalAddress: string;
  status: string;
}

// Define custom meta type for columns
interface CustomColumnMeta {
  width?: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const columns: ColumnDef<Client, unknown>[] = [
    {
      header: 'Company',
      accessorKey: 'company',
      size: 200 // Using size instead of meta.width
    },
    {
      header: 'Details',
      accessorKey: 'details',
      size: 200
    },
    {
      header: 'Currency',
      accessorKey: 'currency',
      size: 100
    },
    {
      header: 'Website',
      accessorKey: 'website',
      size: 200
    },
    {
      header: 'Legal Address',
      accessorKey: 'legalAddress',
      size: 200
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 100
    }
  ];

  const searchColumns: Array<{
    label: string;
    value: keyof Client | 'all';
  }> = [
    { label: 'All', value: 'all' },
    { label: 'Company', value: 'company' },
    { label: 'Details', value: 'details' },
    { label: 'Website', value: 'website' }
  ];

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' }
  ];

  const fetchData = async (
    query: string,
    page: number,
    pageSize: number
  ): Promise<{ data: Client[]; totalItems: number }> => {
    // Implement your API call here
    // This is just a placeholder
    return {
      data: [],
      totalItems: 0
    };
  };

  return (
    <GenericListTable<Client>
      headerName="Client"
      addButtonUrl="/clients/new"
      data={clients}
      columns={columns}
      filterOptions={filterOptions}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      onSearch={setSearchTerm}
      onFilterChange={setFilterValue}
      fetchData={fetchData}
      searchColumns={searchColumns}
    />
  );
};

export default ClientList;
