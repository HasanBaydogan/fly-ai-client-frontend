import SignUpForm from 'components/modules/auth/SignUpForm';
import AuthCardLayout from 'layouts/AuthCardLayout';
import React from 'react';

interface RegisterProps {
  handleRegister: (user: User) => void;
  isLoading: boolean;
}

const Register = ({ handleRegister, isLoading }: RegisterProps) => {
  return (
    <>
      <AuthCardLayout className="card-sign-up">
        <SignUpForm
          layout="card"
          handleRegister={handleRegister}
          isLoading={isLoading}
        />
      </AuthCardLayout>
    </>
  );
};

export default Register;
