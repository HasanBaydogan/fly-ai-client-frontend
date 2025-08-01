import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { getFileIcon } from '../utils/PIListFileUpload.utils';
import { FileItem } from '../../../../types/PIListFileUpload.types';
import '../PIListFileUpload.css';

interface FileRendererProps {
  files: FileItem[];
  nodeId: string;
  parentNodeType: 'category' | 'subcategory';
  isEditing: boolean;
  isCurrentlyUploading: boolean;
  viewingFile: string | null;
  selectedFilesArray: File[];
  hasSelectedFiles: boolean;
  uploadError?: string;
  onViewFile: (fileId: string, ext: string, previewOnly?: boolean) => void;
  onDeleteFile: (
    fileId: string,
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => void;
  onRemoveSelectedFile: (nodeId: string, index: number) => void;
}

const FileRenderer: React.FC<FileRendererProps> = ({
  files,
  nodeId,
  parentNodeType,
  isEditing,
  isCurrentlyUploading,
  viewingFile,
  selectedFilesArray,
  hasSelectedFiles,
  uploadError,
  onViewFile,
  onDeleteFile,
  onRemoveSelectedFile
}) => {
  if (files.length === 0 && !hasSelectedFiles) {
    return null;
  }

  return (
    <div className="files-container px-2">
      {uploadError && (
        <div className="alert alert-danger p-1 mt-1 mb-2">
          <small>{uploadError}</small>
        </div>
      )}

      {hasSelectedFiles && (
        <div className="selected-files mb-2">
          <div className="d-flex flex-wrap gap-1">
            {selectedFilesArray.map((file, idx) => (
              <div
                key={`selected-${nodeId}-${idx}-${file.name}`}
                className="file-item"
              >
                <div className="d-flex align-items-center border rounded p-1 bg-light hover-bg-light">
                  <FontAwesomeIcon
                    icon={getFileIcon(file.name.split('.').pop() || '')}
                    className="me-1 text-secondary"
                    size="sm"
                  />
                  <small className="text-muted">{file.name}</small>
                  <Button
                    variant="link"
                    className="ms-1 text-danger p-0 border-0"
                    onClick={() => onRemoveSelectedFile(nodeId, idx)}
                    disabled={isCurrentlyUploading}
                    style={{ minWidth: 'auto', padding: '2px' }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="existing-files">
          <div className="d-flex flex-column gap-1">
            {files.map(file => {
              // Dosya uzantısını güvenli şekilde al
              const ext = file.name.split('.').pop()?.toLowerCase() || '';
              return (
                <div
                  key={`existing-${nodeId}-${file.id}-${file.name}`}
                  className="file-item"
                >
                  <div className="d-flex align-items-center border rounded p-1 hover-bg-light position-relative">
                    <FontAwesomeIcon
                      icon={getFileIcon(ext)}
                      className="me-1 text-secondary"
                      size="sm"
                    />
                    <span
                      className="small file-name text-muted flex-grow-1 cursor-pointer me-3"
                      onClick={() => onViewFile(file.id, ext)}
                      style={{ cursor: 'pointer' }}
                    >
                      {file.name}
                      {viewingFile === file.id && (
                        <span
                          className="spinner-border spinner-border-sm ms-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                    </span>

                    {/* Action buttons - only show on hover */}
                    <div className="file-actions d-none">
                      {/* Eye icon for preview/download */}
                      <Button
                        variant="link"
                        className="text-primary  p-0 border-0 me-1"
                        title={ext === 'pdf' ? 'Preview PDF' : 'Download'}
                        onClick={e => {
                          e.stopPropagation();
                          onViewFile(file.id, ext, true);
                        }}
                        disabled={viewingFile === file.id}
                        style={{
                          minWidth: 'auto',
                          padding: '2px'
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} size="sm" />
                      </Button>

                      {/* Delete button - only show when editing */}
                      {isEditing && (
                        <Button
                          variant="link"
                          className="text-danger  border-0"
                          onClick={() =>
                            onDeleteFile(file.id, nodeId, parentNodeType)
                          }
                          disabled={isCurrentlyUploading}
                          style={{
                            minWidth: 'auto',
                            padding: '2px'
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileRenderer;
