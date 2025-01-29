import { Col, Form } from 'react-bootstrap';
import SupplierDetailContactList from '../SupplierDetailContactList/SupplierDetailContactList';

const ContactListSection = () => {
  return (
    <Form>
      <Col md={12}>
        <Form.Group className="mt-5 mx-5 ">
          <Form.Label className="fw-bold fs-7">Contact List</Form.Label>
        </Form.Group>
        <SupplierDetailContactList />
      </Col>
    </Form>
  );
};

export default ContactListSection;
