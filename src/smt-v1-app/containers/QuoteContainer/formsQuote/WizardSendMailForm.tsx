import React from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import TinymceEditor from 'components/base/TinymceEditor';
import Dropzone from 'components/base/Dropzone';

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
          <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)} />
        </div>

        {/* Message Body */}
        <Form.Group className="mb-3">
          <TinymceEditor
            options={{
              height: '20rem'
            }}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default WizardSendMailForm;
