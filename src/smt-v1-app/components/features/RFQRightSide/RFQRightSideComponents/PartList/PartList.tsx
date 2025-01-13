import { faArrowRotateRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import CustomButton from '../../../../../../components/base/Button';
import { tableHeaders, Supplier, Currency, formatDate } from './PartListHelper';
import { Option } from 'react-bootstrap-typeahead/types/types';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';
import RFQPartTableRow from '../RFQPartTableRow/RFQPartTableRow';
import './PartList.css';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import {
  getAllCurrenciesFromDB,
  getAllSuppliersFromDB
} from 'smt-v1-app/services/RFQService';

const PartList = ({
  parts,
  handleDeletePart,
  handleAddPart
}: {
  parts: RFQPart[];
  handleDeletePart: (partNumber: string) => void;
  handleAddPart: (rfqPart: RFQPart) => void;
}) => {
  const [isPartNumberEmpty, setIsPartNumberEmpty] = useState(false);
  const [isPartNameEmpty, setIsPartNameEmpty] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessageHeader, setToastMessageHeader] = useState('');
  const [toastMessageBody, setToastMessageBody] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [partIdCounter, setPartIdCounter] = useState(0);

  // RFQPart Properties
  const [partName, setPartName] = useState<string>('');
  const [partNumber, setPartNumber] = useState<string>('');
  const [reqQTY, setReqQTY] = useState<number>(0);
  const [fndQTY, setFndQTY] = useState<number>(0);
  const [reqCND, setReqCND] = useState<string>('');
  const [fndCND, setFndCND] = useState<string>('');
  const [supplierLT, setSupplierLT] = useState<number>(0);
  const [clientLT, setClientLT] = useState<number>(0);
  const [unitPricevalueString, setUnitPricevalueString] =
    useState<string>('0.00');
  const [unitPricevalueNumber, setUnitPricevalueNumber] = useState<number>(0.0);
  const [unitPriceCurrency, setUnitPriceCurrency] = useState<Currency>({
    id: '',
    currency: '',
    currencySymbol: ''
  });

  /*const [unitPriceCurrencyName, setUnitPriceCurrencyName] = useState<string>('USD');
  const [unitPriceCurrencyId, setUnitPriceCurrencyId] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$'); */

  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [comment, setComment] = useState<string>('');
  const [dgPackagingCst, setDgPackagingCost] = useState(false);
  const [tagDate, setTagDate] = useState('');
  const handleDateChange = e => {
    setTagDate(e.target.value); // Store the date in YYYY-MM-DD format
  };
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('23.12.2023');
  const [certType, setCertType] = useState<string>('defCerf');
  const [MSN, setMSN] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('');
  const [stock, setStock] = useState<number>(0);
  const [stockLocation, setStockLocatipon] = useState<string>('');
  const [airlineCompany, setAirlineCompany] = useState<string>('');
  const [MSDS, setMSDS] = useState<string>('');

  const [isNewSupplierLoading, setIsNewSupplierLoading] = useState(false);

  const partNumberRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    // Get all suppliers
    const getAllSupplierAndCurrencies = async () => {
      setIsLoading(true);
      const suppResp = await getAllSuppliersFromDB();
      setSuppliers(suppResp.data);
      const currencyResp = await getAllCurrenciesFromDB();
      setCurrencies(currencyResp.data);
      setIsLoading(false);
    };
    getAllSupplierAndCurrencies();
  }, []);

  const handleAllSuppliersRefresh = async () => {
    setIsNewSupplierLoading(true);
    const resp = await getAllSuppliersFromDB();
    setSuppliers(resp.data);
    setIsNewSupplierLoading(false);
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

      input_val = `${unitPriceCurrency.currencySymbol}${left_side}.${right_side}`;
    } else {
      input_val = `${unitPriceCurrency.currencySymbol}${formatNumber(
        input_val
      )}`;

      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    const x = input_val.split(unitPriceCurrency.currencySymbol);
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

  function toastError(messageHeader: string, message: string) {
    setToastVariant('danger');
    setToastMessageHeader(messageHeader);
    setToastMessageBody(message);
    setIsShowToast(true);
  }
  function toastInfo(messageHeader: string, message: string) {
    setToastVariant('info');
    setToastMessageHeader(messageHeader);
    setToastMessageBody(message);
    setIsShowToast(true);
  }

  const handleNewPartAddition = () => {
    if (!partNumber || !partName || reqQTY === 0 || !reqCND) {
      toastError('Required Field', 'Fill the required fields *');
    } else if (
      fndCND ||
      supplierLT !== 0 ||
      clientLT !== 0 ||
      unitPricevalueNumber !== 0.0 ||
      (supplier && supplier.length > 0)
    ) {
      const missingFields = [];

      if (!fndCND) missingFields.push('fndCND');
      if (supplierLT === 0) missingFields.push('supplierLT');
      if (clientLT === 0) missingFields.push('clientLT');
      if (unitPricevalueNumber === 0.0)
        missingFields.push('unitPricevalueNumber');
      if (!supplier) missingFields.push('supplier');

      if (missingFields.length > 0) {
        toastError(
          'Incomplete Fields',
          `The following fields must be filled: ${missingFields.join(', ')}`
        );
      }
    } else if (clientLT < supplierLT) {
      toastError(
        'Invalid LeadTime',
        'Supplier LT cannot be greater than client LT'
      );
    } else {
      if (parts.some(element => element.partNumber === partNumber)) {
        toastError('Invalid Partnumber', 'Part number is already added!');
      } else {
        // Add the partNumber to the parts array

        // create a RFQPart

        const rfqPart: RFQPart = {
          partId: null,
          rfqPartId: null,
          partNumber: partNumber,
          partName: partName,
          reqQTY: reqQTY,
          fndQTY: fndQTY,
          reqCND: reqCND, // Replace with a default valid value
          fndCND: fndCND, // Replace with a default valid value
          supplierLT: supplierLT,
          clientLT: clientLT,
          unitPriceResponse: {
            currencyId: unitPriceCurrency.id ? unitPriceCurrency.id : null,
            unitPrice: unitPricevalueNumber !== 0 ? unitPricevalueNumber : null,
            currency:
              unitPriceCurrency.currency !== ''
                ? unitPriceCurrency.currency
                : null
          },
          supplier:
            supplier.length > 0
              ? {
                  supplierId: supplier[0].supplierId,
                  supplierName: supplier[0].supplierName
                }
              : null,
          comment: comment,
          dgPackagingCost: dgPackagingCst,
          tagDate: tagDate ? formatDate(tagDate) : null,
          lastUpdatedDate: lastUpdatedDate,
          certificateType: certType, // Replace with a default valid value
          MSN: MSN,
          wareHouse: warehouse,
          stock: stock,
          stockLocation: stockLocation,
          airlineCompany: airlineCompany,
          MSDS: MSDS
        };
        handleAddPart(rfqPart);
      }
    }
  };

  return (
    <div>
      <h3 className="mt-3">Part</h3>
      <hr className="custom-line m-0" />

      <div
        className="d-flex justify-content-end"
        style={{ padding: '10px', paddingRight: '0px' }}
      >
        <CustomButton
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} className="ms-0" />}
          onClick={handleNewPartAddition}
        ></CustomButton>
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center mt-2">
          <LoadingAnimation />
        </div>
      ) : (
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
            {
              <RFQPartTableRow
                rfqParts={parts}
                //setShowDeleteModal={setShowDeleteModal}
                //setDeletedId={setDeletedId}
                //handleEditPart={handleEditPart}
              />
            }

            <tr>
              <td style={{ padding: '10px' }}>
                <span
                  onClick={handleNewPartAddition}
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
                    ref={partNumberRef}
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
                    min={1}
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
                    width: '95px',
                    paddingRight: '4px',
                    paddingLeft: '8px'
                  }}
                >
                  <option value="">Req CND</option>
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
                    width: '95px',
                    paddingRight: '4px',
                    paddingLeft: '8px'
                  }}
                >
                  <option value="">Fnd CND</option>
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
                  style={{ width: '230px' }}
                >
                  <Form.Select
                    value={unitPriceCurrency.id} // Make sure this matches the currency.id value
                    onChange={e => {
                      const selectedCurrencyId = e.target.value;
                      const selectedCurrency = currencies.find(
                        currency => currency.id === selectedCurrencyId
                      );

                      if (selectedCurrency) {
                        setUnitPriceCurrency({
                          id: selectedCurrency.id,
                          currency: selectedCurrency.currency,
                          currencySymbol:
                            selectedCurrency.currencySymbol ||
                            getPriceCurrencySymbol(selectedCurrency.currency)
                        });
                      }
                    }}
                    style={{
                      width: '110px',
                      paddingRight: '4px',
                      paddingLeft: '8px'
                    }}
                  >
                    {currencies.map(currency => (
                      <option key={currency.id} value={currency.id}>
                        {currency.currency} ({currency.currencySymbol})
                      </option>
                    ))}
                  </Form.Select>

                  <Form.Control
                    type="text"
                    value={unitPricevalueString}
                    onChange={handleUnitPriceChange}
                    onBlur={handleBlur}
                    onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                      e.currentTarget.blur()
                    }
                    placeholder={unitPriceCurrency.currency + '1,000,000.00'}
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
                  <div className="d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon
                      icon={faArrowRotateRight}
                      className="me-3"
                      size="lg"
                      spin={isNewSupplierLoading}
                      onClick={handleAllSuppliersRefresh}
                    />
                  </div>

                  {
                    <Form.Group style={{ width: '200px' }}>
                      <Typeahead
                        id="searchable-select"
                        labelKey="supplierCompanyName"
                        options={suppliers}
                        placeholder="Select a supplier"
                        multiple={false}
                        positionFixed
                        style={{ zIndex: 1050 }}
                        //If it is empty then it returns [] otherwise It returns selected
                        onChange={selected => {
                          if (selected.length > 0) {
                            setSupplier(selected as Supplier[]);
                            console.log('Selected Supplier:', selected); // For debugging
                          } else {
                            setSupplier([]);
                            console.log('Supplier cleared.'); // For debugging
                          }
                        }}
                      />
                    </Form.Group>
                  }
                </div>
              </td>
              {/* SUPPLIER END */}

              {/* TOTAL START */}
              <td>
                <div className="d-flex align-items-center mt-2">
                  <span className="fw-bold">{unitPriceCurrency.currency}</span>
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
              {
                <td>
                  <Form.Select
                    value={dgPackagingCst === false ? 'NO' : 'YES'}
                    onChange={e => {
                      setDgPackagingCost(
                        e.target.value === 'NO' ? false : true
                      );
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
              }
              {/* DGPACKAGIN COST END */}

              {/* TAG DATE START */}
              <td>
                <Form.Control
                  value={tagDate}
                  placeholder="Tag Date" // Etiket Tarihi
                  type="date"
                  onChange={handleDateChange}
                  // When sending date to backend use formatDate in helper file.
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
      )}

      {/* <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
      />*/}
      <ToastNotification
        isShow={isShowToast}
        setIsShow={setIsShowToast}
        variant={toastVariant}
        messageHeader={toastMessageHeader}
        messageBodyText={toastMessageBody}
        position="middle-end"
      />
    </div>
  );
};

export default PartList;
