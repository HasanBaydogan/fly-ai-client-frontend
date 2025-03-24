import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import {
  Col,
  Row,
  Dropdown,
  Form,
  Table,
  Spinner,
  InputGroup
} from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import { useNavigate } from 'react-router-dom';
import CustomButton from 'components/base/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export interface SearchColumn<T> {
  label: string;
  value: keyof T | 'all';
}

interface FetchResponse<T> {
  data: T[];
  totalItems: number;
}

interface FilterOption {
  key: string;
  label: string;
}

interface Column {
  header: string;
  accessor: string;
  width?: string;
}

interface GenericListTableProps<T> {
  headerName: string;
  addButtonUrl: string;
  columns: ColumnDef<T>[];
  fetchData: (
    query: string,
    page: number,
    pageSize: number
  ) => Promise<FetchResponse<T>>;
  searchColumns: SearchColumn<T>[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  data: T[];
  loading?: boolean;
  searchConfig?: {
    placeholder?: string;
    searchFields: string[];
  };
  filterConfig?: {
    filters: {
      name: string;
      options: { text: string; value: string }[];
    }[];
  };
  pagination?: {
    pageSize?: number;
    showSizeChanger?: boolean;
  };
  onSearch?: (value: string) => void;
  onFilter?: (filters: any) => void;
  onSort?: (sorter: any) => void;
  filterOptions: FilterOption[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFilterChange: (filterKey: string) => void;
}

function GenericListTable<T extends { id: string | number }>({
  headerName,
  addButtonUrl,
  columns,
  fetchData,
  searchColumns,
  defaultPageSize = 10,
  searchPlaceholder = 'Search...',
  data,
  loading: externalLoading,
  searchConfig,
  filterConfig,
  pagination,
  onSearch,
  onFilter,
  onSort,
  filterOptions,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onFilterChange
}: GenericListTableProps<T>) {
  const [dataState, setDataState] = useState<T[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn<T>>(
    searchColumns[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { setGlobalFilter, setColumnFilters } = useAdvanceTableContext<T>();

  const fetchDataFromAPI = async (
    term: string,
    currentPage: number,
    column: SearchColumn<T>
  ) => {
    setIsLoading(true);
    try {
      let query = '';
      if (term) {
        query =
          column.value !== 'all'
            ? `${String(column.value)}=${term}`
            : `search=${term}`;
      }

      const response = await fetchData(query, currentPage + 1, pageSize);
      setDataState(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchData = useMemo(
    () =>
      debounce((term: string, column: SearchColumn<T>) => {
        if (term) {
          if (column.value === 'all') {
            setGlobalFilter(term || undefined);
            setColumnFilters([]);
          } else {
            setGlobalFilter(undefined);
            setColumnFilters([{ id: String(column.value), value: term }]);
          }
        } else {
          setGlobalFilter(undefined);
          setColumnFilters([]);
        }
        setPageIndex(0);
        fetchDataFromAPI(term, 0, column);
      }, 300),
    [setGlobalFilter, setColumnFilters]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchData(value, selectedColumn);
  };

  const handleColumnSelect = (column: SearchColumn<T>) => {
    setSelectedColumn(column);
    debouncedFetchData(searchTerm, column);
  };

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{headerName} List</h2>
        <CustomButton
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => navigate(addButtonUrl)}
        >
          Add New {headerName}
        </CustomButton>
      </div>

      {/* Search and Filter Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2" style={{ width: '40%' }}>
          <InputGroup>
            <Form.Control
              placeholder={`Search in ${headerName.toLowerCase()} name...`}
              onChange={e => onSearch?.(e.target.value)}
            />
          </InputGroup>
          <Form.Select
            onChange={e => onFilterChange(e.target.value)}
            style={{ width: '200px' }}
          >
            {filterOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </div>
        <Form.Select
          style={{ width: '150px' }}
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {/* {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} {headerName}s
            </option>
          ))} */}
        </Form.Select>
      </div>

      {/* Table Section */}
      <div className="border-bottom border-translucent">
        {(isLoading || externalLoading) && (
          <div className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        <Table responsive hover>
          <thead>
            <tr>
              {columns.map((column: ColumnDef<T>, index) => (
                <th
                  key={index}
                  style={{
                    width: column.size ? `${column.size}px` : 'auto'
                  }}
                >
                  {typeof column.header === 'string'
                    ? column.header
                    : column.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataState.map((item: T, rowIndex) => (
              <tr key={item.id || rowIndex}>
                {columns.map((column: ColumnDef<T>, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ width: column.size ? `${column.size}px` : 'auto' }}
                  >
                    {typeof column.cell === 'function'
                      ? column.cell({ row: { original: item } } as any)
                      : 'accessorKey' in column
                      ? item[column.accessorKey as keyof T]
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <AdvanceTableFooter
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default GenericListTable;
