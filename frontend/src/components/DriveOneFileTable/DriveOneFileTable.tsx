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
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useGetFileByIdQuery } from "../../services/fileManagerApi";
import { formatFileSize } from "../../utilities/formatFileSize";
import { useNavigate, useParams } from "react-router-dom";
import FileActions from "../FileActions/FileActions";
import { blueGrey } from "@mui/material/colors";

const DriveOneFileTable: React.FC = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetFileByIdQuery(fileId ? +fileId : 0);

  if (!fileId) {
    navigate("/drive");
    return null;
  }

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

  if (!data) {
    return (
      <Box
        width={"100%"}
        height={"200px"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color={blueGrey[900]} variant="h5">
          This file does not exist or you do not have permission to access it.
          Please request access from the owner.
        </Typography>
      </Box>
    );
  }

  const { id, name, isPublic, owner, exp, size } = data;

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
              <FileActions file={data} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DriveOneFileTable;
