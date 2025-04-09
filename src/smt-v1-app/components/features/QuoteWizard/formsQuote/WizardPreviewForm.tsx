import React, { useEffect } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import './WizardTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { QuotePartRow, QuoteWizardSetting } from '../QuoteWizard';
import {
  downloadPDF,
  generatePDF,
  returnPdfAsBase64String
} from './PDFGeneratorHelper';

interface WizardPersonalFormProps {
  settings: QuoteWizardSetting;
  quotePartRows: QuotePartRow[];
  subTotalValues: number[]; // Sub-total değerleri
  selectedDate: Date | null; // Seçilen tarih
  checkedStates: boolean[];
  quoteNumber: string; // Add this new prop
  currency: string;
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
    CPT: string;
    setCPT: React.Dispatch<React.SetStateAction<string>>;
    shippingTerms: string;
    setShippingTerms: React.Dispatch<React.SetStateAction<string>>;
  };
}

const WizardPreviewForm: React.FC<WizardPersonalFormProps> = ({
  settings,
  subTotalValues,
  selectedDate,
  checkedStates,
  setBase64Pdf,
  setBase64PdfFileName,
  quotePartRows,
  quoteNumber, // Add this new prop,
  currency,
  setIsPdfConvertedToBase64,
  setupOtherProps
}) => {
  const handleGeneratePDF = () => {
    try {
      downloadPDF(
        settings,
        selectedDate,
        quoteNumber,
        currency,
        quotePartRows,
        subTotalValues,
        checkedStates,
        setupOtherProps.clientLocation,
        setupOtherProps.shipTo,
        setupOtherProps.requisitioner,
        setupOtherProps.shipVia,
        setupOtherProps.CPT,
        setupOtherProps.shippingTerms
      );
    } catch (error) {
      console.error('PDF oluşturma sırasında bir hata oluştu:', error);
    }
  };
  useEffect(() => {
    return () => {
      // Wrap your async logic in an IIFE

      (async () => {
        try {
          const response = await returnPdfAsBase64String(
            settings,
            selectedDate,
            quoteNumber,
            currency,
            quotePartRows,
            subTotalValues,
            checkedStates,
            setupOtherProps.clientLocation,
            setupOtherProps.shipTo,
            setupOtherProps.requisitioner,
            setupOtherProps.shipVia,
            setupOtherProps.CPT,
            setupOtherProps.shippingTerms
          );
          setBase64Pdf(response);
          setBase64PdfFileName(quoteNumber + '.pdf');
          setTimeout(() => {
            setIsPdfConvertedToBase64(false);
          }, 700);
        } catch (error) {
          console.error('Error generating PDF base64:', error);
        }
      })();
    };
  }, [quotePartRows]);

  return (
    <>
      <div className="p-3" id="pdf-content">
        <div className="uppersection">
          <div className="upperleftsection">
            <Card style={{ width: '12rem' }} className="border-0 mb-5">
              <Card.Img variant="top" src={settings.logo} />
              <Card.Body className="p-0 px-1 fs-9">
                <Card.Text className="mb-2 pt-2">
                  {settings.addressRow1}
                </Card.Text>
                <Card.Text className="mb-2">{settings.addressRow2}</Card.Text>
                <Card.Text>{settings.mobilePhone}</Card.Text>
              </Card.Body>
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
              <h2 className="text-primary mb-3">QUOTE</h2>

              <p>
                <strong>Date:</strong>{' '}
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </p>
              <p className=" mt-3">
                <strong>Quote Number:</strong> {quoteNumber}
              </p>
            </div>
          </div>
        </div>
        <Table bordered hover size="sm" id="client-info-form1">
          <thead>
            <tr className="bg-primary text-white text-center align-middle">
              <td colSpan={3} className="text-white">
                CLIENT LOCATION
              </td>
              <td className="text-white">SHIP TO</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td colSpan={3}>
                {setupOtherProps.clientLocation.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.clientLocation
                )}
              </td>
              <td>
                {setupOtherProps.shipTo.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.shipTo
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
                CPT
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
                {setupOtherProps.CPT.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.CPT
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
                <td className="text-white align-middle">PART NUMBER (PN)</td>
                <td className="text-white align-middle">ALTERNATIVE TO</td>
                <td className="text-white align-middle">DESCRIPTION</td>
                <td className="text-white align-middle">REQ CND</td>
                <td className="text-white align-middle">FND CND</td>
                <td className="text-white align-middle">LEAD TIME (DAYS)</td>
                <td className="text-white align-middle">QTY</td>
                <td className="text-white align-middle">UNIT PRICE</td>
                <td className="text-white align-middle">TOTAL</td>
              </tr>
            </thead>
            <tbody>
              {quotePartRows.map((row, index) => (
                <tr key={index} className="text-center align-middle">
                  <td>{row.partNumber}</td>
                  <td>{row.alternativeTo || '-'}</td>
                  <td>{row.description}</td>
                  <td>{row.reqCondition}</td>
                  <td>{row.fndCondition}</td>
                  <td>{row.leadTime} Days</td>
                  <td>{row.quantity}</td>
                  <td>
                    {row.unitPrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: currency.replace(/[^A-Z]/g, '')
                    })}
                  </td>
                  <td>
                    {(row.quantity * row.unitPrice).toLocaleString('en-US', {
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
            <Col md={8}>
              <Table striped bordered hover className="mb-3">
                <thead>
                  <tr>
                    <th className="text-center">
                      Comments or Special Instructions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">
                      {settings.commentsSpecialInstruction}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
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
                              {quotePartRows
                                .reduce(
                                  (acc, row) =>
                                    acc + row.quantity * row.unitPrice,
                                  0
                                )
                                .toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: currency.replace(/[^A-Z]/g, '')
                                })}
                            </span>
                          </h5>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-sm-md">
                        {settings.otherQuoteValues[0]}
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[0]}
                          disabled
                        />
                      </td>
                      <td>
                        {subTotalValues[0]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">
                        {settings.otherQuoteValues[1]}
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[1]}
                          disabled
                        />
                      </td>
                      <td>
                        {subTotalValues[1]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">
                        {settings.otherQuoteValues[2]}
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[2]}
                          disabled
                        />
                      </td>
                      <td>
                        {subTotalValues[2]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">
                        {settings.otherQuoteValues[3]}
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[3]}
                          disabled
                        />
                      </td>
                      <td>
                        {subTotalValues[3]?.toLocaleString('en-US', {
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
                            quotePartRows.reduce(
                              (acc, row) => acc + row.quantity * row.unitPrice,
                              0
                            ) +
                            subTotalValues.reduce(
                              (sum, val, index) =>
                                sum + (checkedStates[index] ? val : 0), // Update total calculation
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
            <Table striped bordered hover className="mb-3 text-center">
              <thead>
                <tr>
                  <th className="text-center">
                    Comments or Special Instructions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">
                    {
                      'Delivery: Destination - Custom and related TAX and costs shall be paid by Client.'
                    }
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table striped bordered hover className="mb-3 text-center">
              <tbody>
                <tr>
                  <td className="p-2">
                    {settings.contactInfo}
                    <br />
                    {settings.phone}
                    <br />
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
