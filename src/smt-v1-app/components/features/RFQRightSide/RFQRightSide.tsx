import { useEffect, useState, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import {
  cancelRFQMail,
  convertOpenToWFS
} from 'smt-v1-app/services/MailTrackingService';
import {
  convertRFQToQuote,
  getQuoteIdwithMailId
} from 'smt-v1-app/services/QuoteService';
import { Modal, Button } from 'react-bootstrap';

const RFQRightSide = ({ rfq }: { rfq: RFQ }) => {
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const navigation = useNavigate();
  const [parts, setParts] = useState<RFQPart[]>(rfq.savedRFQItems);
  const [partName, setPartName] = useState<string>('');
  const [partNumber, setPartNumber] = useState<string>('');
  const [alternativePartName, setAlternativePartName] = useState<string>('');
  const [clientRFQId, setClientRFQId] = useState(rfq.clientRFQNumberId);

  // Global processing state: herhangi bir işlem devam ederken true olacak
  const [isLoading, setIsLoading] = useState(false);
  // Bizim toast ve diğer küçük durumlar için ayrı state'ler
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessageHeader, setToastMessageHeader] = useState('');
  const [toastMessageBody, setToastMessageBody] = useState('');
  const [toastVariant, setToastVariant] = useState('danger');

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [refreshRequested, setRefreshRequested] = useState(false);

  // Store initial values for comparison
  const initialPartsRef = useRef<string>('');
  const initialAlternativePartsRef = useRef<string>('');
  const initialClientRef = useRef<Client | null>(null);
  const initialRfqDeadlineRef = useRef<string>('');
  const initialClientRFQIdRef = useRef<string>('');

  const [foundClient, setFoundClient] = useState<Client | null>(
    rfq.clientResponse
  );
  const [rfqDeadline, setRFQDeadline] = useState<Date | undefined>(
    rfq.rfqDeadline ? parseDeadline(rfq.rfqDeadline) : null
  );
  const [alternativePartNumber, setAlternativePartNumber] =
    useState<string>('');
  const [alternativeParts, setAlternativeParts] = useState(
    rfq.alternativeRFQPartResponses
  );

  // Initialize the reference values when the component mounts
  useEffect(() => {
    initialPartsRef.current = JSON.stringify(rfq.savedRFQItems || []);
    initialAlternativePartsRef.current = JSON.stringify(
      rfq.alternativeRFQPartResponses || []
    );
    initialClientRef.current = rfq.clientResponse;
    initialRfqDeadlineRef.current = rfq.rfqDeadline || '';
    initialClientRFQIdRef.current = rfq.clientRFQNumberId || '';
  }, []);

  // Track changes to check if there are unsaved changes
  useEffect(() => {
    const currentParts = JSON.stringify(parts);
    const currentAlternativeParts = JSON.stringify(alternativeParts);
    const currentRfqDeadline = rfqDeadline
      ? formatDateToString(rfqDeadline)
      : '';

    // Check if any of the tracked values have changed
    const havePartsChanged = currentParts !== initialPartsRef.current;
    const haveAlternativePartsChanged =
      currentAlternativeParts !== initialAlternativePartsRef.current;

    // For client comparison, use client ID since the object reference might change
    const initialClientId = initialClientRef.current?.clientId;
    const currentClientId = foundClient?.clientId;
    const hasClientChanged = initialClientId !== currentClientId;

    const hasRfqDeadlineChanged =
      currentRfqDeadline !== initialRfqDeadlineRef.current;
    const hasClientRFQIdChanged = clientRFQId !== initialClientRFQIdRef.current;

    // For debugging purposes, you can log these values:
    // console.log('Initial Parts:', initialPartsRef.current);
    // console.log('Current Parts:', currentParts);
    // console.log('Changes detected:', {
    //   havePartsChanged,
    //   haveAlternativePartsChanged,
    //   hasClientChanged,
    //   hasRfqDeadlineChanged,
    //   hasClientRFQIdChanged
    // });

    // Set the unsaved changes flag based on whether any tracked value has changed
    setHasUnsavedChanges(
      havePartsChanged ||
        haveAlternativePartsChanged ||
        hasClientChanged ||
        hasRfqDeadlineChanged ||
        hasClientRFQIdChanged
    );
  }, [parts, alternativeParts, foundClient, rfqDeadline, clientRFQId]);

  // Handle F5 key press and page navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 key
      if (e.key === 'F5' || e.keyCode === 116) {
        if (hasUnsavedChanges) {
          e.preventDefault();
          setRefreshRequested(true);
          setPendingAction(() => handleConfirmedRefresh);
          setShowUnsavedWarning(true);
        }
      }
    };

    // For other unload events - instead of showing browser dialog,
    // we'll just let the page unload with our custom handling
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setShowUnsavedWarning(true);
        // Modern browsers require returnValue to be set
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Perform page refresh after confirmation
  const handleConfirmedRefresh = () => {
    window.location.reload();
  };

  // Wrapper for actions that should check for unsaved changes
  const checkUnsavedChangesBeforeAction = (action: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setShowUnsavedWarning(true);
    } else {
      action();
    }
  };

  // Execute pending action after confirmation
  const executePendingAction = () => {
    setShowUnsavedWarning(false);

    if (refreshRequested) {
      handleConfirmedRefresh();
      setRefreshRequested(false);
      setPendingAction(null);
      return;
    }

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleAddPart = (rfqPart: RFQPart) => {
    setParts(prev => [...prev, rfqPart]);
  };

  useEffect(() => {
    const returnColors = getColorStyles(rfq.rfqMailStatus);
    setBgColor(returnColors.bgColor);
    setTextColor(returnColors.textColor);
  }, [rfq.rfqMailStatus]);

  const handleDeleteAlternativePart = (rfqPartId: string) => {
    const updatedArray = alternativeParts.filter(
      item => item.rfqPartId !== rfqPartId
    );
    setAlternativeParts(updatedArray);
  };

  const handleAddAlternativePart = (alternativePart: AlternativeRFQPart) => {
    setAlternativeParts([...alternativeParts, alternativePart]);
  };

  const handleDeletePart = (rfqPartId: string) => {
    const updatedArray = parts.filter(item => item.rfqPartId !== rfqPartId);
    setParts(updatedArray);
  };

  const handleDeleteAlternativePartAccordingToParentRFQNumber = (
    rfqPartId: string
  ) => {
    const updatedArray = alternativeParts.filter(
      item => item.parentRFQPart.rfqPartId !== rfqPartId
    );
    setAlternativeParts(updatedArray);
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

  const handleCancel = async () => {
    if (!hasUnsavedChanges) {
      // If no changes, proceed directly
      setIsLoading(true);
      const response = await cancelRFQMail(rfq.rfqMailId);
      if (response && response.statusCode === 200) {
        toastSuccess('Success Cancel', 'RFQ Mail is canceled successfully');
        setTimeout(() => {
          navigation('/mail-tracking');
        }, 1500);
      } else {
        toastError('An error', 'An error occurs');
        setIsLoading(false);
      }
    } else {
      // If there are changes, show unsaved changes warning
      checkUnsavedChangesBeforeAction(async () => {
        setIsLoading(true);
        const response = await cancelRFQMail(rfq.rfqMailId);
        if (response && response.statusCode === 200) {
          toastSuccess('Success Cancel', 'RFQ Mail is canceled successfully');
          setTimeout(() => {
            navigation('/mail-tracking');
          }, 1500);
        } else {
          toastError('An error', 'An error occurs');
          setIsLoading(false);
        }
      });
    }
  };

  const handleSaveUpdate = async () => {
    setIsLoading(true);
    if (!foundClient) {
      toastError('Client Error', 'Client cannot be empty');
      setIsLoading(false);
      return;
    } else if (partName || partNumber) {
      toastError(
        'Not Added Part Row',
        "Please be careful that you didn't click '+' button in Part"
      );
      setIsLoading(false);
      return;
    } else if (alternativePartName || alternativePartNumber) {
      toastError(
        'Not Added Alternative Part Row',
        "Please be careful that you didn't click '+' button in Alternative Part"
      );
      setIsLoading(false);
      return;
    } else {
      const rfqPartRequests: RFQPartRequest[] = parts.map(
        (part): RFQPartRequest => {
          return {
            rfqPartId: part.rfqPartId,
            partNumber: part.partNumber,
            partName: part.partName,
            partDescription: part.partDescription,
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
            partDescription: alternativePart.partDescription,
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

      const resp = await saveRFQToDB(savedRFQ);
      if (resp && resp.statusCode === 200) {
        // Update reference values after a successful save
        initialPartsRef.current = JSON.stringify(parts);
        initialAlternativePartsRef.current = JSON.stringify(alternativeParts);
        initialClientRef.current = foundClient;
        initialRfqDeadlineRef.current = rfqDeadline
          ? formatDateToString(rfqDeadline)
          : '';
        initialClientRFQIdRef.current = clientRFQId || '';

        // Reset unsaved changes flag after successful save
        setHasUnsavedChanges(false);

        toastSuccess(
          'Saving Success',
          'RFQ is saved successfully, directed...'
        );
        setTimeout(() => {
          navigation('/mail-tracking');
        }, 1500);
      } else {
        toastError(
          'An Error',
          'An error occurs when saving data. Also check parent Part Number'
        );
        setIsLoading(false);
      }
    }
  };

  const convertToWFS = async () => {
    setIsLoading(true);
    const resp = await convertOpenToWFS(rfq.rfqMailId);
    if (resp && resp.statusCode === 200) {
      toastSuccess(
        'Success WFS Conversation',
        'RFQ Mail is converted WFS successfully'
      );
    } else {
      toastError('An Unknown error', 'An Unknown error occurs');
      setIsLoading(false);
    }
  };

  const handleConvertToQuote = async () => {
    if (!hasUnsavedChanges) {
      // If no changes, proceed directly
      setIsLoading(true);
      await handleSaveUpdate();
      if (rfq.rfqMailStatus === 'OPEN') {
        await convertToWFS();
      }
      const response = await convertRFQToQuote(rfq.rfqMailId);
      if (response && response.statusCode === 200) {
        toastSuccess('Successful Quote', 'Converted to Quote');
        setTimeout(() => {
          navigation('/quotes/quote?quoteId=' + response.data.quoteId);
        }, 1500);
      } else {
        toastError('Unknown Error', 'There is an unknown error');
        setIsLoading(false);
      }
    } else {
      // If there are changes, show unsaved changes warning
      checkUnsavedChangesBeforeAction(async () => {
        setIsLoading(true);
        await handleSaveUpdate();
        if (rfq.rfqMailStatus === 'OPEN') {
          await convertToWFS();
        }
        const response = await convertRFQToQuote(rfq.rfqMailId);
        if (response && response.statusCode === 200) {
          toastSuccess('Successful Quote', 'Converted to Quote');
          setTimeout(() => {
            navigation('/quotes/quote?quoteId=' + response.data.quoteId);
          }, 1500);
        } else {
          toastError('Unknown Error', 'There is an unknown error');
          setIsLoading(false);
        }
      });
    }
  };

  const handleGoToQuote = async () => {
    if (!hasUnsavedChanges) {
      // If no changes, proceed directly
      setIsLoading(true);
      try {
        const response = await getQuoteIdwithMailId(rfq.rfqMailId);
        if (response && response.statusCode === 200 && response.data?.quoteId) {
          navigation(`/quotes/quote?quoteId=${response.data.quoteId}`);
        } else {
          toastError('Quote Error', 'Quote id could not be retrieved');
          setIsLoading(false);
        }
      } catch (error) {
        toastError('Error', 'An error occurred while retrieving quote id');
        setIsLoading(false);
      }
    } else {
      // If there are changes, show unsaved changes warning
      checkUnsavedChangesBeforeAction(async () => {
        setIsLoading(true);
        try {
          const response = await getQuoteIdwithMailId(rfq.rfqMailId);
          if (
            response &&
            response.statusCode === 200 &&
            response.data?.quoteId
          ) {
            navigation(`/quotes/quote?quoteId=${response.data.quoteId}`);
          } else {
            toastError('Quote Error', 'Quote id could not be retrieved');
            setIsLoading(false);
          }
        } catch (error) {
          toastError('Error', 'An error occurred while retrieving quote id');
          setIsLoading(false);
        }
      });
    }
  };

  const customNavigate = (path: string) => {
    if (!hasUnsavedChanges) {
      // If no changes, navigate directly
      navigation(path);
    } else {
      // If there are changes, show warning
      checkUnsavedChangesBeforeAction(() => {
        navigation(path);
      });
    }
  };

  return (
    <div className="rfq-right">
      <Header
        date={rfq.lastModifiedDate}
        emailSentDate={rfq.emailSentDate}
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
        toastSuccess={toastSuccess}
        toastError={toastError}
      />
      <PartList
        parts={parts}
        handleDeletePart={handleDeletePart}
        handleAddPart={handleAddPart}
        alternativeParts={alternativeParts}
        handleDeleteAlternativePartAccordingToParentRFQNumber={
          handleDeleteAlternativePartAccordingToParentRFQNumber
        }
        setAlternativeParts={setAlternativeParts}
        partName={partName}
        setPartName={setPartName}
        partNumber={partNumber}
        setPartNumber={setPartNumber}
      />
      <AlternativePartList
        alternativeParts={alternativeParts}
        parts={parts}
        handleDeleteAlternativePart={handleDeleteAlternativePart}
        handleAddAlternativePart={handleAddAlternativePart}
        partName={alternativePartName}
        setPartName={setAlternativePartName}
        partNumber={alternativePartNumber}
        setPartNumber={setAlternativePartNumber}
      />
      <RFQRightSideFooter
        handleCancel={handleCancel}
        handleSaveUpdate={handleSaveUpdate}
        handleConvertToQuote={handleConvertToQuote}
        handleGoToQuote={handleGoToQuote}
        isLoading={isLoading}
        rfqMailStatus={rfq.rfqMailStatus}
      />

      <ToastNotification
        isShow={isShowToast}
        setIsShow={setIsShowToast}
        variant={toastVariant}
        messageHeader={toastMessageHeader}
        messageBodyText={toastMessageBody}
        position="bottom-end"
      />

      {/* Unsaved changes warning modal */}
      <Modal
        show={showUnsavedWarning}
        onHide={() => setShowUnsavedWarning(false)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {refreshRequested ? 'Page Refresh' : 'Unsaved Changes'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. If you continue, these changes will be lost.
          Would you like to save your changes?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setRefreshRequested(false);
              setShowUnsavedWarning(false);
            }}
          >
            Cancel
          </Button>
          {/* <Button
            variant="primary"
            onClick={async () => {
              setShowUnsavedWarning(false);
              await handleSaveUpdate();
              if (pendingAction) executePendingAction();
            }}
          >
            Save First
          </Button> */}
          <Button variant="danger" onClick={executePendingAction}>
            Continue Without Saving
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RFQRightSide;
