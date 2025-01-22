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
  checkedStates: boolean[];
  setCheckedStates: React.Dispatch<React.SetStateAction<boolean[]>>;
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
  setCurrency,
  checkedStates,
  setCheckedStates
}) => {
  const [revisionNumber] = useState(0);
  const [reqQTY, setReqQTY] = useState(1);
  const [currencyLocal, setCurrencyLocal] = useState('USD');
  const [displayValues, setDisplayValues] = useState([
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);

  // Para birimi sembollerini tanımlayalım
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    TRY: '₺',
    RUB: '₽',
    JPY: '¥',
    CNY: '¥',
    CAD: 'CA$',
    NZD: 'NZ$',
    AUD: '$',
    MXN: '$',
    CHF: 'Fr',
    SEK: 'SEK',
    NOK: 'NOK',
    SGD: 'S$',
    HKD: 'HK$',
    INR: '₹',
    BRL: 'R$',
    KRW: '₩',
    DKK: 'kr',
    ZAR: 'R',
    AED: 'د.إ',
    SAR: '﷼',
    MYR: 'RM',
    THB: '฿',
    IDR: 'Rp',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    ILS: '₪'
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

  const handleSubTotalChange = (index: number, value: string) => {
    let cleanValue = value.replace(/[^0-9.]/g, '');

    // Update display value immediately for responsive input
    const newDisplayValues = [...displayValues];
    newDisplayValues[index] = cleanValue;
    setDisplayValues(newDisplayValues);

    // Handle decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
      cleanValue = parts.join('.');
    }

    const numericValue = parseFloat(cleanValue) || 0;
    const updatedValues = [...subTotalValues];
    updatedValues[index] = numericValue;
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

  const formatNumberInput = (value: string): string => {
    // Remove all non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Handle empty input
    if (!cleanValue) return '';

    // Split on decimal point
    const parts = cleanValue.split('.');

    // Format the whole number part with commas
    let wholeNumber = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (!wholeNumber) wholeNumber = '0';

    // Add decimal part if it exists, limit to 2 digits
    let decimalPart = '';
    if (cleanValue.includes('.')) {
      decimalPart = `.${(parts[1] || '').slice(0, 2)}`;
    }

    return wholeNumber + decimalPart;
  };

  const handleUnitPriceChange = (index: number, value: string) => {
    let cleanValue = value.replace(/[^0-9.]/g, '');

    // Handle decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
      cleanValue = parts.join('.');
    }

    if (!cleanValue) {
      // Handle empty input
      const updatedData = [...data];
      updatedData[index] = {
        ...updatedData[index],
        unitPrice: 0,
        displayPrice: ''
      };
      setData(updatedData);
      return;
    }

    const numericValue = parseFloat(cleanValue);
    if (isNaN(numericValue)) return;

    const updatedData = [...data];
    updatedData[index] = {
      ...updatedData[index],
      unitPrice: numericValue,
      displayPrice:
        currencySymbols[currencyLocal] + formatNumberInput(cleanValue)
    };
    setData(updatedData);
  };

  // Checkbox değişikliğini handle eden fonksiyonu güncelliyoruz
  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = checked;
    setCheckedStates(newCheckedStates);
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
                  USD-$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('EUR€')}>
                  EUR-€
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('GBP£')}>
                  GBP-£
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('TRY₺')}>
                  TRY-₺
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('JPY')}>
                  JPY-¥
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('CNY¥')}>
                  CNY-¥
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('CAD')}>
                  CAD-CA$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('AUD')}>
                  AUD-A$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('MXN')}>
                  MXN-$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('NZD$')}>
                  NZD-NZ$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('CHF')}>
                  CHF-Fr
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('SGD')}>
                  SGD-S$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('HKD$')}>
                  HKD-HK$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('ZAR')}>
                  ZAR-R
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('INR₹')}>
                  INR-₹
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('BRL$')}>
                  BRL-R$
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('KRW₩')}>
                  KRW-₩
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('DKK kr')}>
                  DKK-kr
                </Dropdown.Item>

                <Dropdown.Item onClick={() => handleCurrencyChange('AEDد.إ')}>
                  AED-د.إ
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('SAR﷼')}>
                  SAR-﷼
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('MYR')}>
                  MYR-RM
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('THB฿')}>
                  THB-฿
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('IDR')}>
                  IDR-Rp
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('PLNzł')}>
                  PLN-zł
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('CZK')}>
                  CZK-Kč
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('HUF')}>
                  HUF-Ft
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleCurrencyChange('ILS₪')}>
                  ILS-₪
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
                        style={{ width: '75px' }}
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
                    value={
                      row.displayPrice ||
                      (row.unitPrice
                        ? currencySymbols[currencyLocal] +
                          formatNumberInput(row.unitPrice.toString())
                        : currencySymbols[currencyLocal] + '0.00')
                    }
                    onChange={e => handleUnitPriceChange(index, e.target.value)}
                    onBlur={e => {
                      const numericValue =
                        parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                      const hasDecimal = e.target.value.includes('.');
                      const formattedValue =
                        currencySymbols[currencyLocal] +
                        formatNumberInput(numericValue.toString()) +
                        (!hasDecimal ? '.00' : '');

                      const updatedData = [...data];
                      updatedData[index] = {
                        ...updatedData[index],
                        unitPrice: numericValue,
                        displayPrice: formattedValue
                      };
                      setData(updatedData);
                    }}
                    onKeyDown={e => {
                      if (e.key === '.') {
                        const currentValue = e.currentTarget.value;
                        if (!currentValue.includes('.')) {
                          const newValue = currentValue + '.';
                          handleUnitPriceChange(index, newValue);
                        }
                        e.preventDefault();
                      }
                    }}
                    onWheel={e => e.currentTarget.blur()}
                    placeholder="0.00"
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
                          checked={checkedStates[0]}
                          onChange={e =>
                            handleCheckboxChange(0, e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            currencySymbols[currencyLocal] +
                            (displayValues[0] ||
                              formatNumberInput(subTotalValues[0].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              currencySymbols[currencyLocal],
                              ''
                            );
                            handleSubTotalChange(0, value);
                          }}
                          onBlur={e => {
                            const numericValue =
                              parseFloat(
                                e.target.value.replace(/[^0-9.]/g, '')
                              ) || 0;

                            // Sayıyı iki ondalık basamaklı formata çeviriyoruz
                            const formattedNumber = numericValue.toFixed(2);
                            const formattedValue =
                              formatNumberInput(formattedNumber);

                            const newDisplayValues = [...displayValues];
                            newDisplayValues[0] = formattedValue;
                            setDisplayValues(newDisplayValues);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                          onWheel={e => e.currentTarget.blur()}
                          placeholder="0.00"
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
                          checked={checkedStates[1]}
                          onChange={e =>
                            handleCheckboxChange(1, e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            currencySymbols[currencyLocal] +
                            (displayValues[1] ||
                              formatNumberInput(subTotalValues[1].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              currencySymbols[currencyLocal],
                              ''
                            );
                            handleSubTotalChange(1, value);
                          }}
                          onBlur={e => {
                            const numericValue =
                              parseFloat(
                                e.target.value.replace(/[^0-9.]/g, '')
                              ) || 0;

                            // Sayıyı iki ondalık basamaklı formata çeviriyoruz
                            const formattedNumber = numericValue.toFixed(2);
                            const formattedValue =
                              formatNumberInput(formattedNumber);

                            const newDisplayValues = [...displayValues];
                            newDisplayValues[1] = formattedValue;
                            setDisplayValues(newDisplayValues);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                          onWheel={e => e.currentTarget.blur()}
                          placeholder="0.00"
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
                          checked={checkedStates[2]}
                          onChange={e =>
                            handleCheckboxChange(2, e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            currencySymbols[currencyLocal] +
                            (displayValues[2] ||
                              formatNumberInput(subTotalValues[2].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              currencySymbols[currencyLocal],
                              ''
                            );
                            handleSubTotalChange(2, value);
                          }}
                          onBlur={e => {
                            const numericValue =
                              parseFloat(
                                e.target.value.replace(/[^0-9.]/g, '')
                              ) || 0;

                            // Sayıyı iki ondalık basamaklı formata çeviriyoruz
                            const formattedNumber = numericValue.toFixed(2);
                            const formattedValue =
                              formatNumberInput(formattedNumber);

                            const newDisplayValues = [...displayValues];
                            newDisplayValues[2] = formattedValue;
                            setDisplayValues(newDisplayValues);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                          onWheel={e => e.currentTarget.blur()}
                          placeholder="0.00"
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
                          checked={checkedStates[3]}
                          onChange={e =>
                            handleCheckboxChange(3, e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={
                            currencySymbols[currencyLocal] +
                            (displayValues[3] ||
                              formatNumberInput(subTotalValues[3].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              currencySymbols[currencyLocal],
                              ''
                            );
                            handleSubTotalChange(3, value);
                          }}
                          onBlur={e => {
                            const numericValue =
                              parseFloat(
                                e.target.value.replace(/[^0-9.]/g, '')
                              ) || 0;

                            // Sayıyı iki ondalık basamaklı formata çeviriyoruz
                            const formattedNumber = numericValue.toFixed(2);
                            const formattedValue =
                              formatNumberInput(formattedNumber);

                            const newDisplayValues = [...displayValues];
                            newDisplayValues[3] = formattedValue;
                            setDisplayValues(newDisplayValues);
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur();
                            }
                          }}
                          onWheel={e => e.currentTarget.blur()}
                          placeholder="0.00"
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
                          ) +
                            subTotalValues.reduce(
                              (sum, val, index) =>
                                // Sadece seçili olan checkbox'ların değerlerini topla
                                sum + (checkedStates[index] ? val : 0),
                              0
                            )
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
