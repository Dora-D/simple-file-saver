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
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  useCloneFolderMutation,
  useDeleteFolderMutation,
} from "../../services/fileManagerApi";
import { Folder } from "../../types/folder.type";
import EditFolderModal from "../EditFolderModal/EditFolderModal";
import ShareModal from "../ShareModal/ShareModal";
import ViewPermissionsModal from "../ViewPermissionsModal/ViewPermissionsModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxAppHooks";
import { EPermissionType } from "../../types/permission.type";

interface FolderActionsProps {
  folder: Folder;
}

const FolderActions: React.FC<FolderActionsProps> = ({ folder }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { pathname } = useLocation();
  const isAvailable = pathname.includes("available-to-me");
  const [deleteFolder] = useDeleteFolderMutation();
  const [cloneFolder] = useCloneFolderMutation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const userId = useAppSelector(({ user }) => user.currentUser?.id);

  const isUserOwner = folder.owner.id === userId;
  //TOFO: Nedda changes
  const isUserCanEdit = isUserOwner
    ? true
    : isAvailable
    ? !!folder?.permissions?.some(({ type }) => type === EPermissionType.EDIT)
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

  const handleConfirmDelete = async () => {
    try {
      await deleteFolder(folder.id).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  const handleClone = async () => {
    try {
      await cloneFolder(folder.id).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      handleMenuClose();
    }
  };

  const handleCopyLink = () => {
    const baseUrl = `${window.location.origin}/drive/available-to-me`;
    const link = `${baseUrl}/folder/${folder.id}`;
    navigator.clipboard.writeText(link);
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
        itemName={folder.name}
        itemType="folder"
      />
      <ViewPermissionsModal
        open={isPermissionsModalOpen}
        onClose={handleClosePermissionsModal}
        folderId={folder.id}
      />
      <ShareModal
        open={isShareModalOpen}
        onClose={handleCloseShareModal}
        folderId={folder.id}
      />
      <EditFolderModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        folderId={folder.id}
        initialName={folder.name}
        initialIsPublic={folder.isPublic}
      />
    </>
  );
};

export default FolderActions;
