import { Row, Col, Form } from 'react-bootstrap';

interface ContactStatusSectionProps {
  selectedStatus: string;
  setContactStatus: (value: string) => void;
  contactNotes: string;
  setContactNotes: (value: string) => void;
}

const ContactStatusSection = ({
  selectedStatus,
  setContactStatus,
  contactNotes,
  setContactNotes
}: ContactStatusSectionProps) => {
  return (
    <Form className="mb-5">
      <Row className="align-items-center">
        <Col md={4} sm={12} className="mb-2 mb-md-0">
          <Form.Select
            value={selectedStatus}
            onChange={e => setContactStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="CONTACTED">Contacted</option>
            <option value="NOT_CONTACTED">Not Contacted</option>
            <option value="BLACK_LISTED">Black List</option>
          </Form.Select>
        </Col>
        <Col md={8} sm={12}>
          <Form.Control
            type="text"
            placeholder="Contact Notes"
            value={contactNotes}
            onChange={e => setContactNotes(e.target.value)}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default ContactStatusSection;
