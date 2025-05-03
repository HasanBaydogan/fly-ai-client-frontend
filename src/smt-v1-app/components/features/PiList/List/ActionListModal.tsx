import React, { useState } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import {
  postPiActionCreate,
  postPiActionUpdate
} from 'smt-v1-app/services/PIServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const ActionListModal = ({
  show,
  onHide,
  piId,
  actions,
  onActionCreated,
  onActionUpdated
}) => {
  const [newAction, setNewAction] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: '',
    payload: null
  });
  const [newActionEditing, setNewActionEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Yeni aksiyon ekleme
  const handleCreate = async () => {
    setConfirmModal({ show: true, type: 'create', payload: newAction });
  };

  const handleNewActionEdit = () => {
    setNewActionEditing(true);
  };

  const handleNewActionCancel = () => {
    setNewAction('');
    setNewActionEditing(false);
  };

  const confirmCreate = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // API çağrısı
      const response = await postPiActionCreate({
        piId,
        description: newAction
      });

      // Response'u ayrıntılı logla
      console.log('Full API response (create):', response);

      // API yanıtını kontrol et ve işle
      if (response) {
        // Yanıt yapısında data özelliği varsa onu, yoksa direkt yanıtın kendisini kullan
        const responseData = response.data || response;

        if (responseData) {
          console.log('Using response data:', responseData);
          onActionCreated(responseData);
          setNewAction('');
          setNewActionEditing(false);
          setConfirmModal({ show: false, type: '', payload: null });
        } else {
          // Response var ama içinde kullanılabilir veri yok
          console.warn('Response exists but no usable data found');
          setErrorMessage('Server responded but did not return valid data');
        }
      } else {
        // Response tamamen null/undefined
        console.error('API did not return any response');
        setErrorMessage('Server did not respond, please try again');
      }
    } catch (error) {
      console.error('Error creating action:', error);
      setErrorMessage(
        'An error occurred while creating the action. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Düzenleme başlat
  const startEdit = (id, description) => {
    setEditId(id);
    setEditValue(description);
    setIsEditing(true);
  };

  // Düzenlemeyi kaydet
  const handleUpdate = () => {
    setConfirmModal({
      show: true,
      type: 'update',
      payload: { id: editId, description: editValue }
    });
  };

  const confirmUpdate = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const { id, description } = confirmModal.payload;

      // API çağrısı
      const response = await postPiActionUpdate({
        piActionId: id,
        description
      });

      // Response'u ayrıntılı logla
      console.log('Full API response (update):', response);

      // API yanıtını kontrol et ve işle
      if (response) {
        // Yanıt yapısında data özelliği varsa onu, yoksa direkt yanıtın kendisini kullan
        const responseData = response.data || response;

        if (responseData) {
          console.log('Using response data:', responseData);
          onActionUpdated(responseData);
          setEditId(null);
          setEditValue('');
          setIsEditing(false);
          setConfirmModal({ show: false, type: '', payload: null });
        } else {
          // Response var ama içinde kullanılabilir veri yok
          console.warn('Response exists but no usable data found');
          setErrorMessage('Server responded but did not return valid data');
        }
      } else {
        // Response tamamen null/undefined
        console.error('API did not return any response');
        setErrorMessage('Server did not respond, please try again');
      }
    } catch (error) {
      console.error('Error updating action:', error);
      setErrorMessage(
        'An error occurred while updating the action. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // İptal
  const handleCancel = () => {
    setEditId(null);
    setEditValue('');
    setIsEditing(false);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>PI Actions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div className="alert alert-danger mb-3">{errorMessage}</div>
        )}

        {/* New action input area */}
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h6 className="mb-0">Add New Action</h6>
          </Card.Header>
          <Card.Body>
            <div className="d-flex align-items-start gap-2">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter new action..."
                value={newAction}
                onChange={e => setNewAction(e.target.value)}
                disabled={!newActionEditing}
                style={{ minWidth: 0, flex: 1 }}
              />
              {!newActionEditing ? (
                <Button variant="outline-primary" onClick={handleNewActionEdit}>
                  <FontAwesomeIcon icon={faEdit} className="me-1" />
                  Edit
                </Button>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Button
                    variant="primary"
                    disabled={!newAction}
                    onClick={handleCreate}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleNewActionCancel}>
                    <FontAwesomeIcon icon={faTimes} className="me-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Action list title */}
        <h6 className="mb-3">Existing Actions</h6>

        {/* Action list */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '12px'
          }}
        >
          {actions.length === 0 ? (
            <div className="text-center py-4 text-muted">No actions yet.</div>
          ) : (
            actions
              .filter(action => action && action.piActionId)
              .map(action => (
                <Card key={action.piActionId} className="w-100">
                  {editId === action.piActionId ? (
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="mb-2"
                      />
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleUpdate}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-1" />
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleCancel}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-1" />
                          Cancel
                        </Button>
                      </div>
                    </Card.Body>
                  ) : (
                    <Card.Body>
                      <div style={{ position: 'relative', minHeight: '100px' }}>
                        <div
                          className="mb-4"
                          style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            paddingRight: '50px' // Make room for edit button
                          }}
                        >
                          {action.description || 'Action details not found'}
                        </div>

                        {/* Edit button in top right */}
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() =>
                            startEdit(
                              action.piActionId,
                              action.description || ''
                            )
                          }
                          style={{
                            position: 'absolute',
                            top: '0',
                            right: '0'
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>

                        {/* Creator info in bottom right */}
                        <div
                          className="text-muted"
                          style={{
                            fontSize: '0.8rem',
                            position: 'absolute',
                            bottom: '0',
                            right: '0'
                          }}
                        >
                          {action.createdBy || 'Unknown'} ·{' '}
                          {action.createdAt
                            ? new Date(action.createdAt).toLocaleString()
                            : ''}
                        </div>
                      </div>
                    </Card.Body>
                  )}
                </Card>
              ))
          )}
        </div>
      </Modal.Body>
      {/* Confirmation modal */}
      <Modal
        show={confirmModal.show}
        onHide={() =>
          !isSubmitting &&
          setConfirmModal({ show: false, type: '', payload: null })
        }
        centered
      >
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmModal.type === 'create' &&
            'Are you sure you want to create a new action?'}
          {confirmModal.type === 'update' &&
            'Are you sure you want to update this action?'}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setConfirmModal({ show: false, type: '', payload: null })
            }
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={
              confirmModal.type === 'create' ? confirmCreate : confirmUpdate
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default ActionListModal;
