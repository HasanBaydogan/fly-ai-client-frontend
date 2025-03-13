import classNames from 'classnames';
import Button from 'components/base/Button';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const totalInputLength = 6;

const TwoFAForm = ({
  layout,
  handleTwoFA,
  isLoading,
  email
}: {
  layout?: 'simple' | 'card' | 'split';
  handleTwoFA: (email: string, otp: string) => void;
  isLoading: boolean;
  email: string;
}) => {
  const [otp, setOtp] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { value } = e.target;

    if (value) {
      [...value].slice(0, totalInputLength).forEach((char, charIndex) => {
        if (inputRefs.current && inputRefs.current[index + charIndex]) {
          inputRefs.current[index + charIndex]!.value = char;
          inputRefs.current[index + charIndex + 1]?.focus();
        }
      });
    } else {
      inputRefs.current[index]!.value = '';
      inputRefs.current[index - 1]?.focus();
    }

    const updatedOtp = inputRefs.current.reduce(
      (acc, input) => acc + (input?.value || ''),
      ''
    );
    setOtp(updatedOtp);
  };

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => {
      handleTwoFA(email, otp);
    }, 1500);
  };

  return (
    <div>
      <div className={classNames({ 'px-xxl-5': !(layout === 'split') })}>
        <div
          className={classNames('text-center', {
            'mb-6': !(layout === 'split')
          })}
        >
          <h4 className="text-body-highlight">
            Please enter the verification code
          </h4>
          <p className="text-body-tertiary mb-3">
            An email containing a 6-digit verification code has been sent to the
            email address - {email}
          </p>
          <div className="verification-form">
            <div className="d-flex align-items-center gap-2 mb-3">
              {Array(totalInputLength)
                .fill('')
                .map((_, index) => (
                  <React.Fragment key={index}>
                    <Form.Control
                      ref={(el: HTMLInputElement) => {
                        inputRefs.current[index] = el;
                      }}
                      className="px-2 text-center"
                      type="number"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, index)
                      }
                    />
                    {index === 2 && <span>-</span>}
                  </React.Fragment>
                ))}
            </div>
            <Button
              variant="primary"
              className="w-100 mb-5"
              type="button"
              onClick={handleButtonClick}
              disabled={otp.length < totalInputLength || buttonLoading}
            >
              {buttonLoading || isLoading ? <LoadingAnimation /> : 'Verify'}
            </Button>
            <Link to="#!" className="fs-9">
              Didn’t receive the code?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFAForm;
