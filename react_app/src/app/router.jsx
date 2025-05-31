import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Main } from "../pages/Main";
import { Box } from "@mui/material";
import { Login } from "../pages/Login";
import { RequireAuth } from "../components/RequireAuth";

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
