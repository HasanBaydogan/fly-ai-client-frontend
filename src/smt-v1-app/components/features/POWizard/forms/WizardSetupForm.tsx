import React, { useEffect, useState, useRef } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import DatePicker from 'components/base/DatePicker';
import './WizardTabs.css';
import {
  partRow,
  QuoteWizardData,
  PIResponseData,
  POResponseData
} from '../POWizard';
import { getPriceCurrencySymbol } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
interface WizardSetupFormProps {
  id: string;
  currencies: string[];
  quoteWizardData: QuoteWizardData;
  quotePartRows: partRow[];
  setQuotePartRows: React.Dispatch<React.SetStateAction<partRow[]>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  selectedDate: Date;
  subTotalValues: number[];
  setSubTotalValues: React.Dispatch<React.SetStateAction<number[]>>;
  setCurrency: (currency: string) => void;
  currency: string;
  checkedStates: boolean[];
  setCheckedStates: React.Dispatch<React.SetStateAction<boolean[]>>;
  percentageValue: number;
  setPercentageValue: React.Dispatch<React.SetStateAction<number>>;
  taxAmount: number;
  setTaxAmount: React.Dispatch<React.SetStateAction<number>>;
  setupOtherProps: {
    clientLocation: string;
    setClientLocation: React.Dispatch<React.SetStateAction<string>>;
    shipTo: string;
    setShipTo: React.Dispatch<React.SetStateAction<string>>;
    requisitioner: string;
    setRequisitioner: React.Dispatch<React.SetStateAction<string>>;
    shipVia: string;
    setShipVia: React.Dispatch<React.SetStateAction<string>>;
    fob: string;
    setFob: React.Dispatch<React.SetStateAction<string>>;
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
  poResponseData?: POResponseData;
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
  percentageValue,
  setPercentageValue,
  taxAmount,
  setTaxAmount,
  setupOtherProps,
  piResponseData,
  poResponseData
}) => {
  const oneRowHeight = 38;
  const suppliersRef = useRef<HTMLTextAreaElement>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

  // Türkçe karakter kontrolü için yardımcı fonksiyon
  const hasTurkishCharacters = (text: string): boolean => {
    const turkishChars = /[ğüşıöçĞÜŞİÖÇ]/;
    return turkishChars.test(text);
  };

  // Input değerini kontrol eden fonksiyon
  const validateInput = (value: string, fieldName: string): boolean => {
    if (hasTurkishCharacters(value)) {
      setInputErrors(prev => ({
        ...prev,
        [fieldName]: 'Türkçe karakter kullanılamaz!'
      }));
      return false;
    }
    setInputErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    return true;
  };

  useEffect(() => {
    if (piResponseData) {
      setupOtherProps.setIsInternational(piResponseData.isInternational);
      setupOtherProps.setClientLocation(piResponseData.clientLegalAddress);
      setupOtherProps.setShipTo(piResponseData.clientName);
      setupOtherProps.setContractNo(piResponseData.contractNo);
      setupOtherProps.setValidityDay(piResponseData.validityDay);
      setupOtherProps.setFob(piResponseData.deliveryTerm);
      setupOtherProps.setShippingTerms(piResponseData.paymentTerm);

      // Set tax rate from PIResponseData
      if (piResponseData.tax?.taxRate) {
        setPercentageValue(piResponseData.tax.taxRate);
      }

      const formattedParts = piResponseData.piParts.map(part => {
        const { formatted: formattedPrice, numericValue } = formatCurrency(
          part.unitPrice?.toString() || '0',
          part.currency || 'USD'
        );
        return {
          ...part,
          isNew: false,
          unitPrice: numericValue,
          priceString: formattedPrice,
          tempId: undefined,
          id:
            part.piPartId ||
            `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          alternativeTo: part.alternativeTo || '',
          currency: part.currency || 'USD',
          description: part.description || '',
          fndCondition: part.fndCondition || 'NE',
          leadTime: part.leadTime || 0,
          partNumber: part.partNumber || '',
          qty: part.qty || 1,
          reqCondition: part.reqCondition || 'NE'
        };
      });
      // console.log('Formatted parts:', formattedParts);
      setQuotePartRows(formattedParts);

      // Set subTotalValues and checkedStates based on shipping options
      const newSubTotalValues = [
        piResponseData.airCargoToX.airCargoToX || 0,
        piResponseData.sealineToX.sealineToX,
        piResponseData.truckCarriageToX.truckCarriageToX,
        0 // Additional value if needed
      ];
      // console.log('New subTotalValues:', newSubTotalValues);
      setSubTotalValues(newSubTotalValues);

      // const newCheckedStates = [
      //   piResponseData.airCargoToX.isIncluded,
      //   piResponseData.sealineToX.isIncluded,
      //   piResponseData.truckCarriageToX.isIncluded,
      //   false // Additional value if needed
      // ];
      // console.log('New checkedStates:', newCheckedStates);
      // setCheckedStates(newCheckedStates);

      // Set other values
      setupOtherProps.setFob(piResponseData.deliveryTerm || '');
      setupOtherProps.setShippingTerms(piResponseData.paymentTerm || '');
      // console.log('Set other values:', {
      //   deliveryTerm: piResponseData.deliveryTerm,
      //   paymentTerm: piResponseData.paymentTerm
      // });
    } else if (quoteWizardData?.quoteWizardPartResponses) {
      // console.log('Processing quoteWizardData instead of PIResponseData');
      const formattedData = quoteWizardData.quoteWizardPartResponses.map(
        item => {
          const { formatted: formattedPrice, numericValue } = formatCurrency(
            item.price?.toString() || '0',
            item.currency || currency
          );
          return {
            ...item,
            id: item.poPartId,
            unitPrice: numericValue,
            priceString: formattedPrice
          };
        }
      );
      // console.log('Formatted quote data:', formattedData);
      setQuotePartRows(formattedData);
    }
  }, [quoteWizardData, piResponseData]);

  const { formatNumberWithDecimals } = useCurrencyFormatter();

  useEffect(() => {
    const ta = suppliersRef.current;
    if (!ta) return;
    // önce içeriği sığdırmak için reset
    ta.style.height = 'auto';
    // sonra scrollHeight ile gerçek içerik yüksekliğini al, minimum olarak oneRowHeight uygula
    const newHeight = Math.max(ta.scrollHeight, oneRowHeight);
    ta.style.height = `${newHeight}px`;
  }, [poResponseData?.suppliers]);
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
  const [lastEdited, setLastEdited] = useState<'percentage' | 'tax'>(
    'percentage'
  );

  // Calculate sub-total
  const calculateSubTotal = () => {
    return (quotePartRows || []).reduce(
      (acc, row) => acc + row.qty * row.price,
      0
    );
  };

  // Calculate tax amount based on percentage
  const calculateTaxAmount = (percentage: number) => {
    const subTotal = calculateSubTotal();
    const tax = (subTotal * percentage) / 100;
    setTaxAmount(tax);
    return tax;
  };

  // Update tax amount when percentage changes
  useEffect(() => {
    calculateTaxAmount(percentageValue);
  }, [percentageValue, quotePartRows]);

  // Price Methods Start

  const formatNumber = (value: string): string => {
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
            priceString: formatted,
            price: numericValue
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
            row.priceString,
            row.currency,
            true
          );
          return {
            ...row,
            priceString: formatted,
            price: numericValue
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
    // console.log('cargo', newCheckedStates);
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

  // const handleAlternativePartChange = (value: string, tempId: number) => {
  //   setQuotePartRows(prevRows =>
  //     prevRows.map(row =>
  //       row.tempId === tempId ? { ...row, alternativeTo: value } : row
  //     )
  //   );
  // };

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
      prevRows.map(row => (row.id === rowId ? { ...row, qty: value } : row))
    );
  };

  // Add function to handle row numbering
  const getRowNumber = (index: number) => {
    return index + 1;
  };

  // Add function to handle row deletion
  const handleDeleteRow = (index: number) => {
    const rowToDelete = (quotePartRows || [])[index];
    const supplier = rowToDelete.poPartSuppliers?.supplier;

    // Check if this is the last part for this supplier
    const remainingPartsForSupplier = (quotePartRows || []).filter(
      (row, idx) => idx !== index && row.poPartSuppliers?.supplier === supplier
    );

    // If this is the last part for the supplier, remove the supplier from poResponseData
    if (remainingPartsForSupplier.length === 0 && poResponseData?.suppliers) {
      const updatedSuppliers = poResponseData.suppliers.filter(
        s => s.supplier !== supplier
      );
      poResponseData.suppliers = updatedSuppliers;
    }

    // Remove the row
    const newRows = [...(quotePartRows || [])];
    newRows.splice(index, 1);
    setQuotePartRows(newRows);
  };

  // Add function to handle row addition
  const handleAddRow = () => {
    const newRow: partRow = {
      no: 0,
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tempId: Date.now(),
      partNumber: '',
      currency: currency,
      description: '',
      poPartId: null,
      leadTime: 0,
      qty: 1,
      price: 0,
      priceString: '0.00',
      poPartSuppliers: {
        supplier: '-'
      }
    };
    setQuotePartRows([...(quotePartRows || []), newRow]);
  };

  return (
    <>
      <div className="uppersection">
        <div className="upperleftsection">
          <Card style={{ width: '18rem', top: '30px' }} className="border-0 ">
            {poResponseData?.logo ? (
              <Card.Img variant="top" src={poResponseData.logo} />
            ) : null}
            {/* <Card.Body className="p-0 px-1 fs-9 w-100">
              <Card.Text className="mb-2 pt-2">
                {piResponseData?.companyAddress?.split('\n')[0] || ''}
              </Card.Text>
              <Card.Text className="mb-2">
                {piResponseData?.companyAddress?.split('\n')[1] || ''}
              </Card.Text>
              <Card.Text>{piResponseData?.companyTelephone || ''}</Card.Text>
            </Card.Body> */}
          </Card>
        </div>

        <div className="upperrightsection">
          <div className="quote-section mb-4 mt-6">
            <div>
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
            </div>
            <p className="mt-2 small mt-3">
              <strong>PO Number:</strong>{' '}
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
      <h2 className="text-primary mb-3 text-center">PURCHASE ORDER</h2>
      <Table bordered hover size="sm" id="client-info-form1">
        <thead>
          <tr className="bg-primary text-white text-center align-middle">
            <td className="text-white">Vendor</td>
            <td colSpan={3} className="text-white">
              Ship To
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center align-middle">
            <td>
              <div className="d-flex justify-content-center align-items-center">
                <Form.Control
                  as="textarea"
                  ref={suppliersRef}
                  value={
                    (poResponseData?.suppliers || [])
                      .map(s => `• ${s.supplier}`)
                      .join('\n') || ''
                  }
                  disabled
                  style={{
                    width: '100%',
                    overflow: 'hidden', // scrollbar gizle
                    resize: 'none', // kullanıcı resize edemesin
                    minHeight: `${oneRowHeight}px`
                  }}
                />
              </div>
            </td>
            <td colSpan={3}>
              <div className="d-flex flex-column">
                <Form.Control
                  type="text"
                  value={setupOtherProps.shipTo}
                  onChange={e => {
                    if (validateInput(e.target.value, 'shipTo')) {
                      setupOtherProps.setShipTo(e.target.value);
                    }
                  }}
                  style={{ width: '95%' }}
                  isInvalid={!!inputErrors.shipTo}
                />
                {inputErrors.shipTo && (
                  <div
                    className="text-danger small mt-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {inputErrors.shipTo}
                  </div>
                )}
              </div>
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
              TERMS OF PAYMENT
            </td>
            <td className="text-white" style={{ width: '25%' }}>
              SHIPPING TERMS
            </td>
          </tr>
          <tr className="text-center align-middle">
            <td style={{ width: '25%' }}>
              <div className="d-flex flex-column">
                <Form.Control
                  type="text"
                  value={setupOtherProps.requisitioner}
                  onChange={e => {
                    if (validateInput(e.target.value, 'requisitioner')) {
                      setupOtherProps.setRequisitioner(e.target.value);
                    }
                  }}
                  style={{ width: '85%' }}
                  isInvalid={!!inputErrors.requisitioner}
                />
                {inputErrors.requisitioner && (
                  <div
                    className="text-danger small mt-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {inputErrors.requisitioner}
                  </div>
                )}
              </div>
            </td>
            <td style={{ width: '25%' }}>
              <div className="d-flex flex-column">
                <Form.Control
                  type="text"
                  value={setupOtherProps.shipVia}
                  onChange={e => {
                    if (validateInput(e.target.value, 'shipVia')) {
                      setupOtherProps.setShipVia(e.target.value);
                    }
                  }}
                  style={{ width: '85%' }}
                  isInvalid={!!inputErrors.shipVia}
                />
                {inputErrors.shipVia && (
                  <div
                    className="text-danger small mt-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {inputErrors.shipVia}
                  </div>
                )}
              </div>
            </td>
            <td style={{ width: '25%' }}>
              <div className="d-flex flex-column">
                <Form.Control
                  type="text"
                  value={'%100 Advance by USD'}
                  // value={setupOtherProps.fob}
                  onChange={e => setupOtherProps.setFob(e.target.value)}
                  style={{ width: '85%' }}
                />
              </div>
            </td>
            <td style={{ width: '25%' }}>
              <div className="d-flex flex-column">
                <Form.Control
                  type="text"
                  value={setupOtherProps.shippingTerms}
                  onChange={e => {
                    if (validateInput(e.target.value, 'shippingTerms')) {
                      setupOtherProps.setShippingTerms(e.target.value);
                    }
                  }}
                  style={{ width: '85%' }}
                  isInvalid={!!inputErrors.shippingTerms}
                />
                {inputErrors.shippingTerms && (
                  <div
                    className="text-danger small mt-1"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {inputErrors.shippingTerms}
                  </div>
                )}
              </div>
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
              <td className="text-white align-middle">SUPPLIER</td>
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
            {(quotePartRows || []).map((row, index) => (
              <tr
                key={`${row.id}-${index}`}
                className="text-center align-middle"
              >
                <td className="align-middle">{getRowNumber(index)}</td>
                <td>
                  <div className="d-flex flex-column">
                    <Form.Control
                      as="textarea"
                      disabled
                      rows={1}
                      value={row.partNumber}
                      onChange={e => {
                        if (
                          validateInput(e.target.value, `partNumber-${row.id}`)
                        ) {
                          handlePartNumberChange(
                            e.target.value,
                            row.tempId != null ? row.tempId : row.id
                          );
                        }
                      }}
                      style={{ width: '100%', resize: 'vertical' }}
                      isInvalid={!!inputErrors[`partNumber-${row.id}`]}
                    />
                    {inputErrors[`partNumber-${row.id}`] && (
                      <div
                        className="text-danger small mt-1"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {inputErrors[`partNumber-${row.id}`]}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="d-flex flex-column">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={row.description}
                      onChange={e => {
                        if (
                          validateInput(e.target.value, `description-${row.id}`)
                        ) {
                          handleDescriptionChange(
                            e.target.value,
                            row.tempId != null ? row.tempId : row.id
                          );
                        }
                      }}
                      style={{ width: '100%', resize: 'vertical' }}
                      isInvalid={!!inputErrors[`description-${row.id}`]}
                    />
                    {inputErrors[`description-${row.id}`] && (
                      <div
                        className="text-danger small mt-1"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {inputErrors[`description-${row.id}`]}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <Form.Control
                    disabled
                    type="text"
                    value={row.poPartSuppliers.supplier}
                    //onChange={e => setupOtherProps.setSupplier(e.target.value)}
                  />
                </td>
                <td style={{ width: '75px' }}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="number"
                      value={row.qty}
                      onChange={e =>
                        handleQuantityChange(
                          parseInt(e.target.value, 10),
                          row.id
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
                    value={row.leadTime}
                    onChange={e =>
                      handleLeadTimeChange(
                        Number(e.target.value),
                        row.tempId != null ? row.tempId : row.id
                      )
                    }
                    min={1}
                    style={{ width: '75px' }}
                  />
                </td>
                <td style={{ width: '205px' }}>
                  <Form.Control
                    type="text"
                    value={row.priceString}
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
                    formatNumberWithDecimals((row.qty * row.price).toString())}
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
            {/* <div className="mb-4">
              <Table bordered hover size="sm">
                <tbody>
                  <tr>
                    <td className="p-2" style={{ width: '140px' }}>
                      Contract No :
                    </td>
                    <td className="p-2">
                      <div className="d-flex align-items-center ">
                        <Form.Control
                          className="p-2"
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
                          className="ms-3 mx-2"
                          checked={setupOtherProps.isInternational}
                          onChange={e =>
                            setupOtherProps.setIsInternational(e.target.checked)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Payment Term :</td>
                    <td className="p-2">
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
                    <td className="p-2">Delivery Term :</td>
                    <td className="p-2">
                      <Form.Control
                        type="text"
                        value={setupOtherProps.CPT}
                        onChange={e => setupOtherProps.setFob(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2">Validity Day :</td>
                    <td className="p-2">
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
            </div> */}
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
                              calculateSubTotal().toString()
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
                          checked={checkedStates[0]}
                          onChange={e =>
                            handleCheckboxChange(0, e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {/* Yüzde inputu: Ondalık kabul etmez (step="1") */}
                          <div style={{ position: 'relative' }}>
                            <span
                              style={{
                                position: 'absolute',
                                left: '5px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                              }}
                            >
                              %
                            </span>
                            <Form.Control
                              className="formControlNumberInputWizardSetup"
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={
                                percentageValue === 0 ? '' : percentageValue
                              }
                              onChange={e => {
                                const val = e.target.value;
                                if (val === '') {
                                  setPercentageValue(0);
                                  setLastEdited('percentage');
                                  setTaxAmount(0);
                                } else {
                                  const numVal = parseInt(val, 10);
                                  if (!isNaN(numVal)) {
                                    setLastEdited('percentage');
                                    setPercentageValue(numVal);
                                    const subTotal = calculateSubTotal();
                                    const computedTax =
                                      (subTotal * numVal) / 100;
                                    setTaxAmount(computedTax);
                                  }
                                }
                              }}
                              onBlur={e => {
                                if (e.target.value === '') {
                                  setPercentageValue(0);
                                  setTaxAmount(0);
                                }
                              }}
                              style={{
                                width: '60px',
                                textAlign: 'right',
                                fontSize: '0.875rem',
                                paddingLeft: '15px'
                              }}
                              placeholder="0"
                            />
                          </div>
                          <Form.Control
                            type="text"
                            value={
                              getPriceCurrencySymbol(currency) +
                              formatNumberInput(taxAmount.toString())
                            }
                            disabled
                            onChange={e => {
                              const value = e.target.value.replace(
                                getPriceCurrencySymbol(currency),
                                ''
                              );
                              const val = parseFloat(
                                value.replace(/[^0-9.]/g, '')
                              );
                              if (!isNaN(val)) {
                                setLastEdited('tax');
                                setTaxAmount(val);
                                const subTotal = calculateSubTotal();
                                const computedPercentage =
                                  subTotal !== 0
                                    ? Math.round((val / subTotal) * 100)
                                    : 0;
                                setPercentageValue(computedPercentage);
                              }
                            }}
                            style={{
                              width: '85px',
                              paddingRight: '4px',
                              paddingLeft: '8px',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                  {quoteWizardData && (
                    <tr>
                      <td>Aircargo to X</td>
                      <td>
                        <Form.Check
                          type="checkbox"
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
                            formatNumberInput(
                              (subTotalValues[1] || 0).toString() || '0.00'
                            )
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
                            const formattedValue = formatNumberInput(
                              numericValue.toString()
                            );
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
                            width: '150px',
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
                            formatNumberInput(
                              (subTotalValues[2] || 0).toString()
                            )
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
                            const formattedValue = formatNumberInput(
                              numericValue.toString()
                            );
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
                            width: '150px',
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
                            formatNumberInput(
                              (subTotalValues[3] || 0).toString()
                            )
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
                            const formattedValue = formatNumberInput(
                              numericValue.toString()
                            );
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
                            width: '150px',
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
                            calculateSubTotal() +
                            (checkedStates[0] ? taxAmount : 0) +
                            subTotalValues
                              .slice(1)
                              .reduce(
                                (sum, val, index) =>
                                  sum + (checkedStates[index + 1] ? val : 0),
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
          {/* <Table bordered hover size="sm" id="client-info-form1">
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
                    isInvalid={bankError}
                    className={bankError ? 'border border-danger' : ''}
                  >
                    <option value="">Select Bank</option>
                    {piResponseData?.allBanks.map((bank, index) => (
                      <option key={index} value={bank.bankName}>
                        {bank.bankName}
                      </option>
                    ))}
                  </Form.Select>
                  {bankError && (
                    <div className="text-danger mt-1 small">
                      Please select a bank
                    </div>
                  )}
                </td>
                <td>{setupOtherProps.selectedBank?.branchName || ''}</td>
                <td>{setupOtherProps.selectedBank?.branchCode || ''}</td>
                <td>{setupOtherProps.selectedBank?.swiftCode || ''}</td>
                <td>{setupOtherProps.selectedBank?.ibanNo || ''}</td>
              </tr>
            </tbody>
          </Table> */}
        </Row>
      </div>
    </>
  );
};

export default WizardSetupForm;
