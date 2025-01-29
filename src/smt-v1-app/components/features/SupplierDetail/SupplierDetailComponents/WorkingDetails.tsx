import { FloatingLabel, Form } from 'react-bootstrap';

const WorkingDetails = () => {
  return (
    <Form>
      <FloatingLabel controlId="floatingTextarea2" label="Working Details">
        <Form.Control
          as="textarea"
          placeholder="Details"
          style={{ height: '100px' }}
        />
      </FloatingLabel>
    </Form>
  );
};

export default WorkingDetails;
