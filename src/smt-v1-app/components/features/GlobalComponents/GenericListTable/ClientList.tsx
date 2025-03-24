// import { FC } from 'react';
// import GenericListTable from './GenericListTable';
// import { ClientData } from 'smt-v1-app/types/ClientTypes';
// import { searchByClientList } from 'smt-v1-app/services/ClientServices';
// import { ColumnDef } from '@tanstack/react-table';
// import { Badge } from 'react-bootstrap';
// import { SearchColumn } from './GenericListTable';

// const searchColumns: SearchColumn<ClientData>[] = [
//   { label: 'No Filter', value: 'all' },
//   { label: 'Company Name', value: 'companyName' },
//   { label: 'Currency', value: 'currencyPreference' },
//   { label: 'Website', value: 'website' },
//   { label: 'Legal Address', value: 'legalAddress' }
// ];

// // Column definitions moved here
// const ClientTableColumns: ColumnDef<ClientData>[] = [
//   {
//     header: 'Company Name',
//     accessorKey: 'companyName',
//     cell: ({ row }) => (
//       <a href={`/client/edit?clientId=${row.original.clientId}`}>
//         {row.original.companyName}
//       </a>
//     )
//   },
//   {
//     header: 'Details',
//     accessorKey: 'details'
//   },
//   {
//     header: 'Currency',
//     accessorKey: 'currencyPreference'
//   },
//   {
//     header: 'Website',
//     accessorKey: 'website'
//   },
//   {
//     header: 'Legal Address',
//     accessorKey: 'legalAddress'
//   },
//   {
//     header: 'Status',
//     accessorKey: 'clientStatus',
//     cell: ({ row }) => (
//       <Badge
//         bg={
//           row.original.clientStatus?.label.toLowerCase() === 'contacted'
//             ? 'success'
//             : row.original.clientStatus?.label.toLowerCase() === 'not_contacted'
//             ? 'warning'
//             : row.original.clientStatus?.label.toLowerCase() === 'black_listed'
//             ? 'danger'
//             : 'default'
//         }
//       >
//         {row.original.clientStatus?.label}
//       </Badge>
//     )
//   }
// ];

// const ClientList: FC = () => {
//   const fetchClientData = async (
//     query: string,
//     page: number,
//     pageSize: number
//   ) => {
//     const response = await searchByClientList(query, page, pageSize);
//     return {
//       data: response.data.clients,
//       totalItems: response.data.totalItems
//     };
//   };

//   return (
//     <GenericListTable<ClientData>
//       columns={ClientTableColumns}
//       fetchData={fetchClientData}
//       searchColumns={searchColumns}
//       defaultPageSize={10}
//       searchPlaceholder="Search clients..."
//     />
//   );
// };

// export default ClientList;
