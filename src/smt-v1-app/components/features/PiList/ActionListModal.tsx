// src/smt-v1-app/components/features/PiList/List/ActionListModal.tsx

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {
  postPiActionCreate,
  postPiActionUpdate
} from 'smt-v1-app/services/PIServices';

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

  // Yeni aksiyon ekleme
  const handleCreate = async () => {
    setConfirmModal({ show: true, type: 'create', payload: newAction });
  };

  const confirmCreate = async () => {
    const res = await postPiActionCreate({ piId, description: newAction });
    onActionCreated(res.data);
    setNewAction('');
    setConfirmModal({ show: false, type: '', payload: null });
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
    const { id, description } = confirmModal.payload;
    const res = await postPiActionUpdate({ piActionId: id, description });
    onActionUpdated(res.data);
    setEditId(null);
    setEditValue('');
    setIsEditing(false);
    setConfirmModal({ show: false, type: '', payload: null });
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
        <Modal.Title>PI Aksiyonları</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Yeni aksiyon ekleme alanı */}
        <div className="mb-3">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Yeni aksiyon girin..."
            value={newAction}
            onChange={e => setNewAction(e.target.value)}
            disabled={newAction === '' || isEditing}
          />
          <Button
            className="mt-2"
            variant="primary"
            disabled={!newAction || isEditing}
            onClick={handleCreate}
          >
            Ekle
          </Button>
        </div>
        {/* Aksiyonlar listesi */}
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {actions.map(action => (
            <div key={action.piActionId} className="border rounded p-2 mb-2">
              {editId === action.piActionId ? (
                <>
                  <Form.Control
                    as="textarea"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                  />
                  <div className="mt-2 d-flex gap-2">
                    <Button variant="success" onClick={handleUpdate}>
                      Kaydet
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      İptal
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <b>{action.description}</b>
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {action.createdBy} -{' '}
                    {new Date(action.createdAt).toLocaleString()}
                  </div>
                  <Button
                    className="mt-2"
                    size="sm"
                    variant="outline-primary"
                    onClick={() =>
                      startEdit(action.piActionId, action.description)
                    }
                  >
                    Düzenle
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </Modal.Body>
      {/* Onay modalı */}
      <Modal
        show={confirmModal.show}
        onHide={() => setConfirmModal({ show: false, type: '', payload: null })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Onay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmModal.type === 'create' &&
            'Yeni aksiyon eklemek istediğinize emin misiniz?'}
          {confirmModal.type === 'update' &&
            'Aksiyonu güncellemek istediğinize emin misiniz?'}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setConfirmModal({ show: false, type: '', payload: null })
            }
          >
            İptal
          </Button>
          <Button
            variant="primary"
            onClick={
              confirmModal.type === 'create' ? confirmCreate : confirmUpdate
            }
          >
            Onayla
          </Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default ActionListModal;
