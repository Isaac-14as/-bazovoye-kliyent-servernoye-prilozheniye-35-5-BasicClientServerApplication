import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import { authAxios } from "../api/auth-axios";
import { showDefaultSnack } from "../components/DefaultSnack";

export const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    role: "",
    password: "",
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Формируем данные для отправки
    const dataToSend = {
      username: formData.username,
      full_name: formData.full_name,
      role: formData.role,
      password: formData.password,
    };

    try {
      await authAxios({
        url: `http://127.0.0.1:8000/users/register`,
        method: "POST",
        data: dataToSend,
      });
      showDefaultSnack(
        enqueueSnackbar,
        "Пользователь успешно зарегистрирован",
        "success"
      );
    } catch (e) {
      showDefaultSnack(enqueueSnackbar, e.response.data.detail, "error");
      console.error(e);
    }
  };

  const roles = [
    { value: "admin", label: "Администратор" },
    { value: "purchaser", label: "Покупатель" },
    { value: "seller", label: "Продавец" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: "240px", // Отступ для бокового меню
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
          Регистрация нового пользователя
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Логин"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="full_name"
            label="ФИО"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Роль</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Роль"
              onChange={handleChange}
              required
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Добавляем поле для пароля */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/users")}
            >
              Отмена
            </Button>
            <Button type="submit" fullWidth variant="contained">
              Создать
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
