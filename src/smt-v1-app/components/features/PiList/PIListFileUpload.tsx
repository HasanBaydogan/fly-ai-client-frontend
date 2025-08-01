import React, { ChangeEvent } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { usePIListFileUpload } from './hooks/usePIListFileUpload';
import { PIListFileUploadProps } from '../../../types/PIListFileUpload.types';
import FileRenderer from './components/FileRenderer';
import ConfirmationModals from './components/ConfirmationModals';
import FileManagerSection from './components/FileManagerSection';
import './PIListFileUpload.css';

const PIListFileUpload: React.FC<PIListFileUploadProps> = ({
  show,
  onHide,
  piId
}) => {
  const {
    data,
    selectedCategory,
    editModes,
    selectedFiles,
    isUploading,
    uploadErrors,
    isLoading,
    viewingFile,
    showDeleteConfirm,
    showSaveConfirm,
    fileToDelete,
    nodeToSave,
    setSelectedCategory,
    setEditModes,
    setSelectedFiles,
    setIsUploading,
    setUploadErrors,
    setViewingFile,
    setShowDeleteConfirm,
    setShowSaveConfirm,
    setFileToDelete,
    setNodeToSave,
    uploadFilesToAPI,
    handleViewFile,
    deleteFile,
    confirmDelete
  } = usePIListFileUpload(piId, show);

  // Event handlers
  const handleSelectNode = (
    mainId: string,
    categoryId?: string,
    subCategoryId?: string
  ) => {
    setSelectedCategory({
      mainId,
      categoryId: categoryId || null,
      subCategoryId: subCategoryId || null
    });
  };

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => ({
        ...prev,
        [nodeId]: [...(prev[nodeId] || []), ...newFiles]
      }));
    }
  };

  const handleRemoveSelectedFile = (nodeId: string, index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev[nodeId]];
      newFiles.splice(index, 1);
      return {
        ...prev,
        [nodeId]: newFiles
      };
    });
  };

  const toggleEditMode = (nodeId: string) => {
    if (editModes[nodeId]) {
      // If we're exiting edit mode (Save button clicked), show confirmation
      setNodeToSave(nodeId);
      setShowSaveConfirm(true);
    } else {
      // Entering edit mode
      setEditModes(prev => ({
        ...prev,
        [nodeId]: true
      }));
    }
  };

  const handleConfirmedSave = async () => {
    if (nodeToSave) {
      await uploadFilesToAPI(nodeToSave);
      setShowSaveConfirm(false);
      setNodeToSave(null);
    }
  };

  // Render files for a specific node
  const renderFilesForNode = (
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => {
    let files: any[] = [];
    let isEditing = false;

    // Find the files for this specific node
    data.forEach(main => {
      main.categories.forEach(category => {
        if (
          parentNodeType === 'category' &&
          category.id === nodeId &&
          category.files
        ) {
          files = category.files;
          isEditing = editModes[category.id] || false;
        }

        category.subCategories?.forEach(subCategory => {
          if (parentNodeType === 'subcategory' && subCategory.id === nodeId) {
            files = subCategory.files;
            isEditing = editModes[subCategory.id] || false;
          }
        });
      });
    });

    const selectedFilesArray = selectedFiles[nodeId] || [];
    const hasSelectedFiles = selectedFilesArray.length > 0 && isEditing;
    const isCurrentlyUploading = isUploading[nodeId] || false;
    const uploadError = uploadErrors[nodeId];

    return (
      <FileRenderer
        files={files}
        nodeId={nodeId}
        parentNodeType={parentNodeType}
        isEditing={isEditing}
        isCurrentlyUploading={isCurrentlyUploading}
        viewingFile={viewingFile}
        selectedFilesArray={selectedFilesArray}
        hasSelectedFiles={hasSelectedFiles}
        uploadError={uploadError}
        onViewFile={handleViewFile}
        onDeleteFile={deleteFile}
        onRemoveSelectedFile={handleRemoveSelectedFile}
      />
    );
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
        <Modal.Header closeButton>
          <Modal.Title>PI File Management</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          {isLoading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading attachments...</p>
            </div>
          ) : (
            <FileManagerSection
              data={data}
              selectedCategory={selectedCategory}
              editModes={editModes}
              selectedFiles={selectedFiles}
              isUploading={isUploading}
              uploadErrors={uploadErrors}
              viewingFile={viewingFile}
              onSelectNode={handleSelectNode}
              onToggleEditMode={toggleEditMode}
              onFileUpload={handleFileUpload}
              onViewFile={handleViewFile}
              onDeleteFile={deleteFile}
              onRemoveSelectedFile={handleRemoveSelectedFile}
              renderFilesForNode={renderFilesForNode}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmationModals
        showDeleteConfirm={showDeleteConfirm}
        showSaveConfirm={showSaveConfirm}
        fileToDelete={fileToDelete}
        nodeToSave={nodeToSave}
        onHideDeleteConfirm={() => setShowDeleteConfirm(false)}
        onHideSaveConfirm={() => setShowSaveConfirm(false)}
        onConfirmedDelete={confirmDelete}
        onConfirmedSave={handleConfirmedSave}
      />
    </>
  );
};

export default PIListFileUpload;
