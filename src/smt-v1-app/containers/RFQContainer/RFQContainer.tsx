import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import RFQLeftSide from 'smt-v1-app/components/features/RFQLeftSide/RFQLeftSide';
import RFQRightSide from 'smt-v1-app/components/features/RFQRightSide/RFQRightSide';
import { openRFQ } from 'smt-v1-app/services/RFQService';

const RFQContainer = () => {
  const [searchParams] = useSearchParams();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const rfqMailId = searchParams.get('rfqMailId');

  useEffect(() => {
    const openRFQMail = async () => {
      setIsLoading(true);
      const response = await openRFQ(rfqMailId);
      console.log(response);
      setIsLoading(false);
    };

    openRFQMail();
  }, [rfqMailId]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="d-flex flex-wrap justify-content-around ">
        {/* Sol tarafı modular hale getirdik */}
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px'
            }}
          >
            <LoadingAnimation />
          </div>
        ) : (
          <>
            <RFQLeftSide />

            {/* Sağ taraf (products, alternative products) */}
            <RFQRightSide />
          </>
        )}
      </div>
      rfq container
    </div>
  );
};

export default RFQContainer;
