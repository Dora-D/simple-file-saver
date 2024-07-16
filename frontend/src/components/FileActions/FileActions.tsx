import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import DownloadIcon from "@mui/icons-material/Download";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { File } from "../../types/file.type";
import {
  useCloneFileMutation,
  useDeleteFileMutation,
  useDownloadFileQuery,
} from "../../services/fileManagerApi";
import EditFileModal from "../EditFileModal/EditFileModal";
import ShareModal from "../ShareModal/ShareModal";
import ViewPermissionsModal from "../ViewPermissionsModal/ViewPermissionsModal";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { useLocation } from "react-router-dom";
import { EPermissionType } from "../../types/permission.type";
import { useAppSelector } from "../../hooks/reduxAppHooks";

interface FileActionsProps {
  file: File;
}

const FileActions: React.FC<FileActionsProps> = ({ file }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();
  const isAvailable = pathname.includes("available-to-me");
  // TODO: need to change or no use in rtk
  const { refetch: downloadFile } = useDownloadFileQuery(file.id);
  const [deleteFile] = useDeleteFileMutation();
  const [cloneFile] = useCloneFileMutation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const userId = useAppSelector(({ user }) => user.currentUser?.id);

  const isUserOwner = file.owner.id === userId;

  //TOFO: Nedda changes
  const isUserCanEdit = isUserOwner
    ? true
    : isAvailable
    ? !!file?.permissions?.some(({ type }) => type === EPermissionType.EDIT)
    : true;

  const handleDelete = () => {
    setIsConfirmDeleteModalOpen(true);
  };

  const handleViewPermissions = () => {
    setIsPermissionsModalOpen(true);
  };

  const handleClosePermissionsModal = () => {
    setIsPermissionsModalOpen(false);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    downloadFile()
      .unwrap()
      .then((data) => {
        const blob = new Blob([data], { type: file.type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      });
  };

  const handleCopyLink = () => {
    const baseUrl = `${window.location.origin}/drive/available-to-me`;
    const link = `${baseUrl}/file/${file.id}`;
    navigator.clipboard.writeText(link);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFile(file.id).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  const handleClone = async () => {
    try {
      await cloneFile(file.id).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        {isUserOwner && (
          <MenuItem onClick={handleShare}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share</ListItemText>
          </MenuItem>
        )}
        {isUserOwner && (
          <MenuItem onClick={handleViewPermissions}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Permissions</ListItemText>
          </MenuItem>
        )}
        {isUserCanEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {isUserCanEdit && (
          <MenuItem onClick={handleClone}>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Clone</ListItemText>
          </MenuItem>
        )}
        {isUserOwner && (
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <ContentPasteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Link</ListItemText>
        </MenuItem>
      </Menu>
      <ConfirmDeleteModal
        open={isConfirmDeleteModalOpen}
        onClose={() => setIsConfirmDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={file.name}
        itemType="file"
      />
      <ViewPermissionsModal
        open={isPermissionsModalOpen}
        onClose={handleClosePermissionsModal}
        fileId={file.id}
      />
      <ShareModal
        open={isShareModalOpen}
        onClose={handleCloseShareModal}
        fileId={file.id}
      />
      <EditFileModal
        fileId={file.id}
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        initialName={file.name}
        initialIsPublic={file.isPublic}
      />
    </>
  );
};

export default FileActions;