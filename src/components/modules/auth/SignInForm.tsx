import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'components/base/Button';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const SignInForm = ({
  layout,
  isLoading,
  handleLogin,
  setEmail,
  setIsShowToast,
  setMessageHeader,
  setMessageBodyText,
  setVariant
}: {
  layout: 'simple' | 'card' | 'split';
  isLoading: boolean;
  handleLogin: (email: string, password: string) => void;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setIsShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
  setVariant: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [localEmail, setLocalEmail] = useState('');
  const [password, setPassword] = useState('');

  function isValidEmail(email: string) {
    // A commonly used email validation regex pattern (though not perfect)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleLocalLogin = e => {
    e.preventDefault();
    console.log(localEmail + ' ' + password);
    if (!localEmail.trim() || !password || !isValidEmail(localEmail)) {
      setVariant('danger');
      setMessageHeader('Invalid Email or Password!');
      setMessageBodyText('Check Email or Password');
      setIsShowToast(true);
    } else {
      handleLogin(localEmail, password);
      setEmail(localEmail);
    }
  };

  return (
    <>
      <div className="text-center mb-7">
        <h3 className="text-body-highlight">Sign In</h3>
        <p className="text-body-tertiary">Get access to your account</p>
      </div>
      <Form.Group className="mb-3 text-start">
        <Form.Label htmlFor="email">Email address</Form.Label>
        <div className="form-icon-container">
          <Form.Control
            id="email"
            type="email"
            className="form-icon-input"
            placeholder="name@example.com"
            value={localEmail}
            onChange={e => setLocalEmail(e.target.value)}
          />
          <FontAwesomeIcon icon={faUser} className="text-body fs-9 form-icon" />
        </div>
      </Form.Group>
      <Form.Group className="mb-3 text-start">
        <Form.Label htmlFor="password">Password</Form.Label>
        <div className="form-icon-container">
          <Form.Control
            id="password"
            type="password"
            className="form-icon-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <FontAwesomeIcon icon={faKey} className="text-body fs-9 form-icon" />
        </div>
      </Form.Group>
      <Row className="flex-between-center mb-7">
        <Col xs="auto">
          <Form.Check type="checkbox" className="mb-0">
            <Form.Check.Input
              type="checkbox"
              name="remember-me"
              id="remember-me"
              defaultChecked
            />
            <Form.Check.Label htmlFor="remember-me" className="mb-0">
              Remember me
            </Form.Check.Label>
          </Form.Check>
        </Col>
        <Col xs="auto">
          <Link to={`/forget-password`} className="fs-9 fw-semibold">
            Forgot Password?
          </Link>
        </Col>
      </Row>
      <Button
        variant="primary"
        className="w-100 mb-3"
        disabled={isLoading}
        onClick={handleLocalLogin}
      >
        {isLoading ? <LoadingAnimation /> : 'Sign In'}
      </Button>
      <div className="text-center">
        <Link to={`/register`} className="fs-9 fw-bold">
          Create an account
        </Link>
      </div>
    </>
  );
};

export default SignInForm;
