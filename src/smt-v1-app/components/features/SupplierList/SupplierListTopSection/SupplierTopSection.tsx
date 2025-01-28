import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilterTab, { FilterTabItem } from 'components/common/FilterTab';
import SearchBox from 'components/common/SearchBox';
import ToggleViewButton from 'components/common/ToggleViewbutton';
import FourGrid from 'components/icons/FourGrid';
import NineGrid from 'components/icons/NineGrid';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef
} from 'react';
import { Col, Row, Form, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { SupplierData } from '../SupplierListTable/SupplierMockData';
import debounce from 'lodash/debounce';

type StatusType = 'all' | 'CONTACTED' | 'NOTCONTACTED' | 'BLACK LIST';

type SearchColumn = {
  label: string;
  value: keyof SupplierData | 'all';
};

const searchColumns: SearchColumn[] = [
  { label: 'All', value: 'all' },
  { label: 'Company Name', value: 'supplierCompany' },
  { label: 'Brand', value: 'brand' },
  { label: 'Country', value: 'countryInfo' },
  { label: 'Email', value: 'email' },
  { label: 'Address', value: 'pickupaddress' }
];

const SupplierTopSection = ({ activeView }: { activeView: string }) => {
  const {
    getPrePaginationRowModel,
    getColumn,
    setGlobalFilter,
    setColumnFilters
  } = useAdvanceTableContext<SupplierData>();
  const [activeStatus, setActiveStatus] = useState<StatusType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string, column: SearchColumn) => {
        if (column.value === 'all') {
          setGlobalFilter(value || undefined);
          setColumnFilters([]); // Reset column filters when searching all
        } else {
          setGlobalFilter(undefined); // Reset global filter
          setColumnFilters([
            {
              id: column.value,
              value: value
            }
          ]);
        }
      }, 300),
    [setGlobalFilter, setColumnFilters]
  );

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value, selectedColumn);
  };

  // Column selection handler
  const handleColumnSelect = (column: SearchColumn) => {
    setSelectedColumn(column);
    debouncedSearch(searchTerm, column);
  };

  // Status değiştiğinde filtreyi uygula
  useEffect(() => {
    const statusColumn = getColumn('status');
    if (statusColumn) {
      statusColumn.setFilterValue(activeStatus === 'all' ? '' : activeStatus);
    }
  }, [activeStatus, getColumn]);

  // Status sayılarını hesapla
  const statusCounts = useMemo(() => {
    const rows = getPrePaginationRowModel().rows;
    return rows.reduce(
      (acc, row) => {
        const status = row.original.status.label;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [getPrePaginationRowModel]);

  const tabItems: FilterTabItem[] = [
    {
      label: 'All',
      value: 'all',
      onClick: () => setActiveStatus('all'),
      count: getPrePaginationRowModel().rows.length
    },
    {
      label: 'Contacted',
      value: 'CONTACTED',
      onClick: () => setActiveStatus('CONTACTED'),
      count: statusCounts['CONTACTED'] || 0
    },
    {
      label: 'Not Contacted',
      value: 'NOTCONTACTED',
      onClick: () => setActiveStatus('NOTCONTACTED'),
      count: statusCounts['NOTCONTACTED'] || 0
    },
    {
      label: 'Black List',
      value: 'BLACK LIST',
      onClick: () => setActiveStatus('BLACK LIST'),
      count: statusCounts['BLACK LIST'] || 0
    }
  ];

  return (
    <div className="mb-4">
      <Row className="g-3 justify-content-between align-items-center mb-3">
        <Col xs={12} sm="auto">
          <FilterTab tabItems={tabItems} />
        </Col>
      </Row>
      <Row className="g-3 align-items-center">
        <Col xs={12} md={4}>
          <div className="d-flex gap-2">
            <SearchBox
              placeholder={`Search in ${selectedColumn.label.toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="flex-grow-1"
            />
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="text-start"
                style={{ minWidth: '150px' }}
              >
                {selectedColumn.label}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {searchColumns.map(column => (
                  <Dropdown.Item
                    key={column.value.toString()}
                    onClick={() => handleColumnSelect(column)}
                  >
                    {column.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SupplierTopSection;
