import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Modal,
  Button,
  ListGroup,
  Form,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile,
  faFilePdf,
  faFileExcel,
  faFileWord,
  faFileImage,
  faFileAlt,
  faEdit,
  faSave,
  faTrash,
  faFileUpload,
  faFolderOpen,
  faChevronRight,
  faChevronDown,
  faFolder
} from '@fortawesome/free-solid-svg-icons';
import './PIListFileUpload.css';

interface FileItem {
  id: string;
  name: string;
  type: string;
  url?: string;
}

interface SubCategoryItem {
  id: string;
  name: string;
  files: FileItem[];
}

interface CategoryItem {
  id: string;
  name: string;
  subCategories: SubCategoryItem[];
  files?: FileItem[];
}

interface MainCategory {
  id: string;
  name: string;
  categories: CategoryItem[];
}

interface PIListFileUploadProps {
  show: boolean;
  onHide: () => void;
  piId: string;
}

// Mock data based on the tree structure
const mockData: MainCategory[] = [
  {
    id: 'docs-client',
    name: 'Docs with Client',
    categories: [
      {
        id: 'received',
        name: 'Received',
        subCategories: [
          {
            id: 'clients-po',
            name: "Client's PO",
            files: [
              { id: 'po1', name: 'PO135.pdf', type: 'pdf' },
              { id: 'po2', name: 'PO136.pdf', type: 'pdf' }
            ]
          },
          {
            id: 'clients-swift',
            name: "Client's SWIFT",
            files: [{ id: 'swift1', name: 'Client456Swift.txt', type: 'txt' }]
          }
        ]
      },
      {
        id: 'sent',
        name: 'Sent',
        subCategories: [
          {
            id: 'official-invoice',
            name: 'Official Invoice',
            files: [{ id: 'invoice1', name: 'Invoice123.pdf', type: 'pdf' }]
          },
          {
            id: 'clients-aws',
            name: "Client's AWS",
            files: []
          },
          {
            id: 'packing-list',
            name: 'Packing List',
            files: []
          }
        ]
      }
    ]
  },
  {
    id: 'docs-supplier',
    name: 'Docs with Supplier',
    categories: [
      {
        id: 'supplier-received',
        name: 'Received',
        subCategories: [
          {
            id: 'suppliers-pi',
            name: "Supplier's PI",
            files: []
          },
          {
            id: 'suppliers-final-invoice',
            name: "Supplier's Final Invoice",
            files: []
          },
          {
            id: 'suppliers-packing-list',
            name: "Supplier's Packing List",
            files: []
          },
          {
            id: 'certificate',
            name: 'Certificate',
            files: []
          },
          {
            id: 'trace-docs',
            name: 'Trace Docs',
            files: []
          }
        ]
      },
      {
        id: 'supplier-sent',
        name: 'Sent',
        subCategories: [
          {
            id: 'suppliers-euc',
            name: "Supplier's EUC",
            files: []
          },
          {
            id: 'swift-to-supplier',
            name: 'SWIFT to Supplier',
            files: []
          },
          {
            id: 'purchase-order',
            name: 'Purchase Order',
            files: []
          }
        ]
      }
    ]
  },
  {
    id: 'docs-ff',
    name: 'Docs with FF',
    categories: [
      {
        id: 'suppliers-awb',
        name: "Supplier's AWB",
        subCategories: [],
        files: []
      },
      {
        id: 'invoice-ff-turkiye',
        name: 'Invoice of FF to Turkiye',
        subCategories: [],
        files: []
      },
      {
        id: 'invoice-ff-destination',
        name: 'Invoice of FF to Destination',
        subCategories: [],
        files: []
      },
      {
        id: 'lot-form',
        name: 'Lot Form',
        subCategories: [],
        files: []
      }
    ]
  }
];

const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return faFilePdf;
    case 'xlsx':
    case 'xls':
      return faFileExcel;
    case 'docx':
    case 'doc':
      return faFileWord;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return faFileImage;
    case 'txt':
      return faFileAlt;
    default:
      return faFile;
  }
};

