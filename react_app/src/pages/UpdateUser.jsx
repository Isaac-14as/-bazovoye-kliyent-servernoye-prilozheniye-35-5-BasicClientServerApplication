import { useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { authAxios } from "../api/auth-axios";
import { useSnackbar } from "notistack";
import { showDefaultSnack } from "../components/DefaultSnack";

export const UpdateUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    role: "",
    id: null,
    password: "", // Добавляем поле для пароля
  });
  const [passwordChanged, setPasswordChanged] = useState(false); // Флаг изменения пароля

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authAxios({
          url: `http://127.0.0.1:8000/users/${id}`,
        });
        setFormData({
          username: response.username,
          full_name: response.full_name,
          role: response.role,
          id: response.id,
          password: "", // Пароль изначально пустой
        });
      } catch (e) {
        showDefaultSnack(enqueueSnackbar, e.response.data.detail, "error");
        console.error(e);
      }
    };
    getUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Отслеживаем изменение пароля
    if (name === "password") {
      setPasswordChanged(value !== "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Формируем данные для отправки
    const dataToSend = {
      username: formData.username,
      full_name: formData.full_name,
      role: formData.role,
    };

    // Добавляем пароль только если он был изменен
    if (passwordChanged) {
      dataToSend.password = formData.password;
    }

    try {
      await authAxios({
        url: `http://127.0.0.1:8000/users/${id}`,
        method: "PUT",
        data: dataToSend,
      });
      showDefaultSnack(
        enqueueSnackbar,
        "Данные пользователя успешно изменены",
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
          Редактирование профиля
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
            fullWidth
            name="password"
            label="Новый пароль"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            helperText="Оставьте пустым, чтобы не изменять пароль"
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/user_list")}
            >
              Отмена
            </Button>
            <Button type="submit" fullWidth variant="contained">
              Сохранить
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
