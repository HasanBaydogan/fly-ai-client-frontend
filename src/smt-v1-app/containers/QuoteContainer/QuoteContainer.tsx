import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import WizardTabs from './WizardTabs/WizardTabs';

const QuoteContainer: React.FC = () => {
  const [showTabs, setShowTabs] = useState(false);

  const handleOpen = () => setShowTabs(true);
  const handleClose = () => setShowTabs(false);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div>Quote Container</div>
      <Button onClick={handleOpen}>Click Me!</Button>

      <Modal show={showTabs} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Wizard Tabs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WizardTabs />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default QuoteContainer;
