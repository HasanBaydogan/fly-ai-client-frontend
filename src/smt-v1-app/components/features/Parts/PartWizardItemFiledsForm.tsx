import PhoenixDocCard from 'components/base/PhoenixDocCard';
import PaginationExample from 'pages/modules/components/PaginationExample';
import { WizardFormData } from 'pages/modules/forms/WizardExample';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PartHistoryListSection, {
  FormattedContactData
} from './HistoryList/PartHistoryListSection';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import PartTimelineGraph from './TimelineGraph/PartTimelineGraph';

import { TooltipComponent } from 'echarts/components';

const PartWizardItemFiledsForm = ({ id }: { id: string }) => {
  const methods = useWizardFormContext<WizardFormData>();
  const { formData, onChange, validation } = methods;
  const [contacts, setContacts] = useState<FormattedContactData[]>([]);

  return (
    <>
      <Row className="g-4 mb-3">
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label className="text-body">Part Number*</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Part Number"
              value={formData.name || ''}
              onChange={onChange}
              required={validation}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label>Part Name*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Part Name"
              value={formData.email || ''}
              onChange={onChange}
              required={validation}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Label>Aircraft</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>Open this select menu</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="g-4 mb-3">
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label className="text-body">Aircraft Model</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Aircraft Model"
              value={formData.name || ''}
              onChange={onChange}
              required={validation}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label>OEM</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="OEM"
              value={formData.email || ''}
              onChange={onChange}
              required={validation}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Group className="mb-2">
            <Form.Label>HS Code</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="HS Code"
              value={formData.email || ''}
              onChange={onChange}
              required={validation}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="g-3 mb-3">
        <Col sm={5}>
          <Form.Group className="mb-2 mb-sm-0">
            <Form.Label className="text-body">Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              type="password"
              name="password"
              placeholder="Type your comment"
              value={formData.password || ''}
              onChange={onChange}
              required={validation}
            />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <PartHistoryListSection
        onContactsChange={setContacts}
        initialContacts={contacts}
      />

      <PartTimelineGraph />
    </>
  );
};

export default PartWizardItemFiledsForm;
