import Form from 'react-bootstrap/Form';
import { TreeSelect } from '../../SupplierDetailSegmentTreeSelect/SupplierDetailSegmentTreeSelect';
import { mockSegments } from '../../../../containers/SupplierDetailContainer/segmentMockData';

interface SegmentSelectionProps {
  onSelect: (selectedIds: string[]) => void;
}

const SegmentSelection = ({ onSelect }: SegmentSelectionProps) => {
  return (
    <Form>
      <Form.Group className="mb-5 mt-3">
        <Form.Label>Segments</Form.Label>
        <TreeSelect data={mockSegments} onSelect={onSelect} />
      </Form.Group>
    </Form>
  );
};

export default SegmentSelection;
