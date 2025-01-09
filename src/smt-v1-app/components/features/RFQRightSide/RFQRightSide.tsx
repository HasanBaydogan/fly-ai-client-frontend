import React, { useEffect, useState } from 'react';
import { getColorStyles } from '../RfqMailRowItem/RfqMailRowHelper';
import Client from './RFQRightSideComponents/Client/Client';
import PartList from './RFQRightSideComponents/PartList/PartList';
import AlternativePartList from './RFQRightSideComponents/AlternativePartList/AlternativePartList';
import Footer from 'components/footers/Footer';
import Header from './RFQRightSideComponents/Header/Header';

const RFQRightSide = ({ rfq }: { rfq: RFQ }) => {
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [parts, setParts] = useState(rfq.savedRFQItems);
  const [alternativeParts, setAlternativeParts] = useState();

  useEffect(() => {
    const returnColors = getColorStyles(rfq.rfqMailStatus);
    setBgColor(returnColors.bgColor);
    setTextColor(returnColors.textColor);
  }, []);

  const handleDeleteAlternativePart = (
    alternativeRFQPart: AlternativeRFQPart
  ) => {};

  const handleAddAlternativePart = (
    alternativeRFQPart: AlternativeRFQPart
  ) => {};

  const handleAddPart = (rfqPart: RFQPart) => {};
  const handleDeletePart = (rfqPart: RFQPart) => {};

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

        <Client />

        {
          <PartList
            parts={parts}
            handleDeletePart={handleDeletePart}
            handleAddPart={handleAddPart}
          />
        }

        {/* <AlternativePartList
          alternativeParts={alternativeParts}
          handleDeleteAlternativePart={handleDeleteAlternativePart}
          handleAddAlternativePart={handleAddAlternativePart}
        />

        <Footer / */}
      </div>
    </>
  );
};

export default RFQRightSide;
