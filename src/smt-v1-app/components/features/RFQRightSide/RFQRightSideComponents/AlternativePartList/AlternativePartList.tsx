import React, { ChangeEvent, FocusEvent, useRef, useState } from 'react';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { tableHeaders } from './AlternativePartListHelper';
import { Button, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';

const AlternativePartList = ({}) => {
  const [isPartNumberEmpty, setIsPartNumberEmpty] = useState(false);
  const [isPartNameEmpty, setIsPartNameEmpty] = useState(false);
  const [isParentPartNumberEmpty, setIsParentPartNumberEmpty] =
    useState<boolean>(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessageHeader, setToastMessageHeader] = useState('');
  const [toastMessageBody, setToastMessageBody] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [partIdCounter, setPartIdCounter] = useState(0);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selected, setSelected] = useState<Option[]>([]);

  const [partName, setPartName] = useState<string>('');
  const [partNumber, setPartNumber] = useState<string>('');
  const [parentPartNumber, setParentPartNumber] = useState<string>('');
  const [reqQTY, setReqQTY] = useState<number>(0);
  const [fndQTY, setFndQTY] = useState<number>(0);
  const [reqCND, setReqCND] = useState<string>('NE');
  const [fndCND, setFndCND] = useState<string>('NE');
  const [supplierLT, setSupplierLT] = useState<number>(0);
  const [clientLT, setClientLT] = useState<number>(0);
  const [unitPricevalueString, setUnitPricevalueString] =
    useState<string>('0.00');
  const [unitPricevalueNumber, setUnitPricevalueNumber] = useState<number>(0.0);
  const [unitPriceCurrency, setUnitPriceCurrency] = useState<string>('USD');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  //const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [comment, setComment] = useState<string>('');
  const [dgPackagingCst, setDgPackagingCost] = useState('NO');
  const [tagDate, setTagDate] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('23.12.2023');
  const [certType, setCertType] = useState<string>('defCerf');
  const [MSN, setMSN] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('');
  const [stock, setStock] = useState<number>(0);
  const [stockLocation, setStockLocatipon] = useState<string>('');
  const [airlineCompany, setAirlineCompany] = useState<string>('');
  const [MSDS, setMSDS] = useState<string>('');
  const alternativePartNumberRef = useRef<HTMLInputElement>(null);

  const [deletedId, setDeletedId] = useState<number>(0);

  const handleConfirmDelete = () => {
    //handleDeleteAlternativePart(deletedId);
    setShowDeleteModal(false);
  };

  const handleNewAlternativePartAddition = () => {
    if (partNumber === '') {
      setToastMessageHeader('Part Number');
      setToastMessageBody('Please fill Part Number properly!');
      setIsShowToast(true);
      return;
    }
    if (partName === '') {
      setToastMessageHeader('Part Name');
      setToastMessageBody('Please fill Part Name properly!');
      setIsShowToast(true);
      return;
    }
    if (parentPartNumber === '') {
      setToastMessageHeader('Parent Part Number');
      setToastMessageBody('Please fill Parent Part Number properly!');
      setIsShowToast(true);
      return;
    }
    if (reqQTY === 0) {
      setToastMessageHeader('Requested Quantity');
      setToastMessageBody('Please fill Requested Quantity properly!');
      setIsShowToast(true);
      return;
    }

    const alternativePart = {
      id: partIdCounter,
      partNumber: partNumber,
      partName: partName,
      parentPartNumber: parentPartNumber,
      reqQuantity: reqQTY,
      fndQuantity: fndQTY,
      reqCondition: reqCND,
      fndCondition: fndCND,
      supplierLt: supplierLT,
      clientLt: clientLT,
      unitPrice: unitPricevalueNumber,
      unitPriceCurrency: {
        currencyString: unitPriceCurrency,
        currencySymbol: currencySymbol
      },
      //supplier: supplier[0] ? supplier[0].name : '',
      total: unitPricevalueNumber * fndQTY,
      comment: comment,
      dgPackagingCst: dgPackagingCst,
      tagDate: tagDate,
      lastUpdatedDate: '23.12.2023',
      certificateType: certType,
      MSN: MSN,
      warehouse: warehouse,
      stock: stock,
      stockLocation: stockLocation,
      airlineCompany: airlineCompany,
      MSDS: MSDS
    };
    setPartIdCounter(partIdCounter + 1);
    //handleAddAlternativePart(alternativePart);
    resetAllValues();
  };

  const formatNumber = (n: string): string => {
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatCurrency = (inputValue: string, blur: string = ''): string => {
    if (inputValue === '') return '';

    let input_val = inputValue;
    const original_len = input_val.length;

    if (input_val.indexOf('.') >= 0) {
      const decimal_pos = input_val.indexOf('.');
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      left_side = formatNumber(left_side);
      right_side = formatNumber(right_side);

      if (blur === 'blur') {
        right_side += '00';
      }

      right_side = right_side.substring(0, 2);

      input_val = `${currencySymbol}${left_side}.${right_side}`;
    } else {
      input_val = `${currencySymbol}${formatNumber(input_val)}`;

      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    const x = input_val.split(currencySymbol);
    if (x.length > 1) {
      const inputValueArray = x[1].split(',');
      let totalinputValueString = '';
      inputValueArray.forEach(item => {
        totalinputValueString += item;
      });
      setUnitPricevalueNumber(
        Math.round(parseFloat(totalinputValueString) * 100) / 100
      );
    } else {
      const inputValueString = x[1];
      setUnitPricevalueNumber(
        Math.round(parseFloat(inputValueString) * 100) / 100
      );
    }

    return input_val;
  };

  const handleUnitPriceChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formattedValue = formatCurrency(e.target.value);
    setUnitPricevalueString(formattedValue);
  };
  const handleUnitPriceChangeForEdit = (value: string): void => {
    const formattedValue = formatCurrency(value);
    setUnitPricevalueString(formattedValue);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const formattedValue = formatCurrency(unitPricevalueString, 'blur');
    setUnitPricevalueString(formattedValue);
  };

  const resetAllValues = () => {
    setPartNumber('');
    setPartName('');
    setParentPartNumber('');
    setReqQTY(0);
    setFndQTY(0);
    setFndCND('NE');
    setReqCND('NE');
    setSupplierLT(0);
    setClientLT(0);
    setUnitPricevalueString('0.00');
    setUnitPricevalueNumber(0);
    setUnitPriceCurrency('USD');
    setCurrencySymbol('$');
    //setSupplier([]);
    setComment('');
    setDgPackagingCost('NO');
    setTagDate('');
    setLastUpdatedDate('');
    setCertType('defCerf');
    setMSN('');
    setWarehouse('');
    setStock(0);
    setStockLocatipon('');
    setAirlineCompany('');
    setMSDS('');
  };

  const handleEditPart = (alternativePart: AlternativeRFQPart) => {
    /*
    setPartNumber(alternativePart.partNumber);
    setPartName(alternativePart.partName);
    setParentPartNumber(alternativePart.parentPartNumber);
    setReqQTY(alternativePart.reqQuantity);
    setFndQTY(alternativePart.fndQuantity);
    setFndCND(alternativePart.fndCondition);
    setReqCND(alternativePart.reqCondition);
    setSupplierLT(alternativePart.supplierLt);
    setClientLT(alternativePart.clientLt);
    setUnitPricevalueNumber(alternativePart.unitPrice);
    setUnitPriceCurrency(alternativePart.unitPriceCurrency.currencyString);
    setCurrencySymbol(alternativePart.unitPriceCurrency.currencySymbol);
    handleUnitPriceChangeForEdit(alternativePart.unitPrice.toString());
    setSupplier([{ name: alternativePart.supplier }]);
    setComment(alternativePart.comment);
    setDgPackagingCost(alternativePart.dgPackagingCst);
    setTagDate(alternativePart.tagDate);
    setLastUpdatedDate(alternativePart.lastUpdatedDate);
    setCertType(alternativePart.certificateType);
    setMSN(alternativePart.MSN);
    setWarehouse(alternativePart.warehouse);
    setStock(alternativePart.stock);
    setStockLocatipon(alternativePart.stockLocation);
    setAirlineCompany(alternativePart.airlineCompany);
    setMSDS(alternativePart.MSDS);
    handleDeleteAlternativePart(alternativePart.id);
    if (alternativePartNumberRef.current) {
      alternativePartNumberRef.current.focus();
    }
      */
  };

  return (
    <>
      <div>
        <h3 className="mt-3">AlternativePart</h3>
        <hr className="custom-line m-0" />

        <div
          className="d-flex justify-content-end"
          style={{ padding: '10px', paddingRight: '0px' }}
        >
          {/* <CustomButton
            variant="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} className="ms-0" />}
            onClick={handleNewAlternativePartAddition}
          ></CustomButton> */}
        </div>

        <Table responsive style={{ overflow: 'visible' }}>
          <thead>
            <tr>
              {/* For adding and substracting button */}
              <th></th>
              {tableHeaders.map((header, key) => {
                if (header === 'Unit Price') {
                  return (
                    <th key={key} className="text-center">
                      {header}
                    </th>
                  );
                }
                return <th key={key}>{header}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {/*<AlternativePartTableRow
              alternativeParts={alternativeParts}
              setShowDeleteModal={setShowDeleteModal}
              setDeletedId={setDeletedId}
              handleEditPart={handleEditPart}
            /> */}

            <tr>
              <td style={{ padding: '10px' }}>
                <span
                  onClick={handleNewAlternativePartAddition}
                  className="action-icon mt-2"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </span>
              </td>
              {/* Part Number START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="Part Number" // Parça Numarası
                    value={partNumber}
                    ref={alternativePartNumberRef}
                    onChange={e => {
                      setPartNumber(e.target.value);
                      setIsPartNumberEmpty(false); // Reset error when user types
                    }}
                    onBlur={e => {
                      if (!e.target.value.trim()) {
                        setIsPartNumberEmpty(true); // Set error if input is empty
                      }
                    }}
                    style={{
                      width: '180px',
                      borderColor: isPartNumberEmpty ? 'red' : '' // Apply red border if empty
                    }}
                    required
                  />
                </Form.Group>
              </td>
              {/* Part Number END */}

              {/* Part Name START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="Part Name"
                    value={partName}
                    onChange={e => {
                      setPartName(e.target.value);
                      setIsPartNameEmpty(false);
                    }}
                    onBlur={e => {
                      if (!e.target.value.trim()) {
                        setIsPartNameEmpty(true); // Set error if input is empty
                      }
                    }}
                    style={{
                      width: '180px',
                      borderColor: isPartNameEmpty ? 'red' : '' // Apply red border if empty
                    }}
                    required
                  />
                </Form.Group>
              </td>

              {/* Part Name END*/}

              {/* Parent Part Number START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="Parent Part Number" // Parça Numarası
                    value={parentPartNumber}
                    onChange={e => {
                      setParentPartNumber(e.target.value);
                      setIsParentPartNumberEmpty(false); // Reset error when user types
                    }}
                    onBlur={e => {
                      if (!e.target.value.trim()) {
                        setIsParentPartNumberEmpty(true); // Set error if input is empty
                      }
                    }}
                    style={{
                      width: '180px',
                      borderColor: isParentPartNumberEmpty ? 'red' : '' // Apply red border if empty
                    }}
                    required
                  />
                </Form.Group>
              </td>
              {/* Parent Part Number END */}

              {/* Req QTY START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    value={reqQTY}
                    onWheel={e => (e.target as HTMLInputElement).blur()}
                    type="number"
                    onChange={e => {
                      setReqQTY(parseInt(e.target.value, 10));
                    }}
                    required
                    style={{ width: '80px', paddingRight: '8px' }}
                    min={0}
                  />
                </Form.Group>
              </td>
              {/* Req QTY END*/}

              {/* FND QTY START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    value={fndQTY}
                    type="number"
                    onWheel={e => (e.target as HTMLInputElement).blur()}
                    onChange={e => {
                      setFndQTY(parseInt(e.target.value, 10));
                    }}
                    required
                    style={{ width: '80px', paddingRight: '8px' }}
                    min={0}
                  />
                </Form.Group>
              </td>
              {/* FND QTY END*/}

              {/* REQ CND START*/}
              <td>
                <Form.Select
                  value={reqCND}
                  onChange={e => {
                    setReqCND(e.target.value);
                  }}
                  style={{
                    width: '85px',
                    paddingRight: '4px',
                    paddingLeft: '8px'
                  }}
                >
                  <option value="NE">NE</option>
                  <option value="OH">OH</option>
                </Form.Select>
              </td>
              {/* REQ CND END*/}

              {/* FND CND START*/}
              <td>
                <Form.Select
                  value={fndCND}
                  onChange={e => {
                    setFndCND(e.target.value);
                  }}
                  required // Zorunlu alan
                  style={{
                    width: '80px',
                    paddingRight: '4px',
                    paddingLeft: '8px'
                  }}
                >
                  <option value="New">NE</option>
                  <option value="Used">OH</option>
                </Form.Select>
              </td>
              {/* FND CND START*/}

              {/* SUPPLIER LT START*/}
              <td>
                <Form.Control
                  value={supplierLT}
                  type="number"
                  onWheel={e => (e.target as HTMLInputElement).blur()}
                  style={{ width: '80px', paddingRight: '8px' }}
                  onChange={e => {
                    setSupplierLT(parseInt(e.target.value));
                  }}
                  min={0}
                />
              </td>
              {/* SUPPLIER LT END */}

              {/* CLIENT LT START*/}
              <td>
                <Form.Control
                  value={clientLT}
                  type="number"
                  onWheel={e => (e.target as HTMLInputElement).blur()}
                  style={{ width: '80px', paddingRight: '8px' }}
                  onChange={e => {
                    setClientLT(parseInt(e.target.value));
                  }}
                  min={0}
                />
              </td>
              {/* CLIENT LT END */}

              {/* UNIT PRICE START */}
              <td>
                <div
                  className="d-flex justify-content-between"
                  style={{ width: '200px' }}
                >
                  <Form.Select
                    value={unitPriceCurrency}
                    onChange={e => {
                      setUnitPriceCurrency(e.target.value);
                      setCurrencySymbol(getPriceCurrencySymbol(e.target.value));
                    }}
                    style={{
                      width: '80px',
                      paddingRight: '4px',
                      paddingLeft: '8px'
                    }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                    <option value="TRY">TRY</option>
                    <option value="GBP">GBP</option>
                    <option value="CNY">CNY</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="CHF">CHF</option>
                    <option value="SGD">SGD</option>
                    <option value="HKD">HKD</option>
                  </Form.Select>

                  <Form.Control
                    type="text"
                    value={unitPricevalueString}
                    onChange={handleUnitPriceChange}
                    onBlur={handleBlur}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                      e.currentTarget.blur()
                    }
                    placeholder={currencySymbol + '1,000,000.00'}
                    style={{
                      width: '110px',
                      paddingRight: '4px',
                      paddingLeft: '8px'
                    }}
                  />
                </div>
              </td>
              {/* UNIT PRICE END */}

              {/* SUPPLIER START */}
              <td style={{ overflow: 'visible' }}>
                <div className="d-flex">
                  <Button variant="primary" className="px-3 py-1 me-3">
                    <span style={{ fontSize: '16px' }}>+</span>
                  </Button>
                  <Form.Group>
                    <Typeahead // Explicitly set the type parameter to Supplier
                      id="searchable-select"
                      labelKey="name"
                      //onChange={selected => setSupplier(selected as Supplier[])} // Cast selected to Supplier[]
                      options={[
                        { name: 'USA Supplier' },
                        { name: 'EURO Supplier' },
                        { name: 'China Supplier' },
                        { name: 'Turkey 1 Supplier' },
                        { name: 'Grand China Supplier' }
                      ]}
                      placeholder="Select a supplier"
                      //selected={supplier}
                      multiple={false}
                      style={{ zIndex: 1050, width: '170px' }}
                      positionFixed
                    />
                  </Form.Group>
                </div>
              </td>
              {/* SUPPLIER END */}

              {/* TOTAL START */}
              <td>
                <div className="d-flex align-items-center mt-2">
                  <span className="fw-bold">{unitPriceCurrency}</span>
                  <span className="ms-2">
                    {(unitPricevalueNumber
                      ? Math.round(unitPricevalueNumber * 100) / 100
                      : 0) * fndQTY}
                  </span>
                </div>
              </td>
              {/* TOTAL END */}

              {/* COMMENT START */}
              <td>
                <Form.Control
                  as="textarea"
                  placeholder="Comments"
                  value={comment}
                  onChange={e => {
                    setComment(e.target.value);
                  }}
                  style={{ width: '200px', height: '37.07px' }}
                />
              </td>
              {/* COMMENT END */}

              {/* DGPACKAGIN COST START */}
              <td>
                <Form.Select
                  value={dgPackagingCst}
                  onChange={e => {
                    setDgPackagingCost(e.target.value);
                  }}
                  defaultValue={'NO'}
                  required // Zorunlu alan
                  style={{
                    width: '80px',
                    paddingRight: '4px',
                    paddingLeft: '8px'
                  }}
                >
                  <option value="NO">NO</option>
                  <option value="YES">YES</option>
                </Form.Select>
              </td>
              {/* DGPACKAGIN COST END */}

              {/* TAG DATE START */}
              <td>
                <Form.Control
                  value={tagDate}
                  placeholder="Tag Date" // Etiket Tarihi
                  type="date"
                  onChange={e => {
                    setTagDate(e.target.value);
                  }}
                />
              </td>
              {/* TAG DATE END */}

              {/* Last Updated Date START */}
              <td>
                <div className="d-flex align-items-center justify-content-center mt-2 last-updated-date-text-container">
                  <span className="last-updated-date-text fw-bold">
                    {lastUpdatedDate}
                  </span>
                </div>
              </td>
              {/* Last Updated Date END */}

              {/* Certificate Type START */}
              <td>
                <Form.Select
                  value={certType}
                  onChange={e => {
                    setCertType(e.target.value);
                  }}
                  style={{
                    width: '120px',
                    paddingRight: '4px',
                    paddingLeft: '8px'
                  }}
                >
                  <option value="defCerf">Select Cerf.</option>
                  <option value="FAA81303">FAA 8130-3</option>
                  <option value="EASEF1">EASSA Form 1</option>
                  <option value="COFC">CofC</option>
                </Form.Select>
              </td>
              {/* Certificate Type END */}

              {/* MSN START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="MSN"
                    value={MSN}
                    onChange={e => {
                      setMSN(e.target.value);
                    }}
                    style={{
                      width: '180px'
                    }}
                  />
                </Form.Group>
              </td>

              {/* MSN END*/}

              {/* WAREHOUSE START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="Warehouse"
                    value={warehouse}
                    onChange={e => {
                      setWarehouse(e.target.value);
                    }}
                    style={{
                      width: '180px'
                    }}
                  />
                </Form.Group>
              </td>

              {/* WAREHOUSE END*/}

              {/* STOCK START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    value={stock}
                    type="number"
                    onWheel={e => (e.target as HTMLInputElement).blur()}
                    onChange={e => {
                      setStock(parseInt(e.target.value, 10));
                    }}
                    required
                    style={{ width: '80px', paddingRight: '8px' }}
                    min={0}
                  />
                </Form.Group>
              </td>
              {/* STOCK END*/}

              {/* STOCK LOCATION START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="Stock Location"
                    value={stockLocation}
                    onChange={e => {
                      setStockLocatipon(e.target.value);
                    }}
                    style={{
                      width: '180px'
                    }}
                  />
                </Form.Group>
              </td>

              {/* STOCK LOCATION END*/}

              {/* Airline Company START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="Airline Company"
                    value={airlineCompany}
                    onChange={e => {
                      setAirlineCompany(e.target.value);
                    }}
                    style={{
                      width: '180px'
                    }}
                  />
                </Form.Group>
              </td>

              {/* Airline Company END*/}

              {/* MSDS START*/}
              <td>
                <Form.Group>
                  <Form.Control
                    placeholder="MSDS"
                    value={MSDS}
                    onChange={e => {
                      setMSDS(e.target.value);
                    }}
                    style={{
                      width: '180px'
                    }}
                  />
                </Form.Group>
              </td>

              {/* MSDS END*/}
            </tr>
          </tbody>
        </Table>

        {/*<DeleteConfirmationModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleConfirmDelete={handleConfirmDelete}
        />
        <ToastNotification
          isShow={isShowToast}
          setIsShow={setIsShowToast}
          variant={toastVariant}
          messageHeader={toastMessageHeader}
          messageBodyText={toastMessageBody}
        /> */}
      </div>
    </>
  );
};

export default AlternativePartList;
