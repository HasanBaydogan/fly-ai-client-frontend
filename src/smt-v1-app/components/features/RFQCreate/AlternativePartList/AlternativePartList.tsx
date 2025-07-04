import React, {
  ChangeEvent,
  FocusEvent,
  useEffect,
  useRef,
  useState
} from 'react';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { tableHeaders } from './AlternativePartListHelper';
import { Button, Card, Form, Modal, Tab, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getPriceCurrencySymbol } from '../../../../types/RFQRightSideHelper';
import CustomButton from '../../../../../components/base/Button';
import {
  AlternativeRFQPart,
  RFQPart
} from 'smt-v1-app/types/RfqContainerTypes';
import {
  getAllCurrenciesFromDB,
  getAllSuppliersFromDB
} from 'smt-v1-app/services/RFQService';
import {
  convertDateFormat,
  Currency,
  formatDate
} from '../PartList/PartListHelper';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import AlternativePartTableRow from '../AlternativePartTableRow/AlternativePartTableRow';
import DeleteConfirmationModal from '../../GlobalComponents/DeleteConfirmationModal/DeleteConfirmationModal';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import WizardFormProvider from 'providers/WizardFormProvider';
import WizardForm from 'components/wizard/WizardForm';
import PartWizardItemFiledsForm from 'smt-v1-app/components/features/Parts/PartsItemFields/PartWizardItemFiledsForm';
import WizardNav from 'smt-v1-app/components/features/Parts/PartWizardNav';
import PartWizardUserDefFieldsForm from 'smt-v1-app/components/features/Parts/UserDefFields/PartWizardUserDefFieldsForm';
import PartWizardNotesForm from 'smt-v1-app/components/features/Parts/PartsNotes/PartWizardNotesForm';
import PartWizardFilesForm from 'smt-v1-app/components/features/Parts/PartsFiles/PartWizardFilesForm';
import PartWizardAlternativesForm from 'smt-v1-app/components/features/Parts/PartAlternatives/PartWizardAlternativesForm';
import useWizardForm from 'hooks/useWizardForm';
import { getByItemFields } from 'smt-v1-app/services/PartServices';

let tempAltIdCount = 1; // <-- Alternative Partlar için ayrı counter

function generateTempAlternativeRFQPartId() {
  const id = `temp-${String(tempAltIdCount).padStart(2, '0')}`;
  tempAltIdCount++;
  return id;
}

