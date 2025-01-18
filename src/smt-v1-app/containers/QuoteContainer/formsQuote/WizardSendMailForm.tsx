import React from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

const WizardSendMailForm = () => {
  return (
    <div className="p-4">
      {/* To, CC, BCC Fields */}
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md={12}>
            <Form.Label>To</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter recipient emails"
              multiple
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>CC</Form.Label>
            <Form.Control type="text" placeholder="Enter CC emails" />
          </Form.Group>
          <Form.Group as={Col} md={6}>
            <Form.Label>BCC</Form.Label>
            <Form.Control type="text" placeholder="Enter BCC emails" />
          </Form.Group>
        </Row>

        {/* Subject */}
        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subject (e.g., RFQ Number)"
          />
        </Form.Group>

        {/* Attachments Section */}
        <div className="border p-3 mb-3">
          <h5>Attachments</h5>
          <Row>
            <Col md={8}></Col>
            <Col md={4} className="text-end">
              <Button variant="success">Add Attachment +</Button>
            </Col>
          </Row>
        </div>

        {/* Message Body */}
        <Form.Group className="mb-3">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={8}
            placeholder="Type your message here..."
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default WizardSendMailForm;
