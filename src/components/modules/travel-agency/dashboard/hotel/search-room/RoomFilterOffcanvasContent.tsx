import { UilTimes } from '@iconscout/react-unicons';
import Button from 'components/base/Button';
import Unicon from 'components/base/Unicon';
import PhoenixReactRange from 'components/forms/PhoenixReactRange';
import { Col, Form, Row } from 'react-bootstrap';
import RoomFilterActions from './RoomFilterActions';
import RoomFilterSearch from './RoomFilterSearch';
import {
  amenitiesOptions,
  bedTypeOptions,
  RoomCategoryOptions
} from 'data/travel-agency/admin/searchRoom';
import { Dispatch, SetStateAction, useState } from 'react';
import RoomFilterCollapseItem from './RoomFilterCollapseItem';

interface RoomFilterOffcanvasContentProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const RoomFilterOffcanvasContent = ({
  setOpen
}: RoomFilterOffcanvasContentProps) => {
  const priceRange = [699, 1299];
  const [isCollapseAll, setIsCollapseAll] = useState(false);

  return (
    <div className="pe-1">
      <div className="d-flex align-items-center">
        <h3 className="text-body-highlight">Filters</h3>
        <Button
          variant="phoenix-secondary"
          className="px-3 ms-auto me-2 me-xl-0"
          onClick={() => setIsCollapseAll(true)}
        >
          Collapse all
        </Button>
        <Button
          className="p-0 fw-bold d-xl-none"
          onClick={() => setOpen && setOpen(false)}
        >
          <Unicon icon={UilTimes} size={16} />
        </Button>
      </div>

      <RoomFilterCollapseItem
        title="Price Range"
        isCollapseAll={isCollapseAll}
        setIsCollapseAll={setIsCollapseAll}
      >
        <PhoenixReactRange
          values={priceRange}
          variant="primary"
          min={500}
          max={2000}
          // onChange={val => setValues({ ...values, segmentTwo: val })}
          trackHeight={'4px'}
          classNames={'phoenix-react-range-slim px-2 pt-1 mb-3'}
        />
        <Row className="g-2">
          <Col xs={6}>
            <Form.Floating>
              <Form.Control
                type="number"
                id="priceRangeMin"
                className="input-spin-none"
                defaultValue={500}
              />
              <label htmlFor="priceRangeMin">Min</label>
            </Form.Floating>
          </Col>
          <Col xs={6}>
            <Form.Floating>
              <Form.Control
                type="number"
                id="priceRangeMax"
                className="input-spin-none"
                defaultValue={1200}
              />
              <label htmlFor="priceRangeMax">Max</label>
            </Form.Floating>
          </Col>
        </Row>
      </RoomFilterCollapseItem>

      {['Adult', 'Child', 'Bedroom', 'Number of Bed', 'Bathroom'].map(
        (item, index) => (
          <RoomFilterCollapseItem
            key={index}
            title={item}
            isCollapseAll={isCollapseAll}
            setIsCollapseAll={setIsCollapseAll}
          >
            <RoomFilterActions />
          </RoomFilterCollapseItem>
        )
      )}

      <RoomFilterCollapseItem
        title="Room Category"
        defaultOpen={false}
        isCollapseAll={isCollapseAll}
        setIsCollapseAll={setIsCollapseAll}
      >
        <RoomFilterSearch items={RoomCategoryOptions} />
      </RoomFilterCollapseItem>
      <RoomFilterCollapseItem
        title="Bed Type"
        defaultOpen={false}
        isCollapseAll={isCollapseAll}
        setIsCollapseAll={setIsCollapseAll}
      >
        <RoomFilterSearch items={bedTypeOptions} />
      </RoomFilterCollapseItem>
      <RoomFilterCollapseItem
        title="Amenities"
        defaultOpen={false}
        hideBorderBottom
        isCollapseAll={isCollapseAll}
        setIsCollapseAll={setIsCollapseAll}
      >
        <RoomFilterSearch items={amenitiesOptions} />
      </RoomFilterCollapseItem>
      <div className="sticky-bottom bg-body pt-4 pb-4 pb-xl-0">
        <Button variant="phoenix-secondary" className="me-2">
          Reset
        </Button>
        <Button variant="primary" className="px-7">
          Apply
        </Button>
      </div>
    </div>
  );
};

export default RoomFilterOffcanvasContent;
