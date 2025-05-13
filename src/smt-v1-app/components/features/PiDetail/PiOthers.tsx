import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Table } from 'react-bootstrap';
import './PiOthers.css';
import { getPriceCurrencySymbol } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

interface PiOthersProps {
  piData?: any; // Adding piData prop
}

const PiOthers: React.FC<PiOthersProps> = ({ piData }) => {
  // Add reference to track if initial data is loaded
  const isInitialized = useRef(false);
  const piIdRef = useRef<string | null>(null);

  // Initialize states with default values instead of using piData directly
  const [moneyTransfer, setMoneyTransfer] = useState('International');
  const [waybill, setWaybill] = useState('');
  const [contractNo, setContractNo] = useState('');
  const [validityDay, setValidityDay] = useState('0');

  // Checkbox states
  const [taxChecked, setTaxChecked] = useState(false);
  const [aircargoChecked, setAircargoChecked] = useState(false);
  const [sealineChecked, setSealineChecked] = useState(false);
  const [truckCarriageChecked, setTruckCarriageChecked] = useState(false);

  // Values
  const [subtotalValue, setSubtotalValue] = useState(1000);
  const [percentageValue, setPercentageValue] = useState(18);
  const [taxAmount, setTaxAmount] = useState(180);
  const [aircargoValue, setAircargoValue] = useState(50);
  const [sealineValue, setSealineValue] = useState(100);
  const [truckCarriageValue, setTruckCarriageValue] = useState(150);
  const [totalValue, setTotalValue] = useState(0);
  const [currency, setCurrency] = useState('USD');

  // Effect to update state when piData changes - only run when necessary
  useEffect(() => {
    // Only update state if piData is available and either:
    // 1. It's the first load (isInitialized is false)
    // 2. The piId has changed (different PI is loaded)
    if (piData && (!isInitialized.current || piIdRef.current !== piData.piId)) {
      // Update refs
      isInitialized.current = true;
      piIdRef.current = piData.piId || null;

      // Now set all the states from piData
      setMoneyTransfer(piData.moneyTransferType || 'International');
      setWaybill(piData.waybill || '');
      setContractNo(piData.contractNo || '');
      setValidityDay(piData.validityDay?.toString() || '0');

      setTaxChecked(piData.tax?.isIncluded || false);
      setAircargoChecked(piData.airCargoToX?.isIncluded || false);
      setSealineChecked(piData.sealineToX?.isIncluded || false);
      setTruckCarriageChecked(piData.truckCarriageToX?.isIncluded || false);

      setSubtotalValue(piData.subTotal || 0);
      setPercentageValue(piData.tax?.taxRate || 0);
      setTaxAmount(piData.tax?.tax || 0);
      setAircargoValue(piData.airCargoToX?.airCargoToX || 0);
      setSealineValue(piData.sealineToX?.sealineToX || 0);
      setTruckCarriageValue(piData.truckCarriageToX?.truckCarriageToX || 0);
      setTotalValue(piData.total || 0);
      setCurrency(piData.companyCurrency || 'USD');
    }
  }, [piData]);

  // Format functions
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

  // Calculate total when values change
  useEffect(() => {
    let total = subtotalValue;
    if (taxChecked) total += taxAmount;
    if (aircargoChecked) total += aircargoValue;
    if (sealineChecked) total += sealineValue;
    if (truckCarriageChecked) total += truckCarriageValue;
    setTotalValue(total);
  }, [
    subtotalValue,
    taxChecked,
    taxAmount,
    aircargoChecked,
    aircargoValue,
    sealineChecked,
    sealineValue,
    truckCarriageChecked,
    truckCarriageValue
  ]);

  // Calculate tax amount when percentage changes
  useEffect(() => {
    const tax = (subtotalValue * percentageValue) / 100;
    setTaxAmount(tax);
  }, [percentageValue, subtotalValue]);

  // Handle subtotal value change
  const handleSubtotalChange = (value: number) => {
    setSubtotalValue(value);
    // Recalculate tax
    const tax = (value * percentageValue) / 100;
    setTaxAmount(tax);
  };

  // Balance values
  const balanceValue = '';

  return (
    <div className="pi-others-container mt-4">
      <h4 className="mb-3">Others</h4>
      <hr className="custom-line m-0 mb-4" />

      <Row className="mb-3">
        <Col lg={6}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Money Transfer</Form.Label>
                <Form.Select
                  value={moneyTransfer}
                  disabled
                  onChange={e => setMoneyTransfer(e.target.value)}
                >
                  <option value="INTERNATİONAL">International</option>
                  <option value="LOCAL">Domestic</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Validity Day:</Form.Label>
                <Form.Control
                  value={validityDay}
                  disabled
                  onChange={e => setValidityDay(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Waybill:</Form.Label>
                <Form.Control
                  type="text"
                  value={waybill}
                  disabled
                  onChange={e => setWaybill(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contract No:</Form.Label>
                <Form.Control
                  type="text"
                  value={contractNo}
                  disabled
                  onChange={e => setContractNo(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Company Address:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.companyNameAddress || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Form.Group>
        </Col>
        <Col lg={3}>
          {/* Balance Information Table */}
          <Table bordered hover size="sm" className="my-4 balance-table">
            <tbody>
              <tr>
                <td className="balance-label px-2 py-3">
                  Balance Before Payment:
                </td>
                <td className="balance-value text-center">
                  {balanceValue} {getPriceCurrencySymbol(currency)}
                </td>
              </tr>
              <tr>
                <td className="balance-label px-2 py-3">
                  Payment Amount via Balance:
                </td>
                <td className="balance-value text-center">
                  {balanceValue} {getPriceCurrencySymbol(currency)}
                </td>
              </tr>
              <tr>
                <td className="balance-label px-2 py-3">
                  Balance After Payment:
                </td>
                <td className="balance-value text-center">
                  {balanceValue} {getPriceCurrencySymbol(currency)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>

        <Col lg={3}>
          <Table bordered hover size="sm" className="mb-4 total-table">
            <thead>
              <tr>
                <th className="px-2 py-1">Sub-Total</th>
                <td></td>
                <td>
                  <div className="my-3 text-center">
                    <h5>
                      <span className="text-primary ms-2">
                        {formatNumberWithDecimals(subtotalValue.toString())}{' '}
                        {getPriceCurrencySymbol(currency)}
                      </span>
                    </h5>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1">Tax</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={taxChecked}
                    onChange={e => setTaxChecked(e.target.checked)}
                    disabled
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
                        value={taxChecked ? percentageValue : 0}
                        onChange={e => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            setPercentageValue(val);
                            const computedTax = (subtotalValue * val) / 100;
                            setTaxAmount(computedTax);
                          }
                        }}
                        style={{
                          width: '60px',
                          textAlign: 'right',
                          fontSize: '0.875rem',
                          paddingLeft: '15px'
                        }}
                        placeholder="0"
                        disabled
                      />
                    </div>
                    <Form.Control
                      type="text"
                      value={
                        getPriceCurrencySymbol(currency) +
                        formatNumberInput(
                          (taxChecked ? taxAmount : 0).toString()
                        )
                      }
                      disabled
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
              <tr>
                <td className="px-2 py-1">Aircargo to X</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={aircargoChecked}
                    onChange={e => setAircargoChecked(e.target.checked)}
                    disabled
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={
                      getPriceCurrencySymbol(currency) +
                      formatNumberInput(aircargoValue.toString())
                    }
                    onChange={e => {
                      const value = e.target.value.replace(
                        getPriceCurrencySymbol(currency),
                        ''
                      );
                      const val = parseFloat(value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(val)) {
                        setAircargoValue(val);
                      }
                    }}
                    style={{
                      width: '150px',
                      paddingRight: '4px',
                      paddingLeft: '8px'
                    }}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1">Sealine to X</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={sealineChecked}
                    onChange={e => setSealineChecked(e.target.checked)}
                    disabled
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={
                      getPriceCurrencySymbol(currency) +
                      formatNumberInput(sealineValue.toString())
                    }
                    onChange={e => {
                      const value = e.target.value.replace(
                        getPriceCurrencySymbol(currency),
                        ''
                      );
                      const val = parseFloat(value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(val)) {
                        setSealineValue(val);
                      }
                    }}
                    style={{
                      width: '150px',
                      paddingRight: '4px',
                      paddingLeft: '8px'
                    }}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1">Truck to X</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={truckCarriageChecked}
                    onChange={e => setTruckCarriageChecked(e.target.checked)}
                    disabled
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={
                      getPriceCurrencySymbol(currency) +
                      formatNumberInput(truckCarriageValue.toString())
                    }
                    onChange={e => {
                      const value = e.target.value.replace(
                        getPriceCurrencySymbol(currency),
                        ''
                      );
                      const val = parseFloat(value.replace(/[^0-9.]/g, ''));
                      if (!isNaN(val)) {
                        setTruckCarriageValue(val);
                      }
                    }}
                    style={{
                      width: '150px',
                      paddingRight: '4px',
                      paddingLeft: '8px'
                    }}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="px-2 py-1">
                  Total:
                </td>
                <td>
                  <strong>
                    {formatNumberWithDecimals(totalValue.toString())}{' '}
                    {getPriceCurrencySymbol(currency)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6} lg={4}>
          <Form.Label>Payment Term:</Form.Label>
          <Form.Control
            type="text"
            value={piData.paymentTerms}
            disabled
            readOnly
            className="readonly-input"
          />
        </Col>
        <Col md={6} lg={8}>
          <Form.Label>Delivery Term:</Form.Label>
          <Form.Control
            type="text"
            value={piData.deliveryTerms}
            disabled
            readOnly
            className="readonly-input"
          />
        </Col>
      </Row>

      {/* Bank Details Section */}
      <>
        <h5 className="mt-4">Bank Details</h5>
        <hr className="custom-line m-0 mb-3" />

        <Row className="mb-3">
          <Col md={6} lg={4} xl={3} className="mb-3">
            <Form.Label>Bank Name:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.bankDetail?.bankName || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Col>

          <Col md={6} lg={4} xl={3} className="mb-3">
            <Form.Label>Branch Name:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.bankDetail?.branchName || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Col>

          <Col md={6} lg={4} xl={3} className="mb-3">
            <Form.Label>Branch Code:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.bankDetail?.branchCode || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Col>

          <Col md={6} lg={4} xl={3} className="mb-3">
            <Form.Label>Currency:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.bankDetail?.currency || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Col>
        </Row>

        <Row>
          <Col md={6} lg={6} className="mb-3">
            <Form.Label>IBAN No:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.bankDetail?.ibanNo || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Col>

          <Col md={6} lg={6} className="mb-3">
            <Form.Label>Swift Code:</Form.Label>
            <Form.Control
              type="text"
              value={piData?.bankDetail?.swiftCode || ''}
              disabled
              readOnly
              className="readonly-input"
            />
          </Col>
        </Row>
      </>
    </div>
  );
};

export default PiOthers;
