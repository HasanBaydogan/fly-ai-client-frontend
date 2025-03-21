import React, { useEffect, useMemo, useState, ChangeEvent, FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { Col, Row, Dropdown } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import ActionDropdownItems from './ActionDropdownItems/ActionDropdownItems';
import { searchByPartList } from 'smt-v1-app/services/PartServices';

import { PartData } from 'smt-v1-app/types/PartTypes';

import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';

export const PartTableColumns: ColumnDef<PartData>[] = [
  {
    id: 'partNumber',
    accessorKey: 'partNumber',
    header: 'Part Number',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' } }
    }
  },
  {
    header: 'Part Name',
    accessorKey: 'partName',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '32%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Segments',
    accessorKey: 'segments',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '13%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'aircraft',
    header: 'Aircraft',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Aircraft Model',
    accessorKey: 'aircraftModel',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'oem',
    header: 'Oem',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'hsCode',
    header: 'Hs Code',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  }
];

type SearchColumn = {
  label: string;
  value: keyof PartData | 'all';
};

const searchColumns: SearchColumn[] = [
  { label: 'No Filter', value: 'all' },
  { label: 'Part Number', value: 'partNumber' },
  { label: 'Part Name', value: 'partName' },
  { label: 'Aircraft Model', value: 'aircraftModel' }
];

interface PartListProps {
  activeView: string;
  onPartSelect: (partId: string) => void;
}

const PartListTable: FC<PartListProps> = ({ activeView, onPartSelect }) => {
  const [data, setData] = useState<PartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<SearchColumn>(
    searchColumns[0]
  );
  const [pageSize, setPageSize] = useState<number>(10);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<PartData>();

  const fetchData = async (searchParam: string, currentPage: number) => {
    setLoading(true);
    try {
      const response = await searchByPartList(
        searchParam,
        currentPage + 1,
        pageSize
      );
      const parts = response?.data?.parts || [];
      if (Array.isArray(parts)) {
        const mappedData: PartData[] = parts.map((item: any) => ({
          partId: item.partId,
          partNumber: item.partNumber,
          partName: item.partName,
          segments: Array.isArray(item.segments)
            ? item.segments.map((seg: any) => seg.segmentName)
            : [],
          aircraft: item.aircraft,
          aircraftModel: item.aircraftModel,
          oem: item.oem,
          hsCode: item.hsCode
        }));
        setData(mappedData);
        setTotalItems(response.data.totalElements);
      } else {
        console.error('Parts array not found in API response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useMemo(
    () =>
      debounce((term: string, column: SearchColumn) => {
        let searchParam = '';
        if (term && column.value !== 'all') {
          searchParam = `${column.value}=${term}`;
          setGlobalFilter(undefined);
          setColumnFilters([{ id: column.value, value: term }]);
        } else {
          setGlobalFilter(term || undefined);
          setColumnFilters([]);
        }
        setPageIndex(0);
        fetchData(searchParam, 0);
      }, 300),
    [setGlobalFilter, setColumnFilters]
  );
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchData(value, selectedColumn);
  };

  const handleColumnSelect = (column: SearchColumn) => {
    setSelectedColumn(column);
    debouncedFetchData(searchTerm, column);
  };

  useEffect(() => {
    const searchParam =
      selectedColumn.value === 'all'
        ? ''
        : `${selectedColumn.value}=${searchTerm}`;
    fetchData(searchParam, pageIndex);
  }, [pageIndex, pageSize]);

  const openPartModal = (partId: string) => {
    onPartSelect(partId);
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
          <Col xs="auto" className="d-flex gap-2 ms-auto">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                size="sm"
                id="dropdown-items-per-page"
                style={{ minWidth: '100px' }}
              >
                {pageSize} Parts
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[5, 10, 25, 50, 100].map(size => (
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
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <div className="border-bottom border-translucent">
        {loading && <div>Loading...</div>}
        <AdvanceTable
          openPartModal={openPartModal}
          tableProps={{
            className: 'phoenix-table border-top border-translucent fs-9',
            data: data,
            columns: PartTableColumns
          }}
        />
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
};

export default PartListTable;
