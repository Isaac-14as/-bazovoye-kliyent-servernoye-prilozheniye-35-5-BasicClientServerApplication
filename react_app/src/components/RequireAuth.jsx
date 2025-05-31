import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authConstants } from "../api/auth-axios";
import { Header } from "./Header";
import { LeftMenu } from "./LeftMenu";
import { Box } from "@mui/material";

export const RequireAuth = observer(({ children }) => {
  if (!localStorage.getItem(authConstants.tokenString)) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Header />
      <LeftMenu />
      <Box>{children}</Box>
    </>
  );
});
