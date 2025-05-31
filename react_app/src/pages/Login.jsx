import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAxios, authConstants } from "../api/auth-axios";
import axios from "axios";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const login = async () => {
      const params = new URLSearchParams();
      params.append("grant_type", "");
      params.append("username", username);
      params.append("password", password);
      params.append("scope", "");
      params.append("client_id", "");
      params.append("client_secret", "");

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/login",
          params,
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        localStorage.setItem(
          authConstants.tokenString,
          response.data.access_token
        );
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } catch (e) {
        setError(e.response.data.detail);
        console.error("Login error:", e);
      }
    };
    login();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
          Вход
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Логин"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
        </Box>
        <Typography
          textAlign="center"
          sx={{ height: "20px", my: "0px", color: "red" }}
        >
          {error}
        </Typography>
      </Paper>
    </Box>
  );
};
