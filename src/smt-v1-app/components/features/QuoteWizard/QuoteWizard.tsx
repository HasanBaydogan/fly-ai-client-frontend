import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import WizardTabs from './WizardTabs/WizardTabs';


const QuoteWizard = ({handleOpen,handleClose,showTabs}:  {  handleOpen: () => void, handleClose: () => void,showTabs: boolean}) => {
  

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
