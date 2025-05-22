import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import './WizardTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { partRow, POResponseData, QuoteWizardSetting } from '../POWizard';
import {
  downloadPDF,
  generatePDF,
  returnPdfAsBase64String
} from './PDFGeneratorHelper';
import QRCode from 'react-qr-code';

interface WizardPersonalFormProps {
  settings: QuoteWizardSetting;
  quotePartRows: partRow[];
  subTotalValues: number[];
  selectedDate: Date | null;
  checkedStates: boolean[];
  quoteNumber: string;
  currency: string;
  percentageValue: number;
  taxAmount: number;
  setBase64PdfFileName: React.Dispatch<React.SetStateAction<string>>;
  setBase64Pdf: React.Dispatch<React.SetStateAction<string>>;
  setIsPdfConvertedToBase64: React.Dispatch<React.SetStateAction<boolean>>;
  setupOtherProps: {
    clientLocation: string;
    setClientLocation: React.Dispatch<React.SetStateAction<string>>;
    shipTo: string;
    setShipTo: React.Dispatch<React.SetStateAction<string>>;
    requisitioner: string;
    setRequisitioner: React.Dispatch<React.SetStateAction<string>>;
    shipVia: string;
    setShipVia: React.Dispatch<React.SetStateAction<string>>;
    fob: string;
    setFob: React.Dispatch<React.SetStateAction<string>>;
    shippingTerms: string;
    setShippingTerms: React.Dispatch<React.SetStateAction<string>>;
    selectedBank: any;
    contractNo: string;
    setContractNo: React.Dispatch<React.SetStateAction<string>>;
    isInternational: boolean;
    setIsInternational: React.Dispatch<React.SetStateAction<boolean>>;
    validityDay: number;
    setValidityDay: React.Dispatch<React.SetStateAction<number>>;
  };
  piResponseData: any;
  poResponseData?: POResponseData;
}

