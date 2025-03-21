import { useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import ProjectsTopSection from '../../components/features/SupplierList/SupplierListTopSection/SupplierTopSection';
import SupplierList, {
  projectListTableColumns
} from '../../components/features/SupplierList/SupplierListTable/SupplierListTable';
import { defaultBreadcrumbItems } from 'data/commonData';
import useAdvanceTable from '../../components/features/SupplierList/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { searchBySupplierList } from 'smt-v1-app/services/SupplierServices';
import { SupplierData } from 'smt-v1-app/types/SupplierTypes';

import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from 'smt-v1-app/components/features/SupplierList/AdvanceTable';
import SupplierTopSection from '../../components/features/SupplierList/SupplierListTopSection/SupplierTopSection';

const ProjectListView = () => {
  const [data] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);
  const [supplierData, setSupplierData] = useState<SupplierData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await searchBySupplierList('', pageIndex);
        if (response && response.data && response.data.suppliers) {
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageIndex]);

  const table = useAdvanceTable({
    data: data,
    columns: projectListTableColumns as ColumnDef<SupplierData>[],
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
            <span className="me-3">Supplier List</span>{' '}
            <span className="fw-normal text-body-tertiary"></span>
          </h2>
          <Link className="btn btn-primary px-5" to="/supplier/new-supplier">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Supplier
          </Link>
        </div>
        <ProjectsTopSection activeView="list" />
        <SupplierList activeView={''} />
      </AdvanceTableProvider>
    </div>
  );
};

export default ProjectListView;
