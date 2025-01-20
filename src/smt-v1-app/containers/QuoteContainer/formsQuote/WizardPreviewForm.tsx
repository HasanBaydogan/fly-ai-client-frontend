import React from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import Reka_Static from 'assets/img/logos/Reka_Static.jpg';
import './WizardTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface WizardPersonalFormProps {
  settings: {
    adress: { row1: string; row2: string; row3: string };
    quotaNumber: string;
    RevisionNumber: string;
    ClientLocation: string;
    ShipTo: string;
    Requisitioner: string;
    ShipVia: string;
    CPT: string;
    ShippingTerms: string;
    CoSI: string;
    ST1: string;
    ST2: string;
    ST3: string;
    ST4: string;
    CoSI2: string;
    CoSI3: { CoSIRow1: string; CoSIRow2: string };
    reqQTY: number;
    currency: string;
  };
  data: TableRow[];
  subTotalValues: number[]; // Sub-total değerleri
  selectedDate: Date | null; // Seçilen tarih
}

interface TableRow {
  partNumber: string;
  alternativeTo: string;
  description: string;
  leadTime: string;
  qty: number;
  unitPrice: number;
}

const WizardPersonalForm: React.FC<WizardPersonalFormProps> = ({
  settings,
  data,
  subTotalValues,
  selectedDate
}) => {
  const generatePDF = async () => {
    const element = document.getElementById('pdf-content'); // PDF içeriğini al
    const button = document.getElementById('pdf-button'); // Butonu seç

    if (element) {
      try {
        // PDF butonunu gizle
        if (button) button.style.display = 'none';

        // Canvas oluştur
        const canvas = await html2canvas(element, { scale: 1.2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('quote.pdf'); // PDF'i indir
      } catch (error) {
        console.error('PDF oluşturma sırasında bir hata oluştu:', error);
      } finally {
        // PDF butonunu geri göster
        if (button) button.style.display = '';
      }
    } else {
      console.error('PDF içeriği bulunamadı!');
    }
  };

  return (
    <>
      <div className="p-3" id="pdf-content">
        <div className="uppersection">
          <div className="upperleftsection">
            <Card style={{ width: '12rem' }} className="border-0 mb-5">
              <Card.Img variant="top" src={Reka_Static} />
              <Card.Body className="p-0 px-1 fs-9">
                <Card.Text className="mb-2 pt-2">
                  {settings.adress.row1}
                </Card.Text>
                <Card.Text className="mb-2">{settings.adress.row2}</Card.Text>
                <Card.Text>{settings.adress.row3}</Card.Text>
              </Card.Body>
            </Card>
          </div>

          <div className="upperrightsection">
            <div className="quote-section mb-4 ">
              <div className=" gap-2 mb-4">
                <Button
                  variant="phoenix-primary"
                  id="pdf-button"
                  onClick={generatePDF}
                >
                  <FontAwesomeIcon icon={faFileLines} /> Preview PDF File{' '}
                </Button>
              </div>
              <h2 className="text-primary mb-3">QUOTE</h2>

              <p>
                <strong>Date:</strong>{' '}
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : 'No date selected'}
              </p>
              <p className=" mt-3">
                <strong>Quote Number:</strong> {settings.quotaNumber}
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
            <tr className="text-center align-middle">
              <td colSpan={3}>{settings.ClientLocation}</td>
              <td>{settings.ShipTo}</td>
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
            <tr className="text-center align-middle">
              <td style={{ width: '25%' }}>{settings.Requisitioner}</td>
              <td style={{ width: '25%' }}>{settings.ShipVia}</td>
              <td style={{ width: '25%' }}>{settings.CPT}</td>
              <td style={{ width: '25%' }}>{settings.ShippingTerms}</td>
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
                <td className="text-white align-middle">LEAD TIME (DAYS)</td>
                <td className="text-white align-middle">QTY</td>
                <td className="text-white align-middle">UNIT PRICE</td>
                <td className="text-white align-middle">TOTAL</td>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="text-center align-middle">
                  <td>{row.partNumber}</td>
                  <td>{row.alternativeTo || '-'}</td>
                  <td>{row.description}</td>
                  <td>{row.leadTime} Days</td>
                  <td>{row.qty}</td>
                  <td>
                    {row.unitPrice.toLocaleString('en-US', {
                      style: 'currency',
                      currency: settings.currency.replace(/[^A-Z]/g, '')
                    })}
                  </td>
                  <td>
                    {(row.qty * row.unitPrice).toLocaleString('en-US', {
                      style: 'currency',
                      currency: settings.currency.replace(/[^A-Z]/g, '')
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
                    <td className="p-2">{settings.CoSI}</td>
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
                              {data
                                .reduce(
                                  (acc, row) => acc + row.qty * row.unitPrice,
                                  0
                                )
                                .toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: settings.currency.replace(
                                    /[^A-Z]/g,
                                    ''
                                  )
                                })}
                            </span>
                          </h5>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-sm-md">{settings.ST1}</td>
                      <td>
                        <Form.Check type="checkbox" defaultChecked disabled />
                      </td>
                      <td>
                        {subTotalValues[0]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: settings.currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">{settings.ST2}</td>
                      <td>
                        <Form.Check type="checkbox" defaultChecked disabled />
                      </td>
                      <td>
                        {subTotalValues[1]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: settings.currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">{settings.ST3}</td>
                      <td>
                        <Form.Check type="checkbox" disabled />
                      </td>
                      <td>
                        {subTotalValues[2]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: settings.currency.replace(/[^A-Z]/g, '')
                        })}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-sm-md">{settings.ST4}</td>
                      <td>
                        <Form.Check type="checkbox" disabled />
                      </td>
                      <td>
                        {subTotalValues[3]?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: settings.currency.replace(/[^A-Z]/g, '')
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
                            data.reduce(
                              (acc, row) => acc + row.qty * row.unitPrice,
                              0
                            ) +
                            subTotalValues.reduce((sum, val) => sum + val, 0)
                          ).toLocaleString('en-US', {
                            style: 'currency',
                            currency: settings.currency.replace(/[^A-Z]/g, '')
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
                  <td className="p-2">{settings.CoSI2}</td>
                </tr>
              </tbody>
            </Table>
            <Table striped bordered hover className="mb-3 text-center">
              <tbody>
                <tr>
                  <td className="p-2">
                    {settings.CoSI3.CoSIRow1}
                    <br />
                    {settings.CoSI3.CoSIRow2}
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

export default WizardPersonalForm;
