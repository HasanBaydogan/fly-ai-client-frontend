import { UilCheckCircle } from '@iconscout/react-unicons';
import Unicon from 'components/base/Unicon';
import { Card, Col, Container, Row } from 'react-bootstrap';
import bg37 from 'assets/img/bg/37.png';
import flyAiBlue from 'assets/img/bg/flyAiBlue.png';
import bg99 from 'assets/img/bg/bg99Alternative.jpg';
import loginBg from '../assets/img/bg/login-bg.svg';
import authIllustrations from 'assets/img/spot-illustrations/auth.png';
import authIllustrationsDark from 'assets/img/spot-illustrations/auth-dark.png';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'components/common/Logo';
import classNames from 'classnames';
import './AuthCardLayout.css';

interface AuthCardLayoutProps {
  logo?: boolean;
  className?: string;
}

const AuthCardLayout = ({
  logo = true,
  className,
  children
}: PropsWithChildren<AuthCardLayoutProps>) => {
  return (
    <Container fluid className="bg-body-tertiary dark__bg-gray-1200">
      <div
        className="bg-holder bg-auth-card-overlay"
        style={{ backgroundImage: `url(${bg37})` }}
      />

      <Row className="flex-center position-relative min-vh-100 g-0 py-5">
        <Col xs={11} sm={10} xl={8}>
          <Card className="border border-translucent auth-card">
            <Card.Body className="pe-md-0">
              <Row className=" gx-0 ">
                <Col
                  xs="auto"
                  className="rounded-3 position-relative auth-title-box"
                  style={{
                    backgroundImage: `url(${bg99})`,
                    backgroundSize: 'cover', // veya 'contain' tercihinize göre
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '500px', // Görselin doğal yüksekliğine göre ayarlayın
                    overflow: 'hidden'
                  }}
                >
                  <div
                    className={classNames(
                      className,
                      'position-relative px-4 px-lg-7 py-7 pb-sm-5 text-center text-md-start pb-lg-7 text-overlay'
                    )}
                    style={{ zIndex: 2 }}
                  >
                    <h3
                      className="mb-3 text-body-emphasis fs-7"
                      id="loginPgaeLeftHeader"
                    >
                      Aviation Powered by AI
                    </h3>
                    <p className="text-body-tertiary" id="loginPgaeLeftSubText">
                      Data management of supply-chain operations is ready to
                      take off
                    </p>
                    <p className="text-body-tertiary" id="loginPgaeLeftSubText">
                      Self learning software tools based on relative
                      integrations leads to uncompetitive capabilities with AI
                    </p>
                    {/* <ul className="list-unstyled mb-0 w-max-content w-md-auto mx-auto">
                      <li className="d-flex align-items-center gap-2">
                        <Unicon
                          icon={UilCheckCircle}
                          className="text-success"
                          size={16}
                        />
                        <span className="text-body-tertiary fw-semibold">
                          Rapid Results
                        </span>
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <Unicon
                          icon={UilCheckCircle}
                          className="text-success"
                          size={16}
                        />
                        <span className="text-body-tertiary fw-semibold">
                          Embrace Simplicity
                        </span>
                      </li>
                      <li className="d-flex align-items-center gap-2">
                        <Unicon
                          icon={UilCheckCircle}
                          className="text-success"
                          size={16}
                        />
                        <span className="text-body-tertiary fw-semibold">
                          Data Beyond Limits
                        </span>
                      </li>
                    </ul> */}
                  </div>
                </Col>
                <Col className="mx-auto">
                  {logo && (
                    <div className="text-center">
                      <Link
                        to="/"
                        className="d-inline-block text-decoration-none mb-4"
                      >
                        <Logo
                          text={false}
                          width={300}
                          className="fw-bolder fs-5 d-inline-block"
                        />
                      </Link>
                    </div>
                  )}
                  <div className="auth-form-box">{children}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthCardLayout;
