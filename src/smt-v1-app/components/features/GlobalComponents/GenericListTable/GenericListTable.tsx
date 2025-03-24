import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import { Col, Row, Dropdown, Form, Table, Spinner } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';

export interface SearchColumn<T> {
  label: string;
  value: keyof T | 'all';
}

interface FetchResponse<T> {
  data: T[];
  totalItems: number;
}

interface GenericListTableProps<T> {
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
}

function GenericListTable<T extends { id: string | number }>({
  columns,
  fetchData,
  searchColumns,
  defaultPageSize = 10,
  searchPlaceholder = 'Search...',
  // pageSizeOptions = [5, 10, 25, 50, 100],
  data,
  loading: externalLoading,
  searchConfig,
  filterConfig,
  pagination,
  onSearch,
  onFilter,
  onSort
}: GenericListTableProps<T>) {
  const [dataState, setDataState] = useState<T[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn<T>>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [isLoading, setIsLoading] = useState(false);

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
      setTotalItems(response.totalItems);
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
    <div>
      <div className="mb-4">
        <Row className="g-3 align-items-center">
          <Col xs={12} md={5}>
            <div className="d-flex gap-2">
              <SearchBox
                placeholder={`Search in ${selectedColumn.label.toLowerCase()}...`}
                value={searchTerm}
                onChange={handleSearch}
                disabled={selectedColumn.value === 'all'}
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
                      key={String(column.value)}
                      onClick={() => handleColumnSelect(column)}
                    >
                      {column.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          <Col xs="auto" className="d-flex gap-2 ms-auto">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                size="sm"
                id="dropdown-items-per-page"
                style={{ minWidth: '100px' }}
              >
                {pageSize} Items
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {/* {pageSizeOptions.map(size => (
                  <Dropdown.Item
                    key={size}
                    active={pageSize === size}
                    onClick={() => {
                      setPageSize(size);
                      setPageIndex(0);
                    }}
                  >
                    {size} Items
                  </Dropdown.Item>
                ))} */}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

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
              {columns.map((column: any, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataState.map((item: any, rowIndex) => (
              <tr key={item.id || rowIndex}>
                {columns.map((column: any, colIndex) => (
                  <td key={colIndex}>
                    {column.cell
                      ? column.cell({ row: { original: item } })
                      : item[column.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <AdvanceTableFooter
          pagination
          className="py-1"
          totalItems={totalItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}

export default GenericListTable;
