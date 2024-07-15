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
  IconButton,
  Tooltip,
  Backdrop,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "../../hooks/reduxAppHooks";
import { useSearchQuery } from "../../services/fileManagerApi";
import { formatFileSize } from "../../utilities/formatFileSize";
import { useNavigate, useParams } from "react-router-dom";

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
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>;
  }

  if (!data?.folder) {
    return null;
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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {folder.childFolders.map(({ name, id, owner, isPublic }) => (
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
                <Avatar
                  sx={{ width: 30, height: 30 }}
                  alt={owner.name}
                  src={owner.picture}
                />
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                <Tooltip title="Actions">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {folder.files.map(({ name, id, owner, size, isPublic, exp }) => (
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
                <Avatar
                  sx={{ width: 30, height: 30 }}
                  alt={owner.name}
                  src={owner.picture}
                />
              </TableCell>
              <TableCell>{exp.split(".")[1]}</TableCell>
              <TableCell>{formatFileSize(size)}</TableCell>
              <TableCell>
                <Tooltip title="Actions">
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DriveTable;
