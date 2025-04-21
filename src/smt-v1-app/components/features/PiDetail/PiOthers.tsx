import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Table } from 'react-bootstrap';
import './PiOthers.css';
import { getPriceCurrencySymbol } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

interface PiOthersProps {
  piData?: any; // Adding piData prop
}

const PiOthers: React.FC<PiOthersProps> = ({ piData }) => {
  const [moneyTransfer, setMoneyTransfer] = useState(
    piData?.moneyTransferType || 'International'
  );
  const [waybill, setWaybill] = useState(piData?.waybill || '');
  const [contractNo, setContractNo] = useState(piData?.contractNo || '');
  const [validityDay, setValidityDay] = useState(
    piData?.validityDay?.toString() || '0'
  );

  // Checkbox states
  const [taxChecked, setTaxChecked] = useState(piData?.tax?.taxRate > 0);
  const [aircargoChecked, setAircargoChecked] = useState(
    piData?.airCargoToX?.isIncluded || false
  );
  const [sealineChecked, setSealineChecked] = useState(
    piData?.sealineToX?.isIncluded || false
  );
  const [truckCarriageChecked, setTruckCarriageChecked] = useState(
    piData?.truckCarriageToX?.isIncluded || false
  );

  // Values
  const [subtotalValue, setSubtotalValue] = useState(piData?.subTotal || 1000);
  const [percentageValue, setPercentageValue] = useState(
    piData?.tax?.taxRate || 18
  );
  const [taxAmount, setTaxAmount] = useState(piData?.tax?.tax || 180);
  const [aircargoValue, setAircargoValue] = useState(
    piData?.airCargoToX?.airCargoToX || 50
  );
  const [sealineValue, setSealineValue] = useState(
    piData?.sealineToX?.sealineToX || 100
  );
  const [truckCarriageValue, setTruckCarriageValue] = useState(
    piData?.truckCarriageToX?.truckCarriageToX || 150
  );
  const [totalValue, setTotalValue] = useState(piData?.total || 0);
  const [currency, setCurrency] = useState(piData?.companyCurrency || 'USD');

  // Effect to update state when piData changes
  useEffect(() => {
    if (piData) {
      setMoneyTransfer(piData.moneyTransferType || 'International');
      setWaybill(piData.waybill || '');
      setContractNo(piData.contractNo || '');
      setValidityDay(piData.validityDay?.toString() || '0');

      setTaxChecked(piData.tax?.taxRate > 0);
      setAircargoChecked(piData.airCargoToX?.isIncluded || false);
      setSealineChecked(piData.sealineToX?.isIncluded || false);
      setTruckCarriageChecked(piData.truckCarriageToX?.isIncluded || false);

      setSubtotalValue(piData.subTotal || 1000);
      setPercentageValue(piData.tax?.taxRate || 18);
      setTaxAmount(piData.tax?.tax || 180);
      setAircargoValue(piData.airCargoToX?.airCargoToX || 50);
      setSealineValue(piData.sealineToX?.sealineToX || 100);
      setTruckCarriageValue(piData.truckCarriageToX?.truckCarriageToX || 150);
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
  const balanceValue = '4.634,71';

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
                  onChange={e => setMoneyTransfer(e.target.value)}
                >
                  <option value="International">International</option>
                  <option value="Domestic">Domestic</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Validity Day:</Form.Label>
                <Form.Select
                  value={validityDay}
                  onChange={e => setValidityDay(e.target.value)}
                >
                  <option value="0">0</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                  <option value="60">60</option>
                </Form.Select>
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
                <td className="balance-value text-end">
                  {balanceValue} {getPriceCurrencySymbol(currency)}
                </td>
              </tr>
              <tr>
                <td className="balance-label px-2 py-3">
                  Payment Amount via Balance:
                </td>
                <td className="balance-value text-end">
                  {balanceValue} {getPriceCurrencySymbol(currency)}
                </td>
              </tr>
              <tr>
                <td className="balance-label px-2 py-3">
                  Balance After Payment:
                </td>
                <td className="balance-value text-end">
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
                        value={percentageValue}
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
                      />
                    </div>
                    <Form.Control
                      type="text"
                      value={
                        getPriceCurrencySymbol(currency) +
                        formatNumberInput(taxAmount.toString())
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
            value={
              piData?.paymentTerms
                ? `Payment Term ${piData.paymentTerms}`
                : '100% Advance Payment'
            }
            disabled
            readOnly
            className="readonly-input"
          />
        </Col>
        <Col md={6} lg={8}>
          <Form.Label>Delivery Term:</Form.Label>
          <Form.Control
            type="text"
            value={
              piData?.deliveryTerms
                ? `Delivery Term ${piData.deliveryTerms}`
                : 'CPT - Aircargo till destination (Custom Tax and costs to be paid by client)'
            }
            disabled
            readOnly
            className="readonly-input"
          />
        </Col>
      </Row>

      {/* Bank Details Section */}
      {piData?.bankDetail && (
        <>
          <h5 className="mt-4">Bank Details</h5>
          <hr className="custom-line m-0 mb-3" />

          <Row className="mb-3">
            <Col md={6} lg={4} xl={3} className="mb-3">
              <Form.Label>Bank Name:</Form.Label>
              <Form.Control
                type="text"
                value={piData.bankDetail.bankName || ''}
                disabled
                readOnly
                className="readonly-input"
              />
            </Col>

            <Col md={6} lg={4} xl={3} className="mb-3">
              <Form.Label>Branch Name:</Form.Label>
              <Form.Control
                type="text"
                value={piData.bankDetail.branchName || ''}
                disabled
                readOnly
                className="readonly-input"
              />
            </Col>

            <Col md={6} lg={4} xl={3} className="mb-3">
              <Form.Label>Branch Code:</Form.Label>
              <Form.Control
                type="text"
                value={piData.bankDetail.branchCode || ''}
                disabled
                readOnly
                className="readonly-input"
              />
            </Col>

            <Col md={6} lg={4} xl={3} className="mb-3">
              <Form.Label>Currency:</Form.Label>
              <Form.Control
                type="text"
                value={piData.bankDetail.currency || ''}
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
                value={piData.bankDetail.ibanNo || ''}
                disabled
                readOnly
                className="readonly-input"
              />
            </Col>

            <Col md={6} lg={6} className="mb-3">
              <Form.Label>Swift Code:</Form.Label>
              <Form.Control
                type="text"
                value={piData.bankDetail.swiftCode || ''}
                disabled
                readOnly
                className="readonly-input"
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default PiOthers;
