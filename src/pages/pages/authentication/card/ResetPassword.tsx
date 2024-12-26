import ResetPasswordForm from 'components/modules/auth/ResetPasswordForm';
import AuthCardLayout from 'layouts/AuthCardLayout';

const ResetPassword = ({
  isLoading,
  handleResetPassword
}: {
  isLoading: boolean;
  handleResetPassword: (newPassword: string) => void;
}) => {
  return (
    <AuthCardLayout>
      <ResetPasswordForm
        isLoading={isLoading}
        handleResetPassword={handleResetPassword}
      />
    </AuthCardLayout>
  );
};

export default ResetPassword;
