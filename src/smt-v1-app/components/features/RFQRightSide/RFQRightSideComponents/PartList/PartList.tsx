// PartList.tsx
import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FocusEvent
} from 'react';
import {
  getAllCurrenciesFromDB,
  getAllSuppliersFromDB
} from 'smt-v1-app/services/RFQService';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';
import PartListTable from './PartListTable';
import PartWizardModal from './PartWizardModal';
import useWizardForm from 'hooks/useWizardForm';
import {
  RFQPart,
  AlternativeRFQPart
} from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import { formatDate, convertDateFormat } from './PartListHelper';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';
import {
  getByItemFields,
  getPartHistorySuggestion
} from 'smt-v1-app/services/PartServices';
import PartSuggestion from './PartListTable';

let tempIdCount = 1;
function generateTempRFQPartId() {
  const id = `temp-${String(tempIdCount).padStart(2, '0')}`;
  tempIdCount++;
  return id;
}

interface PartListProps {
  parts: RFQPart[];
  handleDeletePart: (rfqPartId: string) => void;
  handleAddPart: (rfqPart: RFQPart) => void;
  alternativeParts: AlternativeRFQPart[];
  handleDeleteAlternativePartAccordingToParentRFQNumber: (
    alternPartNumber: string
  ) => void;
  setAlternativeParts: React.Dispatch<
    React.SetStateAction<AlternativeRFQPart[]>
  >;
  partName: string;
  setPartName: React.Dispatch<React.SetStateAction<string>>;
  partNumber: string;
  setPartNumber: React.Dispatch<React.SetStateAction<string>>;
  attachmentId?: string;
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}

interface PartSuggestion {
  partNumber: string;
  partName: string | null;
  partDescription: string | null;
  reqCND: string;
  reqQTY: number;
  fndQTY: number;
  fndCND: string;
  supplierLT: number;
  clientLT: number;
  price: number;
  currency: string;
  total: number;
  supplier: string;
  comment: string | null;
  dgPackagingCost: boolean;
  tagDate: string | null;
  lastUpdatedDate: string;
  certificateType: string | null;
  stock: number | null;
  stockLocation: string | null;
  wareHouse: string | null;
  MSN: string | null;
  airlineCompany: string | null;
  MSDS: string | null;
}

interface PartHistorySuggestionResponse {
  success: boolean;
  data: {
    partNumber: string;
    partName: string;
    partDescription: string;
    reqCND: string;
    reqQTY: number;
    fndQTY: number;
    fndCND: string;
    supplierLT: number;
    clientLT: number;
    price: number;
    currency: string;
    total: number;
    supplier: string;
    comment: string | null;
    dgPackagingCost: boolean;
    tagDate: string | null;
    lastUpdatedDate: string;
    certificateType: string | null;
    stock: number | null;
    stockLocation: string | null;
    wareHouse: string | null;
    MSN: string | null;
    airlineCompany: string | null;
    MSDS: string | null;
  }[];
}

