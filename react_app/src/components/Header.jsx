import { Box, IconButton, Link, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { authAxios, authConstants } from "../api/auth-axios";
import { useNavigate } from "react-router-dom";
import { getUser } from "../helpers/helpers";
import { roles } from "../helpers/roles";

export const Header = ({}) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(authConstants.tokenString);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: "100px",
        backgroundColor: "#0d0d0d",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
      }}
    >
      <IconButton
        sx={{
          border: "2px solid #fff",
          borderRadius: "10%",
          p: 1.5,
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            transform: "scale(1.05)",
            borderColor: "#1976d2",
          },
        }}
        onClick={() => navigate("/products")}
      >
        <HomeIcon sx={{ color: "#fff", fontSize: "2rem" }} />
      </IconButton>
      <Box sx={{ fontSize: "20px" }}>Магазин стройматериалов </Box>
      <Box sx={{ fontSize: "20px" }}>
        <Link
          sx={{
            color: "white",
            fontSize: "20px",
            textDecoration: "none",
            mr: "5px",
          }}
        >
          {roles[getUser().role]}
        </Link>
        |
        <Link
          sx={{
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": { color: "#1976d2" },
            fontSize: "20px",
            textDecoration: "none",
            mx: "5px",
          }}
          onClick={() => navigate("/profile")}
        >
          {getUser().full_name}
        </Link>
        |
        <Link
          sx={{
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": { color: "#1976d2" },
            fontSize: "20px",
            textDecoration: "none",
            ml: "5px",
          }}
          onClick={() => logout()}
        >
          выход
        </Link>
      </Box>
    </Box>
  );
};
