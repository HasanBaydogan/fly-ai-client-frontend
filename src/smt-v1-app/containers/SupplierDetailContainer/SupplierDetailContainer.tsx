import React, { useState } from 'react';
import { Col, FloatingLabel } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import CustomButton from '../../../components/base/Button';
import AdvanceTableFooter from '../../../components/base/AdvanceTableFooter';
import AdvanceTable from '../../../components/base/AdvanceTable';
import SupplierDetailContactList from '../../components/features/SupplierDetailContactList/SupplierDetailContactList';
import {
  ContactList,
  ContactData
} from '../../components/features/SupplierDetailContactList/SupplierDetailContactList';
import Select from 'react-select';
import { mockSegments } from './segmentMockData';
import { TreeSelect } from '../../components/features/SupplierDetailSegmentTreeSelect/SupplierDetailSegmentTreeSelect';

interface Segment {
  segmentId: string;
  segmentName: string;
  subSegments: Segment[];
}

const SupplierDetailContainer = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const yourData: ContactData[] = [
    {
      name: '',
      email: '',
      phone: '',
      contactname: '',
      title: 30
    }
  ];

  const handleEmailChange = (selected: any[]) => {
    const lastEmail = selected[selected.length - 1]?.label;
    const currentEmails = selected.slice(0, -1).map(item => item.label);

    if (lastEmail && currentEmails.includes(lastEmail)) {
      setError(`Email address "${lastEmail}" is already added.`);
      setEmails(currentEmails);
      return;
    }

    setError('');
    const uniqueEmails = [...new Set(selected.map(item => item.label))];
    setEmails(uniqueEmails);
  };

  // Recursive function to flatten segments into options
  const flattenSegments = (
    segments: Segment[]
  ): { value: string; label: string }[] => {
    return segments.reduce(
      (acc: { value: string; label: string }[], segment) => {
        return [
          ...acc,
          { value: segment.segmentId, label: segment.segmentName },
          ...flattenSegments(segment.subSegments)
        ];
      },
      []
    );
  };

  const handleSegmentSelect = (segmentId: string) => {
    setSelectedSegments(prev => {
      if (prev.includes(segmentId)) {
        return prev.filter(id => id !== segmentId);
      }
      return [...prev, segmentId];
    });
  };

  return (
    <>
      <Form>
        <Form.Group className="mt-3">
          <Form.Label className="fw-bold fs-8">Supplier Information</Form.Label>
        </Form.Group>

        <Form.Group className="d-flex flex-row gap-5 mt-2">
          <Col md={7}>
            <Form.Control type="text" placeholder="Company Name" />
          </Col>
          <Col md={4}>
            <Form.Control type="text" placeholder="Quote Id" />
          </Col>
        </Form.Group>
      </Form>

      <Form>
        <Form.Group className="mb-5 mt-3">
          <Form.Label>Segments</Form.Label>
          <TreeSelect
            data={mockSegments}
            onSelect={handleSegmentSelect}
            selectedIds={selectedSegments}
          />
        </Form.Group>
      </Form>

      <Form>
        <FloatingLabel controlId="floatingTextarea2" label="Pick Up Address">
          <Form.Control
            as="textarea"
            placeholder="Address"
            style={{ height: '100px' }}
          />
        </FloatingLabel>
      </Form>
      <Form>
        {/* Select Country Dropdown */}
        <Form.Group className="d-flex flex-row gap-5 mt-3 mb-5">
          <Col md={5}>
            <Form.Label>Email Addresses</Form.Label>
            <Typeahead
              id="supplier-emails"
              labelKey="label"
              multiple
              allowNew={(results, props) => {
                const text = props.text;
                return (
                  !results.some(r =>
                    typeof r === 'string' ? r === text : r.label === text
                  ) && isValidEmail(text)
                );
              }}
              newSelectionPrefix="Add email: "
              options={emails.map(email => ({ label: email }))}
              placeholder="Add supplier emails"
              selected={emails.map(email => ({ label: email }))}
              onChange={handleEmailChange}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Select Country</Form.Label>
            <Form.Control as="select">
              <option value="" disabled>
                -- Select Country --
              </option>
              <option value="TR">Turkiye</option>
              <option value="USA">United States</option>
              <option value="CAN">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="IND">India</option>
              <option value="AUS">Australia</option>
            </Form.Control>
          </Col>
          <Col md={3}>
            <Form.Label>Status</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>Select Status</option>
              <option value="not-contacted">Not Contacted</option>
              <option value="contacted">Contacted</option>
              <option value="black-listed">Black Listed</option>
            </Form.Select>
          </Col>
          {error && <Form.Text className="text-danger">{error}</Form.Text>}
        </Form.Group>
      </Form>

      <Form>
        <FloatingLabel controlId="floatingTextarea2" label="Working Details">
          <Form.Control
            as="textarea"
            placeholder="Address"
            style={{ height: '100px' }}
          />
        </FloatingLabel>
      </Form>
      <Form>
        <Form.Group className="mt-3">
          <Form.Label className="fw-bold fs-8">Account Information</Form.Label>
        </Form.Group>

        <Form.Group className="d-flex flex-row gap-5 mt-2">
          <Col md={6}>
            <Form.Control type="text" placeholder="User Name" />
          </Col>
          <Col md={5}>
            <Form.Control type="text" placeholder="Password" />
          </Col>
        </Form.Group>
      </Form>
      <Form>
        <Col md={12}>
          <Form.Group className="mt-5 mx-5 ">
            <Form.Label className="fw-bold fs-7">Contact List</Form.Label>
          </Form.Group>
          <SupplierDetailContactList />
        </Col>
      </Form>
      <div>
        <div className="d-flex mt-3 gap-3 mx-5 justify-content-end">
          <CustomButton
            variant="secondary"
            onClick={() => {
              // Handle Go to RFQ Mail click
              console.log('Go to RFQ Mail clicked');
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="success"
            onClick={() => {
              // Handle Quote Wizard click
              console.log('Quote Wizard clicked');
            }}
          >
            Save
          </CustomButton>
        </div>
      </div>
    </>
  );
};

export default SupplierDetailContainer;
