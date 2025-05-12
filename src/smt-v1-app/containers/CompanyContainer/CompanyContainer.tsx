import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PartTopSection from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/ListTopSection';
import CompanyListTable, {
  CompanyData,
  QuoteTableColumns
} from 'smt-v1-app/components/features/CompanyList/List/CompanyListTable';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { getCompanyAll } from 'smt-v1-app/services/CompanyServices';
import { ColumnDef } from '@tanstack/react-table';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const CompanyContainer = () => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('CompanyContainer - Fetching data...');
        const response = await getCompanyAll();
        console.log('CompanyContainer - Full Response:', response);
        console.log('CompanyContainer - Status Code:', response?.statusCode);
        console.log('CompanyContainer - Data:', response?.data);
        console.log('CompanyContainer - Success:', response?.success);

        if (response?.statusCode === 451) {
          console.log(
            'CompanyContainer - 451 detected, navigating to error page'
          );
          navigate('/451');
          return;
        }

        if (response?.success && response?.data?.clients) {
          console.log(
            'CompanyContainer - Setting data:',
            response.data.clients
          );
          setData(response.data.clients);
        } else {
          console.log('CompanyContainer - No valid data found in response');
        }
      } catch (error) {
        console.error('CompanyContainer - Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageIndex, navigate]);

  const table = useAdvanceTable({
    data: data,
    columns: QuoteTableColumns as ColumnDef<CompanyData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  if (loading) {
    return <LoadingAnimation />;
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
