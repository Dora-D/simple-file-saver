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

interface FolderActionsProps {
  folder: Folder;
}

const FolderActions: React.FC<FolderActionsProps> = ({ folder }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteFolder] = useDeleteFolderMutation();
  const [cloneFolder] = useCloneFolderMutation();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

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

  const handleDelete = async () => {
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
      const clonedFolder = await cloneFolder(folder.id).unwrap();
      console.log("clonedFolder", clonedFolder);
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
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleViewPermissions}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Permissions</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClone}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clone</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
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
