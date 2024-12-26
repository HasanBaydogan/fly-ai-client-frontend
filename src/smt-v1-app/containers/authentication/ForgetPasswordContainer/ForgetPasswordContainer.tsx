import ResetPassword from 'pages/pages/authentication/card/ResetPassword';
import TwoFA from 'pages/pages/authentication/card/TwoFA';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import ForgetPassword from 'smt-v1-app/components/features/authentication/ForgetPassword/ForgetPassword';
import {
  forgetPassword,
  refreshPassword,
  verifyPassRefreshOTP
} from 'smt-v1-app/services/AuthenticationService';

const ForgetPasswordContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState('danger');
  const [isShowToast, setIsShowToast] = useState(false);
  const [messageHeader, setMessageHeader] = useState('');
  const [messageBodyText, setMessageBodyText] = useState('');
  const [email, setEmail] = useState('');
  const [isTwoFA, setIsTwoFA] = useState(false);
  const [clientValidationOTP, setClientValidationOTP] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [isNewPassword, setIsNewPassword] = useState(false);

  const navigation = useNavigate();

  const handleEmail = async () => {
    setIsLoading(true);
    if (!email || !isValidEmail(email)) {
      toastError('Invalid Email');
    } else {
      const resp = await forgetPassword(email);
      console.log(resp);
      if (resp && resp.statusCode === 200) {
        // Success
        setIsTwoFA(true);
        setClientValidationOTP(resp.data.clientValidationOTP);
      } else if (resp && resp.statusCode === 404) {
        // User not found
        toastError('There is no such a user');
      } else if (resp && resp.statusCode === 406) {
        // Not Expired OTP
        toastError('Not Expired Code. Wait 2 minutes');
      }
    }
    setIsLoading(false);
  };

  function isValidEmail(email: string) {
    // A commonly used email validation regex pattern (though not perfect)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  function toastError(message: string) {
    setMessageHeader('Error');
    setVariant('danger');
    setMessageBodyText(message);
    setIsShowToast(true);
  }
  const handleTwoFA = async (email: string, otp: string) => {
    setIsLoading(true);
    const resp = await verifyPassRefreshOTP(email, otp, clientValidationOTP);
    if (resp && resp.statusCode === 200) {
      setOtpToken(resp.data.otpToken);
      setIsTwoFA(false);
      setIsNewPassword(true);
    } else if (resp && resp.statusCode === 411) {
      // Invalid OTP
      toastError('Invalid Code');
    } else if (resp && resp.statusCode === 498) {
      // Expired OTP
      toastError('Expired Code. New Code sent');
    } else {
      toastError('Unknown Error!');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (newPassword: string) => {
    if (newPassword.length < 8) {
      toastError('Password should be at least 8 characters');
    } else {
      setIsLoading(true);
      const resp = await refreshPassword(email, otpToken, newPassword);
      if (resp && resp.statusCode === 200) {
        toastSuccess('Refresh Password', 'Successfully password refreshed');
        setIsNewPassword(false);
        setTimeout(() => navigation('/auth/sign-in'), 1500);
      } else if (resp && resp.statusCode === 422) {
        toastError('Invalid Operation. Come back to main Page');
      } else {
        toastError('Unknown Error');
      }
      setIsLoading(false);
    }
    function toastSuccess(messageHeader: string, message: string) {
      setVariant('success');
      setMessageHeader(messageHeader);
      setMessageBodyText(message);
      setIsShowToast(true);
    }
  };

  return (
    <>
      {isTwoFA ? (
        <TwoFA isLoading={isLoading} handleTwoFA={handleTwoFA} email={email} />
      ) : isNewPassword ? (
        <ResetPassword
          isLoading={isLoading}
          handleResetPassword={handleResetPassword}
        />
      ) : (
        <ForgetPassword
          setEmail={setEmail}
          handleEmail={handleEmail}
          isLoading={isLoading}
        />
      )}

      {isShowToast ? (
        <ToastNotification
          isShow={isShowToast}
          setIsShow={setIsShowToast}
          variant={variant}
          messageHeader={messageHeader}
          messageBodyText={messageBodyText}
        />
      ) : null}
    </>
  );
};

export default ForgetPasswordContainer;
