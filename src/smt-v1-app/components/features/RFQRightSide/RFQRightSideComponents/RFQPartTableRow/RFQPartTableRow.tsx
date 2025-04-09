import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import editIcon from '../../../../../../assets/img/icons/edit-icon.svg';
import './RFQPartTableRow.css';
import { RFQPart } from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import { formatNumber } from './RFQPartTableRowHelper';
import { getPriceCurrencySymbol } from '../RFQRightSideHelper';

interface RFQPartTableRowProps {
  rfqParts: RFQPart[];
  handleEditPart: (rfqPartId: string) => void;
  handlePartDeletion: (rfqPartId: string) => void;
  handleOpenPartModal: (rfqPartId: string) => void;
}

const RFQPartTableRow: React.FC<RFQPartTableRowProps> = ({
  rfqParts,
  handleEditPart,
  handlePartDeletion,
  handleOpenPartModal
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
                  onClick={() => handlePartDeletion(rfqPart.rfqPartId)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </span>
                <img
                  src={editIcon}
                  alt="edit-icon"
                  className="part-number-addition-edit-icon"
                  onClick={() => handleEditPart(rfqPart.rfqPartId)}
                />
              </div>
            </td>
            <td
              onClick={() => handleOpenPartModal(rfqPart.partNumber)}
              style={{
                cursor: 'pointer',
                color: 'blue',
                textDecoration: 'underline'
              }}
            >
              {rfqPart.partNumber}
            </td>
            <td>{rfqPart.partName}</td>
            <td>{rfqPart.partDescription}</td>

            <td className="text-center">{rfqPart.reqQTY}</td>
            <td className="text-center">{rfqPart.fndQTY}</td>
            <td className="text-center">{rfqPart.reqCND}</td>
            <td className="text-center">{rfqPart.fndCND}</td>
            <td className="text-center">{rfqPart.supplierLT}</td>
            <td className="text-center">{rfqPart.clientLT}</td>
            <td className="text-center">
              <span className="fw-bold">
                {getPriceCurrencySymbol(rfqPart.currency)}
              </span>{' '}
              {formatNumber(rfqPart.price)}
            </td>
            <td>{rfqPart.supplier && rfqPart.supplier.supplierName}</td>
            <td className="text-center">
              <span className="fw-bold">
                {getPriceCurrencySymbol(rfqPart.currency)}
              </span>{' '}
              {formatNumber(rfqPart.price * rfqPart.fndQTY)}
            </td>
            <td>{rfqPart.comment}</td>
            <td className="text-center">
              {rfqPart.dgPackagingCost ? 'YES' : 'NO'}
            </td>
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
