import { faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FilterTab, { FilterTabItem } from 'components/common/FilterTab';
import SearchBox from 'components/common/SearchBox';
import ToggleViewButton from 'components/common/ToggleViewbutton';
import FourGrid from 'components/icons/FourGrid';
import NineGrid from 'components/icons/NineGrid';
import { Project } from 'data/project-management/projects';
import { useAdvanceTableContext } from 'providers/AdvanceTableProvider';
import { ChangeEvent, useMemo, useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ProjectsTopSectionInterface {
  activeView: 'list' | 'board' | 'card';
}

const ProjectsTopSection = ({ activeView }: ProjectsTopSectionInterface) => {
  const navigate = useNavigate();
  const { setGlobalFilter, getPrePaginationRowModel, getColumn } =
    useAdvanceTableContext<Project>();

  // Seçili filtreyi saklamak için local state
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  // Filtre select'i değişince burası tetiklenir
  const handleFilterSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  const handleFilterItemClick = (columnId: string, value: string) => {
    const column = getColumn(columnId);
    column?.setFilterValue(value === 'all' ? '' : value);
  };

  const tabItems: FilterTabItem[] = useMemo(() => {
    const getDataCount = (label: string) =>
      getPrePaginationRowModel().rows.filter(
        ({ original: { status } }) => status.label === label
      ).length;

    return [
      {
        label: 'All',
        value: 'all',
        onClick: () => handleFilterItemClick('status', 'all'),
        count: getPrePaginationRowModel().rows.length
      },
      {
        label: 'Ongoing',
        value: 'ongoing',
        onClick: () => handleFilterItemClick('status', 'ongoing'),
        count: getDataCount('ongoing')
      },
      {
        label: 'Cancelled',
        value: 'cancelled',
        onClick: () => handleFilterItemClick('status', 'cancelled'),
        count: getDataCount('cancelled')
      },
      {
        label: 'Completed',
        value: 'completed',
        onClick: () => handleFilterItemClick('status', 'completed'),
        count: getDataCount('completed')
      },
      {
        label: 'Critical',
        value: 'critical',
        onClick: () => handleFilterItemClick('status', 'critical'),
        count: getDataCount('critical')
      }
    ];
  }, [getPrePaginationRowModel]);

  /**
   * Arama kutusuna girilen değer değiştiğinde hem global filtre hem de
   * seçili kolona özel filtreleme işini buradan yönetiyoruz.
   */
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value || '';

    if (selectedFilter) {
      // Seçili bir filtre varsa sadece ilgili kolonu filtreleyelim
      getColumn(selectedFilter)?.setFilterValue(searchValue);
    } else {
      // Aksi halde genel aramaya devam
      setGlobalFilter(searchValue || undefined);
    }
  };

  return (
    <Row className="g-3 justify-content-between align-items-center mb-4">
      <Col xs={12} sm="auto">
        <FilterTab tabItems={tabItems} />
      </Col>
      <Col xs={12} sm="auto">
        <div className="d-flex align-items-center gap-2">
          <SearchBox
            onChange={handleSearchInputChange}
            placeholder="Search projects"
            style={{ maxWidth: '30rem' }}
            className="me-2"
          />

          {/* Buraya filtre select'ini ekliyoruz */}
          <Form.Select
            value={selectedFilter}
            onChange={handleFilterSelectChange}
            style={{ width: '12rem' }}
          >
            <option value="">Filtre Seç...</option>
            <option value="supplierCompany">Supplier Company</option>
            <option value="segment">Segments</option>
            <option value="brand">Brand</option>
            <option value="countryInfo">Country Info</option>
            <option value="email">E-Mail</option>
          </Form.Select>
        </div>
      </Col>
    </Row>
  );
};

export default ProjectsTopSection;
