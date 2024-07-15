import Layout from "../Layout/Layout";
import { Stack } from "@mui/material";
import DriveTable from "../DriveTable/DriveTable";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";

const Drive = () => {
  return (
    <Layout>
      <Stack spacing={2} padding={"40px 20px"}>
        <Breadcrumbs />
        <DriveTable />
      </Stack>
    </Layout>
  );
};

export default Drive;
