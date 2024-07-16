import React, { useState } from "react";
import {
  Modal,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import { useUploadFileMutation } from "../../services/fileManagerApi";
import { FileUpload } from "../../types/file.type";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useParams } from "react-router-dom";

const CreateFileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const params = useParams();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleCreateFile = async () => {
    if (file) {
      const fileUploadData: FileUpload = {
        isPublic,
        folderId: params?.folderId,
      };
      try {
        await uploadFile({ file, data: fileUploadData }).unwrap();
        onClose();
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
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
          Upload New File
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
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
        >
          {file ? file.name : "Choose File"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Stack direction={"row"} justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateFile}
            disabled={!file || isLoading}
          >
            Upload
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default CreateFileModal;
