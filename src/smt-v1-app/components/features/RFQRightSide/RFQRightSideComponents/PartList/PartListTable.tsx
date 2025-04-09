import React, { useState, useCallback, useEffect } from 'react';
import { Table, Form, Button, Modal, Tooltip, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRotateRight,
  faInfoCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Typeahead } from 'react-bootstrap-typeahead';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import RFQPartTableRow from '../RFQPartTableRow/RFQPartTableRow';
import CustomButton from '../../../../../../components/base/Button';
import { tableHeaders } from './PartListHelper';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';
import { RFQPart } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import { generateTempRFQPartId } from './PartListHelper';
import { OverlayTrigger } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { createPortal } from 'react-dom';

type Supplier = any;

export interface PartSuggestion {
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

interface PartListTableProps {
  parts: RFQPart[];
  partNumber: string;
  handleAddPart: (rfqPart: RFQPart) => void;
  setParts?: React.Dispatch<React.SetStateAction<RFQPart[]>>;
  setPartNumber: React.Dispatch<React.SetStateAction<string>>;
  partName: string;
  setPartName: React.Dispatch<React.SetStateAction<string>>;
  partDescription: string;
  setPartDescription: React.Dispatch<React.SetStateAction<string>>;
  reqQTY: number;
  setReqQTY: React.Dispatch<React.SetStateAction<number>>;
  fndQTY: number;
  setFndQTY: React.Dispatch<React.SetStateAction<number>>;
  reqCND: string;
  setReqCND: React.Dispatch<React.SetStateAction<string>>;
  fndCND: string;
  setFndCND: React.Dispatch<React.SetStateAction<string>>;
  supplierLT: number;
  setSupplierLT: React.Dispatch<React.SetStateAction<number>>;
  clientLT: number;
  setClientLT: React.Dispatch<React.SetStateAction<number>>;
  unitPricevalueString: string;
  unitPricevalueNumber: number;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  supplier: Supplier[];
  setSupplier: React.Dispatch<React.SetStateAction<Supplier[]>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  dgPackagingCst: boolean;
  setDgPackagingCost: React.Dispatch<React.SetStateAction<boolean>>;
  tagDate: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastUpdatedDate: string;
  certType: string;
  setCertType: React.Dispatch<React.SetStateAction<string>>;
  MSN: string;
  setMSN: React.Dispatch<React.SetStateAction<string>>;
  warehouse: string;
  setWarehouse: React.Dispatch<React.SetStateAction<string>>;
  stock: number;
  setStock: React.Dispatch<React.SetStateAction<number>>;
  stockLocation: string;
  setStockLocation: React.Dispatch<React.SetStateAction<string>>;
  airlineCompany: string;
  setAirlineCompany: React.Dispatch<React.SetStateAction<string>>;
  MSDS: string;
  setMSDS: React.Dispatch<React.SetStateAction<string>>;
  suppliers: Supplier[];
  isNewSupplierLoading: boolean;
  handleNewSupplier: () => void;
  handleAllSuppliersRefresh: () => void;
  currencies: string[];
  unitPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleEditPart: (rfqPartId: string) => void;
  handlePartDeletion: (rfqPartId: string) => void;
  handleOpenPartModal: (partNumber: string) => void;
  handleNewPartAddition: () => void;
  handlePartSearch: (searchTerm: string) => Promise<PartSuggestion[]>;
  setTagDate: React.Dispatch<React.SetStateAction<string>>;
}

const headerCellStyle: React.CSSProperties = {
  padding: '4px 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center'
};

const cellStyle: React.CSSProperties = {
  padding: '4px 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center'
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const PartListTable: React.FC<PartListTableProps> = ({
  parts,
  handleAddPart,
  partNumber,
  setPartNumber,
  partName,
  setPartName,
  partDescription,
  setPartDescription,
  reqQTY,
  setReqQTY,
  fndQTY,
  setFndQTY,
  reqCND,
  setReqCND,
  fndCND,
  setFndCND,
  supplierLT,
  setSupplierLT,
  clientLT,
  setClientLT,
  unitPricevalueString,
  unitPricevalueNumber,
  currency,
  setCurrency,
  supplier,
  setSupplier,
  comment,
  setComment,
  dgPackagingCst,
  setDgPackagingCost,
  tagDate,
  handleDateChange,
  lastUpdatedDate,
  certType,
  setCertType,
  MSN,
  setMSN,
  warehouse,
  setWarehouse,
  stock,
  setStock,
  stockLocation,
  setStockLocation,
  airlineCompany,
  setAirlineCompany,
  MSDS,
  setMSDS,
  suppliers,
  isNewSupplierLoading,
  handleNewSupplier,
  handleAllSuppliersRefresh,
  currencies,
  unitPriceChange,
  handleBlur,
  handleEditPart,
  handlePartDeletion,
  handleOpenPartModal,
  handleNewPartAddition,
  handlePartSearch,
  setTagDate
}) => {
  const [showMultiAddModal, setShowMultiAddModal] = useState(false);
  const [multiPartNumbers, setMultiPartNumbers] = useState('');
  const [multiPartNames, setMultiPartNames] = useState('');
  const [multiQty, setMultiQty] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState<PartSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = React.useRef<HTMLDivElement>(null);

  const parseMultiLineInput = (input: string): string[] => {
    const lines = input
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const results: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.toUpperCase() === 'OR' && i > 0 && i < lines.length - 1) {
        const combined = results[results.length - 1] + ' OR ' + lines[i + 1];
        results[results.length - 1] = combined;
        i += 2;
      } else {
        results.push(line);
        i++;
      }
    }
    return results;
  };

