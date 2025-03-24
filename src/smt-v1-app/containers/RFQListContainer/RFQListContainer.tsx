import { FC } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import GenericListTable, {
  SearchColumn
} from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/GenericListTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// RFQ veri tipi
interface RFQData {
  id: string;
  rfqReferenceId: string;
  clientRFQId: string;
  date: string;
  status: 'OPEN' | 'QUOTE_CREATED' | 'QUOTE_SENT';
  client: string;
  numberOfProducts: number;
  comments: string;
  partNumbers: string[];
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

// Part Numbers için özel hücre komponenti
export const PartNumbersCell: FC<{ partNumbers: string[] }> = ({
  partNumbers
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = 2;

  if (partNumbers.length <= displayCount) {
    return <>{partNumbers.join(', ')}</>;
  }

  return (
    <div>
      {isExpanded
        ? partNumbers.join(', ')
        : `${partNumbers.slice(0, displayCount).join(', ')}`}
      <Button
        variant="link"
        size="sm"
        className="ms-1"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </Button>
    </div>
  );
};

// Kolon tanımlamaları
const RFQTableColumns: ColumnDef<RFQData>[] = [
  {
    header: 'RFQ Reference ID',
    accessorKey: 'rfqReferenceId',
    cell: ({ row }) => (
      <a href={`/rfq/edit/${row.original.id}`}>{row.original.rfqReferenceId}</a>
    )
  },
  {
    header: 'Client RFQ ID',
    accessorKey: 'clientRFQId'
  },
  {
    header: 'Date',
    accessorKey: 'date'
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const statusColors = {
        OPEN: 'warning',
        QUOTE_CREATED: 'info',
        QUOTE_SENT: 'success'
      };
      return (
        <Badge bg={statusColors[row.original.status]}>
          {row.original.status.replace('_', ' ')}
        </Badge>
      );
    }
  },
  {
    header: 'Client',
    accessorKey: 'client'
  },
  {
    header: '# of Products',
    accessorKey: 'numberOfProducts'
  },
  {
    header: 'Comments',
    accessorKey: 'comments'
  },
  {
    header: 'Part Numbers',
    accessorKey: 'partNumbers',
    cell: ({ row }) => (
      <PartNumbersCell partNumbers={row.original.partNumbers} />
    )
  },
  {
    header: 'Created By',
    accessorKey: 'createdBy'
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt'
  },
  {
    header: 'Last Modified By',
    accessorKey: 'lastModifiedBy'
  },
  {
    header: 'Last Modified At',
    accessorKey: 'lastModifiedAt'
  }
];

// Arama kolonları
const searchColumns: SearchColumn<RFQData>[] = [
  { label: 'No Filter', value: 'all' },
  { label: 'RFQ Reference ID', value: 'rfqReferenceId' },
  { label: 'Client RFQ ID', value: 'clientRFQId' },
  { label: 'Client', value: 'client' },
  { label: 'Created By', value: 'createdBy' }
];

interface RFQListContainerProps {
  title: string;
  showAddButton?: boolean;
  addButtonPath?: string;
}

const RFQList: FC<RFQListContainerProps> = ({
  title,
  showAddButton = true,
  addButtonPath = '/rfq/new-rfq'
}) => {
  const [data, setData] = useState<RFQData[]>([]);

  const fetchRFQData = async (
    query: string,
    page: number,
    pageSize: number
  ) => {
    // Mock data for demonstration
    const mockData: RFQData[] = [
      {
        id: '1',
        rfqReferenceId: 'RFQ-2024-001',
        clientRFQId: 'CLIENT-001',
        date: '2024-03-20',
        status: 'OPEN',
        client: 'ABC Electronics',
        numberOfProducts: 5,
        comments: 'Urgent request',
        partNumbers: ['PART-001', 'PART-002', 'PART-003', 'PART-004'],
        createdBy: 'John Doe',
        createdAt: '2024-03-20 10:00',
        lastModifiedBy: 'Jane Smith',
        lastModifiedAt: '2024-03-20 11:00'
      }
    ];

    return {
      data: mockData,
      totalItems: mockData.length
    };
  };

  return (
    <div>
      <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
        <h2 className="mb-0">
          <span className="fw-normal text-body-tertiary"></span>
        </h2>
        {showAddButton && (
          <Link className="btn btn-primary px-5" to={addButtonPath}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New RFQ
          </Link>
        )}
      </div>

      <GenericListTable<RFQData>
        headerName="RFQ"
        addButtonUrl="/rfq/new-rfq"
        columns={RFQTableColumns}
        fetchData={fetchRFQData}
        searchColumns={searchColumns}
        defaultPageSize={10}
        searchPlaceholder="Search RFQs..."
        data={data}
        loading={false}
        filterOptions={[
          { key: 'status', label: 'Status' },
          { key: 'client', label: 'Client' }
        ]}
        totalItems={data.length}
        currentPage={0}
        pageSize={10}
        onPageChange={page => console.log('Page changed:', page)}
        onPageSizeChange={newSize => console.log('Page size changed:', newSize)}
        onFilterChange={filterKey => console.log('Filter changed:', filterKey)}
      />
    </div>
  );
};

export default RFQList;
