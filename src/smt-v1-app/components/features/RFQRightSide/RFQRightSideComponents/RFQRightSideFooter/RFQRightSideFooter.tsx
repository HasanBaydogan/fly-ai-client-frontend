import React from 'react';
import { Button } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const RFQRightSideFooter = ({
  handleCancel,
  handleSaveUpdate,
  isLoadingSave,
  isLoadingCancel,
  isLoading
}: {
  handleCancel: () => void;
  handleSaveUpdate: () => void;
  isLoadingSave: boolean;
  isLoadingCancel: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className="d-flex justify-content-between mt-4 mb-3">
      <Button
        variant="outline-danger ms-3"
        onClick={handleCancel}
        disabled={isLoading}
      >
        {isLoadingCancel ? <LoadingAnimation /> : 'Cancel'}
      </Button>
      <Button
        variant="outline-secondary"
        onClick={handleSaveUpdate}
        disabled={isLoading}
      >
        {isLoadingSave ? <LoadingAnimation /> : 'Save/Update'}
      </Button>
    </div>
  );
};

export default RFQRightSideFooter;
