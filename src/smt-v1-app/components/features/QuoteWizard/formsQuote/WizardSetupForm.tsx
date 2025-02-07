import { WizardFormData } from 'pages/modules/forms/WizardExample';
import { useWizardFormContext } from 'providers/WizardFormProvider';
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';
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
import {
  QuotePartRow,
  QuoteWizardData,
  QuoteWizardSetting
} from '../QuoteWizard';
import { getPriceCurrencySymbol } from '../../RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

interface WizardSetupFormProps {
  id: string;
  currencies: string[];
  quoteWizardData: QuoteWizardData;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date;
  subTotalValues: number[];
  setSubTotalValues: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrency: (currency: string) => void;
  currency: string;
  checkedStates: boolean[];
  setCheckedStates: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const WizardSetupForm: React.FC<WizardSetupFormProps> = ({
  currencies,
  quoteWizardData,
  setSelectedDate,
  selectedDate,
  subTotalValues,
  setSubTotalValues,
  setCurrency,
  currency,
  checkedStates,
  setCheckedStates
}) => {
  const [quotePartRows, setQuotePartRows] = useState<QuotePartRow[]>([]);
  useEffect(() => {
    const formattedData = quoteWizardData.quoteWizardPartResponses.map(item => {
      return {
        ...item,
        id: item.quotePartId,
        unitPriceString: item.unitPrice
          ? formatNumberWithDecimals(item.unitPrice.toString())
          : ''
      };
    });
    console.log(formattedData);
    setQuotePartRows(formattedData);
  }, []);

  // Return revision number
  const [revisionNumber] = useState(quoteWizardData.revisionNumber);
  const [reqQTY, setReqQTY] = useState(1);
  const [currencyLocal, setCurrencyLocal] = useState(currency);
  const [displayValues, setDisplayValues] = useState([
    '0.00',
    '0.00',
    '0.00',
    '0.00'
  ]);

  const [tempIdCounter, setTempIdCounter] = useState(0);

  // Price Methods Start

  const formatNumber = (value: string): string => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  const formatRowTotal = (value: string): string => {
    // Split the input on the decimal point.
    const [integerPartRaw, fractionalPartRaw] = value.split('.');

    // Remove non-digit characters from the integer part.
    const integerDigits = integerPartRaw.replace(/\D/g, '');

    // Format the integer part with commas.
    const formattedInteger = integerDigits.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );

    // If there's a fractional part, remove non-digit characters from it as well.
    if (fractionalPartRaw !== undefined) {
      const fractionalDigits = fractionalPartRaw.replace(/\D/g, '');
      // Re-join the formatted integer part and the fractional part.
      return `${formattedInteger}.${fractionalDigits}`;
    } else {
      return formattedInteger;
    }
  };
  const formatNumberWithDecimals = (value: string): string => {
    // Split on the decimal point.
    const [integerPart, decimalPart] = value.split('.');
    // Format the integer part.
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return with the decimal part (if it exists)
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const formatCurrency = (
    inputValue: string,
    currency: string,
    blur: boolean = false
  ): { formatted: string; numericValue: number } => {
    // Handle empty
    if (!inputValue) {
      return { formatted: '', numericValue: 0 };
    }

    let inputVal = inputValue;
    // Check if the input has a decimal place
    if (inputVal.indexOf('.') >= 0) {
      // Split at decimal
      const decimalPos = inputVal.indexOf('.');
      let leftSide = inputVal.substring(0, decimalPos);
      let rightSide = inputVal.substring(decimalPos);

      // Format left side
      leftSide = formatNumber(leftSide);
      // Format right side
      rightSide = formatNumber(rightSide);

      if (blur) {
        // user left the field, so ensure trailing "00"
        rightSide += '00';
      }
      // Limit decimal to only 2 digits
      rightSide = rightSide.substring(0, 2);

      // Join back
      inputVal = `${getPriceCurrencySymbol(currency)}${leftSide}.${rightSide}`;
    } else {
      // no decimal entered
      inputVal = `${getPriceCurrencySymbol(currency)}${formatNumber(inputVal)}`;

      // If blur, add .00
      if (blur) {
        inputVal += '.00';
      }
    }

    // Convert the formatted string to a numeric value
    // 1) remove currency symbol
    const parts = inputVal.split(getPriceCurrencySymbol(currency));
    const numericString = parts[1] || '0'; // everything after the symbol

    // 2) remove commas
    const raw = numericString.replace(/,/g, '');
    // 3) parse float
    const parsedNumber = parseFloat(raw) || 0;

    return {
      formatted: inputVal,
      numericValue: Math.round(parsedNumber * 100) / 100 // rounding to 2 decimals
    };
  };
  const handleUnitPriceChange = (newValue: string, rowId: string | number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row => {
        if (row.id === rowId) {
          const { formatted, numericValue } = formatCurrency(
            newValue,
            row.currency
          );
          return {
            ...row,
            unitPriceString: formatted,
            unitPrice: numericValue
          };
        }
        return row;
      })
    );
  };

  const handleUnitPriceBlur = (newValue: string, rowId: string | number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row => {
        if (row.tempId === rowId) {
          const { formatted, numericValue } = formatCurrency(
            row.unitPriceString,
            row.currency,
            true
          );
          return {
            ...row,
            unitPriceString: formatted,
            unitPrice: numericValue
          };
        }
        return row;
      })
    );
  };
  // Price Methods End

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

  const addRow = () => {
    // ***
    const newRow: QuotePartRow = {
      id: `temp-${tempIdCounter}`,
      tempId: tempIdCounter,
      partNumber: '',
      alternativeTo: '',
      currency: quoteWizardData.currency,
      description: '',
      reqCondition: 'NE',
      fndCondition: 'NE',
      quotePartId: null,
      leadTime: 0,
      quantity: 1,
      unitPrice: 0.0,
      isNew: true,
      unitPriceString: '0.00'
    };

    const updatedData = [...quotePartRows, newRow];
    setTempIdCounter(tempIdCounter + 1);
    console.log(updatedData);
    setQuotePartRows(updatedData);
  };

  const deleteRow = (tempId: number, quotePartId: string) => {
    // ***
    let updatedData = quotePartRows;
    if (tempId !== undefined) {
      updatedData = quotePartRows.filter(quote => quote.tempId !== tempId);
    } else if (quotePartId !== undefined && quotePartId !== null) {
      updatedData = quotePartRows.filter(
        quote => quote.quotePartId !== quotePartId
      );
    } else {
      console.log('there is a bug in deleteRow');
    }
    setQuotePartRows(updatedData);
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

  //  Handle Functions
  const handleCheckboxChange = (index: number, checked: boolean) => {
    const newCheckedStates = [...checkedStates];
    newCheckedStates[index] = checked;
    setCheckedStates(newCheckedStates);
  };

  const handlePartNumberChange = (value: string, tempId: number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.tempId === tempId ? { ...row, partNumber: value } : row
      )
    );
  };

  const handleAlternativePartChange = (value: string, tempId: number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.tempId === tempId ? { ...row, alternativeTo: value } : row
      )
    );
  };

  const handleDescriptionChange = (value: string, tempId: number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.tempId === tempId ? { ...row, description: value } : row
      )
    );
  };

  const handleLeadTimeChange = (value: number, tempId: number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.tempId === tempId ? { ...row, leadTime: value } : row
      )
    );
  };
  const handleQuantityChange = (value: number, rowId: string) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, quantity: value } : row
      )
    );
  };

  const handleReqCondition = (value: string, rowId: string) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, reqCondition: value } : row
      )
    );
  };
  const handleFndCondition = (value: string, rowId: string) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, fndCondition: value } : row
      )
    );
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
            <Form.Select
              value={currencyLocal}
              onChange={e => setCurrencyLocal(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Card style={{ width: '18rem' }} className="border-0 mb-5">
            <Card.Img
              variant="top"
              src={quoteWizardData.quoteWizardSetting.logo}
            />
            <Card.Body className="p-0 px-1 fs-9 w-100">
              <Card.Text className="mb-2 pt-2">
                {quoteWizardData.quoteWizardSetting.addressRow1}
              </Card.Text>
              <Card.Text className="mb-2">
                {quoteWizardData.quoteWizardSetting.addressRow2}
              </Card.Text>
              <Card.Text>
                {quoteWizardData.quoteWizardSetting.mobilePhone}
              </Card.Text>
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
                  value={selectedDate}
                  onChange={selectedDates => {
                    selectedDates[0];
                    setSelectedDate(selectedDates[0]);
                  }}
                />
              </Form.Group>
            </Form>
            <p className="mt-2 small mt-3">
              <strong>Quote Number:</strong> {quoteWizardData.quoteNumberId}
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
            <td colSpan={3}>{'Client Location'}</td>
            <td>{'SHIP TO From DB'}</td>
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
              <td
                className="text-white align-middle"
                style={{ minWidth: '100px' }}
              >
                TOTAL
              </td>
              <td className="text-white align-middle">ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {quotePartRows.map((row, index) => (
              <tr key={row.tempId} className="text-center align-middle">
                <td>
                  {row.isNew ? (
                    <Form.Control
                      type="text"
                      value={row.partNumber}
                      onChange={e =>
                        handlePartNumberChange(e.target.value, row.tempId)
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
                        handleAlternativePartChange(e.target.value, row.tempId)
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
                        handleDescriptionChange(e.target.value, row.tempId)
                      }
                    />
                  ) : (
                    row.description
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <Form.Select
                      value={row.reqCondition}
                      onChange={e => handleReqCondition(e.target.value, row.id)}
                    >
                      <option value="NE">NE</option>
                      <option value="FN">FN</option>
                      <option value="NS">NS</option>
                      <option value="OH">OH</option>
                      <option value="SV">SV</option>
                      <option value="AR">AR</option>
                      <option value="RP">RP</option>
                      <option value="IN">IN</option>
                      <option value="TST">TST</option>
                    </Form.Select>
                  ) : (
                    row.reqCondition
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <Form.Select
                      value={row.fndCondition}
                      onChange={e => handleFndCondition(e.target.value, row.id)}
                    >
                      <option value="NE">NE</option>
                      <option value="FN">FN</option>
                      <option value="NS">NS</option>
                      <option value="OH">OH</option>
                      <option value="SV">SV</option>
                      <option value="AR">AR</option>
                      <option value="RP">RP</option>
                      <option value="IN">IN</option>
                      <option value="TST">TST</option>
                    </Form.Select>
                  ) : (
                    row.fndCondition
                  )}
                </td>
                <td>
                  {row.isNew ? (
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        value={row.leadTime}
                        onChange={e =>
                          handleLeadTimeChange(
                            Number(e.target.value),
                            row.tempId
                          )
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
                    value={row.quantity}
                    onChange={e =>
                      handleQuantityChange(parseInt(e.target.value, 10), row.id)
                    }
                    min={1}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={row.unitPriceString}
                    onChange={e =>
                      handleUnitPriceChange(e.target.value, row.id)
                    }
                    onBlur={e => handleUnitPriceBlur(e.target.value, row.id)}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                      e.currentTarget.blur()
                    }
                    placeholder={
                      getPriceCurrencySymbol(row.currency) + '1,000,000.00'
                    }
                  />
                </td>
                <td>
                  {getPriceCurrencySymbol(currency) +
                    ' ' +
                    formatRowTotal((row.quantity * row.unitPrice).toString())}
                </td>
                <td className="button-cell">
                  <div className="action-buttons">
                    <Button
                      variant="success"
                      size="sm"
                      className="me-1"
                      onClick={() => addRow()}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteRow(row.tempId, row.quotePartId)}
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
                  <td className="p-2">
                    {
                      quoteWizardData.quoteWizardSetting
                        .commentsSpecialInstruction
                    }
                  </td>
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
                            {formatNumberWithDecimals(
                              quotePartRows
                                .reduce(
                                  (acc, row) =>
                                    acc + row.quantity * row.unitPrice,
                                  0
                                )
                                .toString()
                            )}{' '}
                            {getPriceCurrencySymbol(currency)}
                          </span>
                        </h5>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {quoteWizardData && (
                    <tr>
                      <td>
                        {quoteWizardData.quoteWizardSetting.otherQuoteValues[0]}
                      </td>
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
                            getPriceCurrencySymbol(currency) +
                            (displayValues[0] ||
                              formatNumberInput(subTotalValues[0].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              getPriceCurrencySymbol(currency),
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
                  {quoteWizardData && (
                    <tr>
                      <td>
                        {quoteWizardData.quoteWizardSetting.otherQuoteValues[1]}
                      </td>
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
                            getPriceCurrencySymbol(currency) +
                            (displayValues[1] ||
                              formatNumberInput(subTotalValues[1].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              getPriceCurrencySymbol(currency),
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
                  {quoteWizardData && (
                    <tr>
                      <td>
                        {quoteWizardData.quoteWizardSetting.otherQuoteValues[2]}
                      </td>
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
                            getPriceCurrencySymbol(currency) +
                            (displayValues[2] ||
                              formatNumberInput(subTotalValues[2].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              getPriceCurrencySymbol(currency),
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
                  {quoteWizardData && (
                    <tr>
                      <td>
                        {quoteWizardData.quoteWizardSetting.otherQuoteValues[3]}
                      </td>
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
                            getPriceCurrencySymbol(currency) +
                            (displayValues[3] ||
                              formatNumberInput(subTotalValues[3].toString()))
                          }
                          onChange={e => {
                            const value = e.target.value.replace(
                              getPriceCurrencySymbol(currency),
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
                        {formatNumberWithDecimals(
                          (
                            quotePartRows.reduce(
                              (acc, row) => acc + row.quantity * row.unitPrice,
                              0
                            ) +
                            subTotalValues.reduce(
                              (sum, val, index) =>
                                sum + (checkedStates[index] ? val : 0),
                              0
                            )
                          ).toString() // Convert the final sum to a string AFTER calculation
                        )}{' '}
                        {getPriceCurrencySymbol(currency)}
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
                  {quoteWizardData.quoteWizardSetting.contactInfo}
                  <br />
                  {quoteWizardData.quoteWizardSetting.phone}
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
