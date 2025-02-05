import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import WizardTabs from './WizardTabs/WizardTabs';
import { quoteWizardIntro } from 'smt-v1-app/services/QuoteService';

const QuoteWizard = ({
  handleOpen,
  handleClose,
  showTabs,
  selectedParts,
  selectedAlternativeParts,
  quoteId
}: {
  handleOpen: () => void;
  handleClose: () => void;
  showTabs: boolean;
  selectedParts: string[];
  selectedAlternativeParts: string[];
  quoteId: string;
}) => {
  useEffect(() => {
    const getSelectedQuoteParts = async () => {
      const response = await quoteWizardIntro(
        quoteId,
        selectedParts,
        selectedAlternativeParts
      );
      console.log(response);
    };
    getSelectedQuoteParts();
  }, [selectedParts, selectedAlternativeParts]);
  return (
    <Modal show={showTabs} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quote Wizard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <WizardTabs />
      </Modal.Body>
    </Modal>
  );
};

export default QuoteWizard;
