import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Button from 'components/base/Button';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import { useState } from 'react';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const WizardFormFooter = ({
  className,
  nextBtnLabel = 'Next',
  hidePrevBtn,
  handleSubmit,
  handleSendQuoteEmail,
  isEmailSendLoading,
  setEmailSendLoading
}: {
  className?: string;
  nextBtnLabel?: string;
  hidePrevBtn?: boolean;
  handleSubmit?: () => void;
  handleSendQuoteEmail: () => void;
  isEmailSendLoading: boolean;
  setEmailSendLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { selectedStep, goToStep, getCanNextPage, getCanPreviousPage } =
    useWizardFormContext();

  return (
    <div
      className={classNames(className, 'd-flex justify-content-between mb-0')}
    >
      <Button
        variant="link"
        className={classNames('p-0', {
          'd-none': hidePrevBtn || !getCanPreviousPage
        })}
        startIcon={<FontAwesomeIcon icon={faChevronLeft} className="fs-10" />}
        onClick={() => goToStep(selectedStep - 1)}
        disabled={isEmailSendLoading}
      >
        Previous
      </Button>
      <Button
        variant="primary"
        className={classNames('px-6', {
          'ms-auto': !hidePrevBtn
        })}
        endIcon={<FontAwesomeIcon icon={faChevronRight} className="fs-10" />}
        onClick={async () => {
          if (getCanNextPage) {
            if (selectedStep === 3) {
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
        }}
        disabled={isEmailSendLoading}
      >
        {isEmailSendLoading ? (
          <LoadingAnimation />
        ) : selectedStep === 2 ? (
          'Send Email'
        ) : (
          nextBtnLabel
        )}
      </Button>
    </div>
  );
};

export default WizardFormFooter;
