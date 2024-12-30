import TwoFA from 'pages/pages/authentication/card/TwoFA';
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import Register from 'smt-v1-app/components/features/authentication/Register/Register';
import {
  register,
  validateEmailOTP
} from 'smt-v1-app/services/AuthenticationService';

const RegisterContainer = () => {
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [messageHeader, setMessageHeader] = useState('');
  const [messageBodyText, setMessageBodyText] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (user: User) => {
    setIsLoading(true);
    const response = await register(user);
    if (response.statusCode === 200) {
      setEmail(user.email);
      setIsTwoFactorAuth(true);
    } else if (response.statusCode === 409) {
      setMessageHeader('Already Registered');
      setMessageBodyText('That Email is Already Registered');
      setIsShowToast(true);
    }
    setIsLoading(false);
  };
  const handleTwoFA = async (email: string, otp: string) => {
    setIsLoading(true);
    const response = await validateEmailOTP(email, otp);
    if (response.statusCode === 200) {
      setIsTwoFactorAuth(false);
      navigate('/');
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
      {isTwoFactorAuth ? (
        <TwoFA handleTwoFA={handleTwoFA} isLoading={isLoading} email={email} />
      ) : (
        <Register
          handleRegister={handleRegister}
          isLoading={isLoading}
          setIsShowToast={setIsShowToast}
          setMessageHeader={setMessageHeader}
          setMessageBodyText={setMessageBodyText}
        />
      )}
      {isShowToast ? (
        <ToastNotification
          isShow={isShowToast}
          setIsShow={setIsShowToast}
          variant={'danger'}
          messageHeader={messageHeader}
          messageBodyText={messageBodyText}
        />
      ) : null}
    </>
  );
};

export default RegisterContainer;
