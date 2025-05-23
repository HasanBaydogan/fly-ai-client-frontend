import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Alert, Button } from 'react-bootstrap';
import TinymceEditor from 'components/base/TinymceEditor';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

import { getPreEmailSendingParameters } from 'smt-v1-app/services/PoServices';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import DropzoneQuoteWizard from './DropzoneQuoteWizard';
import { returnPdfAsBase64String } from './PDFGeneratorHelper';
import { QuoteWizardSetting, partRow } from '../POWizard';

interface TypeaheadOption {
  label: string;
  customOption?: boolean;
}

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

interface PreEmailParam {
  toEmails: string[];
  ccEmails: string[];
  bccEmails?: string[];
  subject: string;
  body: string;
  poSupplier: { supplier: string; supplierId: string };
  settings: QuoteWizardSetting;
}

export interface EmailProps {
  toEmails: {
    to: string[];
    cc: string[];
    subject: string;
    body: string;
    attachments: {
      filename: string;
      data: string;
    }[];
  }[];
  setToEmails: React.Dispatch<
    React.SetStateAction<
      {
        to: string[];
        cc: string[];
        subject: string;
        body: string;
        attachments: {
          filename: string;
          data: string;
        }[];
      }[]
    >
  >;
  ccEmails: string[];
  setCcEmails: React.Dispatch<React.SetStateAction<string[]>>;
  bccEmails: string[];
  setBccEmails: React.Dispatch<React.SetStateAction<string[]>>;
  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  base64Files: { name: string; base64: string }[];
  setBase64Files: React.Dispatch<
    React.SetStateAction<{ name: string; base64: string }[]>
  >;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

interface WizardSendMailFormProps {
  onNext?: () => void;
  poId: string;
  poNumberId: string;
  base64Pdf: string;
  base64PdfFileName: string;
  isPdfConvertedToBase64: boolean;
  onFilesUpload: (files: { name: string; base64: string }[]) => void;
  base64Files: { name: string; base64: string }[];
  emailProps: EmailProps;
  // Preview data props
  settings: QuoteWizardSetting;
  quotePartRows: partRow[];
  subTotalValues: number[];
  selectedDate: Date;
  checkedStates: boolean[];
  setupOtherProps: {
    clientLocation: string;
    shipTo: string;
    requisitioner: string;
    shipVia: string;
    fob: string;
    shippingTerms: string;
    contractNo: string;
    isInternational: boolean;
    validityDay: number;
    selectedBank: any;
  };
}

const WizardSendMailForm: React.FC<WizardSendMailFormProps> = ({
  onNext,
  poId,
  poNumberId,
  base64Pdf,
  base64PdfFileName,
  isPdfConvertedToBase64,
  onFilesUpload,
  base64Files,
  emailProps,
  // Preview data props
  settings,
  quotePartRows,
  subTotalValues,
  selectedDate,
  checkedStates,
  setupOtherProps
}) => {
  // State for loading and fetched params
  const [isLoading, setIsLoading] = useState(true);
  const [preEmailParams, setPreEmailParams] = useState<PreEmailParam[]>([]);

  // Current supplier tab
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-supplier email fields
  const [toList, setToList] = useState<string[][]>([]);
  const [ccList, setCcList] = useState<string[][]>([]);
  const [bccList, setBccList] = useState<string[][]>([]);
  const [subjectList, setSubjectList] = useState<string[]>([]);
  const [bodyList, setBodyList] = useState<string[]>([]);

  const [error, setError] = useState('');

  // State for supplier PDFs
  const [supplierPdfs, setSupplierPdfs] = useState<{
    [key: string]: { name: string; base64: string };
  }>({});

  // Fetch pre-email parameters
  useEffect(() => {
    const fetchParams = async () => {
      try {
        const response = await getPreEmailSendingParameters(poId);
        const params: PreEmailParam[] = response.data.preEmailParameters;

        // Ensure each param has the required settings
        const validatedParams = params.map(param => ({
          ...param,
          settings: param.settings || {
            logo: '',
            addressRow1: '',
            addressRow2: '',
            mobilePhone: '',
            commentsSpecialInstruction: '',
            contactInfo: '',
            companyName: '',
            companyAddress: '',
            companyPhone: '',
            companyEmail: '',
            companyWebsite: '',
            companyTelephone: '',
            otherQuoteValues: [],
            phone: ''
          }
        }));

        setPreEmailParams(validatedParams);
        // initialize lists
        setToList(validatedParams.map(p => p.toEmails || []));
        setCcList(validatedParams.map(p => p.ccEmails || []));
        setBccList(validatedParams.map(p => p.bccEmails || []));
        setSubjectList(validatedParams.map(p => p.subject || ''));
        setBodyList(validatedParams.map(p => p.body || ''));
      } catch (e) {
        console.error('Error fetching pre-email params', e);
        setError('Error loading email parameters');
      } finally {
        setIsLoading(false);
      }
    };
    fetchParams();
  }, [poId]);

  // Handle custom Typeahead change
  const handleTypeaheadChange = (
    selected: TypeaheadOption[],
    list: string[][],
    setList: React.Dispatch<React.SetStateAction<string[][]>>
  ) => {
    const labels = selected.map(item => item.label);
    if (new Set(labels).size !== labels.length) {
      setError('Duplicate email is not allowed.');
      return;
    }
    setError('');
    const updated = [...list];
    updated[currentIndex] = labels;
    setList(updated);

    // Update parent component state for To emails
    if (list === toList) {
      // Create an array of email requests for each supplier
      const emailRequests = preEmailParams.map((param, idx) => ({
        to: toList[idx] || [],
        cc: ccList[idx] || [],
        subject: subjectList[idx] || '',
        body: bodyList[idx] || '',
        attachments: supplierPdfs[param.poSupplier.supplierId]
          ? [
              {
                filename: supplierPdfs[param.poSupplier.supplierId].name,
                data: supplierPdfs[param.poSupplier.supplierId].base64
              }
            ]
          : []
      }));
      emailProps.setToEmails(emailRequests);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      console.log('Generate PDF started');
      const currentParam = preEmailParams[currentIndex];
      console.log('Current Param:', currentParam);

      if (!currentParam) {
        console.error('Missing data:', { currentParam });
        setError('Missing required data for PDF generation');
        return;
      }

      // Seçili supplier'a ait parçaları filtrele
      const supplierParts = quotePartRows.filter(
        part =>
          part.poPartSuppliers.supplier === currentParam.poSupplier.supplier
      );
      console.log('Supplier parts:', supplierParts);

      // Seçili supplier'a ait toplam değerleri hesapla
      const supplierSubTotal = supplierParts.reduce(
        (acc, row) => acc + row.qty * row.price,
        0
      );
      console.log('Supplier sub total:', supplierSubTotal);

      console.log('Calling returnPdfAsBase64String with preview data');
      const response = await returnPdfAsBase64String(
        settings,
        selectedDate,
        poNumberId,
        'USD',
        supplierParts,
        [supplierSubTotal],
        [true],
        setupOtherProps.clientLocation,
        setupOtherProps.shipTo,
        setupOtherProps.requisitioner,
        setupOtherProps.shipVia,
        setupOtherProps.fob,
        setupOtherProps.shippingTerms,
        setupOtherProps.contractNo,
        setupOtherProps.isInternational,
        setupOtherProps.validityDay,
        setupOtherProps.selectedBank,
        0,
        0,
        currentParam.poSupplier
      );

      console.log('PDF generation response received:', !!response);

      if (response) {
        const pdfFile = {
          name: `${poNumberId}-${currentParam.poSupplier.supplier}.pdf`,
          base64: response
        };
        console.log('Created PDF file object:', pdfFile.name);

        // Supplier PDF'ini state'e kaydet
        setSupplierPdfs(prev => ({
          ...prev,
          [currentParam.poSupplier.supplierId]: pdfFile
        }));

        // Update email requests with the new PDF
        const emailRequests = preEmailParams.map((param, idx) => ({
          to: toList[idx] || [],
          cc: ccList[idx] || [],
          subject: subjectList[idx] || '',
          body: bodyList[idx] || '',
          attachments: supplierPdfs[param.poSupplier.supplierId]
            ? [
                {
                  filename: supplierPdfs[param.poSupplier.supplierId].name,
                  data: supplierPdfs[param.poSupplier.supplierId].base64
                }
              ]
            : []
        }));
        emailProps.setToEmails(emailRequests);

        // Mevcut dosyaları koru ve yeni PDF'i ekle
        const updatedFiles = [...base64Files];
        console.log(
          'Current files in dropzone:',
          updatedFiles.map(f => f.name)
        );

        // Diğer supplier'ların PDF'lerini kaldır
        const filteredFiles = updatedFiles.filter(
          file => !file.name.includes(poNumberId) || file.name === pdfFile.name
        );
        console.log(
          'Files after filtering:',
          filteredFiles.map(f => f.name)
        );

        // Yeni PDF'i ekle
        const finalFiles = [...filteredFiles, pdfFile];
        console.log(
          'Final files to upload:',
          finalFiles.map(f => f.name)
        );

        // Dropzone'ı güncelle
        onFilesUpload(finalFiles);
        console.log('onFilesUpload called with new files');

        // State'i güncelle
        emailProps.setBase64Files(finalFiles);
        console.log('base64Files state updated');
      } else {
        console.error('No PDF response received');
      }
    } catch (error) {
      console.error('Error in handleGeneratePDF:', error);
      setError('Error generating PDF preview');
    }
  };

  // Update the supplier change handler to maintain email requests
  const handleSupplierChange = (idx: number) => {
    setCurrentIndex(idx);
    const currentParam = preEmailParams[idx];

    if (currentParam && supplierPdfs[currentParam.poSupplier.supplierId]) {
      // Sadece seçili supplier'ın PDF'i ile yeni bir dosya listesi oluştur
      const onlyCurrentSupplierPdf = [
        supplierPdfs[currentParam.poSupplier.supplierId]
      ];

      console.log(
        'Switching to supplier PDF:',
        currentParam.poSupplier.supplier
      );
      console.log(
        'Final files:',
        onlyCurrentSupplierPdf.map(f => f.name)
      );

      onFilesUpload(onlyCurrentSupplierPdf);
      emailProps.setBase64Files(onlyCurrentSupplierPdf);

      // Update email requests when switching suppliers
      const emailRequests = preEmailParams.map((param, index) => ({
        to: toList[index] || [],
        cc: ccList[index] || [],
        subject: subjectList[index] || '',
        body: bodyList[index] || '',
        attachments: supplierPdfs[param.poSupplier.supplierId]
          ? [
              {
                filename: supplierPdfs[param.poSupplier.supplierId].name,
                data: supplierPdfs[param.poSupplier.supplierId].base64
              }
            ]
          : []
      }));
      emailProps.setToEmails(emailRequests);
    } else {
      // Eğer PDF yoksa dropzone'u boşalt
      onFilesUpload([]);
      emailProps.setBase64Files([]);
    }
  };

  // Update useEffect to initialize email requests when preEmailParams changes
  useEffect(() => {
    if (preEmailParams.length > 0) {
      const emailRequests = preEmailParams.map((param, idx) => ({
        to: toList[idx] || [],
        cc: ccList[idx] || [],
        subject: subjectList[idx] || '',
        body: bodyList[idx] || '',
        attachments: supplierPdfs[param.poSupplier.supplierId]
          ? [
              {
                filename: supplierPdfs[param.poSupplier.supplierId].name,
                data: supplierPdfs[param.poSupplier.supplierId].base64
              }
            ]
          : []
      }));
      emailProps.setToEmails(emailRequests);
    }
  }, [preEmailParams, toList, ccList, subjectList, bodyList, supplierPdfs]);

  if (isLoading) return <LoadingAnimation />;

  return (
    <div className="p-4">
      {/* Supplier tabs */}
      {preEmailParams.length > 1 && (
        <Row className="mb-3">
          {preEmailParams.map((p, idx) => (
            <Col key={p.poSupplier.supplierId} xs="auto">
              <Button
                variant={currentIndex === idx ? 'primary' : 'outline-primary'}
                onClick={() => handleSupplierChange(idx)}
              >
                {p.poSupplier.supplier}
              </Button>
            </Col>
          ))}
        </Row>
      )}

      {/* Error alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Form>
        {/* To field */}
        <Form.Group className="mb-3">
          <Form.Label>To</Form.Label>
          <Typeahead
            id="to-emails"
            labelKey="label"
            multiple
            allowNew
            newSelectionPrefix="Add email: "
            options={toList[currentIndex].map(email => ({ label: email }))}
            placeholder="Add recipient emails"
            selected={toList[currentIndex].map(email => ({ label: email }))}
            onChange={(selected: TypeaheadOption[]) =>
              handleTypeaheadChange(selected, toList, setToList)
            }
          />
        </Form.Group>

        {/* CC field */}
        <Form.Group className="mb-3">
          <Form.Label>CC</Form.Label>
          <Typeahead
            id="cc-emails"
            labelKey="label"
            multiple
            allowNew
            newSelectionPrefix="Add CC: "
            options={ccList[currentIndex].map(email => ({ label: email }))}
            placeholder="Add CC emails"
            selected={ccList[currentIndex].map(email => ({ label: email }))}
            onChange={(selected: TypeaheadOption[]) =>
              handleTypeaheadChange(selected, ccList, setCcList)
            }
          />
        </Form.Group>

        {/* BCC field */}
        <Form.Group className="mb-3">
          <Form.Label>BCC</Form.Label>
          <Typeahead
            id="bcc-emails"
            labelKey="label"
            multiple
            allowNew
            newSelectionPrefix="Add BCC: "
            options={
              bccList[currentIndex]?.map(email => ({ label: email })) || []
            }
            placeholder="Add BCC emails"
            selected={
              bccList[currentIndex]?.map(email => ({ label: email })) || []
            }
            onChange={(selected: TypeaheadOption[]) =>
              handleTypeaheadChange(selected, bccList, setBccList)
            }
          />
        </Form.Group>

        {/* Subject */}
        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="text"
                value={subjectList[currentIndex]}
                onChange={e => {
                  const updated = [...subjectList];
                  updated[currentIndex] = e.target.value;
                  emailProps.setSubject(updated[currentIndex]);
                }}
              />
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                className="ms-2"
                onClick={handleGeneratePDF}
              >
                <FontAwesomeIcon icon={faFileLines} className="me-1" />
                Generate
              </Button>
            </Col>
          </Row>
        </Form.Group>

        {/* Attachments */}
        <div className="border p-3 mb-3">
          <DropzoneQuoteWizard
            onFilesUpload={files => {
              console.log(
                'Dropzone onFilesUpload called with files:',
                files.map(f => f.name)
              );
              onFilesUpload(files);
            }}
            alreadyUploadedFiles={base64Files.map(file => ({
              id: undefined,
              name: file.name,
              base64: file.base64
            }))}
          />
        </div>

        {/* Body */}
        <Form.Group className="mb-3">
          <TinymceEditor
            options={{ height: '30rem' }}
            value={bodyList[currentIndex]}
            onChange={text => {
              const updated = [...bodyList];
              updated[currentIndex] = text;
              emailProps.setContent(updated[currentIndex]);
            }}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default WizardSendMailForm;
