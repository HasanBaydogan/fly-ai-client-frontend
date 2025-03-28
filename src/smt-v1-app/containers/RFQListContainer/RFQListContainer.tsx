import { useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PartTopSection from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/ListTopSection';
import RFQListTable, {
  RFQTableColumns
} from 'smt-v1-app/components/features/RFQListTable/List/RFQListTable';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { searchByRFQList } from 'smt-v1-app/services/RFQService';
import { RFQData } from 'smt-v1-app/types/index';
import { ColumnDef } from '@tanstack/react-table';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const RFQListContainer = () => {
  const [data] = useState<RFQData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);
  const [rfqtData, setRFQData] = useState<RFQData[]>([]);

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
    columns: RFQTableColumns as ColumnDef<RFQData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  if (loading) {
    return (
      <div>
        {' '}
        <LoadingAnimation></LoadingAnimation> Loading...
      </div>
    );
  }

  return (
    <div>
      <AdvanceTableProvider {...table}>
        <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
          <h2 className="mb-0">
            <span className="me-3">RFQ List</span>{' '}
            <span className="fw-normal text-body-tertiary text-center"></span>
          </h2>
          {/* <Link className="btn btn-primary px-5" to="/client/new-client">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Client
          </Link> */}
        </div>
        <PartTopSection activeView="list" />
        <RFQListTable activeView={''} />
      </AdvanceTableProvider>
    </div>
  );
};

export default RFQListContainer;
