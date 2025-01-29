import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilterTab, { FilterTabItem } from './FilterTab';
import SearchBox from 'components/common/SearchBox';
import ToggleViewButton from 'components/common/ToggleViewbutton';
import FourGrid from 'components/icons/FourGrid';
import NineGrid from 'components/icons/NineGrid';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Col, Row, Dropdown } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import {
  SupplierData,
  searchBySupplierList
} from '../SupplierListTable/SearchBySupplierListMock';

type StatusType = 'all' | 'CONTACTED' | 'NOT CONTACTED' | 'BLACK LIST';

type SearchColumn = {
  label: string;
  value: keyof SupplierData | 'all';
};

const searchColumns: SearchColumn[] = [
  { label: 'All Columns', value: 'all' },
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
      debounce(async (value: string, column: SearchColumn) => {
        try {
          const response = await searchBySupplierList(value, column.value);
          if (response.statusCode === 200) {
            if (column.value === 'all') {
              setGlobalFilter(value || undefined);
              setColumnFilters([]);
            } else {
              setGlobalFilter(undefined);
              setColumnFilters([
                {
                  id: column.value,
                  value: value
                }
              ]);
            }
          }
        } catch (error) {
          console.error('Search error:', error);
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

  const tabItems: FilterTabItem[] = [
    {
      label: 'All',
      value: 'all',
      onClick: () => setActiveStatus('all'),
      count: getPrePaginationRowModel().rows.length,
      active: activeStatus === 'all'
    },
    {
      label: 'Contacted',
      value: 'CONTACTED',
      onClick: () => setActiveStatus('CONTACTED'),
      count: 0,
      active: activeStatus === 'CONTACTED'
    },
    {
      label: 'Not Contacted',
      value: 'NOT CONTACTED',
      onClick: () => setActiveStatus('NOT CONTACTED'),
      count: 0,
      active: activeStatus === 'NOT CONTACTED'
    },
    {
      label: 'Black List',
      value: 'BLACK LIST',
      onClick: () => setActiveStatus('BLACK LIST'),
      count: 0,
      active: activeStatus === 'BLACK LIST'
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
