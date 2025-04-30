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
import { uploadPIAttachments } from 'smt-v1-app/services/PIServices';

// Type definitions for API integration
interface AttachmentType {
  id: string | null;
  data?: string;
}

interface AttachmentResponse {
  id: string;
  fileName: string;
}

interface ApiResponse {
  data: AttachmentResponse[];
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

// Enum for attachment types that maps to API types
enum PIAttachmentType {
  CLIENT_AWB_ATTACHMENT = 'CLIENT_AWB_ATTACHMENT',
  CLIENT_OFFICIAL_INVOICE_ATTACHMENT = 'CLIENT_OFFICIAL_INVOICE_ATTACHMENT',
  CLIENT_PACKING_LIST_ATTACHMENT = 'CLIENT_PACKING_LIST_ATTACHMENT',
  CLIENT_PO_ATTACHMENT = 'CLIENT_PO_ATTACHMENT',
  CLIENT_SWIFT_ATTACHMENT = 'CLIENT_SWIFT_ATTACHMENT',
  INVOICE_OF_FF_TO_DESTINATION_ATTACHMENT = 'INVOICE_OF_FF_TO_DESTINATION_ATTACHMENT',
  INVOICE_OF_FF_TO_TURKEY_ATTACHMENT = 'INVOICE_OF_FF_TO_TURKEY_ATTACHMENT',
  LOT_FORM_ATTACHMENT = 'LOT_FORM_ATTACHMENT',
  SUPPLIER_AWB_ATTACHMENT = 'SUPPLIER_AWB_ATTACHMENT',
  SUPPLIER_CERTIFICATE_ATTACHMENT = 'SUPPLIER_CERTIFICATE_ATTACHMENT',
  SUPPLIER_EUC_ATTACHMENT = 'SUPPLIER_EUC_ATTACHMENT',
  SUPPLIER_FINAL_INVOICE_ATTACHMENT = 'SUPPLIER_FINAL_INVOICE_ATTACHMENT',
  SUPPLIER_PACKING_LIST_ATTACHMENT = 'SUPPLIER_PACKING_LIST_ATTACHMENT',
  SUPPLIER_PI_ATTACHMENT = 'SUPPLIER_PI_ATTACHMENT',
  SUPPLIER_PURCHASE_ORDER_ATTACHMENT = 'SUPPLIER_PURCHASE_ORDER_ATTACHMENT',
  SUPPLIER_TRACE_DOCS_ATTACHMENT = 'SUPPLIER_TRACE_DOCS_ATTACHMENT',
  SWIFT_TO_SUPPLIER_ATTACHMENT = 'SWIFT_TO_SUPPLIER_ATTACHMENT'
}

// Map folder IDs to attachment types
const folderToAttachmentTypeMap: { [key: string]: PIAttachmentType } = {
  'clients-po': PIAttachmentType.CLIENT_PO_ATTACHMENT,
  'clients-swift': PIAttachmentType.CLIENT_SWIFT_ATTACHMENT,
  'official-invoice': PIAttachmentType.CLIENT_OFFICIAL_INVOICE_ATTACHMENT,
  'clients-awb': PIAttachmentType.CLIENT_AWB_ATTACHMENT,
  'packing-list': PIAttachmentType.CLIENT_PACKING_LIST_ATTACHMENT,
  'suppliers-pi': PIAttachmentType.SUPPLIER_PI_ATTACHMENT,
  'suppliers-final-invoice': PIAttachmentType.SUPPLIER_FINAL_INVOICE_ATTACHMENT,
  'suppliers-packing-list': PIAttachmentType.SUPPLIER_PACKING_LIST_ATTACHMENT,
  certificate: PIAttachmentType.SUPPLIER_CERTIFICATE_ATTACHMENT,
  'trace-docs': PIAttachmentType.SUPPLIER_TRACE_DOCS_ATTACHMENT,
  'suppliers-euc': PIAttachmentType.SUPPLIER_EUC_ATTACHMENT,
  'swift-to-supplier': PIAttachmentType.SWIFT_TO_SUPPLIER_ATTACHMENT,
  'purchase-order': PIAttachmentType.SUPPLIER_PURCHASE_ORDER_ATTACHMENT,
  'suppliers-awb': PIAttachmentType.SUPPLIER_AWB_ATTACHMENT,
  'invoice-ff-turkiye': PIAttachmentType.INVOICE_OF_FF_TO_TURKEY_ATTACHMENT,
  'invoice-ff-destination':
    PIAttachmentType.INVOICE_OF_FF_TO_DESTINATION_ATTACHMENT,
  'lot-form': PIAttachmentType.LOT_FORM_ATTACHMENT
};

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
            id: 'clients-awb',
            name: "Client's AWB",
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
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>(
    {}
  );

