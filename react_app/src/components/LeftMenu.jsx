import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../helpers/helpers";

export const LeftMenu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    let menuItemsList = [];
    if (getUser().role === "admin") {
      menuItemsList.push({ text: "Пользователи", path: "/users" });
    }
    if (getUser().role === "admin" || getUser().role === "purchaser") {
      menuItemsList.push({ text: "Товары", path: "/products" });
    }

    setMenuItems(menuItemsList);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        mt: "100px",
        minHeight: "calc(100vh - 100px)",
        width: "240px",
        bgcolor: "background.paper",
        boxShadow: 3,
        zIndex: 1000,
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
