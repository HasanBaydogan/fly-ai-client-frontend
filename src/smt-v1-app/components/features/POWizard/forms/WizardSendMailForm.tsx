import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Alert } from 'react-bootstrap';
import TinymceEditor from 'components/base/TinymceEditor';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { getPreEmailSendingParameters } from 'smt-v1-app/services/PoServices';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import DropzoneQuoteWizard from './DropzoneQuoteWizard';

export interface SendEmailProps {
  to: string[];
  cc: string[];
  subject: string;
  attachments: {
    filename: string;
    data: string;
  }[];
  body: string;
}

export interface EmailProps {
  toEmails: string[];
  setToEmails: React.Dispatch<React.SetStateAction<string[]>>;
  ccEmails: string[];
  setCcEmails: React.Dispatch<React.SetStateAction<string[]>>;
  bccEmails: string[];
  setBccEmails: React.Dispatch<React.SetStateAction<string[]>>;
  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  base64Files: {
    name: string;
    base64: string;
  }[];
  setBase64Files: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        base64: string;
      }[]
    >
  >;

  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

interface TypeaheadOption {
  label: string;
  customOption?: boolean;
}

interface WizardSendMailFormProps {
  onNext?: () => void;
  emailProps: EmailProps;
  poId: string;
  base64Pdf: string;
  base64PdfFileName: string;
  isPdfConvertedToBase64: boolean;
}

const WizardSendMailForm: React.FC<WizardSendMailFormProps> = ({
  onNext,
  emailProps,
  poId,
  base64Pdf,
  base64PdfFileName,
  isPdfConvertedToBase64
}) => {
  const {
    toEmails,
    setToEmails,
    ccEmails,
    setCcEmails,
    bccEmails,
    setBccEmails,
    subject,
    setSubject,
    content,
    setContent,
    base64Files,
    setBase64Files,
    inputValue,
    setInputValue,
    error,
    setError
  } = emailProps;

  // This state is used for files in base64 format.

  const [isLoading, setIsLoading] = useState(true);

  // Simple email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Optional key handler if you want to support Enter or comma key to add emails.
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

  // This function is used by the Typeahead onChange for To, CC, and BCC fields.
  const handleEmailChange = (
    selected: TypeaheadOption[],
    setEmailList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    // Get the last added email
    const lastEmail = selected[selected.length - 1]?.label;

    // Get current emails without the last one
    const currentEmails = selected.slice(0, -1).map(item => item.label);

    // Check if the last email is a duplicate
    if (lastEmail && currentEmails.includes(lastEmail)) {
      setError(`Email address "${lastEmail}" is already added.`);
      // Remove the duplicate email from selection
      setEmailList(currentEmails);
      return;
    }

    // If no duplicate, proceed normally
    setError(''); // Clear any existing error
    const uniqueEmails = [...new Set(selected.map(item => item.label))];
    setEmailList(uniqueEmails);
  };

  // Fetch the pre-email parameters from the API and set the email fields.
  useEffect(() => {
    const getPreEmailParams = async () => {
      setIsLoading(true);
      const response = await getPreEmailSendingParameters(poId);
      // Assuming response.data has the structure: { body, ccEmails, subject, toEmails }
      setToEmails(response.data.toEmails);
      setCcEmails(response.data.ccEmails);
      setSubject(response.data.subject);
      setContent(response.data.body);
      setIsLoading(false);
    };
    getPreEmailParams();
  }, [poId, setToEmails, setCcEmails, setSubject, setContent]);

  // Update the file state when base64Pdf changes.
  useEffect(() => {
    setBase64Files([{ name: base64PdfFileName, base64: base64Pdf }]);
  }, [base64Pdf, base64PdfFileName]);

  const handleFilesUpload = (files: { name: string; base64: string }[]) => {
    setBase64Files(files);
  };

  return (
    <div className="p-4">
      {isLoading || isPdfConvertedToBase64 ? (
        <LoadingAnimation />
      ) : (
        <Form>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <Row className="mb-3">
            <Form.Group as={Col} md={12}>
              <Form.Label>To</Form.Label>
              <Typeahead
                id="to-emails"
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
                options={(toEmails || []).map(email => ({ label: email }))}
                placeholder="Add recipient emails"
                selected={(toEmails || []).map(email => ({ label: email }))}
                onChange={(selected: TypeaheadOption[]) => {
                  handleEmailChange(selected, setToEmails);
                }}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md={6}>
              <Form.Label>CC</Form.Label>
              <Typeahead
                id="cc-emails"
                labelKey="label"
                multiple
                allowNew
                newSelectionPrefix="Add new email: "
                options={(ccEmails || []).map(email => ({ label: email }))}
                placeholder="Add CC emails"
                selected={(ccEmails || []).map(email => ({ label: email }))}
                onChange={(selected: TypeaheadOption[]) => {
                  handleEmailChange(selected, setCcEmails);
                }}
              />
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label>BCC</Form.Label>
              <Typeahead
                id="bcc-emails"
                labelKey="label"
                multiple
                allowNew
                newSelectionPrefix="Add new email: "
                options={(bccEmails || []).map(email => ({ label: email }))}
                placeholder="Add BCC emails"
                selected={(bccEmails || []).map(email => ({ label: email }))}
                onChange={(selected: TypeaheadOption[]) => {
                  handleEmailChange(selected, setBccEmails);
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
            <DropzoneQuoteWizard
              onFilesUpload={handleFilesUpload}
              alreadyUploadedFiles={[
                { id: undefined, name: base64PdfFileName, base64: base64Pdf }
              ]}
            />
          </div>

          <Form.Group className="mb-3">
            <TinymceEditor
              options={{
                height: '30rem'
              }}
              value={content}
              onChange={(body: string) => setContent(body)}
            />
          </Form.Group>
        </Form>
      )}
    </div>
  );
};

export default WizardSendMailForm;
