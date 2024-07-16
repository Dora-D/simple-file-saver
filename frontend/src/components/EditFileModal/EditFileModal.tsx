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
import { useUpdateFileMutation } from "../../services/fileManagerApi";
import { FileUpdate } from "../../types/file.type";

interface EditFileModalProps {
  fileId: number;
  initialName: string;
  initialIsPublic: boolean;
  open: boolean;
  initialFolderId?: number;
  onClose: () => void;
}

const EditFileModal: React.FC<EditFileModalProps> = ({
  open,
  fileId,
  initialName,
  initialIsPublic,
  initialFolderId,
  onClose,
}) => {
  const [fileName, setFileName] = useState(initialName);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [updateFile, { isLoading }] = useUpdateFileMutation();

  useEffect(() => {
    setFileName(initialName);
    setIsPublic(initialIsPublic);
  }, [initialName, initialIsPublic, initialFolderId]);

  const handleUpdateFile = async () => {
    try {
      const updatedFileData: FileUpdate = {
        name: fileName,
        isPublic,
      };
      await updateFile({ id: fileId, data: updatedFileData }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update file:", error);
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
          Edit File
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
          label="File Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        <Stack direction={"row"} justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateFile}
            disabled={isLoading}
          >
            Update
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default EditFileModal;