const AlternativePartList = ({
  alternativeParts,
  handleDeleteAlternativePart,
  handleAddAlternativePart,
  parts,
  partName,
  setPartName,
  partNumber,
  setPartNumber
}: {
  alternativeParts: AlternativeRFQPart[];
  handleDeleteAlternativePart: (alternPartNumber: string) => void;
  handleAddAlternativePart: (alternativePart: AlternativeRFQPart) => void;
  parts: RFQPart[];
  partName: string;
  setPartName: React.Dispatch<React.SetStateAction<string>>;
  partNumber: string;
  setPartNumber: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isPartNumberEmpty, setIsPartNumberEmpty] = useState(false);
  const [isPartNameEmpty, setIsPartNameEmpty] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessageHeader, setToastMessageHeader] = useState('');
  const [toastMessageBody, setToastMessageBody] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [desiredRfqPartIdToDelete, setDesiredRfqPartIdToDelete] = useState('');
  // RFQPart Properties

  //Wizard
  const [selectedPart, setSelectedPart] = useState<RFQPart | null>(null);
  const [showPartModal, setShowPartModal] = useState(false);
  const form = useWizardForm({ totalStep: 5 });

  const [reqQTY, setReqQTY] = useState<number>(1);
  const [partDescription, setPartDescription] = useState<string>('');
  const [fndQTY, setFndQTY] = useState<number>(0);
  const [reqCND, setReqCND] = useState<string>('');
  const [fndCND, setFndCND] = useState<string>('');
  const [supplierLT, setSupplierLT] = useState<number>(0);
  const [clientLT, setClientLT] = useState<number>(0);
  const [unitPricevalueString, setUnitPricevalueString] =
    useState<string>('0.00');
  const [unitPricevalueNumber, setUnitPricevalueNumber] = useState<number>(0.0);

  const [currency, setCurrency] = useState<string>('USD');

  const [comment, setComment] = useState<string>('');
  const [dgPackagingCst, setDgPackagingCost] = useState(false);
  const [tagDate, setTagDate] = useState('');
  const handleDateChange = e => {
    setTagDate(e.target.value); // Store the date in YYYY-MM-DD format
  };
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('23.12.2023');
  const [certType, setCertType] = useState<string>('');
  const [MSN, setMSN] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('');
  const [stock, setStock] = useState<number>(0);
  const [stockLocation, setStockLocation] = useState<string>('');
  const [airlineCompany, setAirlineCompany] = useState<string>('');
  const [MSDS, setMSDS] = useState<string>('');

  // Parent RFQNumber
  const [selectedParentRFQPart, setSelectedParentRFQPart] =
    useState<RFQPart[]>();

  const [isNewSupplierLoading, setIsNewSupplierLoading] = useState(false);

  const alternativePartNumberRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  //Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [partId, setPartId] = useState<string | null>(null);
  const [rfqPartId, setRfqPartId] = useState<string | null>(null);

  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
    // Get all suppliers
    const getAllSupplierAndCurrencies = async () => {
      setIsLoading(true);
      const suppResp = await getAllSuppliersFromDB();
      const currencyResp = await getAllCurrenciesFromDB();
      setCurrencies(currencyResp.data);
      setIsLoading(false);
    };
    getAllSupplierAndCurrencies();
  }, []);

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

      input_val = `${getPriceCurrencySymbol(
        currency
      )}${left_side}.${right_side}`;
    } else {
      input_val = `${getPriceCurrencySymbol(currency)}${formatNumber(
        input_val
      )}`;

      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    const x = input_val.split(getPriceCurrencySymbol(currency));
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

  const handleConfirmDelete = () => {
    // Actually delete from the parent array
    handleDeleteAlternativePart(desiredRfqPartIdToDelete);
    setShowDeleteModal(false);
    setDesiredRfqPartIdToDelete('');
  };

  const handleOpenPartModal = (partNumber: string) => {
    const foundRFQ = alternativeParts.find(
      part => part.partNumber === partNumber
    );
    if (!foundRFQ) {
      console.log('Part not found');
    } else {
      getByItemFields(partNumber)
        .then(response => {
          if (response.success && response.data && response.data.partId) {
            setSelectedPart(response.data);
          } else {
            setSelectedPart(null);
          }
        })
        .catch(err => {
          console.error('Error fetching part data:', err);
          setSelectedPart(null);
        })
        .finally(() => setShowPartModal(true));
    }
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

  const handleEditAlternativeRFQPart = (rfqPartIdToEdit: string) => {
    // We look it up in the alternativeParts array by ID
    const foundAlternative = alternativeParts.find(
      part => part.rfqPartId === rfqPartIdToEdit
    );
    if (!foundAlternative) {
      toastError('Alternative RFQ Part Error', 'No such alternative part!');
      return;
    }

    // We are now editing
    setIsEditing(true);

    // Fill the state from that part
    setPartName(foundAlternative.partName);
    setPartNumber(foundAlternative.partNumber);
    setPartId(foundAlternative.partId);
    setRfqPartId(foundAlternative.rfqPartId);

    // The "parent" Typeahead
    setSelectedParentRFQPart([foundAlternative.parentRFQPart]);

    setReqQTY(foundAlternative.reqQTY);
    setFndQTY(foundAlternative.fndQTY);
    setReqCND(foundAlternative.reqCND);
    setFndCND(foundAlternative.fndCND);
    setSupplierLT(foundAlternative.supplierLT);
    setClientLT(foundAlternative.clientLT);

    // We want to set the price & currency
    updateUnitPrice(foundAlternative);
    setComment(foundAlternative.comment || '');
    setDgPackagingCost(foundAlternative.dgPackagingCost);
    setTagDate(convertDateFormat(foundAlternative.tagDate));
    setCertType(foundAlternative.certificateType);
    setMSN(foundAlternative.MSN || '');
    setWarehouse(foundAlternative.wareHouse || '');
    setStock(foundAlternative.stock);
    setStockLocation(foundAlternative.stockLocation || '');
    setAirlineCompany(foundAlternative.airlineCompany || '');
    setMSDS(foundAlternative.MSDS || '');

    // Optionally focus on partNumber
    if (alternativePartNumberRef.current) {
      alternativePartNumberRef.current.focus();
    }

    // Finally, remove it from the parent array so we don't have 2 copies
    handleDeleteAlternativePart(rfqPartIdToEdit);
  };

  const handleAlternativeRFQPartDeletion = (rfqPartIdToDelete: string) => {
    setShowDeleteModal(true);
    setDesiredRfqPartIdToDelete(rfqPartIdToDelete);
  };

  const updateUnitPrice = (foundPart: AlternativeRFQPart) => {
    const unitPrice = foundPart.price ?? 0.0;
    const curr = foundPart.currency;
    setUnitPricevalueNumber(unitPrice);
    setUnitPricevalueString(unitPrice.toFixed(2));
    setCurrency(curr);
  };

  const handleNewAlternativePartAddition = () => {
    // Basic required fields
    if (
      !partNumber ||
      !partName ||
      reqQTY === 0 ||
      !reqCND ||
      !selectedParentRFQPart ||
      selectedParentRFQPart.length === 0
    ) {
      toastError(
        'Alternative RFQPart Required Field',
        'Please fill all the required Alternative RFQPart fields.'
      );
      return;
    }

    // Conditional checks
    const additionalFieldsProvided =
      fndQTY !== 0 ||
      fndCND ||
      supplierLT !== 0 ||
      clientLT !== 0 ||
      unitPricevalueNumber !== 0.0;

    if (additionalFieldsProvided) {
      const missingFields: string[] = [];
      if (fndQTY === 0) missingFields.push('fndQTY');
      if (!fndCND) missingFields.push('fndCND');
      if (supplierLT === 0) missingFields.push('supplierLT');
      if (clientLT === 0) missingFields.push('clientLT');
      if (unitPricevalueNumber === 0.0)
        missingFields.push('unitPricevalueNumber');

      if (missingFields.length > 0) {
        toastError(
          'Incomplete Fields',
          `The following fields must be filled: ${missingFields.join(', ')}`
        );
        return;
      }
    }

    // Validate lead times
    if (clientLT < supplierLT) {
      toastError(
        'Invalid LeadTime',
        'Supplier LT cannot be greater than client LT'
      );
      return;
    }

    // We do NOT do any "partNumber" uniqueness check now

    // If we are editing, we keep the same `rfqPartId`. Otherwise, we generate a new "temp" ID
    const finalId =
      isEditing && rfqPartId ? rfqPartId : generateTempAlternativeRFQPartId();

    // Build the part
    const alternativeRfqPart: AlternativeRFQPart = {
      parentRFQPart: selectedParentRFQPart[0],
      partId: isEditing ? partId : null, // db ID if any
      rfqPartId: finalId,
      partNumber: partNumber.trim(),
      partName: partName.trim(),
      partDescription,
      reqQTY,
      fndQTY,
      reqCND,
      fndCND,
      supplierLT,
      clientLT,
      currency,
      price: unitPricevalueNumber,
      comment: comment && comment.trim(),
      dgPackagingCost: dgPackagingCst,
      tagDate: tagDate ? formatDate(tagDate) : null,
      lastUpdatedDate,
      certificateType: certType,
      MSN: MSN && MSN.trim(),
      wareHouse: warehouse && warehouse.trim(),
      stock,
      stockLocation: stockLocation && stockLocation.trim(),
      airlineCompany: airlineCompany && airlineCompany.trim(),
      MSDS: MSDS && MSDS.trim()
    };

    // Send it back up to be added
    handleAddAlternativePart(alternativeRfqPart);

    // Reset the form
    setIsEditing(false);
    setPartId(null);
    setRfqPartId(null);
    setPartNumber('');
    setPartName('');
    setPartDescription;
    setReqQTY(1);
    setFndQTY(0);
    setReqCND('NE');
    setFndCND('');
    setSupplierLT(0);
    setClientLT(0);
    setUnitPricevalueNumber(0.0);
    setUnitPricevalueString('0.00');
    setCurrency('USD');
    setSelectedParentRFQPart([]);
    setComment('');
    setDgPackagingCost(false);
    setTagDate('');
    setLastUpdatedDate('');
    setCertType('');
    setMSN('');
    setWarehouse('');
    setStock(0);
    setStockLocation('');
    setAirlineCompany('');
    setMSDS('');
  };

  return (
    <>
      <div>
        <h3 className="mt-3">Alternative Part</h3>
        <hr className="custom-line m-0" />

        <div
          className="d-flex justify-content-end"
          style={{ padding: '10px', paddingRight: '0px' }}
        >
          {
            <CustomButton
              variant="primary"
              startIcon={<FontAwesomeIcon icon={faPlus} className="ms-0" />}
              onClick={handleNewAlternativePartAddition}
            ></CustomButton>
          }
        </div>
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <Table
            className="text-center"
            responsive
            style={{ overflow: 'visible' }}
          >
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
                <AlternativePartTableRow
                  alternativeRFQParts={alternativeParts}
                  handleEditAlternativeRFQPart={handleEditAlternativeRFQPart}
                  handleAlternativeRFQPartDeletion={
                    handleAlternativeRFQPartDeletion
                  }
                  handleOpenPartModal={handleOpenPartModal}
                />
              }

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

                {/* Additional Info START*/}
                <td>
                  <Form.Group>
                    <Form.Control
                      placeholder="Additional Info"
                      value={partDescription}
                      onChange={e => {
                        setPartDescription(e.target.value);
                        // setIsPartNameEmpty(false);
                      }}
                      // onBlur={e => {
                      //   if (!e.target.value.trim()) {
                      //     setIsPartNameEmpty(true); // Set error if input is empty
                      //   }
                      // }}
                      style={{
                        width: '180px',
                        borderColor: isPartNameEmpty ? 'red' : '' // Apply red border if empty
                      }}
                      // required
                    />
                  </Form.Group>
                </td>

                {/* Part Name END*/}

                {/* Parent Part Number START*/}
                <td>
                  <Form.Group style={{ width: '200px' }}>
                    <Typeahead
                      id="searchable-selec02"
                      labelKey="partNumber"
                      options={parts}
                      placeholder="Select a Parent RFQPart"
                      multiple={false}
                      positionFixed
                      style={{ zIndex: 10 }}
                      //If it is empty then it returns [] otherwise It returns selected
                      selected={selectedParentRFQPart}
                      onChange={selected => {
                        if (selected.length > 0) {
                          setSelectedParentRFQPart(selected as RFQPart[]);
                        } else {
                          setSelectedParentRFQPart([]);
                        }
                      }}
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
                    <option value="MOD">MODIFIED</option>
                    <option value="INS_TST">INS/TST</option>
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
                    <option value="MOD">MODIFIED</option>
                    <option value="INS_TST">INS/TST</option>
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
                      value={currency} // Make sure this matches the currency.id value
                      onChange={e => {
                        setCurrency(e.target.value);
                      }}
                      style={{
                        width: '110px',
                        paddingRight: '4px',
                        paddingLeft: '8px'
                      }}
                    >
                      {currencies.map((currencyVar, id) => (
                        <option key={id} value={currencyVar}>
                          {currencyVar}
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
                      placeholder={
                        getPriceCurrencySymbol(currency) + '1,000,000.00'
                      }
                      style={{
                        width: '110px',
                        paddingRight: '4px',
                        paddingLeft: '8px'
                      }}
                    />
                  </div>
                </td>
                {/* UNIT PRICE END */}

                {/* TOTAL START */}
                <td>
                  <div className="d-flex align-items-center mt-2">
                    <span className="fw-bold">{currency}</span>
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
                    <option value="">Select Cerf.</option>
                    <option value="FAA_8130_3 ">FAA 8130-3</option>
                    <option value="EASA_Form_1">EASA Form-1</option>
                    <option value="ANAC_SEGVOO3">ANAC SEGVOO3</option>
                    <option value="CAA_Form_1">CAA Form 1</option>
                    <option value="CAAC">CAAC</option>
                    <option value="CofC">CofC</option>
                    <option value="OEM_Certs">OEM Certs</option>
                    <option value="MFG_Certs">MFG Certs</option>
                    <option value="DUAL_FAA_EASA">DUAL (FAA&EASA)</option>
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
                        setStockLocation(e.target.value);
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
        {showPartModal && (
          <Modal
            size="xl"
            className="Parts-NewPart-Modal"
            show={showPartModal}
            onHide={() => setShowPartModal(false)}
          >
            <WizardFormProvider {...form}>
              <Card className="theme-wi">
                <Card.Header className="bg-body-highlight pt-3 pb-2 border-bottom-0">
                  <WizardNav />
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey={1}>
                      <WizardForm step={1}>
                        <PartWizardItemFiledsForm
                          partData={selectedPart}
                          onPartCreated={data => setSelectedPart(data)}
                        />
                      </WizardForm>
                    </Tab.Pane>
                    {/* <Tab.Pane eventKey={2}>
                      <WizardForm step={2}>
                        <PartWizardUserDefFieldsForm />
                      </WizardForm>
                    </Tab.Pane> */}
                    <Tab.Pane eventKey={3}>
                      <WizardForm step={3}>
                        <PartWizardNotesForm partId={selectedPart?.partId} />
                      </WizardForm>
                    </Tab.Pane>
                    <Tab.Pane eventKey={4}>
                      <WizardForm step={4}>
                        <PartWizardFilesForm partId={selectedPart?.partId} />
                      </WizardForm>
                    </Tab.Pane>
                    <Tab.Pane eventKey={5}>
                      <WizardForm step={5}>
                        <PartWizardAlternativesForm
                          partId={selectedPart?.partId}
                        />
                      </WizardForm>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
                <Card.Footer className="border-top-0"></Card.Footer>
              </Card>
            </WizardFormProvider>
          </Modal>
        )}

        <DeleteConfirmationModal
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
          position="bottom-end"
        />
      </div>
    </>
  );
};

export default AlternativePartList;
