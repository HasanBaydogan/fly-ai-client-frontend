import { useEffect, useState } from 'react';
import useAdvanceTable from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { ColumnDef } from '@tanstack/react-table';
import PiListTable, {
  PiTableColumns
} from 'smt-v1-app/components/features/PoList/PoListTable';
import GeneralTopSection from 'smt-v1-app/components/features/GlobalComponents/GenericListTable/ListTopSection';
import { PoData } from 'smt-v1-app/types/PoTypes';

const PiListContainer = () => {
  const [data] = useState<PoData[]>([]);

  const table = useAdvanceTable({
    data: data,
    columns: PiTableColumns as ColumnDef<PoData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  return (
    <div>
      <AdvanceTableProvider {...table}>
        <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
          <h2 className="mb-0">
            <span className="me-3">PO List</span>{' '}
            <span className="fw-normal text-body-tertiary"></span>
          </h2>
          {/* <Link className="btn btn-primary px-5" to="/client/new-client">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Client
          </Link> */}
        </div>
        <GeneralTopSection activeView="list" />
        <PiListTable activeView={''} />
      </AdvanceTableProvider>
    </div>
  );
};

export default PiListContainer;
