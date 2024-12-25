import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Button from 'components/base/Button';
import { Form } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
//import { Link } from 'react-router-dom';

const ForgotPasswordForm = ({
  layout,
  setEmail,
  handleEmail,
  isLoading
}: {
  layout?: 'simple' | 'card' | 'split';
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  handleEmail: () => void;
  isLoading: boolean;
}) => {
  return (
    <div className={classNames({ 'px-xxl-5': !(layout === 'split') })}>
      <div
        className={classNames('text-center', { 'mb-6': !(layout === 'split') })}
      >
        <h4 className="text-body-highlight">Forgot your password?</h4>
        <p className="text-body-tertiary mb-5">
          Enter your email below and we will send <br className="d-sm-none" />
          you a code to reset it.
        </p>
        <Form className="d-flex align-items-center mb-5">
          <Form.Control
            type="email"
            id="email"
            className="flex-1"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            variant="primary"
            className="ms-2"
            endIcon={
              isLoading ? null : (
                <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
              )
            }
            onClick={handleEmail}
          >
            {isLoading ? <LoadingAnimation /> : 'Send'}
          </Button>
        </Form>
        {/*<Link to="#!" className="fs-9 fw-bold">
          Still having problems?
        </Link> */}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
