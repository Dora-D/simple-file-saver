import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  useGetPermissionsByFileIdQuery,
  useGetPermissionsByFolderIdQuery,
} from "../../services/permissionsApi";

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
          {permissions?.map((permission) => (
            <React.Fragment key={permission.id}>
              <ListItem>
                <ListItemText
                  primary={permission.user.email}
                  secondary={permission.type}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default ViewPermissionsModal;
