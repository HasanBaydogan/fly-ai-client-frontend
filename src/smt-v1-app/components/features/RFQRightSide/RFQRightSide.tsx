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

const RFQRightSide = ({ rfq }: { rfq: RFQ }) => {
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [parts, setParts] = useState(rfq.savedRFQItems);
  const [alternativeParts, setAlternativeParts] = useState(
    rfq.alternativeRFQPartResponses
  );

  const [foundClient, setFoundClient] = useState<Client | null>(
    rfq.clientResponse
  );
  const [rfqDeadline, setRFQDeadline] = useState(rfq.rfqDeadline);
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
        foundClient
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
        <RFQRightSideFooter />
      </div>
    </>
  );
};

export default RFQRightSide;
