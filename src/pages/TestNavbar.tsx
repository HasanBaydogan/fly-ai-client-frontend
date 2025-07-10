import { useAppContext } from 'providers/AppProvider';
import { Button, Card, Col, Row } from 'react-bootstrap';
import useConfigMountEffect from 'hooks/useConfigMountEffect';

const TestNavbar = () => {
  const {
    config: { navbarPosition },
    setConfig
  } = useAppContext();

  const testNavbarPosition = (
    position: 'vertical' | 'horizontal' | 'combo' | 'dual'
  ) => {
    setConfig({
      navbarPosition: position
    });
  };

  return (
    <div className="p-4">
      <h2>Navbar Test Sayfası</h2>
      <p>
        Mevcut navbar pozisyonu: <strong>{navbarPosition}</strong>
      </p>

      <Row className="g-3">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Vertical Navbar</Card.Title>
              <Card.Text>Sol tarafta dikey menü</Card.Text>
              <Button
                variant={
                  navbarPosition === 'vertical' ? 'primary' : 'outline-primary'
                }
                onClick={() => testNavbarPosition('vertical')}
              >
                Test Et
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Horizontal Navbar</Card.Title>
              <Card.Text>Üst kısımda yatay menü</Card.Text>
              <Button
                variant={
                  navbarPosition === 'horizontal'
                    ? 'primary'
                    : 'outline-primary'
                }
                onClick={() => testNavbarPosition('horizontal')}
              >
                Test Et
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Combo Navbar</Card.Title>
              <Card.Text>Hem üst hem sol menü</Card.Text>
              <Button
                variant={
                  navbarPosition === 'combo' ? 'primary' : 'outline-primary'
                }
                onClick={() => testNavbarPosition('combo')}
              >
                Test Et
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Dual Navbar</Card.Title>
              <Card.Text>Çift katmanlı navbar</Card.Text>
              <Button
                variant={
                  navbarPosition === 'dual' ? 'primary' : 'outline-primary'
                }
                onClick={() => testNavbarPosition('dual')}
              >
                Test Et
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4">
        <h4>Debug Bilgileri:</h4>
        <pre className="bg-light p-3 rounded">
          {JSON.stringify({ navbarPosition }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestNavbar;
