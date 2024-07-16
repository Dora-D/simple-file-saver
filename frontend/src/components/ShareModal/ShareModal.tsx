import React, { useState } from "react";
import {
  Modal,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useCreatePermissionMutation } from "../../services/permissionsApi";
import {
  CreatePermissionRequest,
  EPermissionType,
  PermissionType,
} from "../../types/permission.type";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  fileId?: number;
  folderId?: number;
}

const ShareModal: React.FC<ShareModalProps> = ({
  open,
  onClose,
  fileId,
  folderId,
}) => {
  const [email, setEmail] = useState("");
  const [permissionType, setPermissionType] = useState<PermissionType>(
    EPermissionType.VIEW
  );
  const [createPermission, { isLoading }] = useCreatePermissionMutation();

  const handleShare = async () => {
    const permissionData: CreatePermissionRequest = {
      email,
      fileId,
      folderId,
      type: permissionType,
    };
    try {
      await createPermission(permissionData).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create permission:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        spacing={3}
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
          Share {fileId ? "File" : "Folder"}
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel
            sx={{ top: "-10px", left: "-13px" }}
            id="permission-type-label"
          >
            Permission Type
          </InputLabel>
          <Select
            labelId="permission-type-label"
            // id="permission-type-select"
            value={permissionType}
            variant="outlined"
            onChange={(e) =>
              setPermissionType(e.target.value as PermissionType)
            }
          >
            <MenuItem value={EPermissionType.VIEW}>View</MenuItem>
            <MenuItem value={EPermissionType.EDIT}>Edit</MenuItem>
          </Select>
        </FormControl>
        <Stack direction={"row"} justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleShare}
            disabled={isLoading || !email || !permissionType}
          >
            Share
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ShareModal;
