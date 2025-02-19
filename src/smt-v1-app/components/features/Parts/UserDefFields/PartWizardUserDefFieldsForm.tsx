import Avatar from 'components/base/Avatar';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import { useEffect, useState } from 'react';
import { Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';
import avatarPlaceholder from 'assets/img/team/avatar.webp';
import AvatarDropzone from 'components/common/AvatarDropzone';
import DatePicker from 'components/base/DatePicker';
import { WizardFormData } from 'pages/modules/forms/WizardExample';
import SupplierList, { projectListTableColumns } from './SupplierListTable';
import {
  searchBySupplierList,
  SupplierData
} from 'smt-v1-app/services/SupplierServices';
import useAdvanceTable from 'hooks/useAdvanceTable';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { Link } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectsTopSection from 'components/modules/project-management/ProjectsTopSection';

const PartWizardUserDefFieldsForm = () => {
  const methods = useWizardFormContext<WizardFormData>();
  const { formData, onChange, validation } = methods;
  const [avatar, setAvatar] = useState(avatarPlaceholder);

  const onDrop = (acceptedFiles: File[]) => {
    setAvatar(URL.createObjectURL(acceptedFiles[0]));
  };

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
          <Link className="btn btn-primary px-5" to="/supplier/new-supplier">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New UDF
          </Link>
        </div>
        <SupplierList activeView={''} />
        <Row>
          <Col sm={3} className="mt-5">
            <Dropdown className="d-inline mx-2">
              <Dropdown.Toggle
                id="dropdown-autoclose-true"
                variant="phoenix-primary"
              >
                Field Type
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col sm={3} className="mt-5">
            <Dropdown className="d-inline mx-2">
              <Dropdown.Toggle
                id="dropdown-autoclose-true"
                variant="phoenix-primary"
              >
                Field Type
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </AdvanceTableProvider>
    </div>
  );
};

export default PartWizardUserDefFieldsForm;
