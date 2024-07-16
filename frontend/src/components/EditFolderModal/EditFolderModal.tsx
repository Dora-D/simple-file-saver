import React, { useState, useEffect } from "react";
import {
  Modal,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import { useUpdateFolderMutation } from "../../services/fileManagerApi";
import { FolderUpdate } from "../../types/folder.type";

interface EditFolderModalProps {
  folderId: number;
  initialName: string;
  initialIsPublic: boolean;
  open: boolean;
  onClose: () => void;
}

const EditFolderModal: React.FC<EditFolderModalProps> = ({
  folderId,
  initialName,
  initialIsPublic,
  open,
  onClose,
}) => {
  const [folderName, setFolderName] = useState(initialName);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [updateFolder, { isLoading }] = useUpdateFolderMutation();

  useEffect(() => {
    setFolderName(initialName);
    setIsPublic(initialIsPublic);
  }, [initialName, initialIsPublic]);

  const handleUpdateFolder = async () => {
    try {
      const updatedFolderData: FolderUpdate = {
        name: folderName,
        isPublic,
      };
      await updateFolder({ id: folderId, data: updatedFolderData }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update folder:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        spacing={2}
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
          Edit Folder
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label="Public"
        />
        <TextField
          label="Folder Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Stack direction={"row"} justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateFolder}
            disabled={isLoading}
          >
            Update
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default EditFolderModal;
