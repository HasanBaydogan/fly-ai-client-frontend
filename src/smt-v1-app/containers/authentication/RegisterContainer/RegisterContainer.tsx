import TwoFA from 'pages/pages/authentication/card/TwoFA';
import React, { useState } from 'react';
import Register from 'smt-v1-app/components/authentication/Register/Register';

const RegisterContainer = () => {
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);
  const handleRegister = () => {
    setIsTwoFactorAuth(true);
  };
  const handleTwoFA = () => {
    console.log('TwoFA');
  };

  return (
    <>
      {isTwoFactorAuth ? (
        <TwoFA handleTwoFA={handleTwoFA} />
      ) : (
        <Register handleRegister={handleRegister} />
      )}
    </>
  );
};

export default RegisterContainer;
