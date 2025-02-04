import React from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import Reka_Static from 'assets/img/logos/Reka_Static.jpg';
import './WizardTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

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
  checkedStates: boolean[]; // Add this new prop
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
  selectedDate,
  checkedStates // Add this new prop
}) => {
  const generatePDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.width;

      // Logo
      pdf.addImage(Reka_Static, 'JPEG', 10, 10, 45, 20);
      pdf.setFontSize(10);

      //Adres
      const maxWidth = 80; // Metnin taşmayacağı maksimum genişlik (mm)
      const row1Lines = pdf.splitTextToSize(settings.adress.row1, maxWidth);
      const row2Lines = pdf.splitTextToSize(settings.adress.row2, maxWidth);
      const row3Lines = pdf.splitTextToSize(settings.adress.row3, maxWidth);
      let currentY = 45; // İlk satırın başlangıç Y pozisyonu
      row1Lines.forEach(line => {
        pdf.text(line, 10, currentY);
        currentY += 5; // Bir sonraki satırın Y pozisyonunu ayarla
      });

      row2Lines.forEach(line => {
        pdf.text(line, 10, currentY);
        currentY += 5;
      });

      row3Lines.forEach(line => {
        pdf.text(line, 10, currentY);
        currentY += 5;
      });

      // Quote başlığı ve detayları
      pdf.setFontSize(25);
      pdf.setFont('helvetica', 'bold'); // Yazı tipini kalın (bold) yap
      pdf.setTextColor(51, 102, 204); // Metin rengini mavi yap
      pdf.text('QUOTE', pageWidth - 60, 20);

      // Varsayılan renk ve yazı tipine geri dön
      pdf.setFont('helvetica', 'normal'); // Normal yazı tipi
      pdf.setTextColor(0, 0, 0); // Siyah renk
      pdf.setFontSize(10);
      pdf.text(
        `Date: ${selectedDate?.toLocaleDateString()}`,
        pageWidth - 60,
        30
      );
      pdf.text(`Quote Number: ${settings.quotaNumber}`, pageWidth - 60, 35);

      // Client bilgileri tablosu
      autoTable(pdf, {
        startY: 65,
        head: [['CLIENT LOCATION', 'SHIP TO']],
        body: [[settings.ClientLocation, settings.ShipTo]],
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'center', valign: 'middle' },
        columnStyles: {
          0: { cellWidth: 140 },
          1: { cellWidth: 50 }
        },
        margin: { left: 10 }
      });

      // Shipping detayları tablosu
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5 || 70,
        head: [['REQUISITIONER', 'SHIP VIA', 'CPT', 'SHIPPING TERMS']],
        body: [
          [
            settings.Requisitioner,
            settings.ShipVia,
            settings.CPT,
            settings.ShippingTerms
          ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'center', valign: 'middle' },
        columnStyles: {
          0: { cellWidth: 47.5 },
          1: { cellWidth: 47.5 },
          2: { cellWidth: 47.5 },
          3: { cellWidth: 47.5 }
        },
        margin: { left: 10 }
      });

      // Ana ürün tablosu
      const tableBody = data.map(row => [
        row.partNumber,
        row.alternativeTo || '-',
        row.description,
        `${row.leadTime} Days`,
        row.qty,
        row.unitPrice.toLocaleString('en-US', {
          style: 'currency',
          currency: settings.currency.replace(/[^A-Z]/g, '')
        }),
        (row.qty * row.unitPrice).toLocaleString('en-US', {
          style: 'currency',
          currency: settings.currency.replace(/[^A-Z]/g, '')
        })
      ]);
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5 || 70,
        head: [
          [
            'PART NUMBER',
            'ALTERNATIVE TO',
            'DESCRIPTION',
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
          0: { cellWidth: 28 },
          1: { cellWidth: 28 },
          2: { cellWidth: 50 },
          3: { cellWidth: 20 },
          4: { cellWidth: 14 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 }
        },
        margin: { left: 10 }
      });

      // Alt toplam ve notlar
      const total =
        data.reduce((acc, row) => acc + row.qty * row.unitPrice, 0) +
        subTotalValues.reduce(
          (sum, val, index) => sum + (checkedStates[index] ? val : 0),
          0
        );

      // Ana ürün tablosundan sonraki Y pozisyonu
      const startYPosition = (pdf as any).lastAutoTable?.finalY + 5 || 70;

      // Sol taraftaki Comments bölümü (sayfanın %60'ı)
      autoTable(pdf, {
        startY: startYPosition,
        body: [['Comments or Special Instructions'], [settings.CoSI]],
        theme: 'grid',
        styles: { halign: 'left', valign: 'middle' },
        columnStyles: { 0: { cellWidth: 105 } },
        margin: { left: 10 }
      });

      // Sağ taraftaki Sub-total bölümü (sayfanın %40'ı)
      const subTotal = data.reduce(
        (acc, row) => acc + row.qty * row.unitPrice,
        0
      );
      autoTable(pdf, {
        startY: startYPosition,
        margin: { left: 125 },
        body: [
          [
            'Sub-Total',
            '',
            {
              content: subTotal.toLocaleString('en-US', {
                style: 'currency',
                currency: settings.currency.replace(/[^A-Z]/g, '')
              }),
              styles: { fontStyle: 'bold' }
            }
          ],
          [
            settings.ST1,
            checkedStates[0] ? 'Yes' : 'No',
            subTotalValues[0]?.toLocaleString('en-US', {
              style: 'currency',
              currency: settings.currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            settings.ST2,
            checkedStates[1] ? 'Yes' : 'No',
            subTotalValues[1]?.toLocaleString('en-US', {
              style: 'currency',
              currency: settings.currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            settings.ST3,
            checkedStates[2] ? 'Yes' : 'No',
            subTotalValues[2]?.toLocaleString('en-US', {
              style: 'currency',
              currency: settings.currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            settings.ST4,
            checkedStates[3] ? 'Yes' : 'No',
            subTotalValues[3]?.toLocaleString('en-US', {
              style: 'currency',
              currency: settings.currency.replace(/[^A-Z]/g, '')
            })
          ],
          [
            'Total',
            '',
            {
              content: total.toLocaleString('en-US', {
                style: 'currency',
                currency: settings.currency.replace(/[^A-Z]/g, '')
              }),
              styles: { fontStyle: 'bold' }
            }
          ]
        ],
        theme: 'grid',
        styles: { halign: 'center', valign: 'middle', fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 10 },
          2: { cellWidth: 25 }
        }
      });

      // Alttaki diğer Comments bölümleri
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5,
        body: [['Comments or Special Instructions'], [settings.CoSI2]],
        theme: 'grid',
        headStyles: { fillColor: [51, 102, 204], textColor: 255 },
        styles: { halign: 'left', valign: 'middle' },
        columnStyles: { 0: { cellWidth: 190 } },
        margin: { left: 10 }
      });

      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable?.finalY + 5,
        body: [[settings.CoSI3.CoSIRow1], [settings.CoSI3.CoSIRow2]],
        theme: 'grid',
        styles: { halign: 'left', valign: 'middle' },
        columnStyles: { 0: { cellWidth: 190 } },
        margin: { left: 10 }
      });

      // PDF'i kaydet
      pdf.save('quote.pdf');
    } catch (error) {
      console.error('PDF oluşturma sırasında bir hata oluştu:', error);
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
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[0]}
                          disabled
                        />
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
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[1]}
                          disabled
                        />
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
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[2]}
                          disabled
                        />
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
                        <Form.Check
                          type="checkbox"
                          checked={checkedStates[3]}
                          disabled
                        />
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
                            subTotalValues.reduce(
                              (sum, val, index) =>
                                sum + (checkedStates[index] ? val : 0), // Update total calculation
                              0
                            )
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
