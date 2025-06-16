import React, { useState } from 'react';
import { Modal, Button, Form, Card, Collapse } from 'react-bootstrap';
import {
  postPiActionCreate,
  postPiActionUpdate
} from 'smt-v1-app/services/PIServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faPlus,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

// Function to parse date string in format "15:04 13.05.2025"
const parseDateString = (dateString: string): number => {
  try {
    // Extract parts: "HH:MM DD.MM.YYYY"
    const [timeStr, dateStr] = dateString.split(' ');
    if (!timeStr || !dateStr) return 0;

    const [hours, minutes] = timeStr.split(':');
    const [day, month, year] = dateStr.split('.');

    if (!hours || !minutes || !day || !month || !year) return 0;

    // JavaScript months are 0-based, so we subtract 1 from month
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    return date.getTime();
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return 0;
  }
};

const ActionListModal = ({
  show,
  onHide,
  piId,
  actions,
  onActionCreated,
  onActionUpdated
}) => {
  const [newAction, setNewAction] = useState('');
  const [newActionEditing, setNewActionEditing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [confirmState, setConfirmState] = useState({ type: '', target: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const confirmCreate = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const response = await postPiActionCreate({
        piId,
        description: newAction
      });
      const responseData = response?.data || response;
      if (responseData) {
        onActionCreated(responseData);
        setNewAction('');
        setNewActionEditing(false);
        setConfirmState({ type: '', target: null });
      } else {
        setErrorMessage('Server responded but did not return valid data');
      }
    } catch (error) {
      console.error('Create Error:', error);
      setErrorMessage('An error occurred while creating the action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (id, description) => {
    setEditId(id);
    setEditValue(description);
    setIsEditing(true);
  };

  const confirmUpdate = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const response = await postPiActionUpdate({
        piActionId: editId,
        description: editValue,
        piId
      });
      const responseData = response?.data || response;
      if (responseData) {
        onActionUpdated(responseData);
        setEditId(null);
        setEditValue('');
        setIsEditing(false);
        setConfirmState({ type: '', target: null });
      } else {
        setErrorMessage('Server responded but did not return valid data');
      }
    } catch (error) {
      console.error('Update Error:', error);
      setErrorMessage('An error occurred while updating the action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewActionCancel = () => {
    setNewAction('');
    setNewActionEditing(false);
    setConfirmState({ type: '', target: null });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditValue('');
    setIsEditing(false);
    setConfirmState({ type: '', target: null });
  };

  const handleShowDetails = action => {
    setSelectedAction(action);
    setShowDetails(
      prev => !prev || selectedAction?.piActionId !== action.piActionId
    );
  };

  // Sort actions by date (newest first) using our custom date parser
  const sortedActions = [...(actions || [])].sort((a, b) => {
    if (!a || !a.createdAt) return 1;
    if (!b || !b.createdAt) return -1;
    return parseDateString(b.createdAt) - parseDateString(a.createdAt);
  });

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>PI Actions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div className="alert alert-danger mb-3">{errorMessage}</div>
        )}

        {/* Yeni aksiyon ekleme */}
        <Card className="mb-4">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Add New Action</h6>
            {!newActionEditing && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setNewActionEditing(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
                New Action
              </Button>
            )}
          </Card.Header>
          {newActionEditing && (
            <Card.Body>
              <div className="d-flex align-items-start gap-2">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter new action..."
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  style={{ minWidth: 0, flex: 1 }}
                />
                <div className="d-flex flex-column gap-2">
                  {confirmState.type === 'create' ? (
                    <>
                      <Button
                        variant="success"
                        onClick={confirmCreate}
                        disabled={isSubmitting}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          setConfirmState({ type: '', target: null })
                        }
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        disabled={!newAction}
                        onClick={() =>
                          setConfirmState({ type: 'create', target: newAction })
                        }
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleNewActionCancel}
                      >
                        <FontAwesomeIcon icon={faTimes} className="me-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          )}
        </Card>

        {/* Mevcut aksiyon listesi */}
        <div className="d-flex">
          <h6 className="d-flex align-items-center mb-0">Existing Actions</h6>
          <Button
            variant={detailsOpen ? 'outline-info' : 'info'}
            size="sm"
            className="ms-auto mb-3 d-flex align-items-center gap-2 shadow-sm"
            style={{
              borderRadius: 20,
              fontWeight: 500,
              padding: '6px 16px',
              fontSize: 15,
              transition: 'background 0.2s, color 0.2s'
            }}
            onClick={() => setDetailsOpen(open => !open)}
          >
            <FontAwesomeIcon
              icon={detailsOpen ? faEye : faEyeSlash}
              style={{ fontSize: 17 }}
            />
            <span style={{ fontSize: 14, letterSpacing: 0.5 }}>Details</span>
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '12px',
              flex: 1
            }}
          >
            {sortedActions.length === 0 ? (
              <div className="text-center py-4 text-muted">No actions yet.</div>
            ) : (
              sortedActions
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
                          {confirmState.type === 'update' &&
                          confirmState.target === editId ? (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={confirmUpdate}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  setConfirmState({ type: '', target: null })
                                }
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  setConfirmState({
                                    type: 'update',
                                    target: editId
                                  })
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faSave}
                                  className="me-1"
                                />
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  className="me-1"
                                />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </Card.Body>
                    ) : (
                      <Card.Body style={{ padding: '10px' }}>
                        <div
                          className="d-flex"
                          style={{ minHeight: '90px', position: 'relative' }}
                        >
                          <div
                            style={{
                              flex: '1 1 auto',
                              maxWidth: 'calc(100% - 90px)',
                              paddingRight: '10px'
                            }}
                          >
                            <div
                              style={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                marginBottom: '20px'
                              }}
                            >
                              {action.description || 'Action details not found'}
                            </div>
                          </div>
                          <div
                            style={{
                              flex: '0 0 80px',
                              display: 'flex',
                              gap: '5px',
                              justifyContent: 'flex-end',
                              alignItems: 'flex-start'
                            }}
                          >
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() =>
                                startEdit(
                                  action.piActionId,
                                  action.description || ''
                                )
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button size="sm" variant="outline-danger" disabled>
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
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
                            {action.createdAt || ''}
                          </div>
                        </div>
                      </Card.Body>
                    )}
                  </Card>
                ))
            )}
          </div>
          {/* Action Details Panel: Slide ile açılıp kapanan */}
          <div
            style={{
              flex: detailsOpen ? 1 : 'unset',
              minWidth: detailsOpen ? 300 : 0,
              maxWidth: detailsOpen ? 400 : 0,
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
              overflow: 'hidden',
              marginLeft: detailsOpen ? 0 : -32,
              opacity: detailsOpen ? 1 : 0,
              pointerEvents: detailsOpen ? 'auto' : 'none',
              position: 'relative'
            }}
          >
            <div
              className="border rounded p-3 bg-light"
              style={{ minHeight: 100 }}
            >
              <h5>Action Details</h5>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {sortedActions.length === 0 ? (
                  <div className="text-muted">No actions yet.</div>
                ) : (
                  sortedActions.map(action => (
                    <pre
                      key={action.piActionId}
                      style={{
                        fontSize: 13,
                        background: 'none',
                        border: 'none',
                        textWrap: 'wrap',
                        padding: 0,
                        marginBottom: 16
                      }}
                    >
                      {`${action.description}
${action.createdBy}-${action.createdAt}
------------------------------------------
`}
                    </pre>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ActionListModal;
