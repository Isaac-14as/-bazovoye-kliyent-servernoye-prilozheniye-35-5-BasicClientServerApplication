import { Box, IconButton, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { authAxios, authConstants } from "../api/auth-axios";
import { useNavigate } from "react-router-dom";

export const Header = ({}) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(authConstants.tokenString);
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <Box
      sx={{
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
      >
        <HomeIcon sx={{ color: "#fff", fontSize: "2rem" }} />
      </IconButton>
      <Box sx={{ fontSize: "20px" }}>Название</Box>
      <Box sx={{ fontSize: "20px" }}>
        {localStorage.getItem("username")} |{" "}
        <Link
          sx={{
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": { color: "#1976d2" },
            fontSize: "20px",
          }}
          onClick={() => logout()}
        >
          выход
        </Link>
      </Box>
    </Box>
  );
};
