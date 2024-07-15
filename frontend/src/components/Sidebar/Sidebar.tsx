import { Box, Stack, TextField, Typography } from "@mui/material";
import { grey, green } from "@mui/material/colors";
import { useAppDispatch } from "../../hooks/reduxAppHooks";
import debounce from "lodash.debounce";
import { setSearchQuery } from "../../redux/store/slices/searchSlice";
import CreateButton from "../CreateButton/CreateButton";

const Sidebar = () => {
  const dispatch = useAppDispatch();

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
      borderColor={grey[500]}
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
    </Stack>
  );
};

export default Sidebar;
