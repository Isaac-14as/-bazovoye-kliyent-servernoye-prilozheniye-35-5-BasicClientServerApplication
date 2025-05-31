import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Main } from "../pages/Main";
import { Box } from "@mui/material";
import { Login } from "../pages/Login";
import { RequireAuth } from "../components/RequireAuth";
import { Profile } from "../pages/Profile";
import { UpdateUser } from "../pages/UpdateUser";
import { UserList } from "../pages/UserList";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "",
    element: (
      <RequireAuth>
        <Main />
      </RequireAuth>
    ),
  },
  {
    path: "profile",
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: "update_user/:id",
    element: (
      <RequireAuth>
        <UpdateUser />
      </RequireAuth>
    ),
  },
  {
    path: "user_list",
    element: (
      <RequireAuth>
        <UserList />
      </RequireAuth>
    ),
  },

  // {
  //   path: "/:id",
  //   element: (
  //     <Box>Вторая страница</Box>
  //   )
  // },
  {
    path: "*",
    element: <Box>404</Box>,
  },
]);

export const Router = () => {
  return <RouterProvider router={router}></RouterProvider>;
};
