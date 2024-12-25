import SignInForm from 'components/modules/auth/SignInForm';
import AuthCardLayout from 'layouts/AuthCardLayout';
import React from 'react';

const Login = ({
  isLoading,
  handleLogin,
  setEmail,
  setIsShowToast,
  setMessageHeader,
  setMessageBodyText,
  setVariant
}: {
  isLoading: boolean;
  handleLogin: (email: string, password: string) => void;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setIsShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      <AuthCardLayout className="pb-md-7">
        <SignInForm
          layout="card"
          isLoading={isLoading}
          handleLogin={handleLogin}
          setEmail={setEmail}
          setIsShowToast={setIsShowToast}
          setMessageHeader={setMessageHeader}
          setMessageBodyText={setMessageBodyText}
          setVariant={setVariant}
        />
      </AuthCardLayout>
    </>
  );
};

export default Login;
