import React, { useState } from "react";
import {
  Modal,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCreateFolderMutation } from "../../services/fileManagerApi";

const CreateFolderModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [folderName, setFolderName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const handleCreateFolder = async () => {
    try {
      await createFolder({ name: folderName, isPublic }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  return (
    <Modal open onClose={onClose}>
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
          Create New Folder
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
            onClick={handleCreateFolder}
            disabled={isLoading}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default CreateFolderModal;
