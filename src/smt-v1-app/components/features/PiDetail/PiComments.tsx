import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Table, Row, Col, Alert, Spinner } from 'react-bootstrap';
import './PiComments.css';
import {
  postPiUserCommentNew,
  postPiUserCommentUpdate,
  deletePiUserComment
} from 'smt-v1-app/services/PIServices';
import { UserComment, PiUserComment } from './PiModels';

// Define props interface
interface PiCommentsProps {
  piData?: any;
  userComments?: PiUserComment[];
  onCommentsChange?: (comments: PiUserComment[]) => void;
}

const PiComments: React.FC<PiCommentsProps> = ({
  piData,
  userComments = [],
  onCommentsChange
}) => {
  // Refs to track initialization and prevent infinite loops
  const isInitialized = useRef<boolean>(false);
  const piIdRef = useRef<string | null>(null);
  const prevCommentsRef = useRef<PiUserComment[]>([]);

  const [comments, setComments] = useState<PiUserComment[]>([]);
  const [currentComment, setCurrentComment] = useState<string>('');
  const [severity, setSeverity] = useState<string>('info');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pendingNewComment, setPendingNewComment] = useState<boolean>(false);

  // Helper function to deeply compare comment arrays
  const commentsAreEqual = (
    commentsA: PiUserComment[],
    commentsB: PiUserComment[]
  ): boolean => {
    if (commentsA.length !== commentsB.length) return false;

    return commentsA.every((commentA, index) => {
      const commentB = commentsB[index];
      return (
        commentA.id === commentB.id &&
        commentA.comment === commentB.comment &&
        commentA.severity === commentB.severity &&
        commentA.isNew === commentB.isNew &&
        commentA.isEdited === commentB.isEdited &&
        commentA.isDeleted === commentB.isDeleted
      );
    });
  };

  // Initialize comments from piData
  useEffect(() => {
    if (!piData) return;

    const currentPiId = piData.id || piData.piId;

    // Only update if not initialized yet or if piId changed
    if (!isInitialized.current || piIdRef.current !== currentPiId) {
      const userComments = piData.userComments || [];

      setComments(userComments);
      isInitialized.current = true;
      piIdRef.current = currentPiId;
      prevCommentsRef.current = [...userComments];
    }
  }, [piData]);

  // Notify parent of comment changes
  useEffect(() => {
    // Skip on first render or if comments didn't actually change
    if (
      !isInitialized.current ||
      commentsAreEqual(comments, prevCommentsRef.current)
    ) {
      return;
    }

    // Check for unsaved changes
    const hasUnsaved = pendingNewComment || editingCommentId !== null;
    setHasUnsavedChanges(hasUnsaved);

    // Update the previous comments reference
    prevCommentsRef.current = [...comments];

    // Notify parent component
    onCommentsChange(comments);
  }, [comments, onCommentsChange, pendingNewComment, editingCommentId]);

  const handleEditComment = (comment: PiUserComment) => {
    // Don't allow editing if we're already creating a new comment
    if (pendingNewComment) {
      setSaveError('Please save or cancel the new comment first');
      return;
    }

    setCurrentComment(comment.comment);
    setSeverity(comment.severity);
    setEditingCommentId(comment.id || null);
    setShowAlert(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // Don't allow deleting if we have pending changes
      if (
        pendingNewComment ||
        (editingCommentId && editingCommentId !== commentId)
      ) {
        setSaveError('Please save your current changes first');
        return;
      }

      // Safety check
      if (!commentId) return;

      const commentToDelete = comments.find(c => c.id === commentId);
      if (!commentToDelete) return;

      // If it's a new unsaved comment, just remove it from the state without API call
      if (commentToDelete.isNew) {
        setComments(comments.filter(comment => comment.id !== commentId));

        // Reset editing state if we were editing this comment
        if (editingCommentId === commentId) {
          setEditingCommentId(null);
          setCurrentComment('');
          setSeverity('info');
        }
        return; // Exit early - no need to call API
      }

      // For saved comments, call the delete API
      const piId = piData?.id || piData?.piId;
      if (piId) {
        setIsSaving(true);

        try {
          const response = await deletePiUserComment(commentId);
          if (response && response.statusCode === 200) {
            // Successfully deleted from backend
            setComments(comments.filter(comment => comment.id !== commentId));
            console.log('Comment deleted successfully');
          } else {
            throw new Error('Failed to delete comment');
          }
        } catch (error) {
          console.error('Error deleting comment:', error);
          setSaveError('Failed to delete comment. Please try again.');
        } finally {
          setIsSaving(false);
        }
      }

      // Reset editing state if we were editing this comment
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setCurrentComment('');
        setSeverity('info');
      }
    } catch (error) {
      console.error('Error in handleDeleteComment:', error);
      setSaveError('An error occurred while deleting the comment.');
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setPendingNewComment(false);
    setCurrentComment('');
    setSeverity('info');
    setSaveError(null);
  };

  // Save all unsaved changes to backend
  const handleSaveComments = async () => {
    const piId = piData?.id || piData?.piId;
    if (!piId) {
      setSaveError('Cannot save comments: Missing PI ID');
      return;
    }

    // Check if we have a comment to save
    if (!currentComment.trim()) {
      setSaveError('Please enter a comment before saving');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      if (pendingNewComment) {
        // Create a new comment
        const newComment: PiUserComment = {
          id: `temp-${Date.now()}`, // Temporary ID until saved to backend
          comment: currentComment,
          severity: severity,
          createdAt: new Date().toISOString(),
          isNew: true
        };

        // Save the new comment
        const savedComment = await saveNewComment(newComment);

        // Add to comments list after successful save using the real ID from backend
        if (savedComment && savedComment.id) {
          setComments(prev => [
            ...prev,
            {
              ...newComment,
              isNew: false,
              id: savedComment.id // Use the real ID from backend
            }
          ]);
        }
      } else if (editingCommentId) {
        // Find the comment we're editing
        const commentToUpdate = comments.find(c => c.id === editingCommentId);
        if (!commentToUpdate) {
          throw new Error('Comment not found');
        }

        // Update the comment with new values
        const updatedComment = {
          ...commentToUpdate,
          comment: currentComment,
          severity: severity
        };

        // Save the updated comment
        await updateComment(updatedComment);

        // Update the comment in the list
        setComments(prev =>
          prev.map(c => (c.id === editingCommentId ? updatedComment : c))
        );
      }

      // Reset state after successful save
      setCurrentComment('');
      setSeverity('info');
      setEditingCommentId(null);
      setPendingNewComment(false);
      setHasUnsavedChanges(false);
      setShowAlert(false);
    } catch (error) {
      console.error('Error saving comment:', error);
      setSaveError('Failed to save comment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save a new comment to backend
  const saveNewComment = async (comment: PiUserComment) => {
    const piId = piData?.id || piData?.piId;
    if (!piId) throw new Error('Missing PI ID');

    const response = await postPiUserCommentNew({
      piId: piId,
      comment: comment.comment,
      severity: comment.severity
    });

    if (response && response.statusCode === 200) {
      console.log('New comment saved successfully:', response.data);
      return response.data; // This contains the real ID assigned by the backend
    } else {
      throw new Error('Failed to save new comment');
    }
  };

  // Update an existing comment in backend
  const updateComment = async (comment: PiUserComment) => {
    const piId = piData?.id || piData?.piId;
    if (!piId || !comment.id) throw new Error('Missing PI ID or comment ID');

    // Skip update if the ID starts with "temp-" (it's a locally created comment that hasn't been saved properly yet)
    if (comment.id.toString().startsWith('temp-')) {
      throw new Error(
        'Cannot update a comment with a temporary ID. Please refresh the page and try again.'
      );
    }

    const response = await postPiUserCommentUpdate({
      id: comment.id,
      comment: comment.comment,
      severity: comment.severity
    });

    if (response && response.statusCode === 200) {
      console.log('Comment updated successfully:', response.data);
      return response.data;
    } else {
      throw new Error('Failed to update comment');
    }
  };

  // Determine save button text based on comment state
  const getSaveButtonText = () => {
    if (editingCommentId) {
      return 'Update Comment';
    } else if (pendingNewComment) {
      return 'Save New Comment';
    } else if (currentComment.trim()) {
      return 'Save Comment';
    }
    return 'Save';
  };

  // Start creating a new comment
  const handleStartNewComment = () => {
    // Don't allow new comment if we're already editing
    if (editingCommentId) {
      setSaveError('Please save or cancel your edit first');
      return;
    }

    setPendingNewComment(true);
    setCurrentComment('');
    setSeverity('info');
  };

  return (
    <div className="pi-comments-container mt-4">
      <h4 className="mb-3">Comments</h4>
      <hr className="custom-line m-0 mb-4" />

      {showAlert && (
        <Alert
          variant="warning"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          You have unsaved comments. Please save your changes before leaving the
          page.
        </Alert>
      )}

      {saveError && (
        <Alert variant="danger" onClose={() => setSaveError(null)} dismissible>
          {saveError}
        </Alert>
      )}

      {hasUnsavedChanges && (
        <Alert variant="info">
          You have unsaved changes. Please click the Save button to save your
          changes.
        </Alert>
      )}

      {comments.length > 0 ? (
        <Table bordered hover className="mb-4">
          <thead>
            <tr>
              <th>Comment</th>
              <th>Severity</th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr
                key={comment.id}
                className={`severity-${comment.severity.toLowerCase()}`}
              >
                <td className="px-3">{comment.comment}</td>
                <td>
                  <span
                    className={`severity-badge severity-${comment.severity.toLowerCase()}`}
                  >
                    {comment.severity}
                  </span>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditComment(comment)}
                    disabled={
                      isSaving ||
                      pendingNewComment ||
                      (editingCommentId !== null &&
                        editingCommentId !== comment.id)
                    }
                  >
                    {editingCommentId === comment.id ? 'Editing...' : 'Edit'}
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id || '')}
                    disabled={
                      isSaving ||
                      pendingNewComment ||
                      (editingCommentId !== null &&
                        editingCommentId !== comment.id)
                    }
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted">No comments yet. Add a comment below.</p>
      )}

      <div className="comment-form mt-4">
        <div className="d-flex justify-content-between mb-3">
          <h5>
            {editingCommentId
              ? 'Edit Comment'
              : pendingNewComment
              ? 'New Comment'
              : 'Comments'}
          </h5>
          {!editingCommentId && !pendingNewComment && (
            <Button
              variant="primary"
              onClick={handleStartNewComment}
              disabled={isSaving}
            >
              New Comment
            </Button>
          )}
        </div>

        {/* Show input fields only when needed */}
        {(editingCommentId !== null || pendingNewComment) && (
          <Row>
            <Col md={9}>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentComment}
                  onChange={e => setCurrentComment(e.target.value)}
                  placeholder="Enter your comment here..."
                  disabled={isSaving}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Severity</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                  placeholder="Enter severity"
                  disabled={isSaving}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        <div className="d-flex justify-content-between">
          <div>
            {(editingCommentId || pendingNewComment) && (
              <Button
                variant="secondary"
                className="me-2"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
            )}
          </div>

          <div>
            {(editingCommentId || pendingNewComment) && (
              <Button
                variant="success"
                onClick={handleSaveComments}
                disabled={isSaving || !currentComment.trim()}
              >
                {isSaving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  getSaveButtonText()
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiComments;
