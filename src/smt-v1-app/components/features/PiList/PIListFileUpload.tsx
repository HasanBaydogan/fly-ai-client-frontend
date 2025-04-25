import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';
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
  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>(
    {}
  );
  const [expandedNodes, setExpandedNodes] = useState<{
    [key: string]: boolean;
  }>({});

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

      // Initialize expanded nodes - expand all levels with files by default
      const initialExpandedNodes: { [key: string]: boolean } = {};

      // Expand main categories by default
      mockData.forEach(main => {
        initialExpandedNodes[main.id] = true;

        main.categories.forEach(category => {
          // Check if this category has any subcategories with files
          const hasFilesInSubcategories =
            category.subCategories &&
            category.subCategories.some(
              subCategory => subCategory.files && subCategory.files.length > 0
            );

          // Check if this category has files itself (for categories without subcategories)
          const hasCategoryFiles = category.files && category.files.length > 0;

          // Expand category if it has subcategories with files or has files itself
          initialExpandedNodes[category.id] =
            hasFilesInSubcategories || hasCategoryFiles;

          // Expand all subcategories that have files
          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach(subCategory => {
              const hasFiles =
                subCategory.files && subCategory.files.length > 0;
              initialExpandedNodes[subCategory.id] = hasFiles;
            });
          }
        });
      });

      setExpandedNodes(initialExpandedNodes);
    }
  }, [show, piId]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const toggleEditMode = (subCategoryId: string) => {
    if (editModes[subCategoryId]) {
      // Save changes to backend
      // This would be implemented later
      console.log(
        'Saving changes for',
        subCategoryId,
        'with files:',
        selectedFiles[subCategoryId]
      );
    }

    setEditModes(prev => ({
      ...prev,
      [subCategoryId]: !prev[subCategoryId]
    }));
  };

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    subCategoryId: string
  ) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => ({
        ...prev,
        [subCategoryId]: [...(prev[subCategoryId] || []), ...newFiles]
      }));
    }
  };

  const handleDeleteFile = (
    fileId: string,
    subCategoryId: string,
    categoryId: string,
    mainCategoryId: string
  ) => {
    // This implementation would be replaced with actual API calls
    setData(prevData => {
      return prevData.map(mainCategory => {
        if (mainCategory.id !== mainCategoryId) return mainCategory;

        return {
          ...mainCategory,
          categories: mainCategory.categories.map(category => {
            if (category.id !== categoryId) return category;

            return {
              ...category,
              subCategories: category.subCategories.map(subCategory => {
                if (subCategory.id !== subCategoryId) return subCategory;

                return {
                  ...subCategory,
                  files: subCategory.files.filter(file => file.id !== fileId)
                };
              })
            };
          })
        };
      });
    });
  };

  const handleRemoveSelectedFile = (subCategoryId: string, index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev[subCategoryId]];
      newFiles.splice(index, 1);
      return {
        ...prev,
        [subCategoryId]: newFiles
      };
    });
  };

  const renderFileNode = (
    file: FileItem,
    level: number,
    subCategoryId: string,
    categoryId: string,
    mainCategoryId: string
  ) => {
    return (
      <ListGroup.Item
        key={file.id}
        className="d-flex align-items-center border-0 py-1"
        style={{ paddingLeft: `${level * 20}px` }}
      >
        <FontAwesomeIcon icon={getFileIcon(file.type)} className="me-2" />
        <span>{file.name}</span>
        {editModes[subCategoryId] && (
          <Button
            variant="link"
            size="sm"
            className="ms-auto text-danger p-0"
            onClick={() =>
              handleDeleteFile(
                file.id,
                subCategoryId,
                categoryId,
                mainCategoryId
              )
            }
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        )}
      </ListGroup.Item>
    );
  };

  const renderSubCategoryNode = (
    subCategory: SubCategoryItem,
    level: number,
    categoryId: string,
    mainCategoryId: string
  ) => {
    const isExpanded = expandedNodes[subCategory.id] || false;
    const selectedFilesForSubCategory = selectedFiles[subCategory.id] || [];
    const hasSelectedFiles =
      selectedFilesForSubCategory.length > 0 && editModes[subCategory.id];

    return (
      <div key={subCategory.id}>
        <div
          className="d-flex align-items-center py-2"
          style={{
            paddingLeft: `${level * 20}px`,
            cursor: 'pointer',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
          }}
          onClick={() => toggleNode(subCategory.id)}
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronDown : faChevronRight}
            className="me-2"
            style={{ width: '10px' }}
          />
          <FontAwesomeIcon
            icon={isExpanded ? faFolderOpen : faFolder}
            className="me-2"
            style={{ color: '#ffc107' }}
          />
          <span style={{ fontWeight: '500' }}>{subCategory.name}</span>

          <div className="ms-auto" onClick={e => e.stopPropagation()}>
            {editModes[subCategory.id] && (
              <Form.Group
                controlId={`fileUpload-${subCategory.id}`}
                className="d-inline-block me-2"
              >
                <Form.Label className="btn btn-outline-primary mb-0 btn-sm">
                  <FontAwesomeIcon icon={faFileUpload} className="me-2" />
                  Upload
                  <Form.Control
                    type="file"
                    multiple
                    onChange={e => {
                      if (e.target instanceof HTMLInputElement) {
                        handleFileUpload(
                          e as ChangeEvent<HTMLInputElement>,
                          subCategory.id
                        );
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </Form.Label>
              </Form.Group>
            )}
            <Button
              variant={editModes[subCategory.id] ? 'success' : 'primary'}
              size="sm"
              onClick={e => {
                e.stopPropagation();
                toggleEditMode(subCategory.id);
              }}
            >
              <FontAwesomeIcon
                icon={editModes[subCategory.id] ? faSave : faEdit}
                className="me-2"
              />
              {editModes[subCategory.id] ? 'Save' : 'Edit'}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <>
            {hasSelectedFiles && (
              <div
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                className="mb-2 mt-2 bg-light p-2 rounded"
              >
                <h6 className="mb-2">Files to Upload:</h6>
                <ListGroup>
                  {selectedFilesForSubCategory.map((file, idx) => (
                    <ListGroup.Item
                      key={idx}
                      className="d-flex align-items-center py-1 border-0"
                    >
                      <FontAwesomeIcon
                        icon={getFileIcon(file.name.split('.').pop() || '')}
                        className="me-2"
                      />
                      <span>{file.name}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="ms-auto text-danger p-0"
                        onClick={() =>
                          handleRemoveSelectedFile(subCategory.id, idx)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            {subCategory.files.length > 0 ? (
              subCategory.files.map(file =>
                renderFileNode(
                  file,
                  level + 1,
                  subCategory.id,
                  categoryId,
                  mainCategoryId
                )
              )
            ) : (
              <div
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                className="text-muted py-2"
              >
                No files available
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderCategoryNode = (
    category: CategoryItem,
    level: number,
    mainCategoryId: string
  ) => {
    const isExpanded = expandedNodes[category.id] || false;
    const hasSubcategories =
      category.subCategories && category.subCategories.length > 0;
    const selectedFilesForCategory = selectedFiles[category.id] || [];
    const hasSelectedFiles =
      selectedFilesForCategory.length > 0 && editModes[category.id];

    return (
      <div key={category.id}>
        <div
          className="d-flex align-items-center py-2"
          style={{
            paddingLeft: `${level * 20}px`,
            cursor: 'pointer',
            backgroundColor: !hasSubcategories ? '#f8f9fa' : 'transparent',
            borderBottom: !hasSubcategories ? '1px solid #dee2e6' : 'none'
          }}
          onClick={() => toggleNode(category.id)}
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronDown : faChevronRight}
            className="me-2"
            style={{ width: '10px' }}
          />
          <FontAwesomeIcon
            icon={isExpanded ? faFolderOpen : faFolder}
            className="me-2"
            style={{ color: '#ffc107' }}
          />
          <span style={{ fontWeight: '500' }}>{category.name}</span>

          {/* Add Edit button for categories that don't have subcategories */}
          {!hasSubcategories && (
            <div className="ms-auto" onClick={e => e.stopPropagation()}>
              {editModes[category.id] && (
                <Form.Group
                  controlId={`fileUpload-${category.id}`}
                  className="d-inline-block me-2"
                >
                  <Form.Label className="btn btn-outline-primary mb-0 btn-sm">
                    <FontAwesomeIcon icon={faFileUpload} className="me-2" />
                    Upload
                    <Form.Control
                      type="file"
                      multiple
                      onChange={e => {
                        if (e.target instanceof HTMLInputElement) {
                          handleFileUpload(
                            e as ChangeEvent<HTMLInputElement>,
                            category.id
                          );
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </Form.Label>
                </Form.Group>
              )}
              <Button
                variant={editModes[category.id] ? 'success' : 'primary'}
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  toggleEditMode(category.id);
                }}
              >
                <FontAwesomeIcon
                  icon={editModes[category.id] ? faSave : faEdit}
                  className="me-2"
                />
                {editModes[category.id] ? 'Save' : 'Edit'}
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <>
            {hasSelectedFiles && (
              <div
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                className="mb-2 mt-2 bg-light p-2 rounded"
              >
                <h6 className="mb-2">Files to Upload:</h6>
                <ListGroup>
                  {selectedFilesForCategory.map((file, idx) => (
                    <ListGroup.Item
                      key={idx}
                      className="d-flex align-items-center py-1 border-0"
                    >
                      <FontAwesomeIcon
                        icon={getFileIcon(file.name.split('.').pop() || '')}
                        className="me-2"
                      />
                      <span>{file.name}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="ms-auto text-danger p-0"
                        onClick={() =>
                          handleRemoveSelectedFile(category.id, idx)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            {hasSubcategories ? (
              category.subCategories.map(subCategory =>
                renderSubCategoryNode(
                  subCategory,
                  level + 1,
                  category.id,
                  mainCategoryId
                )
              )
            ) : (
              <>
                {category.files && category.files.length > 0 ? (
                  category.files.map(file =>
                    renderFileNode(
                      file,
                      level + 1,
                      category.id,
                      category.id,
                      mainCategoryId
                    )
                  )
                ) : (
                  <div
                    style={{ paddingLeft: `${(level + 1) * 20}px` }}
                    className="text-muted py-2"
                  >
                    No files available
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderMainCategoryNode = (
    mainCategory: MainCategory,
    level: number
  ) => {
    const isExpanded = expandedNodes[mainCategory.id] || false;

    return (
      <div key={mainCategory.id}>
        <div
          className="d-flex align-items-center py-3"
          style={{
            paddingLeft: `${level * 20}px`,
            cursor: 'pointer',
            borderBottom: '1px solid #e9ecef'
          }}
          onClick={() => toggleNode(mainCategory.id)}
        >
          <FontAwesomeIcon
            icon={isExpanded ? faChevronDown : faChevronRight}
            className="me-2"
            style={{ width: '10px' }}
          />
          <FontAwesomeIcon
            icon={isExpanded ? faFolderOpen : faFolder}
            className="me-2"
            style={{ color: '#6c757d', fontSize: '1.2rem' }}
          />
          <span style={{ fontWeight: '500', fontSize: '1.1rem' }}>
            {mainCategory.name}
          </span>
        </div>

        {isExpanded && (
          <>
            {mainCategory.categories.map(category =>
              renderCategoryNode(category, level + 1, mainCategory.id)
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" fullscreen="lg-down">
      <Modal.Header closeButton>
        <Modal.Title>PI File Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="file-tree">
          {data.map(mainCategory => renderMainCategoryNode(mainCategory, 0))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PIListFileUpload;
