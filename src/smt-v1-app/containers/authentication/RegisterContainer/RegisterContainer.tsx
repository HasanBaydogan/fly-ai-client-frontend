import TwoFA from 'pages/pages/authentication/card/TwoFA';
import React, { useState } from 'react';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import Register from 'smt-v1-app/components/features/authentication/Register/Register';
import { register } from 'smt-v1-app/services/AuthenticationService';

const RegisterContainer = () => {
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);

  const handleRegister = async (user: User) => {
    setIsLoading(true);
    const response = await register(user);
    if (response.statusCode === 200) {
      setIsTwoFactorAuth(true);
    } else if (response.statusCode === 409) {
      setIsShowToast(true);
    }
    setIsLoading(false);
  };
  const handleTwoFA = (otp: string) => {
    setIsTwoFactorAuth(false);
  };

  return (
    <>
      {isTwoFactorAuth ? (
        <TwoFA handleTwoFA={handleTwoFA} />
      ) : (
        <Register handleRegister={handleRegister} isLoading={isLoading} />
      )}
      {isShowToast ? (
        <ToastNotification
          isShow={isShowToast}
          setIsShow={setIsShowToast}
          variant={'danger'}
          messageHeader={'Already Registered'}
          messageBodyText={'That Email is Already Registered'}
        />
      ) : null}
    </>
  );
};

export default RegisterContainer;