const WizardPreviewForm: React.FC<WizardPersonalFormProps> = ({
  settings,
  subTotalValues,
  selectedDate,
  checkedStates,
  setBase64Pdf,
  setBase64PdfFileName,
  quotePartRows,
  quoteNumber,
  currency,
  percentageValue,
  taxAmount,
  setIsPdfConvertedToBase64,
  setupOtherProps,
  piResponseData,
  poResponseData
}) => {
  const [currentVendorIndex, setCurrentVendorIndex] = useState(0);

  const vendors = [...(poResponseData?.suppliers || [])];
  const hasMultipleVendors = vendors.length > 1;

  // Get current vendor
  const currentVendor = vendors[currentVendorIndex];

  // Filter parts for current vendor
  const filteredParts = hasMultipleVendors
    ? quotePartRows.filter(
        part => part.poPartSuppliers?.supplier === currentVendor?.supplier
      )
    : quotePartRows;

  // Calculate totals for filtered parts
  const calculateFilteredTotal = () => {
    return filteredParts.reduce((acc, row) => acc + row.qty * row.price, 0);
  };

  // Debug log
  // console.log('Current Vendor:', currentVendor);
  // console.log('Filtered Parts:', filteredParts);

  const handleGeneratePDF = async () => {
    try {
      console.log('Starting PDF generation...');
      setIsPdfConvertedToBase64(true);

      // Generate PDF and get base64 string in one step
      const base64String = await returnPdfAsBase64String(
        settings,
        selectedDate,
        quoteNumber,
        currency,
        filteredParts,
        subTotalValues,
        checkedStates,
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
        taxAmount,
        percentageValue,
        currentVendor
      );

      if (base64String) {
        console.log('Setting PDF states...');
        setBase64Pdf(base64String);
        setBase64PdfFileName(`PO_${quoteNumber}.pdf`);

        // Open PDF in new tab
        const pdfWindow = window.open('', '_blank');
        if (pdfWindow) {
          pdfWindow.document.write(`
            <html>
              <head>
                <title>PDF Preview</title>
              </head>
              <body style="margin:0;padding:0;">
                <embed width="100%" height="100%" src="${base64String}" type="application/pdf">
              </body>
            </html>
          `);
          pdfWindow.document.close();
        }
      } else {
        console.error('Failed to generate PDF');
      }

      setIsPdfConvertedToBase64(false);
      console.log('PDF process completed');
    } catch (error) {
      console.error('PDF oluşturma sırasında bir hata oluştu:', error);
      setIsPdfConvertedToBase64(false);
    }
  };

  return (
    <>
      <div className="p-3" id="pdf-content">
        {hasMultipleVendors && (
          <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
            {vendors.map((vendor, index) => (
              <Button
                key={vendor.supplierId || index}
                variant={
                  currentVendorIndex === index ? 'primary' : 'outline-primary'
                }
                className="vendor-btn"
                onClick={() => setCurrentVendorIndex(index)}
                style={{
                  minWidth: 120,
                  maxWidth: 160,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: 8,
                  borderRadius: 10,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  lineHeight: 1.1,
                  whiteSpace: 'normal',
                  overflow: 'hidden'
                }}
              >
                <span
                  className="vendor-text"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word',
                    width: '100%'
                  }}
                >
                  {vendor.supplier}
                </span>
              </Button>
            ))}
          </div>
        )}
        <div className="uppersection">
          <div className="upperleftsection">
            <Card
              style={{ width: '18rem', top: '30px' }}
              className="border-0 mb-5"
            >
              <Card.Img variant="top" src={settings.logo} />
            </Card>
          </div>

          <div className="upperrightsection">
            <div className="quote-section mb-4 ">
              <div className=" gap-2 mb-4">
                <Button
                  variant="phoenix-primary"
                  id="pdf-button"
                  onClick={handleGeneratePDF}
                >
                  <FontAwesomeIcon icon={faFileLines} /> Preview PDF File{' '}
                </Button>
              </div>

              <p>
                <strong>Date:</strong>{' '}
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </p>
              <p className=" mt-3">
                <strong>PO Number:</strong> {quoteNumber}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-primary mb-3 text-center">PURCHASE ORDER</h2>
        <Table bordered hover size="sm" id="client-info-form1">
          <thead>
            <tr className="bg-primary text-white text-center align-middle">
              <td className="text-white">Vendor</td>
              <td colSpan={3} className="text-white">
                Ship To
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td>
                <div
                  style={{
                    textAlign: 'left',
                    padding: '10px',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {currentVendor ? `${currentVendor.supplier}` : ''}
                </div>
              </td>
              <td colSpan={3}>
                {setupOtherProps.shipTo?.trim() ? (
                  setupOtherProps.shipTo
                ) : (
                  <span>&nbsp;</span>
                )}
              </td>
            </tr>
            <tr className="bg-primary text-white text-center align-middle">
              <td className="text-white" style={{ width: '25%' }}>
                REQUISITIONER
              </td>
              <td className="text-white" style={{ width: '25%' }}>
                SHIP VIA
              </td>
              <td className="text-white" style={{ width: '25%' }}>
                FOB
              </td>
              <td className="text-white" style={{ width: '25%' }}>
                SHIPPING TERMS
              </td>
            </tr>
            <tr className="text-center">
              <td style={{ width: '25%' }}>
                {setupOtherProps.requisitioner.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.requisitioner
                )}
              </td>
              <td style={{ width: '25%' }}>
                {setupOtherProps.shipVia.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.shipVia
                )}
              </td>
              <td style={{ width: '25%' }}>
                {setupOtherProps.fob.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.fob
                )}
              </td>
              <td style={{ width: '25%' }}>
                {setupOtherProps.shippingTerms.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.shippingTerms
                )}
              </td>
            </tr>
          </tbody>
        </Table>
        <div>
          <Table bordered hover size="sm" responsive>
            <thead>
              <tr className="bg-primary text-white text-center">
                <td
                  className="text-white align-middle"
                  style={{ width: '50px' }}
                >
                  NO
                </td>
                <td
                  className="text-white align-middle"
                  style={{ width: '150px' }}
                >
                  PN/MODEL
                </td>
                <td className="text-white align-middle">DESCRIPTION</td>
                <td className="text-white align-middle">SUPPLIER</td>
                <td className="text-white align-middle">QTY</td>
                <td className="text-white align-middle">LEAD TIME</td>
                <td className="text-white align-middle">UNIT PRICE</td>
                <td
                  className="text-white align-middle"
                  style={{ minWidth: '100px' }}
                >
                  TOTAL
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((row, index) => (
                <tr key={index} className="text-center align-middle">
                  <td>{index + 1}</td>
                  <td>{row.partNumber}</td>
                  <td>{row.description}</td>
                  <td>{row.poPartSuppliers?.supplier || 'N/A'}</td>
                  <td>{row.qty}</td>
                  <td>{row.leadTime} Days</td>
                  <td>
                    {row.price.toLocaleString('en-US', {
                      style: 'currency',
                      currency: currency.replace(/[^A-Z]/g, '')
                    })}
                  </td>
                  <td>
                    {(row.qty * row.price).toLocaleString('en-US', {
                      style: 'currency',
                      currency: currency.replace(/[^A-Z]/g, '')
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="footer-section mt-5">
          <Row className="g-3">
            <Col md={8}></Col>
            <Col md={4}>
              <div className="d-flex flex-column text-center">
                <Table
                  bordered
                  hover
                  size="sm"
                  className="sub-total-table mb-3"
                >
                  <thead>
                    <tr>
                      <th>Sub-Total</th>
                      <td></td>
                      <td>
                        <div className="mt-3 text-center">
                          <h5>
                            <span className="text-primary ms-2">
                              {calculateFilteredTotal().toLocaleString(
                                'en-US',
                                {
                                  style: 'currency',
                                  currency: currency.replace(/[^A-Z]/g, '')
                                }
                              )}
                            </span>
                          </h5>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-sm-md">Tax</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[0]}
                          disabled
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <span
                            style={{
                              fontSize: '0.9rem',
                              minWidth: '70px',
                              textAlign: 'left',
                              marginRight: '20px'
                            }}
                          >
                            {`${percentageValue}% ${taxAmount.toLocaleString(
                              'en-US',
                              {
                                style: 'currency',
                                currency: currency.replace(/[^A-Z]/g, '')
                              }
                            )}`}
                          </span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">Aircargo to X</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[1]}
                          disabled
                        />
                      </td>
                      <td>
                        {(subTotalValues[1] || 0).toLocaleString('en-US', {
                          style: 'currency',
                          currency: currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">Sealine to X</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[2]}
                          disabled
                        />
                      </td>
                      <td>
                        {(subTotalValues[2] || 0).toLocaleString('en-US', {
                          style: 'currency',
                          currency: currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">Truck Carriage to X</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[3]}
                          disabled
                        />
                      </td>
                      <td>
                        {(subTotalValues[3] || 0).toLocaleString('en-US', {
                          style: 'currency',
                          currency: currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text-end">
                        <strong>Total:</strong>
                      </td>
                      <td>
                        <strong>
                          {(
                            calculateFilteredTotal() +
                            (checkedStates[0] ? taxAmount : 0) +
                            subTotalValues
                              .slice(1)
                              .reduce(
                                (sum, val, index) =>
                                  sum + (checkedStates[index + 1] ? val : 0),
                                0
                              )
                          ).toLocaleString('en-US', {
                            style: 'currency',
                            currency: currency.replace(/[^A-Z]/g, '')
                          })}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
            <Table striped bordered hover className="mb-3">
              <tbody>
                <tr>
                  <td
                    className="p-2 text-center"
                    style={{ fontSize: '14px', padding: '15px' }}
                  >
                    <p>
                      If you have any questions about this form, please contact:
                    </p>
                    {settings.companyName}
                    <br />
                    {settings.companyAddress}
                    <br />
                    {settings.phone}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </div>
      </div>
    </>
  );
};

export default WizardPreviewForm;
