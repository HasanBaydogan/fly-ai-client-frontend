import { useState } from 'react';
import { Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const AccountInfo = ({ username, setUsername, password, setPassword }) => {
  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <Form>
      <Form.Group className="mt-3">
        <Form.Label className="fw-bold fs-8">Account Information</Form.Label>
      </Form.Group>

      <Form.Group className="d-flex flex-row gap-5 mt-2">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="User Name"
            value={username}
            onChange={handleUsername}
          />
        </Col>
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
          />
        </Col>
      </Form.Group>
    </Form>
  );
};

export default AccountInfo;
