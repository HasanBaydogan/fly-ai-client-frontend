import { useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectsTopSection from '../../../components/features/Client/ClientList/ClientTopSection';
import ClientList, {
  ClientTableColumns
} from '../../../components/features/Client/ClientList/ClientListTable';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { ClientData } from 'smt-v1-app/types/ClientTypes';
import { ColumnDef } from '@tanstack/react-table';

const ClientListContainer = () => {
  const [data] = useState<ClientData[]>([]);

  const table = useAdvanceTable({
    data: data,
    columns: ClientTableColumns as ColumnDef<ClientData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

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
