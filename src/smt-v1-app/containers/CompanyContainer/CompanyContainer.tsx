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

  const table = useAdvanceTable({
    data: data,
    columns: QuoteTableColumns as ColumnDef<CompanyData>[],
    pageSize: 6,
    pagination: true,
    sortable: true
  });

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
