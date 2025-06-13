import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectsTopSection from '../../components/features/SupplierList/SupplierListTopSection/SupplierTopSection';
import SupplierList from '../../components/features/SupplierList/SupplierListTable/SupplierListTable';
import { Link } from 'react-router-dom';
const ProjectListView = () => {
  return (
    <div>
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
    </div>
  );
};

export default ProjectListView;
