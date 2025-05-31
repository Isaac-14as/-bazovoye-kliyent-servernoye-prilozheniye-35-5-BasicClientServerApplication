import "dayjs/locale/ru";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "../components/Header";

export const Main = () => {
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Header />
    </Box>
  );
};
