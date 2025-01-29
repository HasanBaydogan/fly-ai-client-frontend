import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const AccountInfo = () => {
  return (
    <Form>
      <Form.Group className="mt-3">
        <Form.Label className="fw-bold fs-8">Account Information</Form.Label>
      </Form.Group>

      <Form.Group className="d-flex flex-row gap-5 mt-2">
        <Col md={6}>
          <Form.Control type="text" placeholder="User Name" />
        </Col>
        <Col md={5}>
          <Form.Control type="text" placeholder="Password" />
        </Col>
      </Form.Group>
    </Form>
  );
};

export default AccountInfo;
