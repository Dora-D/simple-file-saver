import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  useDeletePermissionMutation,
  useGetPermissionsByFileIdQuery,
  useGetPermissionsByFolderIdQuery,
} from "../../services/permissionsApi";
import DeleteIcon from "@mui/icons-material/Delete";

interface ViewPermissionsModalProps {
  open: boolean;
  onClose: () => void;
  fileId?: number;
  folderId?: number;
}

const ViewPermissionsModal: React.FC<ViewPermissionsModalProps> = ({
  open,
  onClose,
  fileId,
  folderId,
}) => {
  const { data: filePermissions } = useGetPermissionsByFileIdQuery(
    fileId ?? 0,
    { skip: !fileId }
  );
  const { data: folderPermissions } = useGetPermissionsByFolderIdQuery(
    folderId ?? 0,
    { skip: !folderId }
  );

  const [deletePermission] = useDeletePermissionMutation();

  const handleDeletePermission = async (permissionId: number) => {
    try {
      await deletePermission(permissionId).unwrap();
    } catch (error) {
      console.error("Failed to delete permission:", error);
    }
  };

  const permissions = fileId ? filePermissions : folderPermissions;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Permissions for {fileId ? "File" : "Folder"}
        </Typography>
        <List>
          {permissions?.length ? (
            permissions.map((permission) => (
              <React.Fragment key={permission.id}>
                <ListItem
                  secondaryAction={
                    <Tooltip title="Delete Permission">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeletePermission(permission.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText
                    primary={permission.user.email}
                    secondary={permission.type}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="body1">No Permissions</Typography>
          )}
        </List>
      </Box>
    </Modal>
  );
};

export default ViewPermissionsModal;
