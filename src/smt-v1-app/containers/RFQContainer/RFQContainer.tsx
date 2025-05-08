import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import RFQLeftSide from 'smt-v1-app/components/features/RFQLeftSide/RFQLeftSide';
import RFQRightSide from 'smt-v1-app/components/features/RFQRightSide/RFQRightSide';
import { openRFQ } from 'smt-v1-app/services/RFQService';
import './RFQContainer.css';
import { RFQ } from './RfqContainerTypes';
import { useUnsavedChanges } from 'providers/UnsavedChangesProvider';

const RFQContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const rfqMailId = searchParams.get('rfqMailId');
  const [rfq, setRfq] = useState<RFQ>();

  // Get access to the UnsavedChanges context
  const {
    setHasUnsavedChanges,
    navigateSafely,
    isNavigationCanceled,
    resetNavigationCanceled
  } = useUnsavedChanges();

  // Handle unsaved changes from child components
  const handleUnsavedChangesUpdate = useCallback(
    (hasChanges: boolean) => {
      // Update the global unsaved changes state
      setHasUnsavedChanges(hasChanges);
    },
    [setHasUnsavedChanges]
  );

  useEffect(() => {
    const openRFQMail = async () => {
      setIsLoading(true);
      const response = await openRFQ(rfqMailId);
      // console.log(response);
      setRfq(response.data);
      setIsLoading(false);
    };

    openRFQMail();
  }, [rfqMailId]);

  // Effect to reset loading state when navigation is canceled
  useEffect(() => {
    if (isNavigationCanceled) {
      // Reset loading state
      setIsLoading(false);
      // Reset the navigation canceled flag
      resetNavigationCanceled();
    }
  }, [isNavigationCanceled, resetNavigationCanceled]);

  // Custom navigation function that uses the UnsavedChanges provider
  const customNavigate = useCallback(
    (path: string, options: { skipUnsavedCheck?: boolean } = {}) => {
      // If skipUnsavedCheck is true or if navigating to quote page, bypass unsaved changes check
      if (options.skipUnsavedCheck || path.includes('/quotes/quote')) {
        // Reset unsaved changes state before navigating
        setHasUnsavedChanges(false);
        // Directly navigate without checking for unsaved changes
        navigate(path);
      } else {
        // Use the normal navigation with unsaved changes check
        navigateSafely(path);
      }
    },
    [navigate, navigateSafely, setHasUnsavedChanges]
  );

  return (
    <div className="d-flex flex-wrap justify-content-around ">
      {/* Sol tarafı modular hale getirdik */}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}
        >
          <LoadingAnimation />
        </div>
      ) : (
        <>
          <RFQLeftSide mailItem={rfq.mailItemMoreDetailResponse} />

          {/* Sağ taraf (products, alternative products) */}
          <RFQRightSide
            rfq={rfq}
            onUnsavedChangesUpdate={handleUnsavedChangesUpdate}
            customNavigate={customNavigate}
          />
        </>
      )}
    </div>
  );
};

export default RFQContainer;
