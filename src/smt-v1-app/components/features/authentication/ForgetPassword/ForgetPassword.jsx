import ForgotPasswordForm from 'components/modules/auth/ForgotPasswordForm';
import AuthCardLayout from 'layouts/AuthCardLayout';
import React from 'react';

const ForgetPassword = () => {
  return (
    <>
      <AuthCardLayout>
        <ForgotPasswordForm />
      </AuthCardLayout>
    </>
  );
};

export default ForgetPassword;
