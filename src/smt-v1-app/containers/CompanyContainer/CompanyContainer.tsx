import { useEffect, useState } from 'react';
import PartTopSection from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/ListTopSection';
import CompanyListTable, {
  CompanyData,
  QuoteTableColumns
} from 'smt-v1-app/components/features/CompanyList/List/CompanyListTable';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { getCompanyAll } from 'smt-v1-app/services/CompanyServices';
import { ColumnDef } from '@tanstack/react-table';

const CompanyContainer = () => {
  const [data] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCompanyAll();
        if (response && response.data && response.data.clients) {
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageIndex]);

  const table = useAdvanceTable({
    data: data,
    columns: QuoteTableColumns as ColumnDef<CompanyData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdvanceTableProvider {...table}>
        <PartTopSection activeView="list" />
        <CompanyListTable activeView={''} />
      </AdvanceTableProvider>
    </div>
  );
};

export default CompanyContainer;
