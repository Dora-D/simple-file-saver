import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
  Avatar,
  Stack,
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useAppSelector } from "../../hooks/reduxAppHooks";
import { useSearchQuery } from "../../services/fileManagerApi";
import { formatFileSize } from "../../utilities/formatFileSize";
import { useNavigate, useParams } from "react-router-dom";
import FolderActions from "../FolderActions/FolderActions";
import FileActions from "../FileActions/FileActions";
import { blueGrey } from "@mui/material/colors";

const DriveTable: React.FC = () => {
  let { folderId } = useParams();
  const navigate = useNavigate();

  const { searchIn, query } = useAppSelector(({ search }) => search);

  const { data, isLoading } = useSearchQuery({
    query,
    searchIn,
    folderId: folderId ? +folderId : undefined,
  });

  const handleFolderClick = (folderId: number) => {
    const to =
      searchIn === "own"
        ? `/drive/folder/${folderId}`
        : `/drive/available-to-me/folder/${folderId}`;

    navigate(to);
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (
    !data?.folder ||
    (!data.folder?.files?.length && !data.folder.childFolders.length)
  ) {
    return (
      <Box
        width={"100%"}
        height={"200px"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color={blueGrey[900]} variant="h5">
          Sorry, but you no have any files or folders
        </Typography>
      </Box>
    );
  }

  const { folder } = data;

  return (
    <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Public</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>File Type</TableCell>
            <TableCell>File Size</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {folder.childFolders.map((folder) => {
            const { name, id, owner, isPublic } = folder;
            return (
              <TableRow
                key={id + name}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleFolderClick(id)}
              >
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FolderIcon />
                    <Typography variant="body2" component="span">
                      {name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{isPublic ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems={"center"} spacing={1}>
                    <Avatar
                      sx={{ width: 30, height: 30 }}
                      alt={owner.name}
                      src={owner.picture}
                    />
                    <Typography variant="body2">{owner.email}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <FolderActions folder={folder} />
                </TableCell>
              </TableRow>
            );
          })}
          {folder.files.map((file) => {
            const { name, id, owner, size, isPublic, exp } = file;
            return (
              <TableRow key={id + name} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InsertDriveFileIcon />
                    <Typography variant="body2" component="span">
                      {name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography>{isPublic ? "Yes" : "No"}</Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems={"center"} spacing={1}>
                    <Avatar
                      sx={{ width: 30, height: 30 }}
                      alt={owner.name}
                      src={owner.picture}
                    />
                    <Typography variant="body2">{owner.email}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{exp.split(".")[1]}</TableCell>
                <TableCell>{formatFileSize(size)}</TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <FileActions file={file} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DriveTable;
