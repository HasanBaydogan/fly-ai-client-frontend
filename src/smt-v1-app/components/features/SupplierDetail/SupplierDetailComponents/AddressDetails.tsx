import { Col, FloatingLabel, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const AddressDetails = () => {
  return (
    <Col md={12} className="mt-2">
      <FloatingLabel controlId="floatingTextarea2" label="Pick Up Address">
        <Form.Control
          as="textarea"
          placeholder="Address"
          style={{ height: '100px' }}
        />
      </FloatingLabel>

      <Row className="mt-3">
        <Col md={6}>
          <Form.Label>Select Country</Form.Label>
          <Form.Select>
            <option value="" disabled>
              -- Select Country --
            </option>
            <option value="TR">Turkiye</option>
            <option value="USA">United States</option>
            <option value="CAN">Canada</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>Status</Form.Label>
          <Form.Select>
            <option>Select Status</option>
            <option value="not-contacted">Not Contacted</option>
            <option value="contacted">Contacted</option>
          </Form.Select>
        </Col>
      </Row>

      <Col md={12} className="mt-3 mb-5">
        <Form.Label>Certificates</Form.Label>
        <Form.Control type="text" />
      </Col>
    </Col>
  );
};

export default AddressDetails;
