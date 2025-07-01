import React from 'react';
import { Button } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const RFQRightSideFooter = ({
  handleCancel,
  handleSaveUpdate,
  handleConvertToQuote,
  handleGoToQuote,
  isLoading,
  rfqMailStatus,
  partsCount
}: {
  handleCancel: () => void;
  handleSaveUpdate: () => Promise<void>;
  handleConvertToQuote: () => Promise<void>;
  handleGoToQuote: () => Promise<void>;
  isLoading: boolean;
  rfqMailStatus: string;
  partsCount: number;
}) => {
  const isConvertDisabled = isLoading || partsCount === 0;
  const tooltip = (
    <Tooltip id="tooltip-convert-to-quote">
      You must add at least 1 part to create a quote.
    </Tooltip>
  );
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
          {isLoading ? <LoadingAnimation /> : 'Save/Create'}
        </Button>
        <OverlayTrigger
          placement="top"
          overlay={isConvertDisabled ? tooltip : <></>}
          delay={{ show: 250, hide: 150 }}
        >
          <span className="d-inline-block">
            <Button
              variant="outline-success"
              onClick={handleConvertToQuote}
              disabled={isConvertDisabled}
              className="me-2"
              style={isConvertDisabled ? { pointerEvents: 'none' } : {}}
            >
              {isLoading ? <LoadingAnimation /> : 'Convert To Quote'}
            </Button>
          </span>
        </OverlayTrigger>
      </div>
    </div>
  );
};

export default RFQRightSideFooter;
