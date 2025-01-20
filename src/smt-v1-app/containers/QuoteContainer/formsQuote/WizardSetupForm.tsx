import { WizardFormData } from 'pages/modules/forms/WizardExample';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Row,
  Table
} from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
import Reka_Static from 'assets/img/logos/Reka_Static.jpg';
import './WizardTabs.css';

interface WizardSetupFormProps {
  id: string;
  settings: {
    adress: { row1: string; row2: string; row3: string };
    quotaNumber: string;
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
  };
  data: TableRow[];
  setData: (data: any[]) => void;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  subTotalValues: number[];
  setSubTotalValues: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrency: (currency: string) => void;
}

interface TableRow {
  partNumber: string;
  alternativeTo: string;
  description: string;
  leadTime: string;
  qty: number;
  unitPrice: number;
  isNew?: boolean;
  displayPrice?: string;
}

const WizardSetupForm: React.FC<WizardSetupFormProps> = ({
  settings,
  data,
  setData,
  setSelectedDate,
  subTotalValues,
  setSubTotalValues,
  setCurrency
}) => {
  const [revisionNumber] = useState(0);
  const [reqQTY, setReqQTY] = useState(1);
  const [currencyLocal, setCurrencyLocal] = useState('USD');

  // Para birimi sembollerini tanımlayalım
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    TRY: '₺'
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value);
    const formattedValue = formatCurrency(value);
    e.target.value = formattedValue;
  };

  // Para birimi formatlaması için yardımcı fonksiyon
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: currencyLocal.replace(/[^A-Z]/g, '') // Sembolleri kaldır
    });
  };

  const handleSubTotalChange = (index: number, value: number) => {
    const updatedValues = [...subTotalValues];
    updatedValues[index] = value;
    setSubTotalValues(updatedValues);
  };

  const handleCellChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleCurrencyChange = (selectedCurrency: string) => {
    const currencyCode = selectedCurrency.replace(/[^A-Z]/g, '');
    setCurrency(currencyCode);
    setCurrencyLocal(currencyCode);

    // Fake Currency Data
    const defaultQuantities: Record<string, number> = {
      USD: 35,
      EUR: 2,
      GBP: 3,
      TRY: 100
    };

    setReqQTY(defaultQuantities[currencyCode]);
  };

  const handleQtyChange = (index: number, value: number) => {
    const updatedData = [...data];
    updatedData[index].qty = value;
    setData(updatedData);
  };

  //fake data

  // Satır ekleme için fake data
  const addRow = (index: number) => {
    const newRow: TableRow = {
      partNumber: '',
      alternativeTo: '',
      description: '',
      leadTime: '',
      qty: 1,
      unitPrice: 0.0,
      isNew: true
    };

    const updatedData = [...data];
    updatedData.splice(index + 1, 0, newRow);
    setData(updatedData);
  };

  const deleteRow = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  // Unit price değişikliği için yeni handler
  const handleUnitPriceChange = (index: number, value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      unitPrice: numericValue,
      displayPrice: formatCurrency(numericValue)
    };
    setData(updatedData);
  };

  return (
    <>
      <div className="uppersection">
        <div className="upperleftsection">
          <Form.Group className="d-flex align-items-center gap-3 mb-5">
            <Form.Control
              value={reqQTY}
              onWheel={e => (e.target as HTMLInputElement).blur()}
              type="number"
              onChange={e => {
                setReqQTY(parseInt(e.target.value, 10) || 1);
              }}
              required
              style={{ width: '80px', paddingRight: '8px' }}
              min={1}
            />

            {/* Para Birimi Seçici */}
            <Dropdown>
              <Dropdown.Toggle variant="phoenix-secondary">
                {currencyLocal}
              </Dropdown.Toggle>
              <Dropdown.Menu className="py-2">
                <Dropdown.Item onClick={() => handleCurrencyChange('USD$')}>
                  USD$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('EUR€')}>
                  EUR€
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('GBP£')}>
                  GBP£
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => handleCurrencyChange('TRY₺')}>
                  TRY₺
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

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
            <h2 className="text-primary">QUOTE</h2>
            <Form>
              <Form.Group className="mb-3">
                <DatePicker
                  placeholder="Select a date"
                  onChange={selectedDates => {
                    selectedDates[0];
                    setSelectedDate(selectedDates[0]);
                  }}
                />
              </Form.Group>
            </Form>
            <p className="mt-2 small mt-3">
              <strong>Quote Number:</strong> {settings.quotaNumber}
            </p>
            <Badge bg="primary" className="small">
              REVISION {revisionNumber}
            </Badge>
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
              <td className="text-white align-middle">ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="text-center align-middle">
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.partNumber}
                      onChange={e =>
                        handleCellChange(index, 'partNumber', e.target.value)
                      }
                    />
                  ) : (
                    row.partNumber
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.alternativeTo}
                      onChange={e =>
                        handleCellChange(index, 'alternativeTo', e.target.value)
                      }
                    />
                  ) : (
                    row.alternativeTo || '-'
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.description}
                      onChange={e =>
                        handleCellChange(index, 'description', e.target.value)
                      }
                    />
                  ) : (
                    row.description
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        value={row.leadTime}
                        onChange={e =>
                          handleCellChange(index, 'leadTime', e.target.value)
                        }
                        style={{ width: '60px' }}
                        min={1}
                      />
                      <span className="ms-2">Days</span>
                    </div>
                  ) : (
                    `${row.leadTime} Days`
                  )}
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.qty}
                    onChange={e =>
                      handleCellChange(
                        index,
                        'qty',
                        parseInt(e.target.value, 10)
                      )
                    }
                    min={1}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={row.displayPrice || formatCurrency(row.unitPrice)}
                    onChange={e => handleUnitPriceChange(index, e.target.value)}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder={`0.00 ${currencySymbols[currencyLocal]}`}
                    disabled={!row.isNew}
                  />
                </td>
                <td>{formatCurrency(row.qty * row.unitPrice)}</td>
                <td className="button-cell">
                  <div className="action-buttons">
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => addRow(index)}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteRow(index)}
                    >
                      -
                    </Button>
                  </div>
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
              <Table bordered hover size="sm" className="mb-4">
                <thead>
                  <tr>
                    <th>Sub-Total</th>
                    <td></td>
                    <td>
                      <div className="mt-3 text-center">
                        <h5>
                          <span className="text-primary ms-2">
                            {formatCurrency(
                              data.reduce(
                                (acc, row) => acc + row.qty * row.unitPrice,
                                0
                              )
                            )}
                          </span>
                        </h5>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {settings.ST1 && (
                    <tr>
                      <td>{settings.ST1}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          defaultChecked
                          onChange={e =>
                            handleSubTotalChange(0, subTotalValues[0])
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={subTotalValues[0]}
                          onChange={e =>
                            handleSubTotalChange(
                              0,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onBlur={handleBlur}
                          onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                            e.currentTarget.blur()
                          }
                          placeholder="$1,000,000.00"
                          style={{
                            width: '110px',
                            paddingRight: '4px',
                            paddingLeft: '8px'
                          }}
                        />
                      </td>
                    </tr>
                  )}
                  {settings.ST2 && (
                    <tr>
                      <td>{settings.ST2}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          defaultChecked
                          onChange={e =>
                            handleSubTotalChange(1, subTotalValues[1])
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={subTotalValues[1]}
                          onChange={e =>
                            handleSubTotalChange(
                              1,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onBlur={handleBlur}
                          onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                            e.currentTarget.blur()
                          }
                          placeholder="$1,000,000.00"
                          style={{
                            width: '110px',
                            paddingRight: '4px',
                            paddingLeft: '8px'
                          }}
                        />
                      </td>
                    </tr>
                  )}
                  {settings.ST3 && (
                    <tr>
                      <td>{settings.ST3}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={e =>
                            handleSubTotalChange(2, subTotalValues[2])
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={subTotalValues[2]}
                          onChange={e =>
                            handleSubTotalChange(
                              2,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onBlur={handleBlur}
                          onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                            e.currentTarget.blur()
                          }
                          placeholder="$1,000,000.00"
                          style={{
                            width: '110px',
                            paddingRight: '4px',
                            paddingLeft: '8px'
                          }}
                        />
                      </td>
                    </tr>
                  )}
                  {settings.ST4 && (
                    <tr>
                      <td>{settings.ST4}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={e =>
                            handleSubTotalChange(3, subTotalValues[3])
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={subTotalValues[3]}
                          onChange={e =>
                            handleSubTotalChange(
                              3,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          onBlur={handleBlur}
                          onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                            e.currentTarget.blur()
                          }
                          placeholder="$1,000,000.00"
                          style={{
                            width: '110px',
                            paddingRight: '4px',
                            paddingLeft: '8px'
                          }}
                        />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2}>Total:</td>
                    <td>
                      <strong>
                        {formatCurrency(
                          data.reduce(
                            (acc, row) => acc + row.qty * row.unitPrice,
                            0
                          ) + subTotalValues.reduce((sum, val) => sum + val, 0)
                        )}
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
    </>
  );
};

export default WizardSetupForm;
