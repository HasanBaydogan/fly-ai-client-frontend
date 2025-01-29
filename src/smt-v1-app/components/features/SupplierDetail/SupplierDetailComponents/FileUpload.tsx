import Form from 'react-bootstrap/Form';

const FileUpload = () => {
  return (
    <Form.Group controlId="formFileMultiple" className="my-3">
      <Form.Label>Multiple files input example</Form.Label>
      <Form.Control type="file" size="lg" multiple />
    </Form.Group>
  );
};

export default FileUpload;
