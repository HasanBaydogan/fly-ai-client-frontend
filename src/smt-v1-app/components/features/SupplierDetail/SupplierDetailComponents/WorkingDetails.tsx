import { FloatingLabel, Form } from 'react-bootstrap';

const WorkingDetails = ({ workingDetails, setWorkingDetails }) => {
  const handleWorkingDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkingDetails(event.target.value);
  };
  return (
    <Form className="mb-5">
      <FloatingLabel controlId="floatingTextarea2" label="Working Details">
        <Form.Control
          as="textarea"
          placeholder="Details"
          style={{ height: '200px' }}
          value={workingDetails}
          onChange={handleWorkingDetails}
        />
      </FloatingLabel>
    </Form>
  );
};

export default WorkingDetails;
