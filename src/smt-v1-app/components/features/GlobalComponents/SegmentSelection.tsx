import React from 'react';
import Form from 'react-bootstrap/Form';
import {
  TreeSelect,
  TreeNode
} from '../SupplierDetailSegmentTreeSelect/SupplierDetailSegmentTreeSelect';

interface SegmentSelectionProps {
  data: TreeNode[];
  setSegmentIds: (selectedIds: string[]) => void;
  setSegments: (segments: TreeNode[]) => void;
}

const SegmentSelection: React.FC<SegmentSelectionProps> = ({
  data,
  setSegmentIds,
  setSegments
}) => {
  return (
    <div>
      <Form.Group className="mb-5 mt-3">
        <Form.Label>Segments</Form.Label>
        <TreeSelect
          data={data}
          setSelected={setSegmentIds}
          setSegments={setSegments}
        />
      </Form.Group>
    </div>
  );
};

export default SegmentSelection;
