import React, { useEffect, useState } from 'react';
import { getColorStyles } from '../RfqMailRowItem/RfqMailRowHelper';
import Client from './RFQRightSideComponents/Client/Client';
import PartList from './RFQRightSideComponents/PartList/PartList';
import AlternativePartList from './RFQRightSideComponents/AlternativePartList/AlternativePartList';
import Header from './RFQRightSideComponents/Header/Header';
import {
  AlternativeRFQPart,
  RFQ,
  RFQPart
} from 'smt-v1-app/containers/RFQContainer/RfqContainerTypes';
import RFQRightSideFooter from './RFQRightSideComponents/RFQRightSideFooter/RFQRightSideFooter';
import {
  formatDateToString,
  parseDeadline
} from './RFQRightSideComponents/Client/ClientHelper';
import {
  AlternativeRFQPartRequest,
  RFQPartRequest,
  SaveRFQ
} from './RFQRightSideComponents/RFQRightSideHelper';
import { saveRFQToDB } from 'smt-v1-app/services/RFQService';
import ToastNotification from 'smt-v1-app/components/common/ToastNotification/ToastNotification';

const RFQRightSide = ({ rfq }: { rfq: RFQ }) => {
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [parts, setParts] = useState(rfq.savedRFQItems);
  const [alternativeParts, setAlternativeParts] = useState(
    rfq.alternativeRFQPartResponses
  );

  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessageHeader, setToastMessageHeader] = useState('');
  const [toastMessageBody, setToastMessageBody] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  const [foundClient, setFoundClient] = useState<Client | null>(
    rfq.clientResponse
  );
  const [rfqDeadline, setRFQDeadline] = useState<Date | undefined>(
    rfq.rfqDeadline ? parseDeadline(rfq.rfqDeadline) : undefined
  );
  const [clientRFQId, setClientRFQId] = useState(rfq.clientRFQNumberId);

  useEffect(() => {
    const returnColors = getColorStyles(rfq.rfqMailStatus);
    setBgColor(returnColors.bgColor);
    setTextColor(returnColors.textColor);
  }, []);

  const handleDeleteAlternativePart = (alternPartNumber: string) => {
    const updatedArray = alternativeParts.filter(
      item => item.partNumber !== alternPartNumber
    );
    setAlternativeParts(updatedArray);
  };

  const handleAddAlternativePart = (alternativePart: AlternativeRFQPart) => {
    setAlternativeParts([...alternativeParts, alternativePart]);
  };

  const handleAddPart = (rfqPart: RFQPart) => {
    setParts([...parts, rfqPart]);
  };
  const handleDeletePart = (partNumber: string) => {
    const updatedArray = parts.filter(item => item.partNumber !== partNumber);
    setParts(updatedArray);
  };
  const handleDeleteAlternativePartAccordingToParentRFQNumber = (
    partNumber: string
  ) => {
    const updatedArray = alternativeParts.filter(
      item => item.parentRFQPart.partNumber !== partNumber
    );
    setAlternativeParts(updatedArray);
  };

  const handleCancel = () => {};

  const handleSaveUpdate = async () => {
    if (!foundClient) {
      console.log('Client cannot be empty');
    } else {
      const rfqPartRequests: RFQPartRequest[] = parts.map(
        (part): RFQPartRequest => {
          return {
            rfqPartId: part.rfqPartId,
            partNumber: part.partNumber,
            partName: part.partName,
            reqQTY: part.reqQTY,
            fndQTY: part.fndQTY,
            reqRFQPartCondition: part.reqCND,
            fndRFQPartCondition: part.fndCND ? part.fndCND : null,
            supplierLT: part.supplierLT !== 0 ? part.supplierLT : null,
            clientLT: part.clientLT !== 0 ? part.clientLT : null,
            supplierId:
              part.supplier !== null ? part.supplier.supplierId : null,
            price: part.price,
            currency: part.currency,
            comment: part.comment !== '' ? part.comment : null,
            isDgPackagingCost: part.dgPackagingCost,
            tagDate: part.tagDate !== '' ? part.tagDate : null,
            certificateType:
              part.certificateType !== '' ? part.certificateType : null,
            MSN: part.MSN !== '' ? part.MSN : null,
            warehouse: part.wareHouse !== '' ? part.wareHouse : null,
            stock: part.stock !== 0 ? part.stock : null,
            stockLocation:
              part.stockLocation !== '' ? part.stockLocation : null,
            airlineCompany:
              part.airlineCompany !== '' ? part.airlineCompany : null,
            MSDS: part.MSDS !== '' ? part.MSDS : null
          };
        }
      );

      const alternativeRFQPartRequests: AlternativeRFQPartRequest[] =
        alternativeParts.map((alternativePart): AlternativeRFQPartRequest => {
          return {
            rfqPartId: alternativePart.rfqPartId,
            parentPartNumber: alternativePart.parentRFQPart.partNumber,
            partNumber: alternativePart.partNumber,
            partName: alternativePart.partName,
            reqQTY: alternativePart.reqQTY,
            fndQTY: alternativePart.fndQTY,
            reqRFQPartCondition: alternativePart.reqCND,
            fndRFQPartCondition: alternativePart.fndCND
              ? alternativePart.fndCND
              : null,
            supplierLT:
              alternativePart.supplierLT !== 0
                ? alternativePart.supplierLT
                : null,
            clientLT:
              alternativePart.clientLT !== 0 ? alternativePart.clientLT : null,
            supplierId:
              alternativePart.supplier !== null
                ? alternativePart.supplier.supplierId
                : null,
            price: alternativePart.price,
            currency: alternativePart.currency,
            comment:
              alternativePart.comment !== '' ? alternativePart.comment : null,
            isDgPackagingCost: alternativePart.dgPackagingCost,
            tagDate:
              alternativePart.tagDate !== '' ? alternativePart.tagDate : null,
            certificateType:
              alternativePart.certificateType !== ''
                ? alternativePart.certificateType
                : null,
            MSN: alternativePart.MSN !== '' ? alternativePart.MSN : null,
            warehouse:
              alternativePart.wareHouse !== ''
                ? alternativePart.wareHouse
                : null,
            stock: alternativePart.stock !== 0 ? alternativePart.stock : null,
            stockLocation:
              alternativePart.stockLocation !== ''
                ? alternativePart.stockLocation
                : null,
            airlineCompany:
              alternativePart.airlineCompany !== ''
                ? alternativePart.airlineCompany
                : null,
            MSDS: alternativePart.MSDS !== '' ? alternativePart.MSDS : null
          };
        });

      const savedRFQ: SaveRFQ = {
        rfqMailId: rfq.rfqMailId,
        rfqPartRequests: rfqPartRequests,
        alternativeRFQPartRequests: alternativeRFQPartRequests,
        clientId: foundClient.clientId,
        rfqDeadline: formatDateToString(rfqDeadline),
        clientRFQId: clientRFQId !== '' ? clientRFQId : null
      };

      console.log(savedRFQ);
      const resp = await saveRFQToDB(savedRFQ);
      console.log(resp);
      if (resp.statusCode === 200) {
        toastSuccess(
          'Saving Success',
          'RFQ is saved successfully, directed...'
        );
      } else {
        toastError('An Error', 'An error occurs');
      }
    }
  };
  function toastSuccess(messageHeader: string, message: string) {
    setToastVariant('success');
    setToastMessageHeader(messageHeader);
    setToastMessageBody(message);
    setIsShowToast(true);
  }
  function toastError(messageHeader: string, message: string) {
    setToastVariant('danger');
    setToastMessageHeader(messageHeader);
    setToastMessageBody(message);
    setIsShowToast(true);
  }

  return (
    <>
      <div className="rfq-right">
        <Header
          date={rfq.lastModifiedDate}
          rfqNumberId={rfq.rfqNumberId}
          clientRFQId={rfq.clientRFQNumberId}
          bgColor={bgColor}
          textColor={textColor}
          status={rfq.rfqMailStatus}
        />

        <Client
          foundClient={foundClient}
          setFoundClient={setFoundClient}
          rfqDeadline={rfqDeadline}
          setRFQDeadline={setRFQDeadline}
          clientRFQId={clientRFQId}
          setClientRFQId={setClientRFQId}
        />
        {
          <PartList
            parts={parts}
            handleDeletePart={handleDeletePart}
            handleAddPart={handleAddPart}
            alternativeParts={alternativeParts}
            handleDeleteAlternativePartAccordingToParentRFQNumber={
              handleDeleteAlternativePartAccordingToParentRFQNumber
            }
          />
        }
        <AlternativePartList
          alternativeParts={alternativeParts}
          parts={parts}
          handleDeleteAlternativePart={handleDeleteAlternativePart}
          handleAddAlternativePart={handleAddAlternativePart}
        />
        <RFQRightSideFooter
          handleCancel={handleCancel}
          handleSaveUpdate={handleSaveUpdate}
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

export default RFQRightSide;
