import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import './WizardTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { partRow, QuoteWizardSetting } from '../PIWizard';
import {
  downloadPDF,
  generatePDF,
  returnPdfAsBase64String
} from './PDFGeneratorHelper';
import QRCode from 'react-qr-code';

interface WizardPersonalFormProps {
  settings: QuoteWizardSetting;
  quotePartRows: partRow[];
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
    selectedBank: any;
    contractNo: string;
    setContractNo: React.Dispatch<React.SetStateAction<string>>;
    isInternational: boolean;
    setIsInternational: React.Dispatch<React.SetStateAction<boolean>>;
    validityDay: number;
    setValidityDay: React.Dispatch<React.SetStateAction<number>>;
  };
  piResponseData: any; // Assuming piResponseData is of type any
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
  setupOtherProps,
  piResponseData
}) => {
  const [balanceValues] = useState({
    before: 4634.71,
    payment: 4634.71,
    after: 4634.71
  });

  const [percentageValue] = useState(0);

  const handleGeneratePDF = async () => {
    try {
      await downloadPDF(
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
        setupOtherProps.shippingTerms,
        setupOtherProps.contractNo,
        setupOtherProps.isInternational,
        setupOtherProps.validityDay,
        setupOtherProps.selectedBank
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
            setupOtherProps.shippingTerms,
            setupOtherProps.contractNo,
            setupOtherProps.isInternational,
            setupOtherProps.validityDay,
            setupOtherProps.selectedBank
          );
          setBase64Pdf(response);
          setBase64PdfFileName('quote-' + quoteNumber + '.pdf');
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
            <Card
              style={{ width: '18rem', top: '30px' }}
              className="border-0 mb-5"
            >
              <Card.Img variant="top" src={settings.logo} />
              {/* <Card.Body className="p-0 px-1 fs-9">
                <Card.Text className="mb-2 pt-2">
                  {settings.addressRow1}
                </Card.Text>
                <Card.Text className="mb-2">{settings.addressRow2}</Card.Text>
                <Card.Text>{settings.mobilePhone}</Card.Text>
              </Card.Body> */}
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
                <strong>Quote Number:</strong> {quoteNumber}
              </p>
            </div>
          </div>
        </div>{' '}
        <h2 className="text-primary mb-3 text-center">PROFORMA INVOICE</h2>
        <Table bordered hover size="sm" id="client-info-form1">
          <thead>
            <tr className="bg-primary text-white text-center align-middle">
              <td className="text-white">Company Name</td>
              <td colSpan={3} className="text-white">
                Address
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td>
                {setupOtherProps.shipTo.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.shipTo
                )}
              </td>
              <td colSpan={3}>
                {setupOtherProps.clientLocation.trim() === '' ? (
                  <span>&nbsp;</span>
                ) : (
                  setupOtherProps.clientLocation
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
              {quotePartRows.map((row, index) => (
                <tr key={index} className="text-center align-middle">
                  <td>{index + 1}</td>
                  <td>{row.partNumber}</td>
                  <td>{row.description}</td>
                  <td>{row.quantity}</td>
                  <td>{row.leadTime} Days</td>
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
              <div className="mb-4">
                <Table bordered hover size="sm">
                  <tbody>
                    <tr>
                      <td style={{ width: '120px' }}>Contract No :</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-end">
                          {setupOtherProps.contractNo || ''}
                          <Form.Check
                            type="checkbox"
                            label="International"
                            className="ms-3 px-2"
                            checked={setupOtherProps.isInternational}
                            onChange={e =>
                              setupOtherProps.setIsInternational(
                                e.target.checked
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Payment Term :</td>
                      <td>{setupOtherProps.shippingTerms}</td>
                    </tr>
                    <tr>
                      <td>Delivery Term :</td>
                      <td>{setupOtherProps.CPT}</td>
                    </tr>
                    <tr>
                      <td>Validity Day :</td>
                      <td>{setupOtherProps.validityDay || 0}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
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
                          <span style={{ fontSize: '0.9rem' }}>
                            {percentageValue || 0}%
                          </span>
                          <span
                            style={{
                              fontSize: '0.9rem',
                              minWidth: '70px',
                              textAlign: 'left'
                            }}
                          >
                            {subTotalValues[0]?.toLocaleString('en-US', {
                              style: 'currency',
                              currency: currency.replace(/[^A-Z]/g, '')
                            })}
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
                        {subTotalValues[1]?.toLocaleString('en-US', {
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
                        {subTotalValues[2]?.toLocaleString('en-US', {
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
              {/* Balance Information Section */}
              <div
                className="d-flex justify-content-end mb-3"
                style={{ gap: '20px' }}
              >
                <div style={{ width: '330px' }}>
                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span
                      className="text-success"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Balance Before Payment:
                    </span>
                    <span
                      className="text-end"
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    >
                      {balanceValues.before.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>

                  <div className="mb-2 d-flex justify-content-between align-items-center">
                    <span
                      className="text-success"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Payment Amount via Balance:
                    </span>
                    <span
                      className="text-end"
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    >
                      {balanceValues.payment.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="text-success"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Balance After Payment:
                    </span>
                    <span
                      className="text-end"
                      style={{ width: '120px', fontSize: '0.875rem' }}
                    >
                      {balanceValues.after.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Col>
            <Table bordered hover size="sm" id="client-info-form1" responsive>
              <thead>
                <tr className="bg-primary text-white text-center align-middle">
                  <td className="text-white" style={{ width: '8%' }}>
                    Currency
                  </td>
                  <td className="text-white" style={{ width: '13%' }}>
                    Bank Name
                  </td>
                  <td className="text-white" style={{ width: '13%' }}>
                    Branch Name
                  </td>
                  <td className="text-white" style={{ width: '13%' }}>
                    Branch Code
                  </td>
                  <td className="text-white" style={{ width: '13%' }}>
                    Swift Code
                  </td>
                  <td className="text-white" style={{ width: '40%' }}>
                    IBAN NO
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center align-middle">
                  <td style={{ wordBreak: 'break-word' }}>
                    {setupOtherProps.selectedBank?.currency || ''}
                  </td>
                  <td style={{ wordBreak: 'break-word' }}>
                    {setupOtherProps.selectedBank?.bankName || ''}
                  </td>
                  <td style={{ wordBreak: 'break-word' }}>
                    {setupOtherProps.selectedBank?.branchName || ''}
                  </td>
                  <td style={{ wordBreak: 'break-word' }}>
                    {setupOtherProps.selectedBank?.branchCode || ''}
                  </td>
                  <td style={{ wordBreak: 'break-word' }}>
                    {setupOtherProps.selectedBank?.swiftCode || ''}
                  </td>
                  <td
                    style={{
                      wordBreak: 'break-word',
                      textAlign: 'center',
                      paddingLeft: '10px',
                      position: 'relative'
                    }}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center gap-3">
                      <span>{setupOtherProps.selectedBank?.ibanNo || ''}</span>
                      {setupOtherProps.selectedBank?.ibanNo && (
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: 'white'
                          }}
                        >
                          <QRCode
                            value={setupOtherProps.selectedBank.ibanNo}
                            size={100}
                            level="H"
                            style={{
                              height: 'auto',
                              maxWidth: '100%',
                              width: '100%'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Table striped bordered hover className="mb-3">
              <tbody>
                <tr>
                  <td
                    className="p-2 text-center"
                    style={{ fontSize: '14px', padding: '15px' }}
                  >
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
