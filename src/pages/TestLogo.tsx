import { Card, Col, Row } from 'react-bootstrap';
import NavbarBrand from 'components/navbars/nav-items/NavbarBrand';
import defaultLogo from 'assets/img/icons/FlyAI-Logo.png';
import asparelLogo from 'assets/img/icons/asparelLogo.jpg';

const TestLogo = () => {
  return (
    <div className="p-4">
      <h2>Logo Test Sayfası</h2>

      <Row className="g-3">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Varsayılan Logo (FlyAI)</h5>
            </Card.Header>
            <Card.Body>
              <NavbarBrand />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Özel Logo (Asparel)</h5>
            </Card.Header>
            <Card.Body>
              <NavbarBrand logo={asparelLogo} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Logo Dosyaları</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>FlyAI Logo:</strong>
                <img
                  src={defaultLogo}
                  alt="FlyAI"
                  style={{ maxHeight: '50px', marginLeft: '10px' }}
                />
              </div>
              <div>
                <strong>Asparel Logo:</strong>
                <img
                  src={asparelLogo}
                  alt="Asparel"
                  style={{ maxHeight: '50px', marginLeft: '10px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Logo Bilgileri</h5>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>FlyAI Logo Yolu:</strong> {defaultLogo}
              </p>
              <p>
                <strong>Asparel Logo Yolu:</strong> {asparelLogo}
              </p>
              <p>
                <strong>Logo Boyutu:</strong> 120x40px (responsive)
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TestLogo;
