import { FloatingLabel, Form } from 'react-bootstrap';

const WorkingDetails = ({ workingDetails, setWorkingDetails }) => {
  const handleWorkingDetails = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkingDetails(event.target.value);
  };
  return (
    <Form className="mt-5">
      <FloatingLabel controlId="floatingTextarea2" label="Working Details">
        <Form.Control
          as="textarea"
          placeholder="Details"
          style={{ height: '100px' }}
          value={workingDetails}
          onChange={handleWorkingDetails}
        />
      </FloatingLabel>
    </Form>
  );
};

export default WorkingDetails;
