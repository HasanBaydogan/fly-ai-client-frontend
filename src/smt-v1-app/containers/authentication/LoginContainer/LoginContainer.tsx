import TwoFA from 'pages/pages/authentication/card/TwoFA';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import Login from 'smt-v1-app/components/features/authentication/Login/Login';
import {
  login,
  validateEmailOTP
} from 'smt-v1-app/services/AuthenticationService';
import { setCookie } from 'smt-v1-app/services/CookieService';

const LoginContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState('danger');
  const [isShowToast, setIsShowToast] = useState(false);
  const [messageHeader, setMessageHeader] = useState('');
  const [messageBodyText, setMessageBodyText] = useState('');
  const [email, setEmail] = useState('');
  const [isTwoFA, setIsTwoFA] = useState(false);

  const navigation = useNavigate();

  const handleLogin = async (userInputemail: string, password: string) => {
    setIsLoading(true);
    const resp = await login(userInputemail, password);
    if (resp && resp.statusCode === 200) {
      const { access_token, refresh_token } = resp.data;
      setCookie('access_token', access_token);
      setCookie('refresh_token', refresh_token);

      navigation('/mail-tracking');
    } else if (resp && resp.statusCode === 404) {
      toastError('Error', 'There is no such a user!');
    } else if (resp && resp.statusCode === 411) {
      toastError('Error', 'Username or Password is invalid!');
    } else if (resp && resp.statusCode === 410) {
      toastInfo('Info', 'Emaii Verification Needed! Directed...');
      setTimeout(() => {
        setIsTwoFA(true);
      }, 1500);
    } else {
      toastError('Error', 'Unknown Error');
    }
    setIsLoading(false);
  };

  function toastError(messageHeader: string, message: string) {
    setVariant('danger');
    setMessageHeader(messageHeader);
    setMessageBodyText(message);
    setIsShowToast(true);
  }
  function toastInfo(messageHeader: string, message: string) {
    setVariant('info');
    setMessageHeader(messageHeader);
    setMessageBodyText(message);
    setIsShowToast(true);
  }
  const handleTwoFA = async (email: string, otp: string) => {
    setIsLoading(true);
    const response = await validateEmailOTP(email, otp);
    if (response.statusCode === 200) {
      setIsTwoFA(false);
      navigation('/');
    } else if (response.statusCode === 498) {
      setMessageHeader('Expired Email');
      setMessageBodyText('New Code is sent to your email');
      setIsShowToast(true);
      // Expired
    } else if (response.statusCode === 411) {
      // Otp is invalid
      setMessageHeader('Invalid Code');
      setMessageBodyText('Please ensure the code');
      setIsShowToast(true);
    } else {
      setMessageHeader('An Error Occurs');
      setMessageBodyText('An Error Occurs');
      setIsShowToast(true);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isTwoFA ? (
        <TwoFA isLoading={isLoading} handleTwoFA={handleTwoFA} email={email} />
      ) : (
        <Login
          isLoading={isLoading}
          handleLogin={handleLogin}
          setEmail={setEmail}
          setIsShowToast={setIsShowToast}
          setMessageHeader={setMessageHeader}
          setMessageBodyText={setMessageBodyText}
          setVariant={setVariant}
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

export default LoginContainer;
