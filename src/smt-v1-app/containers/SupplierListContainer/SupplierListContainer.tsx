import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageBreadcrumb from 'components/common/PageBreadcrumb';
import ProjectsTopSection from '../../components/features/SupplierList/SupplierListTopSection/SupplierTopSection';
import ProjectListTable, {
  projectListTableColumns
} from '../../components/features/SupplierList/SupplierListTable/SupplierListTable';
import { defaultBreadcrumbItems } from 'data/commonData';
import useAdvanceTable from '../../components/features/SupplierList/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { supplierMockData } from '../../components/features/SupplierList/SupplierListTable/SupplierMockData';

const ProjectListView = () => {
  const table = useAdvanceTable({
    data: Object.values(supplierMockData),
    columns: projectListTableColumns,
    pageSize: 6,
    pagination: true,
    sortable: true
  });

  return (
    <div>
      <PageBreadcrumb items={defaultBreadcrumbItems} />
      <AdvanceTableProvider {...table}>
        <div className="d-flex flex-wrap mb-2 gap-3 gap-sm-6 align-items-center">
          <h2 className="mb-0">
            <span className="me-3">Supplier List</span>{' '}
            <span className="fw-normal text-body-tertiary"></span>
          </h2>
          <Link className="btn btn-primary px-5" to="/">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add new project
          </Link>
        </div>
        <ProjectsTopSection activeView="list" />
        <ProjectListTable />
      </AdvanceTableProvider>
    </div>
  );
};

export default ProjectListView;
