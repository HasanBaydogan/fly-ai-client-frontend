import React from 'react';
import { Button } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const RFQRightSideFooter = ({
  handleCancel,
  handleSaveUpdate,
  handleConvertToQuote,
  handleGoToQuote,
  isLoading,
  rfqMailStatus
}: {
  handleCancel: () => void;
  handleSaveUpdate: () => Promise<void>;
  handleConvertToQuote: () => Promise<void>;
  handleGoToQuote: () => Promise<void>;
  isLoading: boolean;
  rfqMailStatus: string;
}) => {
  return (
    <div className="d-flex justify-content-between mt-4 mb-3">
      <div>
        {(rfqMailStatus === 'PQ' || rfqMailStatus === 'FQ') && (
          <Button
            variant="outline-info"
            onClick={handleGoToQuote}
            disabled={isLoading}
          >
            {isLoading ? <LoadingAnimation /> : 'Go To Quote'}
          </Button>
        )}
        <Button
          variant="outline-danger"
          onClick={handleCancel}
          disabled={isLoading}
          className="ms-3"
        >
          {isLoading ? <LoadingAnimation /> : 'Cancel'}
        </Button>
      </div>
      <div>
        <Button
          variant="outline-secondary"
          onClick={handleSaveUpdate}
          disabled={isLoading}
          className="me-2"
        >
          {isLoading ? <LoadingAnimation /> : 'Save/Update'}
        </Button>
        <Button
          variant="outline-success"
          onClick={handleConvertToQuote}
          disabled={isLoading}
          className="me-2"
        >
          {isLoading ? <LoadingAnimation /> : 'Convert To Quote'}
        </Button>
      </div>
    </div>
  );
};

export default RFQRightSideFooter;
