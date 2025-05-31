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
    if (getUser().role === "admin") {
      setMenuItems([
        ...menuItems,
        { text: "Пользователи", path: "/user_list" },
      ]);
    }
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
