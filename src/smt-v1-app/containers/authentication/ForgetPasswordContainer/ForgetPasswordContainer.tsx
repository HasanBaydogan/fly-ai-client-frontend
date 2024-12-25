import TwoFA from 'pages/pages/authentication/card/TwoFA';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgetPassword from 'smt-v1-app/components/features/authentication/ForgetPassword/ForgetPassword';
import { forgetPassword } from 'smt-v1-app/services/AuthenticationService';

const ForgetPasswordContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [variant, setVariant] = useState('danger');
  const [isShowToast, setIsShowToast] = useState(false);
  const [messageHeader, setMessageHeader] = useState('');
  const [messageBodyText, setMessageBodyText] = useState('');
  const [email, setEmail] = useState('');
  const [isTwoFA, setIsTwoFA] = useState(false);

  const navigation = useNavigate();

  const handleEmail = async () => {
    setIsLoading(true);
    if (!email || !isValidEmail(email)) {
      toastError('Invalid Email');
    } else {
      const resp = await forgetPassword(email);
      if (resp && resp.statusCode === 200) {
        // Success
        console.log('success');
        setIsTwoFA(true);
      } else if (resp && resp.statusCode === 404) {
        console.log('not found');
        // User not found
      } else if (resp && resp.statusCode === 406) {
        // Not Expired OTP
        console.log('not expired');
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
  const handleTwoFA = () => {};

  return (
    <>
      {isTwoFA ? (
        <TwoFA isLoading={isLoading} handleTwoFA={handleTwoFA} email={email} />
      ) : (
        <ForgetPassword
          setEmail={setEmail}
          handleEmail={handleEmail}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ForgetPasswordContainer;
