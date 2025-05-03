import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren
} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

interface UnsavedChangesContextInterface {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  navigateSafely: (path: string) => void;
  isNavigationCanceled: boolean;
  resetNavigationCanceled: () => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextInterface>({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
  navigateSafely: () => {},
  isNavigationCanceled: false,
  resetNavigationCanceled: () => {}
});

export const UnsavedChangesProvider = ({ children }: PropsWithChildren) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [refreshRequested, setRefreshRequested] = useState(false);
  const [isNavigationCanceled, setIsNavigationCanceled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track current page to restore when dialog is canceled
  const currentPath = location.pathname + location.search;

  // Reset the navigation canceled flag
  const resetNavigationCanceled = useCallback(() => {
    setIsNavigationCanceled(false);
  }, []);

  // Handle navigation with unsaved changes check
  const navigateSafely = useCallback(
    (path: string) => {
      if (hasUnsavedChanges && path !== currentPath) {
        setPendingPath(path);
        setShowUnsavedWarning(true);
      } else {
        navigate(path);
      }
    },
    [hasUnsavedChanges, navigate, currentPath]
  );

  // Handle F5 key press and beforeunload event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 key or Ctrl+R
      if (e.key === 'F5' || e.keyCode === 116 || (e.ctrlKey && e.key === 'r')) {
        if (hasUnsavedChanges) {
          e.preventDefault();
          setRefreshRequested(true);
          setShowUnsavedWarning(true);
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Handle popstate event (browser back/forward)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        // Show warning modal
        setShowUnsavedWarning(true);
        // Store the destination in pendingPath
        // We'll need to get the next URL somehow
        e.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  // Handle confirmation of navigation
  const handleConfirmNavigation = () => {
    setShowUnsavedWarning(false);

    if (refreshRequested) {
      // Handle page refresh
      window.location.reload();
      setRefreshRequested(false);
      return;
    }

    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  // Cancel navigation
  const handleCancelNavigation = () => {
    setShowUnsavedWarning(false);
    setRefreshRequested(false);
    setPendingPath(null);
    // Set the navigation canceled flag to true to notify components
    setIsNavigationCanceled(true);
  };

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        navigateSafely,
        isNavigationCanceled,
        resetNavigationCanceled
      }}
    >
      {children}

      {/* Unsaved changes warning modal */}
      <Modal
        show={showUnsavedWarning}
        onHide={handleCancelNavigation}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {refreshRequested ? 'Page Refresh' : 'Unsaved Changes'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. If you continue, these changes will be lost.
          Would you like to continue without saving?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelNavigation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmNavigation}>
            Continue Without Saving
          </Button>
        </Modal.Footer>
      </Modal>
    </UnsavedChangesContext.Provider>
  );
};

// Custom hook to use the unsaved changes context
export const useUnsavedChanges = () => useContext(UnsavedChangesContext);
