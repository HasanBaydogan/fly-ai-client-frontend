import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import editIcon from '../../../../../../assets/img/icons/edit-icon.svg';
import './RFQPartTableRow.css';
import { RFQPart } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import { formatNumber } from './RFQPartTableRowHelper';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';

const RFQPartTableRow = ({
  rfqParts,
  setShowDeleteModal,
  handleDeletePart,
  handleEditPart,
  handlePartDeletion
}: {
  rfqParts: RFQPart[];
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletePart: (partNumber: string) => void;
  handleEditPart: (partNumber: string) => void;
  handlePartDeletion: (partNumber: string) => void;
}) => {
  return (
    <>
      {rfqParts.map((rfqPart, key) => {
        return (
          <tr key={key}>
            <td style={{ padding: '10px' }}>
              <div className="d-flex justify-content-center">
                <span
                  className="action-icon"
                  style={{ cursor: 'pointer', marginRight: '8px' }}
                  onClick={() => handlePartDeletion(rfqPart.partNumber)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </span>
                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="part-number-addition-edit-icon"
                  onClick={() => handleEditPart(rfqPart.partNumber)}
                />
              </div>
            </td>
            <td>{rfqPart.partNumber}</td>
            <td>{rfqPart.partName}</td>
            <td className="text-center">{rfqPart.reqQTY}</td>
            <td className="text-center">{rfqPart.fndQTY}</td>
            <td className="text-center">{rfqPart.reqCND}</td>
            <td className="text-center">{rfqPart.fndCND}</td>
            <td className="text-center">{rfqPart.supplierLT}</td>
            <td className="text-center">{rfqPart.clientLT}</td>
            <td className="text-center">
              <span className="fw-bold">
                {rfqPart.unitPriceResponse.currency &&
                  getPriceCurrencySymbol(rfqPart.unitPriceResponse.currency)}
              </span>{' '}
              {rfqPart.unitPriceResponse.unitPrice &&
                formatNumber(rfqPart.unitPriceResponse.unitPrice)}
            </td>
            <td>{rfqPart.supplier && rfqPart.supplier.supplierName}</td>
            <td className="text-center">
              <span className="fw-bold">
                {rfqPart.unitPriceResponse.currency &&
                  getPriceCurrencySymbol(rfqPart.unitPriceResponse.currency)}
              </span>{' '}
              {rfqPart.unitPriceResponse.unitPrice &&
                formatNumber(
                  rfqPart.unitPriceResponse.unitPrice * rfqPart.fndQTY
                )}
            </td>
            <td>{rfqPart.comment}</td>
            <td className="text-center">{rfqPart.dgPackagingCost}</td>
            <td className="text-center">{rfqPart.tagDate}</td>
            <td className="text-center">{rfqPart.lastUpdatedDate}</td>
            <td>{rfqPart.certificateType}</td>
            <td>{rfqPart.MSN}</td>
            <td>{rfqPart.wareHouse}</td>
            <td>{rfqPart.stock}</td>
            <td>{rfqPart.stockLocation}</td>
            <td>{rfqPart.airlineCompany}</td>
            <td>{rfqPart.MSDS}</td>
          </tr>
        );
      })}
    </>
  );
};

export default RFQPartTableRow;
