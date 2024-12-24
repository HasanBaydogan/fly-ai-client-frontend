import SignInForm from 'components/modules/auth/SignInForm';
import AuthCardLayout from 'layouts/AuthCardLayout';
import React from 'react';

const Login = () => {
  return (
    <>
      <AuthCardLayout className="pb-md-7">
        <SignInForm layout="card" />
      </AuthCardLayout>
    </>
  );
};

export default Login;
