import { useState, useEffect } from 'react';
import {
  uploadPIAttachments,
  getPiAttachments,
  getPiSelectedAttachments
} from 'smt-v1-app/services/PIServices';
import {
  mockData,
  folderToAttachmentTypeMap
} from '../constants/PIListFileUpload.constants';
import {
  getAttachmentTypeToFolderMap,
  getBase64,
  extractFileInfoFromBase64
} from '../utils/PIListFileUpload.utils';
import {
  MainCategory,
  SelectedCategory,
  FileToDelete,
  AttachmentType,
  FileItem
} from '../../../../types/PIListFileUpload.types';

export const usePIListFileUpload = (piId: string, show: boolean) => {
  const [data, setData] = useState<MainCategory[]>(mockData);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileToDelete | null>(null);
  const [nodeToSave, setNodeToSave] = useState<string | null>(null);

  // Track deleted files for each node
  const [deletedFiles, setDeletedFiles] = useState<{ [key: string]: string[] }>(
    {}
  );

  // Get the inverse mapping from attachment type to folder ID
  const attachmentTypeToFolderMap = getAttachmentTypeToFolderMap();

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

      // Get deleted files for this node
      const deletedFileIds = deletedFiles[nodeId] || [];

      // Prepare the attachment requests array
      const piAttachmentRequests: AttachmentType[] = [];

      // If there are existing files, add them with their IDs (empty data)
      // This tells backend to keep these files
      if (existingFiles.length > 0) {
        existingFiles.forEach(file => {
          piAttachmentRequests.push({
            id: file.id,
            data: '',
            fileName: file.name
          });
        });
      }

      // Add new files with null ID and base64 data
      for (const file of newFiles) {
        const base64Data = await getBase64(file);
        piAttachmentRequests.push({
          id: null,
          data: base64Data,
          fileName: file.name
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

        // Clear deleted files for this node
        setDeletedFiles(prev => ({
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

      // Find the file and its attachment type
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

        // Extract file info from base64 data URL
        const { mimeType, extension, base64Data } =
          extractFileInfoFromBase64(dataUrl);

        // If fileName doesn't have extension, add it from MIME type
        if (!downloadName.includes('.')) {
          downloadName = `${downloadName}.${extension}`;
        }

        // PDF ise yeni sekmede aç, diğerlerinde indir
        if (
          previewOnly &&
          (extension === 'pdf' || mimeType === 'application/pdf')
        ) {
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
          // Create blob and download
          const bstr = atob(base64Data);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], { type: mimeType });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = downloadName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(link.href), 100);
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

  // Function to delete a file from frontend
  const deleteFileFromFrontend = (fileId: string, nodeId: string) => {
    // Add to deleted files list
    setDeletedFiles(prev => ({
      ...prev,
      [nodeId]: [...(prev[nodeId] || []), fileId]
    }));

    // Remove from data state
    setData(prevData => {
      const newData = [...prevData];

      newData.forEach(main => {
        main.categories.forEach(category => {
          if (category.files) {
            category.files = category.files.filter(file => file.id !== fileId);
          }
          category.subCategories?.forEach(subCategory => {
            if (subCategory.files) {
              subCategory.files = subCategory.files.filter(
                file => file.id !== fileId
              );
            }
          });
        });
      });

      return newData;
    });
  };

  // Function to handle file deletion
  const deleteFile = (
    fileId: string,
    nodeId: string,
    parentNodeType: 'category' | 'subcategory'
  ) => {
    setFileToDelete({ fileId, nodeId, parentNodeType });
    setShowDeleteConfirm(true);
  };

  // Function to handle confirmed deletion
  const confirmDelete = async () => {
    if (!fileToDelete) return;

    const { fileId, nodeId } = fileToDelete;

    // Delete from frontend immediately
    deleteFileFromFrontend(fileId, nodeId);

    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  // Initialize states when modal opens
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

  return {
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
  };
};
