import { useAppContext } from 'providers/AppProvider';
import { Button, Card, Col, Row } from 'react-bootstrap';
import useConfigMountEffect from 'hooks/useConfigMountEffect';
import NavbarDual from 'components/navbars/navbar-dual/NavbarDual';

const TestDualNavbar = () => {
  const {
    config: { navbarPosition },
    setConfig
  } = useAppContext();

  const testDualNavbar = () => {
    setConfig({
      navbarPosition: 'dual'
    });
  };

  const testOtherNavbars = (position: 'vertical' | 'horizontal' | 'combo') => {
    setConfig({
      navbarPosition: position
    });
  };

  return (
    <div className="p-4">
      <h2>Dual Navbar Test Sayfası</h2>
      <p>
        Mevcut navbar pozisyonu: <strong>{navbarPosition}</strong>
      </p>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Button
            variant={navbarPosition === 'dual' ? 'primary' : 'outline-primary'}
            onClick={testDualNavbar}
            className="w-100"
          >
            Dual Navbar Test Et
          </Button>
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => testOtherNavbars('vertical')}
            className="w-100"
          >
            Vertical Navbar
          </Button>
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => testOtherNavbars('horizontal')}
            className="w-100"
          >
            Horizontal Navbar
          </Button>
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => testOtherNavbars('combo')}
            className="w-100"
          >
            Combo Navbar
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Dual Navbar Özellikleri</h5>
            </Card.Header>
            <Card.Body>
              <ul>
                <li>Logo sol tarafta</li>
                <li>Searchbox ortada</li>
                <li>User menu sağ tarafta</li>
                <li>Navigation menu alt kısımda</li>
                <li>Responsive tasarım</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Test NavbarDual Bileşeni</h5>
            </Card.Header>
            <Card.Body>
              <NavbarDual userId="test-user" userFullName="Test User" logo="" />
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Header>
              <h5>Debug Bilgileri</h5>
            </Card.Header>
            <Card.Body>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify({ navbarPosition }, null, 2)}
              </pre>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TestDualNavbar;
