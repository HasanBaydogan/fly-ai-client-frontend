import Button from 'components/base/Button';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SignUpForm = ({
  layout,
  handleRegister
}: {
  layout: 'simple' | 'card' | 'split';
  handleRegister: () => void;
}) => {
  return (
    <>
      <div className="text-center mb-3">
        <h3 className="text-body-highlight">Sign Up</h3>
        <p className="text-body-tertiary">Create your account today</p>
      </div>
      <Form>
        <Form.Group className="mb-2 text-start">
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control id="name" type="text" placeholder="Name" />
        </Form.Group>
        <Form.Group className="mb-2 text-start">
          <Form.Label htmlFor="surname">Surname</Form.Label>
          <Form.Control id="surname" type="text" placeholder="Surname" />
        </Form.Group>
        <Form.Group className="mb-2 text-start">
          <Form.Label htmlFor="email">Email address</Form.Label>
          <Form.Control
            id="email"
            type="email"
            placeholder="name@example.com"
          />
        </Form.Group>
        <Row className="g-3 mb-3">
          <Col sm={layout === 'card' ? 12 : 6} lg={6}>
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control id="password" type="text" placeholder="Password" />
            </Form.Group>
          </Col>
          <Col sm={layout === 'card' ? 12 : 6} lg={6}>
            <Form.Group>
              <Form.Label htmlFor="confirmPassword">
                Confirm Password
              </Form.Label>
              <Form.Control
                id="confirmPassword"
                type="text"
                placeholder="Confirm Password"
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Check type="checkbox" className="mb-3">
          <Form.Check.Input
            type="checkbox"
            name="termsService"
            id="termsService"
          />
          <Form.Check.Label
            htmlFor="termsService"
            className="fs-9 text-transform-none"
          >
            I accept the <Link to="#!">terms </Link>and{' '}
            <Link to="#!">privacy policy</Link>
          </Form.Check.Label>
        </Form.Check>
        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={handleRegister}
        >
          Sign up
        </Button>
        <div className="text-center">
          <Link to={`/auth/sign-in`} className="fs-9 fw-bold">
            Sign in to an existing account
          </Link>
        </div>
      </Form>
    </>
  );
};

export default SignUpForm;
