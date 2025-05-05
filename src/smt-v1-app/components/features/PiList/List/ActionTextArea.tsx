import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ActionListModal from './ActionListModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';

interface ActionType {
  piActionId: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

interface ActionTextAreaProps {
  piId: string;
  actions: ActionType[];
  onActionCreated?: (action: ActionType) => void;
  onActionUpdated?: (action: ActionType) => void;
}

// Function to truncate text with ellipsis after a certain number of lines
const truncateText = (text: string, maxChars = 50): string => {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + '...';
};

const ActionTextArea: React.FC<ActionTextAreaProps> = ({
  piId,
  actions: initialActions,
  onActionCreated,
  onActionUpdated
}) => {
  const [showModal, setShowModal] = useState(false);
  const [actions, setActions] = useState(initialActions);

  // When a new action is created
  const handleActionCreated = (newAction: ActionType) => {
    if (!newAction) return;

    // Null check
    if (!newAction.description || !newAction.piActionId) {
      console.error('Invalid action data received:', newAction);
      return;
    }

    setActions(prev => [...(prev || []), newAction]);
    if (onActionCreated) onActionCreated(newAction);
  };

  // When an action is updated
  const handleActionUpdated = (updatedAction: ActionType) => {
    if (!updatedAction) return;

    // Null check
    if (!updatedAction.description || !updatedAction.piActionId) {
      console.error('Invalid updated action data received:', updatedAction);
      return;
    }

    setActions(prev =>
      prev
        ? prev.map(a =>
            a && a.piActionId === updatedAction.piActionId ? updatedAction : a
          )
        : []
    );
    if (onActionUpdated) onActionUpdated(updatedAction);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        width: '100%'
      }}
    >
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: 4,
          background: '#f9f9f9',
          padding: '5px',
          flex: 1,
          maxWidth: 'calc(100% )',
          position: 'relative',
          minWidth: '400px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            overflowY: 'auto',
            paddingRight: '2px'
          }}
        >
          {!actions || actions.length === 0 ? (
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: 4,
                height: 40,
                width: '100%',
                background: '#fafbfc'
              }}
            />
          ) : (
            actions
              .filter(action => action && action.description)
              .map(action => (
                <div
                  key={action.piActionId || `action-${Math.random()}`}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 4,
                    padding: 4,
                    background: '#fafbfc',
                    width: '100%',
                    minHeight: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}
                  title={action.description}
                >
                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: '1',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-word',
                      marginBottom: '16px',
                      textAlign: 'left'
                    }}
                  >
                    {action.description}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#666',
                      position: 'absolute',
                      bottom: 4,
                      right: 8,
                      fontStyle: 'italic'
                    }}
                  >
                    {action.createdBy} -{' '}
                    {new Date(action.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => setShowModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          padding: 0,
          flexShrink: 0
        }}
        title="View Actions"
      >
        <FontAwesomeIcon icon={faListUl} />
      </Button>
      {showModal && (
        <ActionListModal
          show={showModal}
          onHide={() => setShowModal(false)}
          piId={piId}
          actions={actions}
          onActionCreated={handleActionCreated}
          onActionUpdated={handleActionUpdated}
        />
      )}
    </div>
  );
};

export default ActionTextArea;
