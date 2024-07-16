import { Stack } from "@mui/material";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import DriveOneFileTable from "../DriveOneFileTable/DriveOneFileTable";
import Layout from "../Layout/Layout";

const FilePage = () => {
  return (
    <Layout>
      <Stack spacing={2} padding={"40px 20px"}>
        <Breadcrumbs />
        <DriveOneFileTable />
      </Stack>
    </Layout>
  );
};

export default FilePage;
