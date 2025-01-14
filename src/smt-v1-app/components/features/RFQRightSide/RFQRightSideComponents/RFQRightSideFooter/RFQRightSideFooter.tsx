import React from 'react';
import { Button } from 'react-bootstrap';

const RFQRightSideFooter = () => {
  return (
    <div className="d-flex justify-content-between mt-4 mb-3">
      <Button variant="outline-danger ms-3">Cancel</Button>
      <Button variant="outline-secondary">Save/Update</Button>
    </div>
  );
};

export default RFQRightSideFooter;
