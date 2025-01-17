import React from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import Reka_Static from 'assets/img/logos/Reka_Static.jpg';
import './WizardTabs.css';
import Badge from 'components/base/Badge';

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
  selectedDate
}) => {
  return (
    <>
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
          <div className="quote-section mb-4 mt-6">
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
            <td>{settings.ShipTo}</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center align-middle">
            <td colSpan={3}>{settings.ClientLocation}</td>
            <td></td>
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
                    currency: 'USD'
                  })}
                </td>
                <td>
                  {(row.qty * row.unitPrice).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
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
              <Table bordered size="sm" className="sub-total-table mb-3">
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
                                currency: 'USD'
                              })}
                          </span>
                        </h5>
                      </div>
                    </td>
                  </tr>
                </thead>
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
    </>
  );
};

export default WizardPersonalForm;
