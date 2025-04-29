import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Button from 'components/base/Button';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import { useState, useEffect } from 'react';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const WizardFormFooter = ({
  className,
  nextBtnLabel = 'Next',
  hidePrevBtn,
  handleSubmit,
  handleSendQuoteEmail,
  isEmailSendLoading,
  setEmailSendLoading,
  onClose
}: {
  className?: string;
  nextBtnLabel?: string;
  hidePrevBtn?: boolean;
  handleSubmit?: () => void;
  handleSendQuoteEmail: () => void;
  isEmailSendLoading: boolean;
  setEmailSendLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}) => {
  const { selectedStep, goToStep, getCanNextPage, getCanPreviousPage } =
    useWizardFormContext();

  // Add state to track bank validation
  const [isValidationPassed, setIsValidationPassed] = useState(true);

  // Set up event listeners for validation results
  useEffect(() => {
    const handleValidationResult = (event: CustomEvent) => {
      setIsValidationPassed(event.detail.isValid);

      // If validation passed, proceed to next step
      if (event.detail.isValid && selectedStep === 1) {
        goToStep(selectedStep + 1);
      }
    };

    // TypeScript requires this casting
    const typedListener = handleValidationResult as EventListener;
    document.addEventListener('bankValidationResult', typedListener);

    return () => {
      document.removeEventListener('bankValidationResult', typedListener);
    };
  }, [selectedStep, goToStep]);

  // Function to handle clicking Next
  const handleNextClick = async () => {
    if (getCanNextPage) {
      if (selectedStep === 1) {
        // Trigger bank validation on first step
        document.dispatchEvent(new Event('validateBankSelection'));
        // The actual navigation happens in the validation result event handler
      } else if (selectedStep === 3) {
        await handleSendQuoteEmail();
        goToStep(selectedStep + 1);
      } else {
        goToStep(selectedStep + 1);
      }
    } else {
      if (handleSubmit) {
        handleSubmit();
      }
    }
  };

  return (
    <div
      className={classNames(className, 'd-flex justify-content-between mb-0')}
    >
      <Button
        variant="link"
        className={classNames('p-0', {
          'd-none': hidePrevBtn
        })}
        startIcon={<FontAwesomeIcon icon={faChevronLeft} className="fs-10" />}
        onClick={() => {
          if (selectedStep === 1 && onClose) {
            onClose();
          } else {
            goToStep(selectedStep - 1);
          }
        }}
        disabled={isEmailSendLoading}
      >
        Previous
      </Button>
      <Button
        variant="primary"
        className={classNames('px-6', {
          'ms-auto': !hidePrevBtn,
          'd-none': selectedStep === 4
        })}
        endIcon={<FontAwesomeIcon icon={faChevronRight} className="fs-10" />}
        onClick={handleNextClick}
        disabled={isEmailSendLoading}
      >
        {isEmailSendLoading ? (
          <LoadingAnimation />
        ) : selectedStep === 3 ? (
          'Send Email'
        ) : (
          nextBtnLabel
        )}
      </Button>
    </div>
  );
};

export default WizardFormFooter;
