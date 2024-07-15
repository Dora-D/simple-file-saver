import { Chip, Stack, TextField, Typography } from "@mui/material";
import { green, blueGrey } from "@mui/material/colors";
import { useAppDispatch } from "../../hooks/reduxAppHooks";
import debounce from "lodash.debounce";
import {
  setSearchIn,
  setSearchQuery,
} from "../../redux/store/slices/searchSlice";
import CreateButton from "../CreateButton/CreateButton";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const isAvailable = pathname.includes("available-to-me");

  useEffect(() => {
    if (isAvailable) {
      dispatch(setSearchIn("available"));
    } else {
      dispatch(setSearchIn("own"));
    }
  }, [isAvailable, dispatch]);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      dispatch(setSearchQuery(value));
    },
    500
  );

  return (
    <Stack
      spacing={2}
      padding={"40px 20px"}
      width={400}
      borderRight={"1px solid"}
      borderColor={blueGrey[900]}
    >
      <Typography color={green[900]} variant="h4">
        VrealSoft Test Task
      </Typography>
      <CreateButton />
      <TextField
        fullWidth
        onChange={handleSearch}
        label="Search files and folders"
        variant="outlined"
      />
      <Chip
        sx={{ fontSize: "16px", height: "40px" }}
        component={Link}
        clickable
        to={"/drive"}
        label="My Files"
        variant="outlined"
        color={!isAvailable ? "success" : "default"}
      />
      <Chip
        sx={{ fontSize: "16px", height: "40px" }}
        component={Link}
        clickable
        to={"/drive/available-to-me"}
        label="Available to Me"
        variant="outlined"
        color={isAvailable ? "success" : "default"}
      />
    </Stack>
  );
};

export default Sidebar;
