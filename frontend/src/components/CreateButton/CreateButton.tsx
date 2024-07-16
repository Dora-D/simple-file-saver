import React, { useState } from "react";
import { Button, Menu, MenuItem, Box, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateFolderModal from "../CreateFolderModal/CreateFolderModal";
import CreateFileModal from "../CreateFileModal/CreateFileModal";

const CreateButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = useState<"file" | "folder" | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenModal(null);
  };

  const handleCreateFile = () => {
    setOpenModal("file");
  };

  const handleCreateFolder = () => {
    setOpenModal("folder");
  };

  return (
    <Box>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClick}>
        Create
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleCreateFile}>File</MenuItem>
        <Divider />
        <MenuItem onClick={handleCreateFolder}>Folder</MenuItem>
      </Menu>
      {openModal === "file" && <CreateFileModal onClose={handleClose} />}
      {openModal === "folder" && <CreateFolderModal onClose={handleClose} />}
    </Box>
  );
};

export default CreateButton;
