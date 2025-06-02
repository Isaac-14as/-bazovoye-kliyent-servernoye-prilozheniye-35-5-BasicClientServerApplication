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
import { ProductList } from "../pages/ProductList";
import { UpdateProduct } from "../pages/UpdateProduct";
import { CreateProduct } from "../pages/CreateProduct";
import { SupplierList } from "../pages/SupplierList";
import { CreateSupplier } from "../pages/CreateSupplier";
import { UpdateSupplier } from "../pages/UpdateSupplier";

const router = createBrowserRouter([
  // Пользователи
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
    path: "users/update/:id",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <UpdateUser />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "users/create",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <CreateUser />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "users",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <UserList />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  // Товары
  {
    path: "products",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <ProductList />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "products/update/:id",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <UpdateProduct />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },

  {
    path: "products/create",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <CreateProduct />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },

  {
    path: "suppliers",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <SupplierList />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "suppliers/create",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <CreateSupplier />
        </RequireAuth>
      </SnackbarProvider>
    ),
  },
  {
    path: "suppliers/update/:id",
    element: (
      <SnackbarProvider maxSnack={3}>
        <RequireAuth>
          <UpdateSupplier />
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
