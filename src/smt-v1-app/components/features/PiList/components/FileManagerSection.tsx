import React from 'react';
import { Card, ListGroup, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake,
  faBoxesPacking,
  faTruckPlane,
  faArrowCircleDown,
  faArrowCircleUp,
  faFolder,
  faEdit,
  faSave,
  faFileUpload
} from '@fortawesome/free-solid-svg-icons';
import {
  MainCategory,
  SelectedCategory
} from '../../../../types/PIListFileUpload.types';
import FileRenderer from './FileRenderer';

// Helper function to check if a node is Client's SWIFT
const isClientSwift = (nodeId: string): boolean => {
  return nodeId === 'clients-swift';
};

interface FileManagerSectionProps {
  data: MainCategory[];
  selectedCategory: SelectedCategory;
  editModes: { [key: string]: boolean };
  selectedFiles: { [key: string]: File[] };
  isUploading: { [key: string]: boolean };
  uploadErrors: { [key: string]: string };
  viewingFile: string | null;
  onSelectNode: (
    mainId: string,
    categoryId?: string,
    subCategoryId?: string
  ) => void;
  onToggleEditMode: (nodeId: string) => void;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    nodeId: string
  ) => void;
  onViewFile: (fileId: string, ext: string, previewOnly?: boolean) => void;
  onDeleteFile: (
    fileId: string,
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => void;
  onRemoveSelectedFile: (nodeId: string, index: number) => void;
  renderFilesForNode: (
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => React.ReactNode;
}

const FileManagerSection: React.FC<FileManagerSectionProps> = ({
  data,
  selectedCategory,
  editModes,
  selectedFiles,
  isUploading,
  uploadErrors,
  viewingFile,
  onSelectNode,
  onToggleEditMode,
  onFileUpload,
  onViewFile,
  onDeleteFile,
  onRemoveSelectedFile,
  renderFilesForNode
}) => {
  return (
    <div className="vertical-file-manager">
      {/* Row 1: Client Documents */}
      <Row className="mb-3">
        <Col>
          <Card>
            <Card.Header className=" fs-6 bg-light p-2">
              <FontAwesomeIcon
                icon={faHandshake}
                className="me-2"
                style={{ color: '#6BAA75' }}
              />
              Docs with Client
            </Card.Header>
            <Card.Body className="p-2">
              <Row>
                <Col md={6}>
                  <Card className="mb-2">
                    <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faArrowCircleDown}
                        className="me-2"
                        size="lg"
                        style={{ color: '#4CAF50' }}
                      />
                      <span className="fs-7">Received</span>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {data[0].categories[0].subCategories.map(subCategory => (
                        <ListGroup.Item
                          key={subCategory.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            onSelectNode(
                              'docs-client',
                              'received',
                              subCategory.id
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'received' &&
                            selectedCategory.subCategoryId === subCategory.id
                          }
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faFolder}
                                className="me-2"
                                size="sm"
                                style={{ color: '#f8d775' }}
                              />
                              <span className="small">{subCategory.name}</span>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <div
                                className="file-renderer-container"
                                style={{ minWidth: '150px', maxWidth: '250px' }}
                              >
                                {renderFilesForNode(
                                  subCategory.id,
                                  'subcategory'
                                )}
                              </div>
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleEditMode(subCategory.id);
                                }}
                                disabled={
                                  isUploading[subCategory.id] ||
                                  !isClientSwift(subCategory.id)
                                }
                                title={
                                  !isClientSwift(subCategory.id)
                                    ? 'Edit disabled - Only Client SWIFT files can be edited'
                                    : editModes[subCategory.id]
                                    ? 'Save Changes'
                                    : 'Edit Files'
                                }
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[subCategory.id] ? faSave : faEdit
                                  }
                                />
                                {isUploading[subCategory.id] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes[subCategory.id] &&
                                isClientSwift(subCategory.id) && (
                                  <Form.Group
                                    controlId={`fileUpload-${subCategory.id}`}
                                    className="d-inline-block ms-1"
                                  >
                                    <Form.Label
                                      className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                        isUploading[subCategory.id]
                                          ? 'disabled'
                                          : ''
                                      }`}
                                    >
                                      <FontAwesomeIcon icon={faFileUpload} />
                                      <Form.Control
                                        type="file"
                                        multiple
                                        onChange={e =>
                                          onFileUpload(
                                            e as React.ChangeEvent<HTMLInputElement>,
                                            subCategory.id
                                          )
                                        }
                                        style={{ display: 'none' }}
                                        disabled={isUploading[subCategory.id]}
                                      />
                                    </Form.Label>
                                  </Form.Group>
                                )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="mb-2">
                    <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faArrowCircleUp}
                        className="me-2"
                        size="lg"
                        style={{ color: '#1976D2' }}
                      />
                      <span className="fs-7">Sent</span>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {data[0].categories[1].subCategories.map(subCategory => (
                        <ListGroup.Item
                          key={subCategory.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            onSelectNode('docs-client', 'sent', subCategory.id)
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'sent' &&
                            selectedCategory.subCategoryId === subCategory.id
                          }
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faFolder}
                                className="me-2"
                                size="sm"
                                style={{ color: '#f8d775' }}
                              />
                              <span className="small">{subCategory.name}</span>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <div
                                className="file-renderer-container"
                                style={{ minWidth: '150px', maxWidth: '250px' }}
                              >
                                {renderFilesForNode(
                                  subCategory.id,
                                  'subcategory'
                                )}
                              </div>
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleEditMode(subCategory.id);
                                }}
                                disabled={
                                  isUploading[subCategory.id] ||
                                  !isClientSwift(subCategory.id)
                                }
                                title={
                                  !isClientSwift(subCategory.id)
                                    ? 'Edit disabled - Only Client SWIFT files can be edited'
                                    : editModes[subCategory.id]
                                    ? 'Save Changes'
                                    : 'Edit Files'
                                }
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[subCategory.id] ? faSave : faEdit
                                  }
                                />
                                {isUploading[subCategory.id] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes[subCategory.id] &&
                                isClientSwift(subCategory.id) && (
                                  <Form.Group
                                    controlId={`fileUpload-${subCategory.id}`}
                                    className="d-inline-block ms-1"
                                  >
                                    <Form.Label
                                      className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                        isUploading[subCategory.id]
                                          ? 'disabled'
                                          : ''
                                      }`}
                                    >
                                      <FontAwesomeIcon icon={faFileUpload} />
                                      <Form.Control
                                        type="file"
                                        multiple
                                        onChange={e =>
                                          onFileUpload(
                                            e as React.ChangeEvent<HTMLInputElement>,
                                            subCategory.id
                                          )
                                        }
                                        style={{ display: 'none' }}
                                        disabled={isUploading[subCategory.id]}
                                      />
                                    </Form.Label>
                                  </Form.Group>
                                )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Row 2: Supplier Documents */}
      {/* <Row className="mb-3">
        <Col>
          <Card>
            <Card.Header className="bg-light fs-6 p-2">
              <FontAwesomeIcon
                icon={faBoxesPacking}
                className="me-2"
                style={{ color: '#4B6A9B ' }}
              />
              Docs with Supplier
            </Card.Header>
            <Card.Body className="p-2">
              <Row>
                <Col md={6}>
                  <Card className="mb-2">
                    <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faArrowCircleDown}
                        className="me-2"
                        size="lg"
                        style={{ color: '#4CAF50' }}
                      />
                      <span className="fs-7">Received</span>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {data[1].categories[0].subCategories.map(subCategory => (
                        <ListGroup.Item
                          key={subCategory.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            onSelectNode(
                              'docs-supplier',
                              'supplier-received',
                              subCategory.id
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-supplier' &&
                            selectedCategory.categoryId ===
                              'supplier-received' &&
                            selectedCategory.subCategoryId === subCategory.id
                          }
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faFolder}
                                className="me-2"
                                size="sm"
                                style={{ color: '#f8d775' }}
                              />
                              <span className="small">{subCategory.name}</span>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <div
                                className="file-renderer-container"
                                style={{ minWidth: '150px', maxWidth: '250px' }}
                              >
                                {renderFilesForNode(
                                  subCategory.id,
                                  'subcategory'
                                )}
                              </div>
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleEditMode(subCategory.id);
                                }}
                                disabled={
                                  isUploading[subCategory.id] ||
                                  !isClientSwift(subCategory.id)
                                }
                                title={
                                  !isClientSwift(subCategory.id)
                                    ? 'Edit disabled - Only Client SWIFT files can be edited'
                                    : editModes[subCategory.id]
                                    ? 'Save Changes'
                                    : 'Edit Files'
                                }
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[subCategory.id] ? faSave : faEdit
                                  }
                                />
                                {isUploading[subCategory.id] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes[subCategory.id] &&
                                isClientSwift(subCategory.id) && (
                                  <Form.Group
                                    controlId={`fileUpload-${subCategory.id}`}
                                    className="d-inline-block ms-1"
                                  >
                                    <Form.Label
                                      className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                        isUploading[subCategory.id]
                                          ? 'disabled'
                                          : ''
                                      }`}
                                    >
                                      <FontAwesomeIcon icon={faFileUpload} />
                                      <Form.Control
                                        type="file"
                                        multiple
                                        onChange={e =>
                                          onFileUpload(
                                            e as React.ChangeEvent<HTMLInputElement>,
                                            subCategory.id
                                          )
                                        }
                                        style={{ display: 'none' }}
                                        disabled={isUploading[subCategory.id]}
                                      />
                                    </Form.Label>
                                  </Form.Group>
                                )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="mb-2">
                    <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faArrowCircleUp}
                        className="me-2"
                        size="lg"
                        style={{ color: '#1976D2' }}
                      />
                      <span className="fs-7">Sent</span>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {data[1].categories[1].subCategories.map(subCategory => (
                        <ListGroup.Item
                          key={subCategory.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            onSelectNode(
                              'docs-supplier',
                              'supplier-sent',
                              subCategory.id
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-supplier' &&
                            selectedCategory.categoryId === 'supplier-sent' &&
                            selectedCategory.subCategoryId === subCategory.id
                          }
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faFolder}
                                className="me-2"
                                size="sm"
                                style={{ color: '#f8d775' }}
                              />
                              <span className="small">{subCategory.name}</span>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <div
                                className="file-renderer-container"
                                style={{ minWidth: '150px', maxWidth: '250px' }}
                              >
                                {renderFilesForNode(
                                  subCategory.id,
                                  'subcategory'
                                )}
                              </div>
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleEditMode(subCategory.id);
                                }}
                                disabled={
                                  isUploading[subCategory.id] ||
                                  !isClientSwift(subCategory.id)
                                }
                                title={
                                  !isClientSwift(subCategory.id)
                                    ? 'Edit disabled - Only Client SWIFT files can be edited'
                                    : editModes[subCategory.id]
                                    ? 'Save Changes'
                                    : 'Edit Files'
                                }
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[subCategory.id] ? faSave : faEdit
                                  }
                                />
                                {isUploading[subCategory.id] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes[subCategory.id] &&
                                isClientSwift(subCategory.id) && (
                                  <Form.Group
                                    controlId={`fileUpload-${subCategory.id}`}
                                    className="d-inline-block ms-1"
                                  >
                                    <Form.Label
                                      className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                        isUploading[subCategory.id]
                                          ? 'disabled'
                                          : ''
                                      }`}
                                    >
                                      <FontAwesomeIcon icon={faFileUpload} />
                                      <Form.Control
                                        type="file"
                                        multiple
                                        onChange={e =>
                                          onFileUpload(
                                            e as React.ChangeEvent<HTMLInputElement>,
                                            subCategory.id
                                          )
                                        }
                                        style={{ display: 'none' }}
                                        disabled={isUploading[subCategory.id]}
                                      />
                                    </Form.Label>
                                  </Form.Group>
                                )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Row 3: FF Documents */}
      {/* <Row>
        <Col>
          <Card>
            <Card.Header className="bg-light fs-6 p-2">
              <FontAwesomeIcon
                icon={faTruckPlane}
                className="me-2"
                style={{ color: '#2A5D66 ' }}
              />
              Docs with FF
            </Card.Header>
            <Card.Body className="p-2">
              <Row>
                <Col md={6}>
                  <Card className="mb-2">
                    <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faArrowCircleDown}
                        className="me-2"
                        size="lg"
                        style={{ color: '#4CAF50' }}
                      />
                      <span className="fs-7">Received</span>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {data[2].categories.map(category => (
                        <ListGroup.Item
                          key={category.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            onSelectNode('docs-ff-received', category.id)
                          }
                          active={
                            selectedCategory.mainId === 'docs-ff-received' &&
                            selectedCategory.categoryId === category.id
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">{category.name}</span>
                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode(category.id, 'category')}
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleEditMode(category.id);
                                }}
                                disabled={isUploading[category.id]}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[category.id] ? faSave : faEdit
                                  }
                                />
                                {isUploading[category.id] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes[category.id] && (
                                <Form.Group
                                  controlId={`fileUpload-${category.id}`}
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading[category.id] ? 'disabled' : ''
                                    }`}
                                  >
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        onFileUpload(
                                          e as React.ChangeEvent<HTMLInputElement>,
                                          category.id
                                        )
                                      }
                                      style={{ display: 'none' }}
                                      disabled={isUploading[category.id]}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-2">
                    <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faArrowCircleUp}
                        className="me-2"
                        size="lg"
                        style={{ color: '#1976D2' }}
                      />
                      <span className="fs-7">Sent</span>
                    </Card.Header>
                    <ListGroup variant="flush">
                      {data[3].categories.map(category => (
                        <ListGroup.Item
                          key={category.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            onSelectNode('docs-ff-send', category.id)
                          }
                          active={
                            selectedCategory.mainId === 'docs-ff-send' &&
                            selectedCategory.categoryId === category.id
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">{category.name}</span>
                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode(category.id, 'category')}
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  onToggleEditMode(category.id);
                                }}
                                disabled={isUploading[category.id]}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[category.id] ? faSave : faEdit
                                  }
                                />
                                {isUploading[category.id] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes[category.id] && (
                                <Form.Group
                                  controlId={`fileUpload-${category.id}`}
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading[category.id] ? 'disabled' : ''
                                    }`}
                                  >
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        onFileUpload(
                                          e as React.ChangeEvent<HTMLInputElement>,
                                          category.id
                                        )
                                      }
                                      style={{ display: 'none' }}
                                      disabled={isUploading[category.id]}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
};

export default FileManagerSection;
