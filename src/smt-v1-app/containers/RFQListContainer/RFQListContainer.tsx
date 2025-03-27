import { useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PartTopSection from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/ListTopSection';
import QuoteListTable, {
  QuoteTableColumns
} from 'smt-v1-app/components/features/QuoteList/List/QuoteListTable';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { searchByRFQList } from 'smt-v1-app/services/RFQService';
import { QuoteData } from 'smt-v1-app/types/QuoteTypes';
import { ColumnDef } from '@tanstack/react-table';

const RFQListContainer = () => {
  const [data] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);
  const [rfqtData, setRFQData] = useState<QuoteData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await searchByRFQList('', pageIndex);
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
    columns: QuoteTableColumns as ColumnDef<QuoteData>[],
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
        <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
          <h2 className="mb-0">
            <span className="me-3">RFQ List</span>{' '}
            <span className="fw-normal text-body-tertiary"></span>
          </h2>
          {/* <Link className="btn btn-primary px-5" to="/client/new-client">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Client
          </Link> */}
        </div>
        <PartTopSection activeView="list" />
        <QuoteListTable activeView={''} />
      </AdvanceTableProvider>
    </div>
  );
};

export default RFQListContainer;
