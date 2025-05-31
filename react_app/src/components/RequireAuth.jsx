import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authConstants } from "../api/auth-axios";

export const RequireAuth = observer(({ children }) => {
  if (!localStorage.getItem(authConstants.tokenString)) {
    return <Navigate to={"/login"} />;
  }

  return children;
});
