import React from 'react';
import classNames from 'classnames';
import { Nav } from 'react-bootstrap';

export interface FilterTabItem {
  label: string;
  value: string;
  onClick: () => void;
  count: number;
  active?: boolean;
}

interface FilterTabProps {
  tabItems: FilterTabItem[];
}

const FilterTab: React.FC<FilterTabProps> = ({ tabItems }) => {
  return (
    <Nav className={classNames(classNames, 'nav nav-links mx-n2')}>
      {tabItems.map(item => (
        <Nav.Item key={item.label}>
          <Nav.Link
            key={item.value}
            onClick={item.onClick}
            className={`tab-item ${item.active ? 'active' : ''}`}
          >
            {item.label} ({item.count})
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default FilterTab;
