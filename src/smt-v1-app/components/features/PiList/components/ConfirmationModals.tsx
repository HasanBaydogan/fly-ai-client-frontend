import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FileToDelete } from '../../../../types/PIListFileUpload.types';

interface ConfirmationModalsProps {
  showDeleteConfirm: boolean;
  showSaveConfirm: boolean;
  fileToDelete: FileToDelete | null;
  nodeToSave: string | null;
  onHideDeleteConfirm: () => void;
  onHideSaveConfirm: () => void;
  onConfirmedDelete: () => void;
  onConfirmedSave: () => void;
}

const ConfirmationModals: React.FC<ConfirmationModalsProps> = ({
  showDeleteConfirm,
  showSaveConfirm,
  fileToDelete,
  nodeToSave,
  onHideDeleteConfirm,
  onHideSaveConfirm,
  onConfirmedDelete,
  onConfirmedSave
}) => {
  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={onHideDeleteConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Delete File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHideDeleteConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirmedDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal show={showSaveConfirm} onHide={onHideSaveConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Save Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save these changes? This will update the
          files in this folder.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHideSaveConfirm}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirmedSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmationModals;
