import React, { useEffect, useMemo, useState, FC } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import AdvanceTableFooter from './AdvanceTableFooter';
import { Col, Row } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { getByUDFPartList } from 'smt-v1-app/services/PartServices';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import { UDFData } from 'smt-v1-app/services/PartServices';

// Tabloda görüntülenecek kolon tanımlamaları
export const udfTableColumns: ColumnDef<UDFData>[] = [
  {
    id: 'fieldName',
    accessorKey: 'fieldName',
    header: 'Field Name',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' },
      headerProps: { style: { width: '15%' } }
    }
  },
  {
    header: 'Field Default Value',
    accessorKey: 'fieldDefaultValue',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '25%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Created By',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    header: 'Updated By',
    accessorKey: 'updatedBy',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    meta: {
      cellProps: { className: 'ps-3 text-body py-2' },
      headerProps: { style: { width: '10%' }, className: 'ps-3' }
    }
  }
];

// Arama için kullanılacak kolon tipi
type SearchColumn = {
  label: string;
  value: string;
};

interface PartUDFListProps {
  activeView: string;
}

const PartUDFList: FC<PartUDFListProps> = ({ activeView }) => {
  const [data, setData] = useState<UDFData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  const { setGlobalFilter, setColumnFilters } =
    useAdvanceTableContext<UDFData>();

  // API'den gelen UDF verilerini uygun şekilde mapleyip tabloya aktarıyoruz.
  const fetchData = async (term: string, column: SearchColumn) => {
    setLoading(true);
    try {
      const response = await getByUDFPartList(term, pageIndex + 1, pageSize);
      if (response?.data?.data) {
        const udfData = response.data.data.map((item: any) => ({
          udfId: item.udfId,
          fieldName: item.fieldName,
          fieldType: item.fieldType,
          fieldStringValues: item.fieldStringValues,
          addrfieldIntValuesess: item.addrfieldIntValuesess,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          updatedAt: item.updatedAt,
          updatedBy: item.updatedBy
        }));
        setData(Array.isArray(udfData) ? udfData : [udfData]);
        setTotalItems(Array.isArray(udfData) ? udfData.length : 1);
      }
    } catch (error) {
      console.error('Error fetching UDF data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced arama fonksiyonu
  const debouncedFetchData = useMemo(
    () =>
      debounce((term: string, column: SearchColumn) => {
        if (term) {
          if (column.value === 'all') {
            setGlobalFilter(term || undefined);
            setColumnFilters([]);
          } else {
            setGlobalFilter(undefined);
            setColumnFilters([{ id: column.value, value: term }]);
          }
        } else {
          setGlobalFilter(undefined);
          setColumnFilters([]);
        }
        fetchData(term, column);
      }, 300),
    [setGlobalFilter, setColumnFilters]
  );

  useEffect(() => {
    // Başlangıçta veya arama terimi değiştiğinde fetchData çağrılıyor.
    fetchData(searchTerm, { label: 'All', value: 'all' });
  }, [searchTerm, pageIndex, pageSize]);

  return (
    <div>
      <div className="border-bottom border-translucent">
        {loading && <div>Loading...</div>}
        <AdvanceTable
          tableProps={{
            className: 'phoenix-table border-top border-translucent fs-9',
            data: data,
            columns: udfTableColumns
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

export default PartUDFList;
