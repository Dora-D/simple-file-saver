import { FC, ReactNode } from "react";
import { Box } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";

interface ILayout {
  children: ReactNode;
}

const Layout: FC<ILayout> = ({ children }) => {
  return (
    <Box minHeight={"100vh"} display={"flex"}>
      <Sidebar />
      <Box flex={"1"}>{children}</Box>
    </Box>
  );
};

export default Layout;
