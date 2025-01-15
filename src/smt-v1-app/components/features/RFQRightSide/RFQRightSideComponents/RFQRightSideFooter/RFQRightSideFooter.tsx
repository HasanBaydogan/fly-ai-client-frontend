import React from 'react';
import { Button } from 'react-bootstrap';

const RFQRightSideFooter = ({
  handleCancel,
  handleSaveUpdate
}: {
  handleCancel: () => void;
  handleSaveUpdate: () => void;
}) => {
  return (
    <div className="d-flex justify-content-between mt-4 mb-3">
      <Button variant="outline-danger ms-3" onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="outline-secondary" onClick={handleSaveUpdate}>
        Save/Update
      </Button>
    </div>
  );
};

export default RFQRightSideFooter;
