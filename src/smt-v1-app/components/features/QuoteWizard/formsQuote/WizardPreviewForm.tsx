import React, { useEffect } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import './WizardTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import {
  QuotePartRow,
  QuoteWizardData,
  QuoteWizardSetting
} from '../QuoteWizard';

interface WizardPersonalFormProps {
  settings: QuoteWizardSetting;
  quotePartRows: QuotePartRow[];
  subTotalValues: number[]; // Sub-total değerleri
  selectedDate: Date | null; // Seçilen tarih
  checkedStates: boolean[];
  quoteNumber: string; // Add this new prop
  currency: string;
}

interface TableRow {
  partNumber: string;
  alternativeTo: string;
  description: string;
  leadTime: string;
  qty: number;
  unitPrice: number;
}

const WizardPreviewForm: React.FC<WizardPersonalFormProps> = ({
  settings,
  subTotalValues,
  selectedDate,
  checkedStates,
  quotePartRows,
  quoteNumber, // Add this new prop,
  currency
}) => {
  const generatePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width;

      // Logo
      pdf.addImage(settings.logo, 'JPEG', 10, 10, 60, 20);
      pdf.setFontSize(10);

      // Address (split into rows)
      const maxWidth = 80;
      const row1Lines = pdf.splitTextToSize(settings.addressRow1, maxWidth);
      const row2Lines = pdf.splitTextToSize(settings.addressRow2, maxWidth);
      const row3Lines = pdf.splitTextToSize(settings.mobilePhone, maxWidth);
      let currentY = 45;
      row1Lines.forEach(line => {
        pdf.text(line, 10, currentY);
        currentY += 5;
      });
      row2Lines.forEach(line => {
        pdf.text(line, 10, currentY);
        currentY += 5;
      });
      row3Lines.forEach(line => {
        pdf.text(line, 10, currentY);
        currentY += 5;
      });

      // Quote header and details
      pdf.setFontSize(25);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(51, 102, 204);
      pdf.text('QUOTE', pageWidth - 60, 20);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(
        `Date: ${selectedDate?.toLocaleDateString()}`,
        pageWidth - 60,
        30
      );
      pdf.text(`Quote Number: ${quoteNumber}`, pageWidth - 60, 35);

      // Client info table
      autoTable(pdf, {
        startY: 65,
        head: [['CLIENT LOCATION', 'SHIP TO']],
        body: [['', '']],
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'center', valign: 'middle' },
        columnStyles: {
          0: { cellWidth: 143 },
          1: { cellWidth: 53 }
        },
        margin: { left: 7 }
      });

      // Shipping details table
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5 || 70,
        head: [['REQUISITIONER', 'SHIP VIA', 'CPT', 'SHIPPING TERMS']],
        body: [['', '', '', '']],
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'center', valign: 'middle' },
        columnStyles: {
          0: { cellWidth: 48.5 },
          1: { cellWidth: 48.5 },
          2: { cellWidth: 49.5 },
          3: { cellWidth: 49.5 }
        },
        margin: { left: 7 }
      });

      // Main product table
      const tableBody = quotePartRows.map(row => [
        row.partNumber,
        row.alternativeTo || '-',
        row.description,
        row.reqCondition,
        row.fndCondition,
        `${row.leadTime} Days`,
        row.quantity,
        row.unitPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: currency.replace(/[^A-Z]/g, '')
        }),
        (row.quantity * row.unitPrice).toLocaleString('en-US', {
          style: 'currency',
          currency: currency.replace(/[^A-Z]/g, '')
        })
      ]);
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5 || 70,
        head: [
          [
            'PART NUMBER',
            'ALTERNATIVE TO',
            'DESCRIPTION',
            'REQ CND',
            'FND CND',
            'LEAD TIME',
            'QTY',
            'UNIT PRICE',
            'TOTAL'
          ]
        ],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'center', valign: 'middle' },
        columnStyles: {
          0: { cellWidth: 29 },
          1: { cellWidth: 28 },
          2: { cellWidth: 35 },
          3: { cellWidth: 11 },
          4: { cellWidth: 11 },
          5: { cellWidth: 20 },
          6: { cellWidth: 12 },
          7: { cellWidth: 24 },
          8: { cellWidth: 26 }
        },
        margin: { left: 7 }
      });

      // Calculate totals
      const subTotal = quotePartRows.reduce(
        (acc, row) => acc + row.quantity * row.unitPrice,
        0
      );
      const total =
        quotePartRows.reduce(
          (acc, row) => acc + row.quantity * row.unitPrice,
          0
        ) +
        subTotalValues.reduce(
          (sum, val, index) => sum + (checkedStates[index] ? val : 0),
          0
        );

      // Use the Y position after the main product table
      const startYPosition = (pdf as any).lastAutoTable?.finalY + 5 || 70;

      // --- Revised Layout ---

      // 1. Sub-total section (occupies 40% of the page width, aligned to the right)
      const subTotalWidth = pageWidth * 0.4; // Sub-total table width (40% of the page)
      const leftMarginForSubTotal = pageWidth - subTotalWidth - 10; // 40% of page width
      autoTable(pdf, {
        startY: startYPosition,
        // Set the left margin so that the table occupies the right 40%
        margin: { left: leftMarginForSubTotal },
        body: [
          [
            'Sub-Total',
            'Include',
            {
              content: subTotal.toLocaleString('en-US', {
                style: 'currency',
                currency: currency.replace(/[^A-Z]/g, '')
              }),
              styles: { fontStyle: 'bold' }
            }
          ],
          [
            settings.otherQuoteValues[0],
            checkedStates[0] ? 'Yes' : 'No',
            subTotalValues[0]?.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            settings.otherQuoteValues[1],
            checkedStates[1] ? 'Yes' : 'No',
            subTotalValues[1]?.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            settings.otherQuoteValues[2],
            checkedStates[2] ? 'Yes' : 'No',
            subTotalValues[2]?.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            settings.otherQuoteValues[3],
            checkedStates[3] ? 'Yes' : 'No',
            subTotalValues[3]?.toLocaleString('en-US', {
              style: 'currency',
              currency: currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            'Total',
            '',
            {
              content: total.toLocaleString('en-US', {
                style: 'currency',
                currency: currency.replace(/[^A-Z]/g, '')
              }),
              styles: { fontStyle: 'bold' }
            }
          ]
        ],
        theme: 'grid',
        styles: { halign: 'center', valign: 'middle', fontSize: 9 },
        // Adjust the column widths to fill the sub-total area
        columnStyles: {
          0: { cellWidth: subTotalWidth * 0.51 },
          1: { cellWidth: subTotalWidth * 0.17 },
          2: { cellWidth: subTotalWidth * 0.35 }
        }
      });

      // 2. Comments section (full width, placed below the Sub-total block)
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5,
        margin: { left: 7 },
        body: [
          [
            {
              content: 'Comments or Special Instructions',
              styles: { halign: 'center', fontStyle: 'bold' }
            }
          ],
          [settings.commentsSpecialInstruction]
        ],
        theme: 'grid',
        styles: { halign: 'left', valign: 'middle' },
        // Make sure the table uses the full available width (pageWidth minus left/right margins)
        columnStyles: { 0: { cellWidth: pageWidth - 15 } }
      });

      // (Optional) Additional sections such as centered contact info can follow…
      const tableWidth = 195;
      const leftMargin = (pageWidth - tableWidth) / 2;
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5,
        body: [[settings.contactInfo + '\n' + settings.phone]],
        theme: 'grid',
        styles: { halign: 'center', valign: 'middle' },
        columnStyles: { 0: { cellWidth: tableWidth } },
        margin: { left: leftMargin }
      });

      // Save the PDF
      pdf.save('quote-' + quoteNumber + '.pdf');
    } catch (error) {
      console.error('PDF oluşturma sırasında bir hata oluştu:', error);
    }
  };
  useEffect(() => {
    console.log(quotePartRows);
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
            <tr className="text-center align-middle">
              <td colSpan={3}>{'ClientLocation'}</td>
              <td>{'ShipTo'}</td>
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
              <td style={{ width: '25%' }}>{'Requisitioner'}</td>
              <td style={{ width: '25%' }}>{'ShipVia'}</td>
              <td style={{ width: '25%' }}>{'CPT'}</td>
              <td style={{ width: '25%' }}>{'ShippingTerms'}</td>
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
