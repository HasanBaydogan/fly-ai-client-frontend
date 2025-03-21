import { useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectsTopSection from '../../../components/features/Client/ClientList/ClientTopSection';
import ClientList, {
  ClientTableColumns
} from '../../../components/features/Client/ClientList/ClientListTable';
import useAdvanceTable from '../../../components/features/Client/ClientList/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { searchByClientList } from 'smt-v1-app/services/ClientServices';
import { ClientData } from 'smt-v1-app/types/ClientTypes';

import { ColumnDef } from '@tanstack/react-table';

const ClientListContainer = () => {
  const [data] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);
  const [clientData, setClientData] = useState<ClientData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await searchByClientList('', pageIndex);
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
    columns: ClientTableColumns as ColumnDef<ClientData>[],
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
            <span className="me-3">Client List</span>{' '}
            <span className="fw-normal text-body-tertiary"></span>
          </h2>
          <Link className="btn btn-primary px-5" to="/client/new-client">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Client
          </Link>
        </div>
        <ProjectsTopSection activeView="list" />
        <ClientList activeView={''} />
      </AdvanceTableProvider>
    </div>
  );
};

export default ClientListContainer;