  const handleMultiAdd = () => {
    const parsedPartNumbers = parseMultiLineInput(multiPartNumbers);
    const parsedPartNames = parseMultiLineInput(multiPartNames);
    const parsedQty = parseMultiLineInput(multiQty);

    if (
      parsedPartNumbers.length !== parsedPartNames.length ||
      parsedPartNumbers.length !== parsedQty.length
    ) {
      setErrorMessage(
        'Part Number, Part Name and Qty line numbers do not match!'
      );
      return;
    }

    const newParts = parsedPartNumbers.map((pn, idx) => ({
      partNumber: pn.trim(),
      partName: parsedPartNames[idx].trim(),
      reqQty: parseInt(parsedQty[idx], 10) || 1
    }));

    newParts.forEach(np => {
      handleAddPart({
        partId: null,
        rfqPartId: generateTempRFQPartId(),
        partNumber: np.partNumber,
        partName: np.partName,
        partDescription: '',
        reqQTY: np.reqQty,
        fndQTY: 0,
        reqCND: 'NE',
        fndCND: '',
        supplierLT: 0,
        clientLT: 0,
        currency: 'USD',
        price: 0.0,
        supplier: null,
        comment: '',
        dgPackagingCost: false,
        tagDate: null,
        lastUpdatedDate: '',
        certificateType: '',
        MSN: '',
        wareHouse: '',
        stock: 0,
        stockLocation: '',
        airlineCompany: '',
        MSDS: ''
      });
    });

    setShowMultiAddModal(false);
    setMultiPartNumbers('');
    setMultiPartNames('');
    setMultiQty('');
    setErrorMessage('');
  };

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length >= 3) {
        const results = await handlePartSearch(searchTerm);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    [handlePartSearch]
  );

  const handlePartNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPartNumber(value);
    debouncedSearch(value);
  };

  const handleSuggestionSelect = (suggestion: PartSuggestion) => {
    setPartNumber(suggestion.partNumber);
    setPartName(suggestion.partName || '');
    setPartDescription(suggestion.partDescription || '');
    setReqCND(suggestion.reqCND);
    setReqQTY(suggestion.reqQTY);
    //setFndQTY(suggestion.fndQTY);
    //setFndCND(suggestion.fndCND);
    setSupplierLT(suggestion.supplierLT);
    setClientLT(suggestion.clientLT);
    setCurrency(suggestion.currency);
    //setSupplier([{ supplierName: suggestion.supplier }]);
    setComment(suggestion.comment || '');
    setDgPackagingCost(suggestion.dgPackagingCost);
    setTagDate(suggestion.tagDate || '');
    setCertType(suggestion.certificateType || '');
    setMSN(suggestion.MSN || '');
    setWarehouse(suggestion.wareHouse || '');
    //setStock(suggestion.stock || 0);
    //setStockLocation(suggestion.stockLocation || '');
    //setAirlineCompany(suggestion.airlineCompany || '');
    setMSDS(suggestion.MSDS || '');

    const priceString = suggestion.price ? suggestion.price.toString() : '0';
    unitPriceChange({
      target: { value: priceString }
    } as React.ChangeEvent<HTMLInputElement>);

    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(
          'input[placeholder="Part Number"]'
        )
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePartNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (suggestionRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
  };

  useEffect(() => {
    const handleGlobalAction = (event: Event) => {
      if (
        suggestionRef.current &&
        suggestionRef.current.contains(event.target as Node)
      ) {
        return;
      }
      // setShowSuggestions(false);
    };

    // window.addEventListener('scroll', handleGlobalAction);
    window.addEventListener('click', handleGlobalAction);

    return () => {
      // window.removeEventListener('scroll', handleGlobalAction);
      window.removeEventListener('click', handleGlobalAction);
    };
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (showSuggestions && suggestionRef.current && document.activeElement) {
        const rect = (
          document.activeElement as HTMLElement
        ).getBoundingClientRect();
        suggestionRef.current.style.top = `${rect.bottom}px`;
        suggestionRef.current.style.left = `${rect.left}px`;
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showSuggestions]);

  return (
    <div>
      <div
        className="d-flex justify-content-end"
        style={{ padding: '10px', paddingRight: '0px' }}
      >
        {/* Single*/}
        <CustomButton
          variant="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} className="ms-0" />}
          onClick={handleNewPartAddition}
        />

        {/* Multi */}
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => setShowMultiAddModal(true)}
        >
          {<FontAwesomeIcon icon={faPlus} className="ms-0" />}
          {<FontAwesomeIcon icon={faPlus} className="ms-0" />}
          {<FontAwesomeIcon icon={faPlus} className="ms-0" />}
        </Button>
      </div>
      <Table responsive style={{ overflow: 'visible', position: 'relative' }}>
        <thead>
          <tr>
            <th></th>
            {tableHeaders.map((header, key) =>
              header === 'Unit Price' ? (
                <th key={key} className="text-center">
                  {header}
                </th>
              ) : (
                <th key={key}>{header}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          <RFQPartTableRow
            rfqParts={parts}
            handleEditPart={handleEditPart}
            handlePartDeletion={handlePartDeletion}
            handleOpenPartModal={handleOpenPartModal}
          />
          <tr>
            <td style={{ padding: '10px' }}>
              <span
                onClick={handleNewPartAddition}
                className="action-icon mt-2"
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
            </td>
            {/* Part Number */}
            <td style={{ overflow: 'visible', position: 'relative' }}>
              <Form.Group style={{ position: 'relative' }}>
                <Form.Control
                  placeholder="Part Number"
                  value={partNumber}
                  onChange={handlePartNumberChange}
                  onBlur={handlePartNumberBlur}
                  style={{ width: '180px' }}
                  required
                />
                {showSuggestions &&
                  suggestions.length > 0 &&
                  createPortal(
                    <div
                      ref={suggestionRef}
                      style={{
                        position: 'fixed',
                        top: `${(
                          document.activeElement as HTMLElement
                        )?.getBoundingClientRect().bottom}px`,
                        left: `${(
                          document.activeElement as HTMLElement
                        )?.getBoundingClientRect().left}px`,
                        width: '90vw',
                        maxWidth: '750px',
                        zIndex: 999999,
                        backgroundColor: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        maxHeight: '400px',
                        marginTop: '4px'
                      }}
                    >
                      <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: '2000px' }}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: `
                                  minmax(170px, 170px)
                                  minmax(170px, 170px)
                                  minmax(160px, 160px)
                                  minmax(100px, 100px)
                                  minmax(100px, 100px)
                                  minmax(100px, 100px)
                                  minmax(80px, 80px)
                                  minmax(80px, 80px)
                                  minmax(80px, 80px)
                                  minmax(120px, 120px)
                                  minmax(80px, 80px)
                                  minmax(100px, 100px)
                                  minmax(100px, 100px)
                                  minmax(80px, 80px)
                                  minmax(100px, 100px)
                                  minmax(80px, 80px)
                                  minmax(100px, 100px)
                                  minmax(120px, 120px)
                                `,
                              gap: '4px',
                              padding: '8px',
                              backgroundColor: '#f8f9fa',
                              borderBottom: '2px solid #dee2e6',
                              fontWeight: 'bold',
                              fontSize: '0.8em',
                              position: 'sticky',
                              top: 0,
                              zIndex: 2
                            }}
                          >
                            <div style={headerCellStyle}>Part Number</div>
                            <div style={headerCellStyle}>Part Name</div>
                            <div style={headerCellStyle}>Part Description</div>
                            <div style={headerCellStyle}>Req/Fnd QTY</div>
                            <div style={headerCellStyle}>Req/Fnd CND</div>
                            <div style={headerCellStyle}>Lead Times</div>
                            <div style={headerCellStyle}>Price</div>
                            <div style={headerCellStyle}>Currency</div>
                            <div style={headerCellStyle}>Total</div>
                            <div style={headerCellStyle}>Supplier</div>
                            <div style={headerCellStyle}>Stock</div>
                            <div style={headerCellStyle}>Location</div>
                            <div style={headerCellStyle}>Certificate</div>
                            <div style={headerCellStyle}>DG Pack</div>
                            <div style={headerCellStyle}>MSN</div>
                            <div style={headerCellStyle}>MSDS</div>
                            <div style={headerCellStyle}>Last Updated</div>
                            <div style={headerCellStyle}>Comment</div>
                          </div>
                          <div
                            style={{
                              maxHeight: '340px',
                              position: 'relative'
                            }}
                          >
                            <div style={{ paddingBottom: '12px' }}>
                              {suggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  onClick={() =>
                                    handleSuggestionSelect(suggestion)
                                  }
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: `
                                        minmax(170px, 170px)
                                        minmax(170px, 170px)
                                        minmax(160px, 160px)
                                        minmax(100px, 100px)
                                        minmax(100px, 100px)
                                        minmax(100px, 100px)
                                        minmax(80px, 80px)
                                        minmax(80px, 80px)
                                        minmax(80px, 80px)
                                        minmax(120px, 120px)
                                        minmax(80px, 80px)
                                        minmax(100px, 100px)
                                        minmax(100px, 100px)
                                        minmax(80px, 80px)
                                        minmax(100px, 100px)
                                        minmax(80px, 80px)
                                        minmax(100px, 100px)
                                        minmax(120px, 120px)
                                      `,
                                    gap: '4px',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #eee',
                                    alignItems: 'center',
                                    fontSize: '0.85em',
                                    backgroundColor: 'white'
                                  }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor =
                                      '#f5f5f5';
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor =
                                      'white';
                                  }}
                                >
                                  <div style={cellStyle}>
                                    {suggestion.partNumber}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.partName || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.partDescription || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {`${suggestion.reqQTY}/${suggestion.fndQTY}`}
                                  </div>
                                  <div style={cellStyle}>
                                    {`${suggestion.reqCND}/${suggestion.fndCND}`}
                                  </div>
                                  <div style={cellStyle}>
                                    {`${suggestion.supplierLT}/${suggestion.clientLT}`}
                                  </div>
                                  <div style={cellStyle}>
                                    {formatCurrency(suggestion.price)}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.currency}
                                  </div>
                                  <div style={cellStyle}>
                                    {formatCurrency(suggestion.total)}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.supplier || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.stock || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.stockLocation || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.certificateType || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.dgPackagingCost ? 'Yes' : 'No'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.MSN || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.MSDS || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.lastUpdatedDate || '-'}
                                  </div>
                                  <div style={cellStyle}>
                                    {suggestion.comment || '-'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
              </Form.Group>
            </td>
            {/* Part Name */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="Part Name"
                  value={partName}
                  onChange={e => {
                    setPartName(e.target.value);
                  }}
                  style={{ width: '180px' }}
                  required
                />
              </Form.Group>
            </td>
            {/* Part Desc */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="Part Description"
                  value={partDescription}
                  onChange={e => {
                    setPartDescription(e.target.value);
                  }}
                  style={{ width: '160px' }}
                  required
                />
              </Form.Group>
            </td>
            {/* Req QTY */}
            <td>
              <Form.Group>
                <Form.Control
                  value={reqQTY}
                  type="number"
                  onChange={e => setReqQTY(parseInt(e.target.value, 10))}
                  required
                  style={{ width: '80px' }}
                  min={1}
                />
              </Form.Group>
            </td>
            {/* FND QTY */}
            <td>
              <Form.Group>
                <Form.Control
                  value={fndQTY}
                  type="number"
                  onChange={e => setFndQTY(parseInt(e.target.value, 10))}
                  required
                  style={{ width: '80px' }}
                  min={0}
                />
              </Form.Group>
            </td>
            {/* REQ CND */}
            <td>
              <Form.Select
                value={reqCND}
                onChange={e => setReqCND(e.target.value)}
                style={{ width: '95px' }}
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
            {/* FND CND */}
            <td>
              <Form.Select
                value={fndCND}
                onChange={e => setFndCND(e.target.value)}
                required
                style={{ width: '95px' }}
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
            {/* SUPPLIER LT */}
            <td>
              <Form.Control
                value={supplierLT}
                type="number"
                onChange={e => setSupplierLT(parseInt(e.target.value))}
                style={{ width: '80px' }}
                min={0}
              />
            </td>
            {/* CLIENT LT */}
            <td>
              <Form.Control
                value={clientLT}
                type="number"
                onChange={e => setClientLT(parseInt(e.target.value))}
                style={{ width: '80px' }}
                min={0}
              />
            </td>
            {/* UNIT PRICE */}
            <td>
              <div
                className="d-flex justify-content-between"
                style={{ width: '230px' }}
              >
                <Form.Select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  style={{ width: '110px' }}
                >
                  {currencies.map((curr, id) => (
                    <option key={id} value={curr}>
                      {curr}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  value={unitPricevalueString}
                  onChange={unitPriceChange}
                  onBlur={e => {
                    handleBlur(
                      e as React.FocusEvent<HTMLInputElement, Element>
                    );

                    const numValue = parseFloat(
                      e.target.value.replace(/,/g, '')
                    );
                    if (!isNaN(numValue)) {
                      e.target.value = formatCurrency(numValue);
                    }
                  }}
                  placeholder={`${getPriceCurrencySymbol(
                    currency
                  )}1,000,000.00`}
                  style={{ width: '110px' }}
                />
              </div>
            </td>
            {/* SUPPLIER */}
            <td style={{ overflow: 'visible' }}>
              {isNewSupplierLoading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <LoadingAnimation />
                </div>
              ) : (
                <div className="d-flex">
                  <Button
                    variant="primary"
                    className="px-3 py-1 me-3"
                    onClick={handleNewSupplier}
                  >
                    <span style={{ fontSize: '16px' }}>+</span>
                  </Button>
                  <div className="d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon
                      icon={faArrowRotateRight}
                      className="me-3"
                      size="lg"
                      onClick={handleAllSuppliersRefresh}
                    />
                  </div>
                  <Form.Group style={{ width: '200px' }}>
                    <Typeahead
                      id="searchable-select"
                      labelKey="supplierName"
                      options={suppliers}
                      placeholder="Select a supplier"
                      multiple={false}
                      positionFixed
                      style={{ zIndex: 100 }}
                      selected={supplier}
                      onChange={selected => {
                        if (selected.length > 0) {
                          setSupplier(selected as Supplier[]);
                        } else {
                          setSupplier([]);
                        }
                      }}
                    />
                  </Form.Group>
                </div>
              )}
            </td>
            {/* TOTAL */}
            <td>
              <div className="d-flex align-items-center mt-2">
                <span className="fw-bold">{currency}</span>
                <span className="ms-2">
                  {formatCurrency(
                    (unitPricevalueNumber
                      ? Math.round(unitPricevalueNumber * 100) / 100
                      : 0) * fndQTY
                  )}
                </span>
              </div>
            </td>
            {/* COMMENT */}
            <td>
              <Form.Control
                as="textarea"
                placeholder="Comments"
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: '200px', height: '37.07px' }}
              />
            </td>
            {/* DG PACKAGING COST */}
            <td>
              <Form.Select
                value={dgPackagingCst ? 'YES' : 'NO'}
                onChange={e =>
                  setDgPackagingCost(e.target.value === 'NO' ? false : true)
                }
                defaultValue={'NO'}
                required
                style={{ width: '80px' }}
              >
                <option value="NO">NO</option>
                <option value="YES">YES</option>
              </Form.Select>
            </td>
            {/* TAG DATE */}
            <td>
              <Form.Control
                value={tagDate}
                placeholder="Tag Date"
                type="date"
                onChange={handleDateChange}
              />
            </td>
            {/* Last Updated Date */}
            <td>
              <div className="d-flex align-items-center justify-content-center mt-2 last-updated-date-text-container">
                <span className="last-updated-date-text fw-bold">
                  {lastUpdatedDate}
                </span>
              </div>
            </td>
            {/* Certificate Type */}
            <td>
              <Form.Select
                value={certType}
                onChange={e => setCertType(e.target.value)}
                style={{ width: '120px' }}
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
            {/* MSN */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="MSN"
                  value={MSN}
                  onChange={e => setMSN(e.target.value)}
                  style={{ width: '180px' }}
                />
              </Form.Group>
            </td>
            {/* Warehouse */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="Warehouse"
                  value={warehouse}
                  onChange={e => setWarehouse(e.target.value)}
                  style={{ width: '180px' }}
                />
              </Form.Group>
            </td>
            {/* Stock */}
            <td>
              <Form.Group>
                <Form.Control
                  value={stock}
                  type="number"
                  onChange={e => setStock(parseInt(e.target.value, 10))}
                  required
                  style={{ width: '80px' }}
                  min={0}
                />
              </Form.Group>
            </td>
            {/* Stock Location */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="Stock Location"
                  value={stockLocation}
                  onChange={e => setStockLocation(e.target.value)}
                  style={{ width: '180px' }}
                />
              </Form.Group>
            </td>
            {/* Airline Company */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="Airline Company"
                  value={airlineCompany}
                  onChange={e => setAirlineCompany(e.target.value)}
                  style={{ width: '180px' }}
                />
              </Form.Group>
            </td>
            {/* MSDS */}
            <td>
              <Form.Group>
                <Form.Control
                  placeholder="MSDS"
                  value={MSDS}
                  onChange={e => setMSDS(e.target.value)}
                  style={{ width: '180px' }}
                />
              </Form.Group>
            </td>
          </tr>
        </tbody>
      </Table>
      {/* Çoklu Ekleme Modal'ı */}
      <Modal
        show={showMultiAddModal}
        onHide={() => setShowMultiAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Multiple Parts{' '}
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-multiple-parts">
                  Part Number, Part Name and QTY line numbers must be equal.
                  <br />
                  QTY can only be a number.
                </Tooltip>
              }
            >
              <span style={{ marginLeft: '8px', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faInfoCircle} size="lg" />
              </span>
            </OverlayTrigger>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: 'relative' }}>
          {errorMessage && (
            <Alert
              variant="danger"
              onClose={() => setErrorMessage('')}
              dismissible
              style={{
                position: 'absolute',
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1051,
                width: '90%'
              }}
            >
              {errorMessage}
            </Alert>
          )}
          <div className="d-flex justify-content-between">
            <Form.Group className="mb-3 me-2" style={{ flex: 1 }}>
              <Form.Label>Part Numbers</Form.Label>
              <Form.Control
                as="textarea"
                rows={20}
                value={multiPartNumbers}
                onChange={e => setMultiPartNumbers(e.target.value)}
                placeholder={`Part Number1\nPart Number2\nPart Number3`}
              />
            </Form.Group>
            <Form.Group className="mb-3 me-2" style={{ flex: 1 }}>
              <Form.Label>Part Names</Form.Label>
              <Form.Control
                as="textarea"
                rows={20}
                value={multiPartNames}
                onChange={e => setMultiPartNames(e.target.value)}
                placeholder={`Part Name1\nPart Name2\nPart Name3`}
              />
            </Form.Group>
            <Form.Group className="mb-3" style={{ flex: 1 }}>
              <Form.Label>QTY</Form.Label>
              <Form.Control
                as="textarea"
                rows={20}
                value={multiQty}
                onChange={e => setMultiQty(e.target.value)}
                placeholder={`QTY 1\nQTY 2\nQTY 3`}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMultiAddModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleMultiAdd}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PartListTable;
