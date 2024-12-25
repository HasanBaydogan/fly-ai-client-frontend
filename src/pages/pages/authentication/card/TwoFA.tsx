import TwoFAForm from 'components/modules/auth/TwoFAForm';
import AuthCardLayout from 'layouts/AuthCardLayout';

const TwoFA = ({
  handleTwoFA,
  isLoading,
  email
}: {
  handleTwoFA: (email: string, otp: string) => void;
  isLoading: boolean;
  email: string;
}) => {
  return (
    <AuthCardLayout>
      <TwoFAForm
        handleTwoFA={handleTwoFA}
        isLoading={isLoading}
        email={email}
      />
    </AuthCardLayout>
  );
};

export default TwoFA;
