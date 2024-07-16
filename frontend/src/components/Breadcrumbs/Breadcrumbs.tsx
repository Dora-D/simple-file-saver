import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/reduxAppHooks";
import { useSearchQuery } from "../../services/fileManagerApi";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import {
  Link,
  Typography,
  Breadcrumbs as MaterialBreadcrumbs,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const isAvailable = pathname.includes("available-to-me");

  const initianBreadcrumb = [
    <Link
      key={"drive"}
      underline="none"
      color={blueGrey[900]}
      component={RouterLink}
      to={isAvailable ? "/drive/available-to-me" : "/drive"}
    >
      <Typography variant="h5">My Drive</Typography>
    </Link>,
  ];

  const [breadcrumbs, setBreadcrumbs] = useState(initianBreadcrumb);

  const params = useParams();

  const { searchIn, query } = useAppSelector(({ search }) => search);

  const { data, isError } = useSearchQuery({
    query,
    searchIn,
    folderId: params.folderId ? +params.folderId : undefined,
  });

  useEffect(() => {
    if (data?.breadcrumbs && data.breadcrumbs.length) {
      const to = isAvailable ? "/drive/available-to-me" : "/drive";
      const newBreadcrumbs = data.breadcrumbs.map(
        ({ folderId, folderName }) => (
          <Link
            key={"drive" + folderId + folderName}
            underline="none"
            color={blueGrey[900]}
            component={RouterLink}
            to={`${to}/folder/${folderId}`}
          >
            <Typography variant="h5">{folderName}</Typography>
          </Link>
        )
      );
      setBreadcrumbs([...initianBreadcrumb, ...newBreadcrumbs]);
    }
    if (!params.folderId) {
      setBreadcrumbs(initianBreadcrumb);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, params]);

  if (isError || !data) {
    return null;
  }

  return (
    <MaterialBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </MaterialBreadcrumbs>
  );
};

export default Breadcrumbs;
