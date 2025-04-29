import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faSave } from '@fortawesome/free-solid-svg-icons';

interface ActionTextAreaProps {
  initialValue: string;
  onSave: (value: string) => void;
}

const ActionTextArea: React.FC<ActionTextAreaProps> = ({
  initialValue,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [nextAction, setNextAction] = useState<() => void>(() => () => {});

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setShowEditModal(false);
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    onSave(value);
    setIsEditing(false);
    setShowSaveModal(false);
  };

  const checkUnsavedChanges = (nextAction: () => void) => {
    if (value !== initialValue) {
      setNextAction(() => nextAction);
      setShowUnsavedModal(true);
    } else {
      nextAction();
    }
  };

  return (
    <div className="d-flex align-items-start gap-2">
      <Form.Control
        as="textarea"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!isEditing}
        style={{ minHeight: '100px', resize: 'vertical' }}
      />

      {!isEditing ? (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleEditClick}
          title="Edit"
          className="d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px' }}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </Button>
      ) : (
        <Button
          variant="outline-success"
          size="sm"
          onClick={handleSaveClick}
          title="Save"
          className="d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px' }}
        >
          <FontAwesomeIcon icon={faSave} />
        </Button>
      )}

      {/* Edit Confirmation Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit Mode</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to enter edit mode?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStartEdit}>
            Yes, Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        show={showSaveModal}
        onHide={() => setShowSaveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save your changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmSave}>
            Yes, Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Unsaved Changes Warning Modal */}
      <Modal
        show={showUnsavedModal}
        onHide={() => setShowUnsavedModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have unsaved changes. Your changes will be lost if you continue.
          Do you want to proceed?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUnsavedModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowUnsavedModal(false);
              nextAction();
            }}
          >
            Yes, Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActionTextArea;
