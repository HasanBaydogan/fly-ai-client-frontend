import ForgotPasswordForm from 'components/modules/auth/ForgotPasswordForm';
import AuthCardLayout from 'layouts/AuthCardLayout';
import React from 'react';

const ForgetPassword = ({
  setEmail,
  handleEmail,
  isLoading
}: {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  handleEmail: () => void;
  isLoading: boolean;
}) => {
  return (
    <>
      <AuthCardLayout>
        <ForgotPasswordForm
          layout="card"
          setEmail={setEmail}
          handleEmail={handleEmail}
          isLoading={isLoading}
        />
      </AuthCardLayout>
    </>
  );
};

export default ForgetPassword;
