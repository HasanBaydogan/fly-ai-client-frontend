import React, {
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  FC,
  useRef
} from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/AdvanceTableFooter';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import { Col, Row, Dropdown } from 'react-bootstrap';
import SearchBox from 'components/common/SearchBox';
import debounce from 'lodash/debounce';
import { searchByPartList } from 'smt-v1-app/services/PartServices';

import { PartData } from 'smt-v1-app/types/PartTypes';

import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { usePopper } from 'react-popper';
// Create a reusable EnhancedTooltip component
const EnhancedTooltip = ({
  children,
  tooltipContent,
  placement = 'right'
}: {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAvailable, setisAvailable] = useState(false);
  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  const { styles, attributes } = usePopper(
    referenceRef.current,
    popperRef.current,
    {
      placement,
      strategy: 'fixed',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10]
          }
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: document.body,
            padding: 10
          }
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['left', 'bottom', 'top']
          }
        }
      ]
    }
  );

  const handleMouseEnter = () => {
    if (!isAvailable) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isAvailable) {
      setShowTooltip(false);
    }
  };

  const handleClick = () => {
    setisAvailable(!isAvailable);
    setShowTooltip(!isAvailable);
  };

  return (
    <>
      <div
        ref={referenceRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: 'pointer', display: 'inline-block' }}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          ref={popperRef}
          style={{
            ...styles.popper,
            zIndex: 1050,
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: '0.25rem',
            padding: '0.5rem',
            maxWidth: '300px',
            boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
            fontSize: '0.875rem'
          }}
          {...attributes.popper}
        >
          {tooltipContent}
          {isAvailable && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                padding: '2px 6px',
                fontWeight: 'bold'
              }}
              onClick={e => {
                e.stopPropagation();
                setisAvailable(false);
                setShowTooltip(false);
              }}
            >
              ×
            </div>
          )}
        </div>
      )}
    </>
  );
};

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
    accessorKey: 'oems',
    header: 'Oem',
    cell: ({ row: { original } }) => {
      if (
        !original.oems ||
        !Array.isArray(original.oems) ||
        original.oems.length < 1
      ) {
        return '-';
      }

      const parts: string[] = Array.isArray(original.oems) ? original.oems : [];
      console.log(
        'OEMs data:',
        parts,
        'Type:',
        typeof parts,
        'Is Array:',
        Array.isArray(parts)
      );
      const hasMoreItems = parts.length > 2;
      const displayParts: string[] = hasMoreItems ? parts.slice(0, 2) : parts;

      const tooltipContent = (
        <div style={{ whiteSpace: 'pre-line' }}>
          {parts.map((part: string, index: number) => (
            <div key={index}>
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
        </div>
      );

      return (
        <div style={{ position: 'relative' }}>
          {displayParts.map((part: string, index: number) => (
            <div key={index} className="my-1">
              <span className="me-1">•</span>
              {part}
            </div>
          ))}
          {hasMoreItems && (
            <div style={{ display: 'inline-block' }}>
              <EnhancedTooltip
                tooltipContent={tooltipContent}
                placement="right"
              >
                <span className="text-primary">...</span>
              </EnhancedTooltip>
            </div>
          )}
        </div>
      );
    },
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
  // { label: 'No Filter', value: 'all' },
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
  const [pageSize, setPageSize] = useState<number | 'all'>(10);
  const pageSizeOptions: (number | 'all')[] = [5, 10, 25, 50, 100, 'all'];

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
          oems: Array.isArray(item.oems)
            ? item.oems
            : typeof item.oems === 'string'
            ? (() => {
                try {
                  const parsed = JSON.parse(item.oems);
                  return Array.isArray(parsed) ? parsed : [];
                } catch {
                  return item.oems ? [item.oems] : [];
                }
              })()
            : [],
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
        const effectiveTerm = term.trim();
        const searchParam = effectiveTerm
          ? `${column.value}=${effectiveTerm}`
          : '';
        if (pageSize !== 'all') {
          setGlobalFilter(undefined);
          setColumnFilters([{ id: column.value, value: effectiveTerm }]);
        } else {
          setGlobalFilter(effectiveTerm || undefined);
          setColumnFilters([]);
        }
        setPageIndex(0);
        fetchData(searchParam, 0);
      }, 300),
    [setGlobalFilter, setColumnFilters, pageSize]
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
                {pageSize === 'all' ? 'All Items' : `${pageSize} Parts`}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {pageSizeOptions.map(size => (
                  <Dropdown.Item
                    key={size.toString()}
                    active={pageSize === size}
                    onClick={() => {
                      setPageSize(size);
                      setPageIndex(0);
                    }}
                  >
                    {size === 'all' ? 'All Parts' : `${size} Parts`}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <div className="border-bottom border-translucent">
        {loading ? (
          <div>
            <LoadingAnimation />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default PartListTable;
