import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const SupplierInfo = () => {
  return (
    <Form>
      <Form.Group className="mt-3">
        <Form.Label className="fw-bold fs-8">Supplier Information</Form.Label>
      </Form.Group>

      <Form.Group className="d-flex flex-row gap-5 mt-2">
        <Col md={12}>
          <Form.Control type="text" placeholder="Company Name" />
        </Col>
      </Form.Group>
    </Form>
  );
};

export default SupplierInfo;