  // Function to convert file to Base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          // Extract the base64 data part (remove the prefix)
          const base64String = reader.result.toString();
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Function to upload files to the API
  const uploadFilesToAPI = async (nodeId: string) => {
    if (!piId || !folderToAttachmentTypeMap[nodeId]) {
      setUploadErrors(prev => ({
        ...prev,
        [nodeId]: 'Missing PI ID or invalid folder type'
      }));
      return;
    }

    setIsUploading(prev => ({ ...prev, [nodeId]: true }));
    setUploadErrors(prev => ({ ...prev, [nodeId]: '' }));

    try {
      // Get all existing files for this node to include in the request
      const existingFiles: FileItem[] = [];
      data.forEach(main => {
        main.categories.forEach(category => {
          if (category.files && category.id === nodeId) {
            existingFiles.push(...category.files);
          }
          category.subCategories?.forEach(subCategory => {
            if (subCategory.id === nodeId) {
              existingFiles.push(...subCategory.files);
            }
          });
        });
      });

      // Get all new files that need to be uploaded
      const newFiles = selectedFiles[nodeId] || [];

      // Prepare the attachment requests array
      const piAttachmentRequests: AttachmentType[] = [];

      // Add existing files with their IDs (empty data)
      existingFiles.forEach(file => {
        piAttachmentRequests.push({
          id: file.id,
          data: ''
        });
      });

      // Add new files with null ID and base64 data
      for (const file of newFiles) {
        const base64Data = await getBase64(file);
        piAttachmentRequests.push({
          id: null,
          data: base64Data
        });
      }

      // Make the API call using the service
      const response = await uploadPIAttachments(
        piId,
        piAttachmentRequests,
        folderToAttachmentTypeMap[nodeId]
      );

      if (response.success) {
        // Update the UI with the new files
        updateFilesAfterUpload(nodeId, response.data, newFiles);

        // Clear selected files for this node
        setSelectedFiles(prev => ({
          ...prev,
          [nodeId]: []
        }));
      } else {
        setUploadErrors(prev => ({
          ...prev,
          [nodeId]: response.message || 'Upload failed'
        }));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadErrors(prev => ({
        ...prev,
        [nodeId]: 'Error uploading files. Please try again.'
      }));
    } finally {
      setIsUploading(prev => ({ ...prev, [nodeId]: false }));
      // Exit edit mode after upload attempt (whether successful or not)
      setEditModes(prev => ({
        ...prev,
        [nodeId]: false
      }));
    }
  };

  // Update the file list after successful upload
  const updateFilesAfterUpload = (
    nodeId: string,
    uploadedFiles: AttachmentResponse[],
    originalFiles: File[]
  ) => {
    // Map original filenames to their uploaded IDs and create FileItem objects
    const newFileItems: FileItem[] = uploadedFiles.map(
      (uploadedFile, index) => {
        // Try to match with original file name if possible
        const matchingOriginalFile = originalFiles.find(
          file => file.name === uploadedFile.fileName
        );

        // Get file extension
        const fileType = uploadedFile.fileName.split('.').pop() || '';

        return {
          id: uploadedFile.id,
          name: uploadedFile.fileName,
          type: fileType
        };
      }
    );

    // Update data state with new files
    setData(prevData => {
      return prevData.map(mainCategory => {
        return {
          ...mainCategory,
          categories: mainCategory.categories.map(category => {
            // If this category has the node ID directly
            if (category.id === nodeId && category.files) {
              return {
                ...category,
                files: [...category.files, ...newFileItems]
              };
            }

            // Check subcategories
            return {
              ...category,
              subCategories: category.subCategories.map(subCategory => {
                if (subCategory.id === nodeId) {
                  return {
                    ...subCategory,
                    files: [...subCategory.files, ...newFileItems]
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

      // Initialize uploading status
      const initialUploadingStatus: { [key: string]: boolean } = {};
      mockData.forEach(main => {
        main.categories.forEach(category => {
          if (!category.subCategories || category.subCategories.length === 0) {
            initialUploadingStatus[category.id] = false;
          }

          if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories.forEach(subCategory => {
              initialUploadingStatus[subCategory.id] = false;
            });
          }
        });
      });
      setIsUploading(initialUploadingStatus);
    }
  }, [show, piId]);

  const toggleEditMode = (nodeId: string) => {
    if (editModes[nodeId]) {
      // If we're exiting edit mode, try to upload files
      if (selectedFiles[nodeId]?.length > 0) {
        uploadFilesToAPI(nodeId);
      } else {
        // No files selected, just exit edit mode
        setEditModes(prev => ({
          ...prev,
          [nodeId]: false
        }));
      }
    } else {
      // Entering edit mode
      setEditModes(prev => ({
        ...prev,
        [nodeId]: true
      }));
    }
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
    const isCurrentlyUploading = isUploading[nodeId] || false;
    const uploadError = uploadErrors[nodeId];

    if (files.length === 0 && !hasSelectedFiles) {
      return (
        <div className="text-muted px-2 py-1">
          <small>No files available</small>
        </div>
      );
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
            <div className="d-flex flex-wrap gap-2">
              {selectedFilesArray.map((file, idx) => (
                <div
                  key={`selected-${nodeId}-${idx}-${file.name}`}
                  className="file-item"
                >
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
                      disabled={isCurrentlyUploading}
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
                <div
                  key={`existing-${nodeId}-${file.id}-${file.name}`}
                  className="file-item"
                >
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
                        disabled={isCurrentlyUploading}
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
                                disabled={isUploading['clients-po']}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-po'] ? faSave : faEdit
                                  }
                                />
                                {isUploading['clients-po'] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes['clients-po'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-po"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading['clients-po']
                                        ? 'disabled'
                                        : ''
                                    }`}
                                  >
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
                                      disabled={isUploading['clients-po']}
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
                                disabled={isUploading['clients-swift']}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-swift'] ? faSave : faEdit
                                  }
                                />
                                {isUploading['clients-swift'] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes['clients-swift'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-swift"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading['clients-swift']
                                        ? 'disabled'
                                        : ''
                                    }`}
                                  >
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
                                      disabled={isUploading['clients-swift']}
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
                                disabled={isUploading['official-invoice']}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['official-invoice']
                                      ? faSave
                                      : faEdit
                                  }
                                />
                                {isUploading['official-invoice'] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes['official-invoice'] && (
                                <Form.Group
                                  controlId="fileUpload-official-invoice"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading['official-invoice']
                                        ? 'disabled'
                                        : ''
                                    }`}
                                  >
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
                                      disabled={isUploading['official-invoice']}
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
                              'clients-awb'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'sent' &&
                            selectedCategory.subCategoryId === 'clients-awb'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Client's AWB</span>
                            <div className="ms-auto">
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-awb');
                                }}
                                disabled={isUploading['clients-awb']}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-awb'] ? faSave : faEdit
                                  }
                                />
                                {isUploading['clients-awb'] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes['clients-awb'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-awb"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading['clients-awb']
                                        ? 'disabled'
                                        : ''
                                    }`}
                                  >
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <Form.Control
                                      type="file"
                                      multiple
                                      onChange={e =>
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
                                          'clients-awb'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                      disabled={isUploading['clients-awb']}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                          {renderFilesForNode('clients-awb', 'subcategory')}
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
                                disabled={isUploading['packing-list']}
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['packing-list'] ? faSave : faEdit
                                  }
                                />
                                {isUploading['packing-list'] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes['packing-list'] && (
                                <Form.Group
                                  controlId="fileUpload-packing-list"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading['packing-list']
                                        ? 'disabled'
                                        : ''
                                    }`}
                                  >
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
                                      disabled={isUploading['packing-list']}
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
                                    disabled={isUploading[subCategory.id]}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        editModes[subCategory.id]
                                          ? faSave
                                          : faEdit
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
                                  {editModes[subCategory.id] && (
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
                                            handleFileUpload(
                                              e as ChangeEvent<HTMLInputElement>,
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
                                    disabled={isUploading[subCategory.id]}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        editModes[subCategory.id]
                                          ? faSave
                                          : faEdit
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
                                  {editModes[subCategory.id] && (
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
                                            handleFileUpload(
                                              e as ChangeEvent<HTMLInputElement>,
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
                                        handleFileUpload(
                                          e as ChangeEvent<HTMLInputElement>,
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
