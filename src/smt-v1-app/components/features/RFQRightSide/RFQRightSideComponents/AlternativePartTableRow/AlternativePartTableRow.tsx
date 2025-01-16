import React from 'react';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';
import { formatNumber } from '../RFQPartTableRow/RFQPartTableRowHelper';
import { AlternativeRFQPart } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import editIcon from '../../../../../../assets/img/icons/edit-icon.svg';

const AlternativePartTableRow = ({
  alternativeRFQParts,
  handleEditAlternativeRFQPart,
  handleAlternativeRFQPartDeletion
}: {
  alternativeRFQParts: AlternativeRFQPart[];
  handleEditAlternativeRFQPart: (partNumber: string) => void;
  handleAlternativeRFQPartDeletion: (partNumber: string) => void;
}) => {
  return (
    <>
      {alternativeRFQParts.map((alternativeRFQPart, key) => {
        return (
          <tr key={key}>
            <td style={{ padding: '10px' }}>
              <div className="d-flex justify-content-center">
                <span
                  className="action-icon"
                  style={{ cursor: 'pointer', marginRight: '8px' }}
                  onClick={() =>
                    handleAlternativeRFQPartDeletion(
                      alternativeRFQPart.partNumber
                    )
                  }
                >
                  <FontAwesomeIcon icon={faMinus} />
                </span>
                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="part-number-addition-edit-icon"
                  onClick={() =>
                    handleEditAlternativeRFQPart(alternativeRFQPart.partNumber)
                  }
                />
              </div>
            </td>
            <td>{alternativeRFQPart.partNumber}</td>
            <td>{alternativeRFQPart.partName}</td>
            <td>{alternativeRFQPart.parentRFQPart.partNumber}</td>
            <td className="text-center">{alternativeRFQPart.reqQTY}</td>
            <td className="text-center">{alternativeRFQPart.fndQTY}</td>
            <td className="text-center">{alternativeRFQPart.reqCND}</td>
            <td className="text-center">{alternativeRFQPart.fndCND}</td>
            <td className="text-center">{alternativeRFQPart.supplierLT}</td>
            <td className="text-center">{alternativeRFQPart.clientLT}</td>
            <td className="text-center">
              <span className="fw-bold">
                {getPriceCurrencySymbol(alternativeRFQPart.currency)}
              </span>{' '}
              {formatNumber(alternativeRFQPart.price)}
            </td>
            <td>
              {alternativeRFQPart.supplier &&
                alternativeRFQPart.supplier.supplierName}
            </td>
            <td className="text-center">
              <span className="fw-bold">
                {getPriceCurrencySymbol(alternativeRFQPart.currency)}
              </span>{' '}
              {formatNumber(
                alternativeRFQPart.price * alternativeRFQPart.fndQTY
              )}
            </td>
            <td>{alternativeRFQPart.comment}</td>
            <td className="text-center">
              {alternativeRFQPart.dgPackagingCost}
            </td>
            <td className="text-center">{alternativeRFQPart.tagDate}</td>
            <td className="text-center">
              {alternativeRFQPart.lastUpdatedDate}
            </td>
            <td>{alternativeRFQPart.certificateType}</td>
            <td>{alternativeRFQPart.MSN}</td>
            <td>{alternativeRFQPart.wareHouse}</td>
            <td>{alternativeRFQPart.stock}</td>
            <td>{alternativeRFQPart.stockLocation}</td>
            <td>{alternativeRFQPart.airlineCompany}</td>
            <td>{alternativeRFQPart.MSDS}</td>
          </tr>
        );
      })}
    </>
  );
};

export default AlternativePartTableRow;
