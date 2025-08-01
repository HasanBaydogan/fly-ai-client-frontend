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
  faFolder,
  faEye,
  faUsersRectangle,
  faTruckPlane,
  faHandshake,
  faBoxesPacking,
  faArrowsUpToLine,
  faArrowUpLong,
  faArrowCircleUp,
  faArrowCircleDown
} from '@fortawesome/free-solid-svg-icons';
import './PIListFileUpload.css';
import {
  uploadPIAttachments,
  getPiAttachments,
  getPiSelectedAttachments
} from 'smt-v1-app/services/PIServices';

// Type definitions for API integration
interface AttachmentType {
  id: string | null;
  data?: string;
}

// API response interfaces
interface PIAttachmentItem {
  id: string;
  fileName: string;
}

interface PIAttachmentTypeGroup {
  type: string;
  piAttachments: PIAttachmentItem[];
}

interface PIAttachmentsResponse {
  data: PIAttachmentTypeGroup[];
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: string;
}

interface PISelectedAttachmentResponse {
  data: {
    id: string;
    fileName: string;
    data: string;
  };
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
  CLIENT_PI_ATTACHMENT = 'CLIENT_PI_ATTACHMENT',
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
  'clients-pi': PIAttachmentType.CLIENT_PI_ATTACHMENT,
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

// Initialize with empty data structure
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
            files: []
          },
          {
            id: 'clients-swift',
            name: "Client's SWIFT",
            files: []
          }
        ]
      },
      {
        id: 'sent',
        name: 'Sent',
        subCategories: [
          {
            id: 'clients-pi',
            name: "Client's PI",
            files: []
          },
          {
            id: 'official-invoice',
            name: 'Official Invoice',
            files: []
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
  }
  // {
  //   id: 'docs-supplier',
  //   name: 'Docs with Supplier',
  //   categories: [
  //     {
  //       id: 'supplier-received',
  //       name: 'Received',
  //       subCategories: [
  //         {
  //           id: 'suppliers-pi',
  //           name: "Supplier's PI",
  //           files: []
  //         },
  //         {
  //           id: 'suppliers-final-invoice',
  //           name: "Supplier's Final Invoice",
  //           files: []
  //         },
  //         {
  //           id: 'suppliers-packing-list',
  //           name: "Supplier's Packing List",
  //           files: []
  //         },
  //         {
  //           id: 'certificate',
  //           name: 'Certificate',
  //           files: []
  //         },
  //         {
  //           id: 'trace-docs',
  //           name: 'Trace Docs',
  //           files: []
  //         }
  //       ]
  //     },
  //     {
  //       id: 'supplier-sent',
  //       name: 'Sent',
  //       subCategories: [
  //         {
  //           id: 'suppliers-euc',
  //           name: "Supplier's EUC",
  //           files: []
  //         },
  //         {
  //           id: 'swift-to-supplier',
  //           name: 'SWIFT to Supplier',
  //           files: []
  //         },
  //         {
  //           id: 'purchase-order',
  //           name: 'Purchase Order',
  //           files: []
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 'docs-ff-received',
  //   name: 'Docs with FF Received',
  //   categories: [
  //     {
  //       id: 'suppliers-awb',
  //       name: "Supplier's AWB",
  //       subCategories: [],
  //       files: []
  //     },
  //     {
  //       id: 'invoice-ff-turkiye',
  //       name: 'Invoice of FF to Transit',
  //       subCategories: [],
  //       files: []
  //     },
  //     {
  //       id: 'invoice-ff-destination',
  //       name: 'Invoice of FF to Destination',
  //       subCategories: [],
  //       files: []
  //     }
  //   ]
  // },
  // {
  //   id: 'docs-ff-sent',
  //   name: 'Docs with FF Send',
  //   categories: [
  //     {
  //       id: 'lot-form',
  //       name: 'Lot Form',
  //       subCategories: [],
  //       files: []
  //     }
  //   ]
  // }
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  // Add new states for confirmation modals
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<{
    fileId: string;
    nodeId: string;
    parentNodeType: 'category' | 'subcategory';
  } | null>(null);
  const [nodeToSave, setNodeToSave] = useState<string | null>(null);

  // Get the inverse mapping from attachment type to folder ID
  const attachmentTypeToFolderMap = Object.entries(
    folderToAttachmentTypeMap
  ).reduce(
    (acc, [folderId, attachmentType]) => {
      acc[attachmentType] = folderId;
      return acc;
    },
    {} as Record<string, string>
  );

  // Function to fetch attachments from backend
  const fetchAttachments = async () => {
    if (!piId) return;

    setIsLoading(true);
    try {
      const response = await getPiAttachments(piId);
      if (response && response.success) {
        updateDataWithFetchedAttachments(response.data);
      } else {
        console.error('Failed to fetch attachments:', response?.message);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the data structure with fetched attachments
  const updateDataWithFetchedAttachments = (
    attachmentGroups: {
      type: string;
      piAttachments: { id: string; fileName: string }[];
    }[]
  ) => {
    // Create a copy of the current data
    const updatedData = [...data];

    // Process each attachment group
    attachmentGroups.forEach(group => {
      const folderId = attachmentTypeToFolderMap[group.type];

      if (!folderId) {
        console.warn(
          `No folder mapping found for attachment type: ${group.type}`
        );
        return;
      }

      // Convert attachment items to FileItem format
      const fileItems: FileItem[] = group.piAttachments.map(item => {
        // Extract file extension from fileName
        const fileExtension = item.fileName.split('.').pop() || '';

        return {
          id: item.id,
          name: item.fileName,
          type: fileExtension
        };
      });

      // Find the correct location in the data structure to update
      let updated = false;

      // Look through all main categories
      updatedData.forEach(main => {
        main.categories.forEach(category => {
          // Check if this is a category with direct files
          if (category.id === folderId && category.files) {
            category.files = fileItems;
            updated = true;
          }

          // Check in subcategories
          category.subCategories?.forEach(subCategory => {
            if (subCategory.id === folderId) {
              subCategory.files = fileItems;
              updated = true;
            }
          });
        });
      });

      if (!updated) {
        console.warn(
          `Could not find folder with ID ${folderId} in data structure`
        );
      }
    });

    // Update the state with the new data
    setData(updatedData);
  };

  // Fetch real data from API
  const fetchFileStructure = async () => {
    // Initialize with mock structure
    setData(mockData);

    // Then fetch real attachments from API
    await fetchAttachments();
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

  // After successful upload, refresh the attachments from backend
  const handleUploadSuccess = async () => {
    await fetchAttachments();
  };

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
      // These are files that are still in the UI (haven't been deleted)
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

      // If there are existing files, add them with their IDs (empty data)
      // This tells backend to keep these files
      if (existingFiles.length > 0) {
        existingFiles.forEach(file => {
          piAttachmentRequests.push({
            id: file.id,
            data: ''
          });
        });
      }

      // Add new files with null ID and base64 data
      for (const file of newFiles) {
        const base64Data = await getBase64(file);
        piAttachmentRequests.push({
          id: null,
          data: base64Data
        });
      }

      // Make the API call using the service
      // Even if there are no files, we send an empty array to indicate all files should be deleted
      const response = await uploadPIAttachments(
        piId,
        piAttachmentRequests,
        folderToAttachmentTypeMap[nodeId]
      );

      if (response.success) {
        // Clear selected files for this node
        setSelectedFiles(prev => ({
          ...prev,
          [nodeId]: []
        }));

        // Refresh attachments from backend
        await handleUploadSuccess();
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

  // Modify handleDeleteFile to show confirmation modal
  const handleDeleteFile = async (
    fileId: string,
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => {
    setFileToDelete({ fileId, nodeId, parentNodeType });
    setShowDeleteConfirm(true);
  };

  // Add new function to handle confirmed deletion
  const handleConfirmedDelete = async () => {
    if (!fileToDelete) return;

    const { fileId, nodeId, parentNodeType } = fileToDelete;

    // Remove from UI
    setData(prevData => {
      return prevData.map(mainCategory => {
        return {
          ...mainCategory,
          categories: mainCategory.categories.map(category => {
            if (parentNodeType === 'category' && category.id === nodeId) {
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

    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  // Modify toggleEditMode to show save confirmation
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

  // Add new function to handle confirmed save
  const handleConfirmedSave = async () => {
    if (nodeToSave) {
      await uploadFilesToAPI(nodeToSave);
      setShowSaveConfirm(false);
      setNodeToSave(null);
    }
  };

  // Function to convert file to Base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          // Return the complete data URL including the MIME type prefix
          resolve(reader.result.toString());
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
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

  // Yardımcı fonksiyon: Data URL'den dosya indirme
  function downloadDataUrlFile(dataUrl: string, fileName: string) {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 100);
  }

  // Function to handle file view
  const handleViewFile = async (
    fileId: string,
    ext: string,
    previewOnly = false
  ) => {
    try {
      setViewingFile(fileId);
      let attachmentType = '';
      let fileName = '';
      data.forEach(main => {
        main.categories.forEach(category => {
          if (category.files) {
            const foundFile = category.files.find(file => file.id === fileId);
            if (foundFile) {
              attachmentType = folderToAttachmentTypeMap[category.id];
              fileName = foundFile.name;
            }
          }
          category.subCategories?.forEach(subCategory => {
            const foundFile = subCategory.files.find(
              file => file.id === fileId
            );
            if (foundFile) {
              attachmentType = folderToAttachmentTypeMap[subCategory.id];
              fileName = foundFile.name;
            }
          });
        });
      });
      if (!attachmentType) {
        console.error('Could not determine attachment type for file:', fileId);
        return;
      }
      const response = await getPiSelectedAttachments(fileId, attachmentType);
      if (response && response.success && response.data) {
        const dataUrl = response.data.data;
        let downloadName = response.data.fileName || fileName || 'dosya';
        const arr = dataUrl.split(',');
        const mimeMatch = arr[0].match(/data:(.*?);/);
        let mime = '';
        if (mimeMatch && mimeMatch[1]) {
          mime = mimeMatch[1];
        }
        // PDF ise yeni sekmede aç, diğerlerinde indir
        if (previewOnly && (ext === 'pdf' || mime === 'application/pdf')) {
          const win = window.open();
          if (win) {
            win.document.write(`
              <style>body{margin:0;}</style>
              <iframe src='${dataUrl}' frameborder='0' style='width:100vw;height:100vh;'></iframe>
            `);
          } else {
            window.location.href = dataUrl;
          }
        } else {
          downloadDataUrlFile(dataUrl, downloadName);
        }
      } else {
        console.error('Failed to fetch file data:', response?.message);
      }
    } catch (error) {
      console.error('Error viewing file:', error);
    } finally {
      setViewingFile(null);
    }
  };

  // Helper function to download a file
  const downloadFile = (blob: Blob, fileName: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL after download
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 100);
  };

  // Function to get the MIME type based on file extension
  const getMimeType = (fileType: string): string => {
    const type = fileType.toLowerCase();
    switch (type) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'txt':
        return 'text/plain';
      default:
        return 'application/octet-stream';
    }
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
      return null; // Return nothing instead of "No files available" to save space
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
            <div className="d-flex flex-column gap-2">
              {files.map(file => {
                // Dosya uzantısını güvenli şekilde al
                const ext = file.name.split('.').pop()?.toLowerCase() || '';
                return (
                  <div
                    key={`existing-${nodeId}-${file.id}-${file.name}`}
                    className="file-item"
                  >
                    <div className="d-flex align-items-center border rounded p-1">
                      <FontAwesomeIcon
                        icon={getFileIcon(ext)}
                        className="me-1 text-secondary"
                        size="sm"
                      />
                      <span
                        className="small file-name cursor-pointer"
                        onClick={() => handleViewFile(file.id, ext)}
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
                      {/* Eye icon always visible for preview/download */}
                      <Button
                        variant="link"
                        className="ms-1 text-primary p-1"
                        title={ext === 'pdf' ? 'Preview PDF' : 'Download'}
                        onClick={e => {
                          e.stopPropagation();
                          handleViewFile(file.id, ext, true);
                        }}
                        disabled={viewingFile === file.id}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <div className="ms-auto d-flex">
                        {isEditing && (
                          <Button
                            variant="link"
                            className="text-danger p-1"
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
                  </div>
                );
              })}
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

                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode('clients-po', 'subcategory')}

                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-po');
                                }}
                                // disabled={isUploading['clients-po']}
                                disabled
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
                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode(
                                'clients-swift',
                                'subcategory'
                              )}
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
                        </ListGroup.Item>
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
                        <ListGroup.Item
                          className="py-1 px-2"
                          action
                          onClick={() =>
                            handleSelectNode(
                              'docs-client',
                              'received',
                              'clients-pi'
                            )
                          }
                          active={
                            selectedCategory.mainId === 'docs-client' &&
                            selectedCategory.categoryId === 'sent' &&
                            selectedCategory.subCategoryId === 'clients-pi'
                          }
                        >
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon
                              icon={faFolder}
                              className="me-2"
                              size="sm"
                              style={{ color: '#f8d775' }}
                            />
                            <span className="small">Client's PI</span>
                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode('clients-pi', 'subcategory')}

                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-pi');
                                }}
                                //disabled={isUploading['clients-pi']}
                                disabled
                              >
                                <FontAwesomeIcon
                                  icon={
                                    editModes['clients-pi'] ? faSave : faEdit
                                  }
                                />
                                {isUploading['clients-pi'] && (
                                  <span
                                    className="spinner-border spinner-border-sm ms-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                )}
                              </Button>
                              {editModes['clients-pi'] && (
                                <Form.Group
                                  controlId="fileUpload-clients-pi"
                                  className="d-inline-block ms-1"
                                >
                                  <Form.Label
                                    className={`btn btn-outline-primary py-1 px-2 mb-0 ${
                                      isUploading['clients-pi']
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
                                          'clients-pi'
                                        )
                                      }
                                      style={{ display: 'none' }}
                                      disabled={isUploading['clients-pi']}
                                    />
                                  </Form.Label>
                                </Form.Group>
                              )}
                            </div>
                          </div>
                        </ListGroup.Item>
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

                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode(
                                'official-invoice',
                                'subcategory'
                              )}
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('official-invoice');
                                }}
                                //disabled={isUploading['official-invoice']}
                                disabled
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
                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode('clients-awb', 'subcategory')}

                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('clients-awb');
                                }}
                                //disabled={isUploading['clients-awb']}
                                disabled
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
                            <div className="d-flex gap-2 ms-auto align-items-center">
                              {renderFilesForNode(
                                'packing-list',
                                'subcategory'
                              )}
                              <Button
                                variant="outline-primary"
                                className="py-1 px-2"
                                onClick={e => {
                                  e.stopPropagation();
                                  toggleEditMode('packing-list');
                                }}
                                //disabled={isUploading['packing-list']}
                                disabled
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
                        {/* Supplier received docs here */}
        {/*
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
                                <div className="d-flex gap-2 ms-auto align-items-center">
                                  {renderFilesForNode(
                                    subCategory.id,
                                    'subcategory'
                                  )}
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
                          icon={faArrowCircleUp}
                          className="me-2"
                          size="lg"
                          style={{ color: '#1976D2' }}
                        />
                        <span className="fs-7">Sent</span>
                      </Card.Header>
                      <ListGroup variant="flush">
                        {/* Supplier sent docs here */}
        {/*
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
                                <div className="d-flex gap-2 ms-auto align-items-center">
                                  {renderFilesForNode(
                                    subCategory.id,
                                    'subcategory'
                                  )}
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
                        {/* FF docs here */}
        {/*
                        {data[2].categories.map(category => (
                          <ListGroup.Item
                            key={category.id}
                            className="py-1 px-2"
                            action
                            onClick={() =>
                              handleSelectNode('docs-ff-received', category.id)
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
                                        isUploading[category.id]
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
                        {/* FF docs here */}
        {/*
                        {data[3].categories.map(category => (
                          <ListGroup.Item
                            key={category.id}
                            className="py-1 px-2"
                            action
                            onClick={() =>
                              handleSelectNode('docs-ff-send', category.id)
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
                                        isUploading[category.id]
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
            renderVerticalFileManager()
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmedDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal show={showSaveConfirm} onHide={() => setShowSaveConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Save Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save these changes? This will update the
          files in this folder.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmedSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PIListFileUpload;
