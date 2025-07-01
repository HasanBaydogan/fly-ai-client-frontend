import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import RFQLeftSide from 'smt-v1-app/components/features/RFQLeftSide/RFQLeftSide';
import RFQRightSide from 'smt-v1-app/components/features/RFQRightSide/RFQRightSide';
import './RFQContainer.css';
import { useUnsavedChanges } from 'providers/UnsavedChangesProvider';
// import PartList from 'smt-v1-app/components/features/RFQCreate/PartList/PartList';
import RFQBoady from 'smt-v1-app/components/features/RFQCreate/RFQBoady';
import { RFQ } from '../../types/RfqContainerTypes';

const RFQCreate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Create a new empty RFQ object for creating new RFQ
  const [rfq, setRfq] = useState<RFQ>({
    alternativeRFQPartResponses: [],
    clientRFQNumberId: null,
    clientResponse: null,
    clientNote: '',
    lastModifiedDate: new Date().toISOString(),
    emailSentDate: new Date().toISOString(),
    mailItemMoreDetailResponse: {
      from: '',
      mailContentItemResponses: '',
      mailDate: new Date().toISOString(),
      mailItemAttachmentResponses: [],
      senderCompanyName: '',
      subject: ''
    },
    rfqDeadline: '',
    rfqId: null,
    rfqMailId: '',
    rfqMailStatus: 'OPEN',
    rfqNumberId: '',
    savedRFQItems: []
  });

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
    <div className="rfq-create-container">
      <>
        <RFQBoady
          rfq={rfq}
          onUnsavedChangesUpdate={handleUnsavedChangesUpdate}
          customNavigate={customNavigate}
        />
      </>
    </div>
  );
};

export default RFQCreate;
