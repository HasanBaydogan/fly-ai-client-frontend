import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import TinymceEditor from 'components/base/TinymceEditor';
import Dropzone from 'components/base/Dropzone';
import { useMail } from './MailContext';

const WizardSendMailForm: React.FC = ({ onNext }: { onNext: () => void }) => {
  const { setMailData } = useMail();
  const [toEmails, setToEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    setMailData({
      to: toEmails,
      cc: ccEmails,
      bcc: bccEmails,
      subject,
      content,
      attachments,
      quoteId: 'Q-2323123',
      rfqId: 'RFQ-2323123'
    });
    onNext();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && isValidEmail(trimmedValue)) {
        setEmailList([...emailList, trimmedValue]);
        setInputValue('');
      }
    }
  };

  const handleRemoveEmail = (
    index: number,
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setEmailList(emailList.filter((_, i) => i !== index));
  };

  const renderEmailTags = (
    emailList: string[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {emailList.map((email, index) => (
          <div
            key={index}
            style={{
              background: '#e0f7fa',
              borderRadius: '4px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {email}
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#d32f2f',
                marginLeft: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleRemoveEmail(index, emailList, setEmailList)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} md={12}>
            <Form.Label>To</Form.Label>
            {renderEmailTags(toEmails, setToEmails)}
            <Form.Control
              type="text"
              placeholder="Add recipient emails"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e, toEmails, setToEmails)
              }
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>CC</Form.Label>
            {renderEmailTags(ccEmails, setCcEmails)}
            <Form.Control
              type="text"
              placeholder="Add CC emails"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e, ccEmails, setCcEmails)
              }
            />
          </Form.Group>
          <Form.Group as={Col} md={6}>
            <Form.Label>BCC</Form.Label>
            {renderEmailTags(bccEmails, setBccEmails)}
            <Form.Control
              type="text"
              placeholder="Add BCC emails"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(e, bccEmails, setBccEmails)
              }
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control type="text" placeholder="Enter subject" />
        </Form.Group>

        <div className="border p-3 mb-3">
          <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)} />
        </div>

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
