import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { Box, Breadcrumbs, Link, Stack, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSearchQuery } from "../../services/fileManagerApi";
import { useAppSelector } from "../../hooks/reduxAppHooks";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import DriveTable from "../DriveTable/DriveTable";

const Drive = () => {
  const location = useLocation();

  const [breadcrumbs, setBreadcrumbs] = useState([
    <Link
      key={"drive"}
      underline="none"
      color={blueGrey[900]}
      component={RouterLink}
      to={"/drive"}
    >
      <Typography variant="h5">My Drive</Typography>
    </Link>,
  ]);

  const { searchIn, query } = useAppSelector(({ search }) => search);

  const { data } = useSearchQuery({ query, searchIn });

  console.log(data);

  return (
    <Layout>
      <Stack spacing={2} padding={"40px 20px"}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <DriveTable />
      </Stack>
    </Layout>
  );
};

export default Drive;