const PIListFileUpload: React.FC<PIListFileUploadProps> = ({
  show,
  onHide,
  piId
}) => {
  const [data, setData] = useState<MainCategory[]>(mockData);
  const [selectedCategory, setSelectedCategory] = useState<{
    mainId: string | null;
    categoryId: string | null;
    subCategoryId: string | null;
  }>({
    mainId: null,
    categoryId: null,
    subCategoryId: null
  });
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>(
    {}
  );

  // This function would fetch real data from API
  const fetchFileStructure = async () => {
    // In real implementation, fetch data from API using piId
    // For now, using mock data
    setData(mockData);
  };

  useEffect(() => {
    if (show) {
      fetchFileStructure();

      // Initialize edit modes for all subcategories and categories without subcategories
      const initialEditModes: { [key: string]: boolean } = {};
      mockData.forEach(main => {
        main.categories.forEach(category => {
          // Add edit mode for categories without subcategories
          if (!category.subCategories || category.subCategories.length === 0) {
            initialEditModes[category.id] = false;
          }

          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach(subCategory => {
              initialEditModes[subCategory.id] = false;
            });
          }
        });
      });
      setEditModes(initialEditModes);

      // Initialize selected files object
      const initialSelectedFiles: { [key: string]: File[] } = {};
      mockData.forEach(main => {
        main.categories.forEach(category => {
          // Add selected files array for categories without subcategories
          if (!category.subCategories || category.subCategories.length === 0) {
            initialSelectedFiles[category.id] = [];
          }

          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach(subCategory => {
              initialSelectedFiles[subCategory.id] = [];
            });
          }
        });
      });
      setSelectedFiles(initialSelectedFiles);
    }
  }, [show, piId]);

  const toggleEditMode = (nodeId: string) => {
    if (editModes[nodeId]) {
      // Save changes to backend
      // This would be implemented later
      console.log(
        'Saving changes for',
        nodeId,
        'with files:',
        selectedFiles[nodeId]
      );
    }

    setEditModes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
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

  const handleDeleteFile = (
    fileId: string,
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => {
    // This implementation would be replaced with actual API calls
    setData(prevData => {
      return prevData.map(mainCategory => {
        return {
          ...mainCategory,
          categories: mainCategory.categories.map(category => {
            if (parentNodeType === 'category' && category.id === nodeId) {
              // File is directly under a category
              return {
                ...category,
                files: category.files
                  ? category.files.filter(file => file.id !== fileId)
                  : []
              };
            }

            return {
              ...category,
              subCategories: category.subCategories.map(subCategory => {
                if (
                  parentNodeType === 'subcategory' &&
                  subCategory.id === nodeId
                ) {
                  // File is under a subcategory
                  return {
                    ...subCategory,
                    files: subCategory.files.filter(file => file.id !== fileId)
                  };
                }
                return subCategory;
              })
            };
          })
        };
      });
    });
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

  // Find main category by ID
  const getMainCategoryById = (id: string): MainCategory | undefined => {
    return data.find(main => main.id === id);
  };

  // Find category by ID within a main category
  const getCategoryById = (
    mainCategoryId: string,
    categoryId: string
  ): CategoryItem | undefined => {
    const mainCategory = getMainCategoryById(mainCategoryId);
    if (!mainCategory) return undefined;
    return mainCategory.categories.find(category => category.id === categoryId);
  };

  // Find subcategory by ID within a category
  const getSubCategoryById = (
    mainCategoryId: string,
    categoryId: string,
    subCategoryId: string
  ): SubCategoryItem | undefined => {
    const category = getCategoryById(mainCategoryId, categoryId);
    if (!category) return undefined;
    return category.subCategories.find(
      subCategory => subCategory.id === subCategoryId
    );
  };

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

  // Render files for a specific node
  const renderFilesForNode = (
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => {
    let files: FileItem[] = [];
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

    if (files.length === 0 && !hasSelectedFiles) {
      return (
        <div className="text-muted px-2 py-1">
          <small>No files available</small>
        </div>
      );
    }

    return (
      <div className="files-container px-2">
        {hasSelectedFiles && (
          <div className="selected-files mb-2">
            <div className="d-flex flex-wrap gap-2">
              {selectedFilesArray.map((file, idx) => (
                <div key={idx} className="file-item">
                  <div className="d-flex align-items-center border rounded p-1 bg-light">
                    <FontAwesomeIcon
                      icon={getFileIcon(file.name.split('.').pop() || '')}
                      className="me-1 text-secondary"
                      size="sm"
                    />
                    <small>{file.name}</small>
                    <Button
                      variant="link"
                      className="ms-1 text-danger p-1"
                      onClick={() => handleRemoveSelectedFile(nodeId, idx)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="existing-files">
            <div className="d-flex flex-wrap gap-2">
              {files.map(file => (
                <div key={file.id} className="file-item">
                  <div className="d-flex align-items-center border rounded p-1">
                    <FontAwesomeIcon
                      icon={getFileIcon(file.type)}
                      className="me-1 text-secondary"
                      size="sm"
                    />
                    <small>{file.name}</small>
                    {isEditing && (
                      <Button
                        variant="link"
                        className="ms-1 text-danger p-1"
                        onClick={() =>
                          handleDeleteFile(file.id, nodeId, parentNodeType)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render file management content in rows
  const renderVerticalFileManager = () => {
    return (
      <div className="vertical-file-manager">
        {/* Row 1: Client Documents */}
        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Header className="bg-light">
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  className="me-2"
                  style={{ color: '#f8d775' }}
                />
                Docs with Client
              </Card.Header>
              <Card.Body className="p-2">
                <Row>
                  <Col md={6}>
                    <Card className="mb-2">
                      <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          className="me-2"
                          size="sm"
                          style={{ color: '#f8d775' }}
                        />
                        <span className="fs-6">Received</span>
                      </Card.Header>
                      <ListGroup variant="flush">
                        <ListGroup.Item
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode(
                              'docs-client',
                              'received',
                              'clients-po'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'received' &&
                            selectedCategory.subCategoryId === 'clients-po'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Client's PO</span>
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-po');
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-po'] ? faSave : faEdit
                                  }
                                />
                              </Button>
                              {editModes['clients-po'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-po"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          'clients-po'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode('clients-po', 'subcategory')}
                        </ListGroup.Item>

                        <ListGroup.Item
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode(
                              'docs-client',
                              'received',
                              'clients-swift'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'received' &&
                            selectedCategory.subCategoryId === 'clients-swift'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Client's SWIFT</span>
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-swift');
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-swift'] ? faSave : faEdit
                                  }
                                />
                              </Button>
                              {editModes['clients-swift'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-swift"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          'clients-swift'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode('clients-swift', 'subcategory')}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="mb-2">
                      <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          className="me-2"
                          size="sm"
                          style={{ color: '#f8d775' }}
                        />
                        <span className="fs-6">Sent</span>
                      </Card.Header>
                      <ListGroup variant="flush">
                        <ListGroup.Item
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode(
                              'docs-client',
                              'sent',
                              'official-invoice'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'sent' &&
                            selectedCategory.subCategoryId ===
                              'official-invoice'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Official Invoice</span>
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('official-invoice');
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['official-invoice']
                                      ? faSave
                                      : faEdit
                                  }
                                />
                              </Button>
                              {editModes['official-invoice'] && (
                                <Form.Group
                                  controlId="fileUpload-official-invoice"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          'official-invoice'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode(
                            'official-invoice',
                            'subcategory'
                          )}
                        </ListGroup.Item>

                        <ListGroup.Item
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode(
                              'docs-client',
                              'sent',
                              'clients-aws'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'sent' &&
                            selectedCategory.subCategoryId === 'clients-aws'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Client's AWS</span>
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-aws');
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-aws'] ? faSave : faEdit
                                  }
                                />
                              </Button>
                              {editModes['clients-aws'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-aws"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          'clients-aws'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode('clients-aws', 'subcategory')}
                        </ListGroup.Item>

                        <ListGroup.Item
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode(
                              'docs-client',
                              'sent',
                              'packing-list'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'sent' &&
                            selectedCategory.subCategoryId === 'packing-list'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Packing List</span>
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('packing-list');
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['packing-list'] ? faSave : faEdit
                                  }
                                />
                              </Button>
                              {editModes['packing-list'] && (
                                <Form.Group
                                  controlId="fileUpload-packing-list"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          'packing-list'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode('packing-list', 'subcategory')}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row 2: Supplier Documents */}
        <Row className="mb-3">
          <Col>
            <Card>
              <Card.Header className="bg-light">
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  className="me-2"
                  style={{ color: '#f8d775' }}
                />
                Docs with Supplier
              </Card.Header>
              <Card.Body className="p-2">
                <Row>
                  <Col md={6}>
                    <Card className="mb-2">
                      <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          className="me-2"
                          size="sm"
                          style={{ color: '#f8d775' }}
                        />
                        <span className="fs-6">Received</span>
                      </Card.Header>
                      <ListGroup variant="flush">
                        {/* Supplier received docs here */}
                        {data[1].categories[0].subCategories.map(
                          subCategory => (
                            <ListGroup.Item
                              key={subCategory.id}
                              className="py-1 px-2"
                              action
                              onClick={() =>
                                handleSelectNode(
                                  'docs-supplier',
                                  'supplier-received',
                                  subCategory.id
                                )
                              }
                              active={
                                selectedCategory.mainId === 'docs-supplier' &&
                                selectedCategory.categoryId ===
                                  'supplier-received' &&
                                selectedCategory.subCategoryId ===
                                  subCategory.id
                              }
                            >
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                  icon={faFolder}
                                  className="me-2"
                                  size="sm"
                                  style={{ color: '#f8d775' }}
                                />
                                <span className="small">
                                  {subCategory.name}
                                </span>
                                <div className="ms-auto">
                                  <Button
                                    variant="outline-primary"
                                    className="py-1 px-2"
                                    onClick={e => {
                                      e.stopPropagation();
                                      toggleEditMode(subCategory.id);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        editModes[subCategory.id]
                                          ? faSave
                                          : faEdit
                                      }
                                    />
                                  </Button>
                                  {editModes[subCategory.id] && (
                                    <Form.Group
                                      controlId={`fileUpload-${subCategory.id}`}
                                      className="d-inline-block ms-1"
                                    >
                                      <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                        <FontAwesomeIcon icon={faFileUpload} />
                                        <Form.Control
                                          type="file"
                                          multiple
                                          onChange={e =>
                                            handleFileUpload(
                                              e as ChangeEvent<HTMLInputElement>,
                                              subCategory.id
                                            )
                                          }
                                          style={{ display: 'none' }}
                                        />
                                      </Form.Label>
                                    </Form.Group>
                                  )}
                                </div>
                              </div>
                              {renderFilesForNode(
                                subCategory.id,
                                'subcategory'
                              )}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </Card>
                  </Col>

                  <Col md={6}>
                    <Card className="mb-2">
                      <Card.Header className="py-1 px-2 bg-light d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faFolderOpen}
                          className="me-2"
                          size="sm"
                          style={{ color: '#f8d775' }}
                        />
                        <span className="fs-6">Sent</span>
                      </Card.Header>
                      <ListGroup variant="flush">
                        {/* Supplier sent docs here */}
                        {data[1].categories[1].subCategories.map(
                          subCategory => (
                            <ListGroup.Item
                              key={subCategory.id}
                              className="py-1 px-2"
                              action
                              onClick={() =>
                                handleSelectNode(
                                  'docs-supplier',
                                  'supplier-sent',
                                  subCategory.id
                                )
                              }
                              active={
                                selectedCategory.mainId === 'docs-supplier' &&
                                selectedCategory.categoryId ===
                                  'supplier-sent' &&
                                selectedCategory.subCategoryId ===
                                  subCategory.id
                              }
                            >
                              <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                  icon={faFolder}
                                  className="me-2"
                                  size="sm"
                                  style={{ color: '#f8d775' }}
                                />
                                <span className="small">
                                  {subCategory.name}
                                </span>
                                <div className="ms-auto">
                                  <Button
                                    variant="outline-primary"
                                    className="py-1 px-2"
                                    onClick={e => {
                                      e.stopPropagation();
                                      toggleEditMode(subCategory.id);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        editModes[subCategory.id]
                                          ? faSave
                                          : faEdit
                                      }
                                    />
                                  </Button>
                                  {editModes[subCategory.id] && (
                                    <Form.Group
                                      controlId={`fileUpload-${subCategory.id}`}
                                      className="d-inline-block ms-1"
                                    >
                                      <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                        <FontAwesomeIcon icon={faFileUpload} />
                                        <Form.Control
                                          type="file"
                                          multiple
                                          onChange={e =>
                                            handleFileUpload(
                                              e as ChangeEvent<HTMLInputElement>,
                                              subCategory.id
                                            )
                                          }
                                          style={{ display: 'none' }}
                                        />
                                      </Form.Label>
                                    </Form.Group>
                                  )}
                                </div>
                              </div>
                              {renderFilesForNode(
                                subCategory.id,
                                'subcategory'
                              )}
                            </ListGroup.Item>
                          )
                        )}
                      </ListGroup>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Row 3: FF Documents */}
        <Row>
          <Col>
            <Card>
              <Card.Header className="bg-light">
                <FontAwesomeIcon
                  icon={faFolderOpen}
                  className="me-2"
                  style={{ color: '#f8d775' }}
                />
                Docs with FF
              </Card.Header>
              <Card.Body className="p-2">
                <Row>
                  <Col>
                    <ListGroup variant="flush">
                      {/* FF docs here */}
                      {data[2].categories.map(category => (
                        <ListGroup.Item
                          key={category.id}
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode('docs-ff', category.id)
                          }
                          active={
                            selectedCategory.mainId === 'docs-ff' &&
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
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode(category.id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes[category.id] ? faSave : faEdit
                                  }
                                />
                              </Button>
                              {editModes[category.id] && (
                                <Form.Group
                                  controlId={`fileUpload-${category.id}`}
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label className="btn btn-outline-primary py-1 px-2 mb-0">
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          category.id
                                        )
                                      }
                                      style={{ display: 'none' }}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode(category.id, 'category')}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>PI File Management</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">{renderVerticalFileManager()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PIListFileUpload;
