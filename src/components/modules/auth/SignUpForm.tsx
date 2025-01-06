import Button from 'components/base/Button';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';

const SignUpForm = ({
  layout,
  handleRegister,
  isLoading,
  setIsShowToast,
  setMessageHeader,
  setMessageBodyText
}: {
  layout: 'simple' | 'card' | 'split';
  handleRegister: (user: User) => void;
  isLoading: boolean;
  setIsShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHeader: React.Dispatch<React.SetStateAction<string>>;
  setMessageBodyText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  function isValidEmail(email: string) {
    // A commonly used email validation regex pattern (though not perfect)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  const handleRegisterFields = e => {
    e.preventDefault();
    if (!name.trim()) {
      toastError('Enter your name');
    } else if (!surname.trim()) {
      toastError('Enter your surname');
    } else if (!email.trim() || !isValidEmail(email)) {
      toastError('Invalid Email!');
    } else if (password.includes(' ')) {
      toastError('Password has empty character!');
    } else if (password.trim().length < 8) {
      toastError('Password has at least 8 character!');
    } else if (password !== repeatPassword) {
      toastError('Passwords are not same!');
    } else if (!isChecked) {
      toastError('Confirm terms and privacy!');
    } else {
      const user = {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        password: password.trim()
      };

      handleRegister(user);
    }
  };
  function toastError(message: string) {
    setMessageHeader('Invalid Field');
    setMessageBodyText(message);
    setIsShowToast(true);
  }

  return (
    <>
      <div className="text-center mb-3">
        <h3 className="text-body-highlight">Sign Up</h3>
        <p className="text-body-tertiary">Create your account today</p>
      </div>
      <Form>
        <Form.Group className="mb-2 text-start">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2 text-start">
          <Form.Label htmlFor="surname">Surname</Form.Label>
          <Form.Control
            id="surname"
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={e => setSurname(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2 text-start">
          <Form.Label htmlFor="email">Email address</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Form.Group>
        <Row className="g-3 mb-3">
          <Col sm={layout === 'card' ? 12 : 6} lg={6}>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col sm={layout === 'card' ? 12 : 6} lg={6}>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">
                Confirm Password
              </Form.Label>
              <Form.Control
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Check type="checkbox" className="mb-3">
          <Form.Check.Input
            type="checkbox"
            name="termsService"
            id="termsService"
            checked={isChecked}
            onChange={e => setIsChecked(e.target.checked)}
          />
          <Form.Check.Label
            htmlFor="termsService"
            className="fs-9 text-transform-none"
          >
            I accept the{' '}
            <Link to="/privacy-policy" target="_blank">
              terms{' '}
            </Link>
            and{' '}
            <Link to="/privacy-policy" target="_blank">
              privacy policy
            </Link>
          </Form.Check.Label>
        </Form.Check>
        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={handleRegisterFields}
          disabled={isLoading}
        >
          {isLoading ? <LoadingAnimation /> : 'Sign up'}
        </Button>
        <div className="text-center">
          <Link to={`/`} className="fs-9 fw-bold">
            Sign in to an existing account
          </Link>
        </div>
      </Form>
    </>
  );
};

export default SignUpForm;
