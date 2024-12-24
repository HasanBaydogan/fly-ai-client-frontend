import SignUpForm from 'components/modules/auth/SignUpForm';
import AuthCardLayout from 'layouts/AuthCardLayout';
import React from 'react';

interface RegisterProps {
  handleRegister: () => void;
}

const Register = ({ handleRegister }: RegisterProps) => {
  return (
    <>
      <AuthCardLayout className="card-sign-up">
        <SignUpForm layout="card" handleRegister={handleRegister} />
      </AuthCardLayout>
    </>
  );
};

export default Register;
