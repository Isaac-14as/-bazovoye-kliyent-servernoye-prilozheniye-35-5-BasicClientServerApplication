import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { authAxios } from "../../api/auth-axios";
import { useSnackbar } from "notistack";
import { showDefaultSnack } from "../../components/DefaultSnack";

export const CreateSupplier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

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

    // Валидация телефона (базовая проверка)
    if (formData.phone && !/^\+?[0-9\s\-()]+$/.test(formData.phone)) {
      showDefaultSnack(
        enqueueSnackbar,
        "Введите корректный номер телефона",
        "error"
      );
      return;
    }

    try {
      await authAxios({
        url: "http://127.0.0.1:8000/suppliers/",
        method: "POST",
        data: formData,
      });
      showDefaultSnack(enqueueSnackbar, "Поставщик успешно создан", "success");
    } catch (e) {
      showDefaultSnack(enqueueSnackbar, e.response.data.detail, "error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "100px",
        // minHeight: "calc(100vh - 100px)",
        marginLeft: "240px", // Отступ для бокового меню
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Добавление нового поставщика
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Название компании"
            name="name"
            value={formData.name}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+79161234567"
            helperText="Формат: +79161234567"
          />

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button variant="outlined" onClick={() => navigate("/suppliers")}>
              Отмена
            </Button>
            <Button type="submit" variant="contained">
              Создать поставщика
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
