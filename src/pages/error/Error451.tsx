import Button from 'components/base/Button';
import errorIllustration from 'assets/img/spot-illustrations/404-illustration.png';
import dark404illustrations from 'assets/img/spot-illustrations/dark_404-illustration.png';
import error451 from 'assets/img/spot-illustrations/451.png';
import PermissionErrorIllustration2 from 'assets/img/spot-illustrations/PermissionErrorIllustration2.png';
import darkError40 from 'assets/img/spot-illustrations/dark_404.png';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useSettingsMountEffect from 'hooks/useSettingsMountEffect';

const Error451 = () => {
  useSettingsMountEffect({
    disableNavigationType: true,
    disableHorizontalNavbarAppearance: true,
    disableVerticalNavbarAppearance: true,
    disableHorizontalNavbarShape: true
  });
  return (
    <div>
      <div className="px-3">
        <Row className="min-vh-100 flex-center p-5">
          <Col xs={12} xl={10} xxl={8}>
            <Row className="justify-content-center align-items-center g-5">
              <Col xs={12} lg={6} className="text-center order-lg-1">
                <img
                  src={PermissionErrorIllustration2}
                  alt=""
                  width={400}
                  className="img-fluid w-lg-100 d-dark-none"
                />
                <img
                  src={PermissionErrorIllustration2}
                  alt=""
                  width={540}
                  className="img-fluid w-md-50 w-lg-100 d-light-none"
                />
              </Col>
              <Col xs={12} lg={6} className="text-center text-lg-start">
                <img
                  src={error451}
                  className="img-fluid mb-6 w-50 w-lg-75 d-dark-none"
                  alt=""
                />
                <img
                  src={error451}
                  className="img-fluid mb-6 w-50 w-lg-75 d-light-none"
                  alt=""
                />
                <h2 className="text-body-secondary fw-bolder mb-3">
                  No Permission!
                </h2>
                <p className="text-body mb-5">
                  Access to the page is restricted,
                  <br className="d-none d-sm-block" />
                  plase contact your administrator for more information.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  as={Link}
                  to="/mail-tracking"
                >
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

export default Error451;
