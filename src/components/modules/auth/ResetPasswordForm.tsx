import Button from 'components/base/Button';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const ResetPasswordForm = ({
  isLoading,
  handleResetPassword
}: {
  isLoading: boolean;
  handleResetPassword: (newPassword: string) => void;
}) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  return (
    <div className="text-center mb-6">
      <h4 className="text-body-highlight">Reset new password</h4>
      <p className="text-body-tertiary">Please type your new password</p>
      <Form className="mt-5">
        <Form.Control
          className="mb-2"
          id="password"
          type="password"
          placeholder="Type new password"
          onChange={e => setPassword(e.target.value)}
        />
        <Form.Control
          className="mb-4"
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          onChange={e => setRepeatPassword(e.target.value)}
        />
        <Button
          variant="primary"
          className="w-100"
          onClick={() => handleResetPassword(password)}
          disabled={!repeatPassword || !password || password != repeatPassword}
        >
          {isLoading ? <LoadingAnimation /> : 'Set Password'}
        </Button>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
