import React from 'react';
import Button from 'components/base/Button';
import errorIllustration from 'assets/img/spot-illustrations/404-illustration.png';
import dark404illustrations from 'assets/img/spot-illustrations/dark_404-illustration.png';
import error404 from 'assets/img/spot-illustrations/404.png';
import darkError40 from 'assets/img/spot-illustrations/dark_404.png';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const AlreadyOpenedRfqBySomeoneError = () => {
  return (
    <div>
      <div className="px-3">
        <Row className="min-vh-100 flex-center p-5">
          <Col xs={12} xl={10} xxl={8}>
            <Row className="justify-content-center align-items-center g-5">
              <Col xs={12} lg={6} className="text-center order-lg-1">
                <img
                  src={errorIllustration}
                  alt=""
                  width={400}
                  className="img-fluid w-lg-100 d-dark-none"
                />
                <img
                  src={dark404illustrations}
                  alt=""
                  width={540}
                  className="img-fluid w-md-50 w-lg-100 d-light-none"
                />
              </Col>
              <Col xs={12} lg={6} className="text-center text-lg-start">
                <h2 className="text-body-secondary fw-bolder mb-3">
                  Not Allowed RFQ
                </h2>
                <p className="text-body mb-5">
                  You cannot open RFQ when someone opens it already
                  <br className="d-none d-sm-block" />
                  Someone already open that RFQ
                </p>
                <Button variant="primary" size="lg" as={Link} to="/pi/list">
                  Go Home
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AlreadyOpenedRfqBySomeoneError;
