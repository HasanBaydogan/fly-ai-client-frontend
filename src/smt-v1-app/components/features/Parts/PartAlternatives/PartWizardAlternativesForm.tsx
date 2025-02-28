import Avatar from 'components/base/Avatar';
import { useEffect, useState } from 'react';
import {
  Col,
  Dropdown,
  Form,
  Row,
  Button,
  Pagination,
  Table
} from 'react-bootstrap';
import avatarPlaceholder from 'assets/img/team/avatar.webp';
import AvatarDropzone from 'components/common/AvatarDropzone';
import DatePicker from 'components/base/DatePicker';
import { WizardFormData } from 'pages/modules/forms/WizardExample';
import {
  searchBySupplierList,
  SupplierData
} from 'smt-v1-app/services/SupplierServices';
import useAdvanceTable from 'hooks/useAdvanceTable';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import { faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProjectsTopSection from 'components/modules/project-management/ProjectsTopSection';
import PartHistoryListSection from '../PartsItemFields/HistoryList/PartHistoryListSection';
import PartTimelineGraph from '../TimelineGraph/PartTimelineGraph';

const files = [
  {
    id: 1,
    partNumber: 'VL_Photos_22a',
    partName: 'BRAKE',
    description: 'PRODUCT PHOTO'
  },
  {
    id: 2,
    partNumber: 'DK-120902_152',
    partName: 'BRAKE',
    description: 'Certificate'
  }
];

// Sütun tanımlamalarını ekleyin
const projectListTableColumns: ColumnDef<SupplierData>[] = [
  {
    id: 'partNumber',
    accessorKey: 'partNumber',
    header: 'Part Number',
    meta: {
      cellProps: { className: 'white-space-nowrap py-2' }
    }
  },
  {
    id: 'partName',
    accessorKey: 'partName',
    header: 'Part Name',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' }
    }
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Description',
    meta: {
      cellProps: { className: 'ps-3 fs-9 text-body white-space-nowrap py-2' }
    }
  }
];

const PartWizardUserDefFieldsForm = () => {
  const [data] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageIndex] = useState<number>(1);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await searchBySupplierList('', pageIndex);
        if (response && response.data && response.data.suppliers) {
          // Supplier datasını işleyebilirsiniz
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

  // Actions butonları için işlemler
  const handleHistory = (file: any) => {
    // İstenirse file'a ait history datası burada güncellenebilir.
    setShowHistory(true);
  };

  const handleDetail = (file: any) => {
    // Detail butonuna basıldığında, ilgili URL'e yönlendiriyoruz.
    window.location.href = `/detail/${file.id}`;
  };

  return (
    <div>
      {/* Dosya tablosu */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Part Name</th>
            <th>Description</th>
            <th style={{ width: '50px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td>{file.partNumber}</td>
              <td>{file.partName}</td>
              <td>{file.description}</td>
              <td className="text-center">
                <Dropdown>
                  <Dropdown.Toggle variant="link" className="p-0">
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleHistory(file)}>
                      History
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDetail(file)}>
                      Detail
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Sayfalandırma alanı (Pagination) */}
      <div className="d-flex justify-content-between align-items-center">
        <div></div>
        <Pagination className="mb-0">
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </div>

      {/* History butonuna tıklandığında History ve Timeline bileşenleri görünsün */}
      {showHistory && (
        <div className="mt-4">
          <PartHistoryListSection
            onContactsChange={setContacts}
            initialContacts={contacts}
          />
          <PartTimelineGraph />
        </div>
      )}
    </div>
  );
};

export default PartWizardUserDefFieldsForm;
