import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
// import './WizardTabs.css';
import { QuotePartRow, QuoteWizardData, PIResponseData } from '../PIWizard';
import { getPriceCurrencySymbol } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

interface WizardSetupFormProps {
  id: string;
  currencies: string[];
  quoteWizardData: QuoteWizardData;
  quotePartRows: QuotePartRow[];
  setQuotePartRows: React.Dispatch<React.SetStateAction<QuotePartRow[]>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date;
  subTotalValues: number[];
  setSubTotalValues: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrency: (currency: string) => void;
  currency: string;
  checkedStates: boolean[];
  setCheckedStates: React.Dispatch<React.SetStateAction<boolean[]>>;
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
    contractNo?: string;
    setContractNo: React.Dispatch<React.SetStateAction<string | undefined>>;
    isInternational: boolean;
    setIsInternational: React.Dispatch<React.SetStateAction<boolean>>;
    validityDay?: number;
    setValidityDay: React.Dispatch<React.SetStateAction<number | undefined>>;
    selectedBank: any;
    setSelectedBank: React.Dispatch<React.SetStateAction<any>>;
  };
  piResponseData?: PIResponseData;
}

const WizardSetupForm: React.FC<WizardSetupFormProps> = ({
  id,
  currencies,
  quoteWizardData,
  quotePartRows,
  setQuotePartRows,
  setSelectedDate,
  selectedDate,
  subTotalValues,
  setSubTotalValues,
  setCurrency,
  currency,
  checkedStates,
  setCheckedStates,
  setupOtherProps,
  piResponseData
}) => {
  // Add console.log to check PIResponseData
  console.log('PIResponseData received:', piResponseData);
  console.log('PIResponseData parts:', piResponseData?.piParts);
  console.log('PIResponseData company info:', {
    logo: piResponseData?.logo,
    companyAddress: piResponseData?.companyAddress,
    companyTelephone: piResponseData?.companyTelephone
  });

  useEffect(() => {
    if (piResponseData) {
      console.log('Processing PIResponseData in useEffect');
      // Set initial values from PIResponseData
      setupOtherProps.setClientLocation(piResponseData.clientLegalAddress);
      setupOtherProps.setShipTo(piResponseData.clientName);
      setupOtherProps.setContractNo(piResponseData.contractNo);
      setupOtherProps.setIsInternational(piResponseData.isInternational);
      setupOtherProps.setValidityDay(piResponseData.validityDay);
      setupOtherProps.setCPT(piResponseData.deliveryTerm);
      setupOtherProps.setShippingTerms(piResponseData.paymentTerm);

      // Set quote part rows from piParts with formatted unit prices
      const formattedParts = piResponseData.piParts.map(part => {
        console.log('Processing part:', part);
        const { formatted: formattedPrice, numericValue } = formatCurrency(
          part.unitPrice?.toString() || '0',
          part.currency || 'USD'
        );
        return {
          ...part,
          isNew: false,
          unitPrice: numericValue,
          unitPriceString: formattedPrice,
          tempId: undefined,
          id:
            part.quotePartId ||
            `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          alternativeTo: part.alternativeTo || '',
          currency: part.currency || 'USD',
          description: part.description || '',
          fndCondition: part.fndCondition || 'NE',
          leadTime: part.leadTime || 0,
          partNumber: part.partNumber || '',
          quantity: part.quantity || 1,
          reqCondition: part.reqCondition || 'NE'
        };
      });
      console.log('Formatted parts:', formattedParts);
      setQuotePartRows(formattedParts);

      // Set subTotalValues and checkedStates based on shipping options
      const newSubTotalValues = [
        piResponseData.airCargoToX.airCargoToX,
        piResponseData.sealineToX.sealineToX,
        piResponseData.truckCarriageToX.truckCarriageToX,
        0 // Additional value if needed
      ];
      console.log('New subTotalValues:', newSubTotalValues);
      setSubTotalValues(newSubTotalValues);

      const newCheckedStates = [
        piResponseData.airCargoToX.included,
        piResponseData.sealineToX.included,
        piResponseData.truckCarriageToX.included,
        false // Additional value if needed
      ];
      console.log('New checkedStates:', newCheckedStates);
      setCheckedStates(newCheckedStates);

      // Set other values
      setupOtherProps.setCPT(piResponseData.deliveryTerm || '');
      setupOtherProps.setShippingTerms(piResponseData.paymentTerm || '');
      console.log('Set other values:', {
        deliveryTerm: piResponseData.deliveryTerm,
        paymentTerm: piResponseData.paymentTerm
      });
    } else if (quoteWizardData?.quoteWizardPartResponses) {
      console.log('Processing quoteWizardData instead of PIResponseData');
      const formattedData = quoteWizardData.quoteWizardPartResponses.map(
        item => {
          const { formatted: formattedPrice, numericValue } = formatCurrency(
            item.unitPrice?.toString() || '0',
            item.currency || currency
          );
          return {
            ...item,
            id: item.quotePartId,
            unitPrice: numericValue,
            unitPriceString: formattedPrice
          };
        }
      );
      console.log('Formatted quote data:', formattedData);
      setQuotePartRows(formattedData);
    }
  }, [quoteWizardData, piResponseData]);

  // Return revision number
  const [revisionNumber] = useState(quoteWizardData?.revisionNumber || 0);
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
    if (!value) return '0.00';

    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';

    const [integerPart, decimalPart] = num.toFixed(2).split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${formattedInteger}.${decimalPart}`;
  };
  const formatNumberWithDecimals = (value: string): string => {
    if (!value) return '0.00';

    // Convert to number and format with exactly 2 decimal places
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = num.toFixed(2).split('.');

    // Format integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Always return with 2 decimal places
    return `${formattedInteger}.${decimalPart}`;
  };

  const formatCurrency = (
    inputValue: string,
    currency: string,
    blur: boolean = false
  ): { formatted: string; numericValue: number } => {
    // Handle empty or invalid input
    if (!inputValue || inputValue === 'NaN' || inputValue === 'undefined') {
      return { formatted: '', numericValue: 0 };
    }

    let inputVal = inputValue.toString();

    // Remove any existing currency symbol
    inputVal = inputVal.replace(getPriceCurrencySymbol(currency), '');

    // Remove all non-numeric characters except decimal point
    inputVal = inputVal.replace(/[^0-9.]/g, '');

    // Handle decimal places - truncate to 2 digits without rounding
    const parts = inputVal.split('.');
    if (parts.length > 1) {
      inputVal =
        parts[0] +
        '.' +
        (parts[1].length > 2 ? parts[1].substring(0, 2) : parts[1]);
    }

    const numericValue = parseFloat(inputVal);

    // Format with commas for thousands
    const [integerPart, decimalPart = '00'] = inputVal.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const paddedDecimal = decimalPart.padEnd(2, '0');

    const formatted = `${getPriceCurrencySymbol(
      currency
    )}${formattedInteger}.${paddedDecimal}`;

    return {
      formatted,
      numericValue
    };
  };

  const handleUnitPriceChange = (newValue: string, rowId: string | number) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row => {
        if (row.id === rowId || row.tempId === rowId) {
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
        if (row.id === rowId || row.tempId === rowId) {
          const { formatted, numericValue } = formatCurrency(
            newValue,
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
      no: 0,
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

  const handlePartNumberChange = (
    value: string,
    identifier: number | string
  ) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        (row.tempId != null ? row.tempId === identifier : row.id === identifier)
          ? { ...row, partNumber: value }
          : row
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

  const handleDescriptionChange = (
    value: string,
    identifier: number | string
  ) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        (row.tempId != null ? row.tempId === identifier : row.id === identifier)
          ? { ...row, description: value }
          : row
      )
    );
  };

  const handleLeadTimeChange = (value: number, identifier: number | string) => {
    setQuotePartRows(prevRows =>
      prevRows.map(row =>
        (row.tempId != null ? row.tempId === identifier : row.id === identifier)
          ? { ...row, leadTime: value }
          : row
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

  // Add function to handle row numbering
  const getRowNumber = (index: number) => {
    return index + 1;
  };

  // Add function to handle row deletion
  const handleDeleteRow = (index: number) => {
    const newRows = [...quotePartRows];
    newRows.splice(index, 1);
    setQuotePartRows(newRows);
  };

  // Add function to handle row addition
  const handleAddRow = () => {
    const newRow: QuotePartRow = {
      no: 0,
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tempId: Date.now(),
      partNumber: '',
      alternativeTo: '',
      currency: currency,
      description: '',
      reqCondition: 'NE',
      fndCondition: 'NE',
      quotePartId: null,
      leadTime: 0,
      quantity: 1,
      unitPrice: 0,
      isNew: true,
      unitPriceString: '0.00'
    };
    setQuotePartRows([...quotePartRows, newRow]);
  };

  const handleBankChange = (bankName: string) => {
    const selected = piResponseData?.allBanks.find(
      bank => bank.bankName === bankName
    );
    setupOtherProps.setSelectedBank(selected || null);
  };

  return (
    <>
      <div className="uppersection">
        <div className="upperleftsection">
          <Card style={{ width: '18rem' }} className="border-0 mb-5">
            {piResponseData?.logo ? (
              <Card.Img variant="top" src={piResponseData.logo} />
            ) : null}
            <Card.Body className="p-0 px-1 fs-9 w-100">
              <Card.Text className="mb-2 pt-2">
                {piResponseData?.companyAddress?.split('\n')[0] || ''}
              </Card.Text>
              <Card.Text className="mb-2">
                {piResponseData?.companyAddress?.split('\n')[1] || ''}
              </Card.Text>
              <Card.Text>{piResponseData?.companyTelephone || ''}</Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="upperrightsection">
          <div className="quote-section mb-4 mt-6">
            <h2 className="text-primary">PROFORMA INVOICE</h2>
            <Form>
              <Form.Group className="mb-3">
                <div className="d-flex justify-content-end">
                  <div style={{ maxWidth: '180px' }}>
                    <DatePicker
                      placeholder="Select a date"
                      value={selectedDate}
                      onChange={selectedDates => {
                        setSelectedDate(selectedDates[0]);
                      }}
                    />
                  </div>
                </div>
              </Form.Group>
            </Form>
            <p className="mt-2 small mt-3">
              <strong>Quote Number:</strong>{' '}
              {piResponseData?.piNumberId ||
                quoteWizardData?.quoteNumberId ||
                ''}
            </p>
            <Badge bg="primary" className="small">
              REVISION{' '}
              {piResponseData?.revisionNumber ||
                quoteWizardData?.revisionNumber ||
                0}
            </Badge>
          </div>
        </div>
      </div>
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
          <tr className="text-center align-middle">
            {' '}
            <td>
              {
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Control
                    type="text"
                    value={setupOtherProps.shipTo}
                    onChange={e => setupOtherProps.setShipTo(e.target.value)}
                    style={{ width: '85%' }}
                  />
                </div>
              }
            </td>
            <td colSpan={3}>
              {
                <div className="d-flex justify-content-center align-items-center">
                  <Form.Control
                    type="text"
                    value={setupOtherProps.clientLocation}
                    onChange={e =>
                      setupOtherProps.setClientLocation(e.target.value)
                    }
                    style={{ width: '85%' }}
                  />
                </div>
              }
            </td>
          </tr>
        </tbody>
      </Table>

      <div>
        <Table bordered hover size="sm" responsive>
          <thead>
            <tr className="bg-primary text-white text-center">
              <td className="text-white align-middle" style={{ width: '50px' }}>
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
              <td className="text-white align-middle">ACTIONS</td>
            </tr>
          </thead>
          <tbody>
            {quotePartRows.map((row, index) => (
              <tr
                key={`${row.id}-${index}`}
                className="text-center align-middle"
              >
                <td className="align-middle">{getRowNumber(index)}</td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    value={row.partNumber}
                    onChange={e =>
                      handlePartNumberChange(
                        e.target.value,
                        row.tempId != null ? row.tempId : row.id
                      )
                    }
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={row.description}
                    onChange={e =>
                      handleDescriptionChange(
                        e.target.value,
                        row.tempId != null ? row.tempId : row.id
                      )
                    }
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </td>
                <td style={{ width: '75px' }}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="number"
                      value={row.leadTime}
                      onChange={e =>
                        handleLeadTimeChange(
                          Number(e.target.value),
                          row.tempId != null ? row.tempId : row.id
                        )
                      }
                      style={{ width: '75px' }}
                      min={1}
                    />
                  </div>
                </td>
                <td style={{ width: '75px' }}>
                  <Form.Control
                    type="number"
                    value={row.quantity}
                    onChange={e =>
                      handleQuantityChange(parseInt(e.target.value, 10), row.id)
                    }
                    min={1}
                    style={{ width: '75px' }}
                  />
                </td>
                <td style={{ width: '205px' }}>
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
                      onClick={handleAddRow}
                    >
                      +
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteRow(index)}
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
            <div className="mb-4">
              <Table bordered hover size="sm">
                <tbody>
                  <tr>
                    <td style={{ width: '120px' }}>Contract No :</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          placeholder="Contract No"
                          value={setupOtherProps.contractNo || ''}
                          onChange={e =>
                            setupOtherProps.setContractNo(e.target.value)
                          }
                        />
                        <Form.Check
                          type="checkbox"
                          label="International"
                          className="ms-3"
                          checked={setupOtherProps.isInternational}
                          onChange={e =>
                            setupOtherProps.setIsInternational(e.target.checked)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Payment Term :</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={setupOtherProps.shippingTerms}
                        onChange={e =>
                          setupOtherProps.setShippingTerms(e.target.value)
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Delivery Term :</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={setupOtherProps.CPT}
                        onChange={e => setupOtherProps.setCPT(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Validity Day :</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        value={setupOtherProps.validityDay || 0}
                        onChange={e =>
                          setupOtherProps.setValidityDay(
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
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
                      <td>Tax</td>
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
                      <td>Aircargo to X</td>
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
                      <td>Sealine to X</td>
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
                      <td>Truck Carriage to X</td>
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
                          ).toString()
                        )}{' '}
                        {getPriceCurrencySymbol(currency)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Table bordered hover size="sm" id="client-info-form1">
            <thead>
              <tr className="bg-primary text-white text-center align-middle">
                <td className="text-white">Bank Name</td>
                <td className="text-white">Branch Name</td>
                <td className="text-white">Branch Code</td>
                <td className="text-white">Swift Code</td>
                <td className="text-white">IBAN NO</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center align-middle">
                <td>
                  <Form.Select
                    value={setupOtherProps.selectedBank?.bankName || ''}
                    onChange={e => handleBankChange(e.target.value)}
                  >
                    <option value="">Select Bank</option>
                    {piResponseData?.allBanks.map((bank, index) => (
                      <option key={index} value={bank.bankName}>
                        {bank.bankName}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>{setupOtherProps.selectedBank?.branchName || ''}</td>
                <td>{setupOtherProps.selectedBank?.branchCode || ''}</td>
                <td>{setupOtherProps.selectedBank?.swiftCode || ''}</td>
                <td>{setupOtherProps.selectedBank?.ibanNo || ''}</td>
              </tr>
            </tbody>
          </Table>
        </Row>
      </div>
    </>
  );
};

export default WizardSetupForm;
