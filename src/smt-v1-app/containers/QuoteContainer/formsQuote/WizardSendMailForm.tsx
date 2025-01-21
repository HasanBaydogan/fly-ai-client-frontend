import React, { useState } from 'react';
import { Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import TinymceEditor from 'components/base/TinymceEditor';
import Dropzone from 'components/base/Dropzone';
import { useMail } from './MailContext';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { defaultMailTemplate } from './defaultMailTemplate';
import { MailProvider } from './MailContext';
import ReviewMail from './ReviewMail';

const MAX_TOTAL_SIZE = 22 * 1024 * 1024; // 22MB in bytes

interface WizardSendMailFormProps {
  onNext?: () => void;
}

const WizardSendMailForm: React.FC<WizardSendMailFormProps> = ({ onNext }) => {
  const { setMailData } = useMail();
  const [toEmails, setToEmails] = useState<string[]>([]);
  const [ccEmails, setCcEmails] = useState<string[]>([]);
  const [bccEmails, setBccEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>(defaultMailTemplate);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    const mailDataToSend = {
      to: toEmails,
      cc: ccEmails,
      bcc: bccEmails,
      subject,
      content,
      attachments,
      quoteId: 'Q-2323123',
      rfqId: 'RFQ-2323123'
    };

    setMailData(mailDataToSend);
    if (onNext) onNext();
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

  const handleDrop = (acceptedFiles: File[]) => {
    const totalSize = acceptedFiles.reduce(
      (acc, file) => acc + file.size,
      attachments.reduce((acc, file) => acc + file.size, 0)
    );

    if (totalSize > MAX_TOTAL_SIZE) {
      setError('Total attachment size cannot exceed 22MB.');
      return;
    }

    setError(null); // Hata mesajını sıfırla
    setAttachments(prev => [...prev, ...acceptedFiles]);
  };

  return (
    <div className="p-4">
      <Form>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="mb-3">
          <Form.Group as={Col} md={12}>
            <Form.Label>To</Form.Label>
            <Typeahead
              id="to-emails"
              labelKey={(option: any) => {
                if (typeof option === 'string') return option;
                if (typeof option === 'object' && option.email)
                  return option.email;
                if (typeof option === 'object' && option.label)
                  return option.label;
                return '';
              }}
              multiple
              allowNew
              newSelectionPrefix="Add new email: "
              options={toEmails}
              placeholder="Add recipient emails"
              selected={toEmails}
              onChange={(selected: any[]) => {
                setToEmails(
                  selected.map(item => {
                    if (typeof item === 'string') {
                      return item;
                    } else if ('customOption' in item) {
                      return item.label;
                    } else {
                      return item;
                    }
                  })
                );
              }}
              onInputChange={text => {
                if (!isValidEmail(text)) {
                  setError('Please enter a valid email address');
                } else {
                  setError(null);
                }
              }}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>CC</Form.Label>
            <Typeahead
              id="cc-emails"
              labelKey={(option: any) => {
                if (typeof option === 'string') return option;
                if (typeof option === 'object' && option.email)
                  return option.email;
                if (typeof option === 'object' && option.label)
                  return option.label;
                return '';
              }}
              multiple
              allowNew
              newSelectionPrefix="Add new email: "
              options={ccEmails}
              placeholder="Add CC emails"
              selected={ccEmails}
              onChange={(selected: any[]) => {
                setCcEmails(
                  selected.map(item => {
                    if (typeof item === 'string') {
                      return item;
                    } else if ('customOption' in item) {
                      return item.label;
                    } else {
                      return item;
                    }
                  })
                );
              }}
            />
          </Form.Group>
          <Form.Group as={Col} md={6}>
            <Form.Label>BCC</Form.Label>
            <Typeahead
              id="bcc-emails"
              labelKey={(option: any) => {
                if (typeof option === 'string') return option;
                if (typeof option === 'object' && option.email)
                  return option.email;
                if (typeof option === 'object' && option.label)
                  return option.label;
                return '';
              }}
              multiple
              allowNew
              newSelectionPrefix="Add new email: "
              options={bccEmails}
              placeholder="Add BCC emails"
              selected={bccEmails}
              onChange={(selected: any[]) => {
                setBccEmails(
                  selected.map(item => {
                    if (typeof item === 'string') {
                      return item;
                    } else if ('customOption' in item) {
                      return item.label;
                    } else {
                      return item;
                    }
                  })
                );
              }}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          />
        </Form.Group>

        <div className="border p-3 mb-3">
          <Dropzone onDrop={handleDrop} />
        </div>

        <Form.Group className="mb-3">
          <TinymceEditor
            options={{
              height: '30rem'
            }}
            value={content}
            onChange={(content: string) => setContent(content)}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default WizardSendMailForm;
