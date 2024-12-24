import TwoFAForm from 'components/modules/auth/TwoFAForm';
import AuthCardLayout from 'layouts/AuthCardLayout';

const TwoFA = ({ handleTwoFA }: { handleTwoFA: () => void }) => {
  return (
    <AuthCardLayout>
      <TwoFAForm handleTwoFA={handleTwoFA} />
    </AuthCardLayout>
  );
};

export default TwoFA;