const PartList: React.FC<PartListProps> = ({
  parts,
  handleDeletePart,
  handleAddPart,
  alternativeParts,
  handleDeleteAlternativePartAccordingToParentRFQNumber,
  setAlternativeParts,
  partName,
  setPartName,
  // partDescription,
  partNumber,
  setPartNumber,
  attachmentId,
  note,
  setNote
}) => {
  // Genel state'ler
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessageHeader, setToastMessageHeader] = useState('');
  const [toastMessageBody, setToastMessageBody] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [desiredPartNumberToDelete, setDesiredPartNumberToDelete] =
    useState('');

  // RFQPart özellikleri
  const [reqQTY, setReqQTY] = useState<number>(1);
  const [partDescription, setPartDescription] = useState<string>('');
  const [fndQTY, setFndQTY] = useState<number>(0);
  const [reqCND, setReqCND] = useState<string>('NE');
  const [fndCND, setFndCND] = useState<string>('');
  const [supplierLT, setSupplierLT] = useState<number>(0);
  const [clientLT, setClientLT] = useState<number>(0);
  const [unitPricevalueString, setUnitPricevalueString] =
    useState<string>('0.00');
  const [unitPricevalueNumber, setUnitPricevalueNumber] = useState<number>(0.0);
  const [currency, setCurrency] = useState('USD');
  const [supplier, setSupplier] = useState<any[]>([]);
  const [comment, setComment] = useState<string>('');
  const [dgPackagingCst, setDgPackagingCost] = useState(false);
  const [tagDate, setTagDate] = useState('');
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagDate(e.target.value);
  };
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('23.12.2023');
  const [certType, setCertType] = useState<string>('');
  const [MSN, setMSN] = useState<string>('');
  const [warehouse, setWarehouse] = useState<string>('');
  const [stock, setStock] = useState<number>(0);
  const [stockLocation, setStockLocation] = useState<string>('');
  const [airlineCompany, setAirlineCompany] = useState<string>('');
  const [MSDS, setMSDS] = useState<string>('');

  // Wizard ve modal
  const [selectedPart, setSelectedPart] = useState<RFQPart | null>(null);
  const [showPartModal, setShowPartModal] = useState(false);
  const form = useWizardForm({ totalStep: 5 });

  // Diğer state'ler
  const [isNewSupplierLoading, setIsNewSupplierLoading] = useState(false);
  const constPartNumberRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Edit durumları
  const [isEditing, setIsEditing] = useState(false);
  const [oldPartNumber, setOldPartNumber] = useState<string>('');
  const [partId, setPartId] = useState<string | null>(null);
  const [rfqPartId, setRfqPartId] = useState<string | null>(null);

  // Silme ile ilgili state'ler
  const [numOfconnectedAlternativeRFQ, setNumOfconnectedAlternativeRFQ] =
    useState(0);
  const [
    connectedAlternativeRFQPartsForDeletion,
    setConnectedAlternativeRFQPartsForDeletion
  ] = useState<AlternativeRFQPart[]>();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);

  useEffect(() => {
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

  const handleNewSupplier = () => {
    window.open('/supplier/new-supplier', '_blank');
  };

  const handleOpenPartModal = (partNumber: string) => {
    const foundRFQ = parts.find(part => part.partNumber === partNumber);
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

  const formatCurrency = (inputValue: string, blur: string = ''): string => {
    if (inputValue === '') return '';
    let input_val = inputValue;
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
        inputValue
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

  const handleUnitPriceChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const formattedValue = formatCurrency(e.target.value);
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

  const handleEditPart = (rfqPartId: string) => {
    const foundRFQ: RFQPart | null = parts.filter(
      part => part.rfqPartId === rfqPartId
    )[0];
    if (!foundRFQ) {
      console.log('Found RFQ is not valid', parts);
    } else {
      setIsEditing(true);
      setPartName(foundRFQ.partName);
      setPartNumber(foundRFQ.partNumber);
      setPartDescription(foundRFQ.partDescription);
      setPartId(foundRFQ.partId);
      setRfqPartId(foundRFQ.rfqPartId);
      setReqQTY(foundRFQ.reqQTY);
      setFndQTY(foundRFQ.fndQTY);
      setReqCND(foundRFQ.reqCND);
      setFndCND(foundRFQ.fndCND);
      setSupplierLT(foundRFQ.supplierLT);
      setClientLT(foundRFQ.clientLT);
      updateUnitPrice(foundRFQ);
      setSupplier(foundRFQ.supplier ? [foundRFQ.supplier] : []);
      setComment(foundRFQ.comment);
      setDgPackagingCost(foundRFQ.dgPackagingCost);
      setTagDate(convertDateFormat(foundRFQ.tagDate));
      setCertType(foundRFQ.certificateType);
      setMSN(foundRFQ.MSN);
      setWarehouse(foundRFQ.wareHouse);
      setStock(foundRFQ.stock);
      setStockLocation(foundRFQ.stockLocation);
      setAirlineCompany(foundRFQ.airlineCompany);
      setMSDS(foundRFQ.MSDS);
      if (constPartNumberRef.current) {
        constPartNumberRef.current.focus();
      }
      handleDeletePart(rfqPartId);
    }
  };

  const handleConfirmDelete = () => {
    handleDeletePart(desiredPartNumberToDelete);
    handleDeleteAlternativePartAccordingToParentRFQNumber(
      desiredPartNumberToDelete
    );
    setShowDeleteModal(false);
    setDesiredPartNumberToDelete('');
  };

  const handlePartDeletion = (rfqPartId: string) => {
    setShowDeleteModal(true);
    const connectedAlternativeRFQParts = alternativeParts.filter(
      alternativePart => alternativePart.parentRFQPart.rfqPartId === rfqPartId
    );
    setConnectedAlternativeRFQPartsForDeletion(connectedAlternativeRFQParts);
    setNumOfconnectedAlternativeRFQ(connectedAlternativeRFQParts.length);
    setDesiredPartNumberToDelete(rfqPartId);
  };

  const updateUnitPrice = (foundRFQ: RFQPart) => {
    const unitPrice = foundRFQ.price ?? 0.0;
    const curr = foundRFQ.currency;
    setUnitPricevalueNumber(unitPrice);
    setUnitPricevalueString(unitPrice.toFixed(2));
    setCurrency(curr);
  };

  const handleNewPartAddition = () => {
    if (!partNumber || !partName || reqQTY === 0 || !reqCND) {
      toastError(
        'RFQPart Required Field',
        'Please fill all the required RFQPart fields.'
      );
      return;
    }
    const additionalFieldsProvided =
      fndQTY !== 0 ||
      fndCND ||
      supplierLT !== 0 ||
      clientLT !== 0 ||
      unitPricevalueNumber !== 0.0 ||
      (supplier && supplier.length > 0);
    if (additionalFieldsProvided) {
      const missingFields = [];
      if (fndQTY === 0) missingFields.push('fndQTY');
      if (!fndCND) missingFields.push('fndCND');
      if (supplierLT === 0) missingFields.push('supplierLT');
      if (clientLT === 0) missingFields.push('clientLT');
      if (unitPricevalueNumber === 0.0)
        missingFields.push('unitPricevalueNumber');
      if (!supplier || supplier.length === 0) missingFields.push('supplier');
      if (missingFields.length > 0) {
        toastError(
          'Incomplete Fields',
          `The following fields must be filled: ${missingFields.join(', ')}`
        );
        return;
      }
    }
    if (clientLT < supplierLT) {
      toastError(
        'Invalid LeadTime',
        'Supplier LT cannot be greater than client LT'
      );
      return;
    }
    const finalRFQPartId =
      isEditing && rfqPartId ? rfqPartId : generateTempRFQPartId();
    const rfqPart: RFQPart = {
      partId: isEditing ? partId : null,
      rfqPartId: finalRFQPartId,
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
      supplier:
        supplier.length > 0
          ? {
              supplierId: supplier[0].supplierId,
              supplierName: supplier[0].supplierName
            }
          : null,
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
    if (oldPartNumber !== partNumber.trim()) {
      const newAlternativeParts = alternativeParts.map(ap =>
        ap.parentRFQPart.partNumber === oldPartNumber
          ? {
              ...ap,
              parentRFQPart: {
                ...ap.parentRFQPart,
                partNumber: partNumber.trim()
              }
            }
          : ap
      );
      setAlternativeParts(newAlternativeParts);
    }
    setOldPartNumber('');
    handleAddPart(rfqPart);
    setRfqPartId('');
    setPartNumber('');
    setPartName('');
    setPartDescription('');
    setReqQTY(1);
    setFndQTY(0);
    setReqCND('NE');
    setFndCND('');
    setSupplierLT(0);
    setClientLT(0);
    setUnitPricevalueNumber(0.0);
    setUnitPricevalueString('0.00');
    setCurrency('USD');
    setSupplier([]);
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
    setIsEditing(false);
    setPartId(null);
    setRfqPartId(null);
  };

  const handlePartSearch = async (
    searchTerm: string
  ): Promise<PartSuggestion[]> => {
    try {
      const response = await getPartHistorySuggestion(searchTerm);
      const typedResponse = response as PartHistorySuggestionResponse;

      if (typedResponse.success && typedResponse.data) {
        return typedResponse.data.map(item => ({
          partNumber: item.partNumber,
          partName: item.partName,
          partDescription: item.partDescription,
          reqCND: item.reqCND || '-',
          reqQTY: item.reqQTY || 0,
          dgPackagingCost: item.dgPackagingCost || false,
          fndQTY: item.fndQTY || 0,
          fndCND: item.fndCND || '-',
          supplierLT: item.supplierLT || 0,
          clientLT: item.clientLT || 0,
          price: item.price || 0,
          currency: item.currency || 'USD',
          total: item.total || 0,
          supplier: item.supplier || 'Unknown Supplier',
          comment: item.comment || null,
          tagDate: item.tagDate || null,
          lastUpdatedDate: item.lastUpdatedDate || '-',
          certificateType: item.certificateType || null,
          stock: item.stock || null,
          stockLocation: item.stockLocation || null,
          wareHouse: item.wareHouse || null,
          MSN: item.MSN || null,
          airlineCompany: item.airlineCompany || null,
          MSDS: item.MSDS || null
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching part suggestions:', error);
      return [];
    }
  };

  return (
    <div>
      <h3 className="mt-3">Part</h3>
      <hr className="custom-line m-0" />
      {isLoading ? (
        <div className="d-flex justify-content-center mt-2">
          <LoadingAnimation />
        </div>
      ) : (
        <PartListTable
          parts={parts}
          handleAddPart={handleAddPart}
          partNumber={partNumber}
          setPartNumber={setPartNumber}
          partName={partName}
          setPartName={setPartName}
          partDescription={partDescription}
          setPartDescription={setPartDescription}
          reqQTY={reqQTY}
          setReqQTY={setReqQTY}
          fndQTY={fndQTY}
          setFndQTY={setFndQTY}
          reqCND={reqCND}
          setReqCND={setReqCND}
          fndCND={fndCND}
          setFndCND={setFndCND}
          supplierLT={supplierLT}
          setSupplierLT={setSupplierLT}
          clientLT={clientLT}
          setClientLT={setClientLT}
          unitPricevalueString={unitPricevalueString}
          unitPricevalueNumber={unitPricevalueNumber}
          currency={currency}
          setCurrency={setCurrency}
          supplier={supplier}
          setSupplier={setSupplier}
          comment={comment}
          setComment={setComment}
          dgPackagingCst={dgPackagingCst}
          setDgPackagingCost={setDgPackagingCost}
          tagDate={tagDate}
          handleDateChange={handleDateChange}
          lastUpdatedDate={lastUpdatedDate}
          certType={certType}
          setCertType={setCertType}
          MSN={MSN}
          setMSN={setMSN}
          warehouse={warehouse}
          setWarehouse={setWarehouse}
          stock={stock}
          setStock={setStock}
          stockLocation={stockLocation}
          setStockLocation={setStockLocation}
          airlineCompany={airlineCompany}
          setAirlineCompany={setAirlineCompany}
          MSDS={MSDS}
          setMSDS={setMSDS}
          suppliers={suppliers}
          isNewSupplierLoading={isNewSupplierLoading}
          handleNewSupplier={handleNewSupplier}
          handleAllSuppliersRefresh={handleAllSuppliersRefresh}
          currencies={currencies}
          unitPriceChange={handleUnitPriceChange}
          handleBlur={handleBlur}
          handleEditPart={handleEditPart}
          handlePartDeletion={handlePartDeletion}
          handleOpenPartModal={handleOpenPartModal}
          handleNewPartAddition={handleNewPartAddition}
          handlePartSearch={handlePartSearch}
          setTagDate={setTagDate}
          attachmentId={attachmentId}
          note={note}
          setNote={setNote}
        />
      )}
      {/* Parts Total and Alternative Parts Total Section */}
      <div className="mt-3 row align-items-end mx-2">
        {/* Parts Total (left) */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0"
            style={{ background: '#ffff' }}
          >
            <div className="card-body py-2 px-2 d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-1">
                <span
                  className="me-2"
                  style={{ fontSize: '1.1rem', color: '#0d6efd' }}
                >
                  <i className="fas fa-coins"></i>
                </span>
                <span
                  className="fw-bold"
                  style={{ fontSize: '0.95rem', color: '#333' }}
                >
                  Parts Total
                </span>
              </div>
              <div
                className="fw-bold"
                style={{
                  fontSize: '1.1rem',
                  color: '#0d6efd',
                  letterSpacing: '0.5px'
                }}
              >
                {(() => {
                  if (!parts || parts.length === 0) return '0';
                  const totalsByCurrency = parts.reduce(
                    (acc, part) => {
                      if (!part.currency) return acc;
                      if (!acc[part.currency]) acc[part.currency] = 0;
                      acc[part.currency] +=
                        (part.price || 0) * (part.fndQTY || 0);
                      return acc;
                    },
                    {} as Record<string, number>
                  );
                  return Object.entries(totalsByCurrency)
                    .map(
                      ([currency, total]) =>
                        `${currency} ${total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}`
                    )
                    .join(' | ');
                })()}
              </div>
            </div>
          </div>
        </div>
        {/* Alternative Parts Total (middle) */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0"
            style={{ background: '#ffff' }}
          >
            <div className="card-body py-2 px-2 d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-1">
                <span
                  className="me-2"
                  style={{ fontSize: '1.1rem', color: '#0d6efd' }}
                >
                  <i className="fas fa-coins"></i>
                </span>
                <span
                  className="fw-bold"
                  style={{ fontSize: '0.95rem', color: '#333' }}
                >
                  Alternative Parts Total
                </span>
              </div>
              <div
                className="fw-bold"
                style={{
                  fontSize: '1.1rem',
                  color: '#0d6efd',
                  letterSpacing: '0.5px'
                }}
              >
                {(() => {
                  if (!alternativeParts || alternativeParts.length === 0)
                    return '0';
                  const totalsByCurrency = alternativeParts.reduce(
                    (acc, part) => {
                      if (!part.currency) return acc;
                      if (!acc[part.currency]) acc[part.currency] = 0;
                      acc[part.currency] +=
                        (part.price || 0) * (part.fndQTY || 0);
                      return acc;
                    },
                    {} as Record<string, number>
                  );
                  return Object.entries(totalsByCurrency)
                    .map(
                      ([currency, total]) =>
                        `${currency} ${total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}`
                    )
                    .join(' | ');
                })()}
              </div>
            </div>
          </div>
        </div>
        {/* All Parts Total (right) */}
        <div className="col-md-4">
          <div
            className="card shadow-sm border-0"
            style={{ background: '#ffff' }}
          >
            <div className="card-body py-2 px-2 d-flex flex-column align-items-center">
              <div className="d-flex align-items-center mb-1">
                <span
                  className="me-2"
                  style={{ fontSize: '1.1rem', color: '#0d6efd' }}
                >
                  <i className="fas fa-coins"></i>
                </span>
                <span
                  className="fw-bold"
                  style={{ fontSize: '0.95rem', color: '#333' }}
                >
                  All Parts Total
                </span>
              </div>
              <div
                className="fw-bold"
                style={{
                  fontSize: '1.1rem',
                  color: '#0d6efd',
                  letterSpacing: '0.5px'
                }}
              >
                {(() => {
                  const allParts = [
                    ...(parts || []),
                    ...(alternativeParts || [])
                  ];
                  if (allParts.length === 0) return '0';
                  const totalsByCurrency = allParts.reduce(
                    (acc, part) => {
                      if (!part.currency) return acc;
                      if (!acc[part.currency]) acc[part.currency] = 0;
                      acc[part.currency] +=
                        (part.price || 0) * (part.fndQTY || 0);
                      return acc;
                    },
                    {} as Record<string, number>
                  );
                  return Object.entries(totalsByCurrency)
                    .map(
                      ([currency, total]) =>
                        `${currency} ${total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}`
                    )
                    .join(' | ');
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Parts Total and Alternative Parts Total Section */}
      <div className="mt-3 row align-items-end mx-2">
        <div className="col-md-12">
          <label htmlFor="part-notes" className="form-label fw-bold">
            Notes
          </label>
          <textarea
            id="part-notes"
            className="form-control"
            placeholder="Enter notes about the parts..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            style={{ resize: 'vertical', minHeight: '38px' }}
          />
        </div>
      </div>
      {showPartModal && (
        <PartWizardModal
          show={showPartModal}
          onHide={() => setShowPartModal(false)}
          form={form}
          selectedPart={selectedPart}
        />
      )}
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handleConfirmDelete={handleConfirmDelete}
        numOfconnectedAlternativeRFQ={numOfconnectedAlternativeRFQ}
      />
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
