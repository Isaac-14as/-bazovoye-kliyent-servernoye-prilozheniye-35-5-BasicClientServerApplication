import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Box } from "@mui/material";
import { SnackbarProvider } from "notistack";

import { Main } from "../pages/Main";
import { Login } from "../pages/Login";
import { RequireAuth } from "../components/RequireAuth";
import { Profile } from "../pages/Profile";
import { UpdateUser } from "../pages/UpdateUser";
import { UserList } from "../pages/UserList";
import { CreateUser } from "../pages/CreatUser";

const router = createBrowserRouter([
  {
    path: "login",
    element: (
      <SnackbarProvider maxSnack={3}>
        <Login />
      </SnackbarProvider>
    ),
  },
  {
    path: "",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <Main />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "profile",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <Profile />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "update_user/:id",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <UpdateUser />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "create_user",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <CreateUser />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "user_list",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <UserList />
        </RequireAuth>
      </SnackbarProvider>
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
