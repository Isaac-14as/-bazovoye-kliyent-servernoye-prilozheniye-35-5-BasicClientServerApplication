import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  Alert,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { showDefaultSnack } from "../../components/DefaultSnack";

import { authAxios } from "../../api/auth-axios";

export const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    selling_price: 0,
    current_quantity: 0,
    supplier_id: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Загрузка данных товара
    const fetchProductData = async () => {
      try {
        const response = await authAxios({
          url: `http://localhost:8000/products/${id}`,
          method: "GET",
        });
        setFormData({
          name: response.name,
          unit: response.unit,
          selling_price: response.selling_price,
          current_quantity: response.current_quantity,
          supplier_id: response.supplier_id,
        });
      } catch (e) {
        console.error(e);
        showDefaultSnack(enqueueSnackbar, e.response.data.detail, "error");
      }
    };

    // Загрузка списка поставщиков
    const fetchSuppliers = async () => {
      try {
        const response = await authAxios({
          url: `http://localhost:8000/suppliers/`,
          method: "GET",
        });
        setSuppliers(response);
      } catch (e) {
        console.error(e);
        showDefaultSnack(enqueueSnackbar, e.response.data.detail, "error");
      }
    };

    fetchProductData();
    fetchSuppliers();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация цен
    if (
      parseFloat(formData.selling_price) <= parseFloat(formData.purchase_price)
    ) {
      showDefaultSnack(
        enqueueSnackbar,
        "Цена продажи должна быть больше цены закупки",
        "error"
      );
      return;
    }

    try {
      await authAxios({
        url: `http://localhost:8000/products/${id}`,
        method: "PUT",
        data: {
          name: formData.name,
          unit: formData.unit,
          selling_price: formData.selling_price,
          current_quantity: Number(formData.current_quantity),
          supplier_id: formData.supplier_id,
        },
      });
      showDefaultSnack(enqueueSnackbar, "Товар успешно обновлен", "success");
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
          Редактирование товара
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Наименование товара"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Единица измерения"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            helperText="Например: банка 5л, кг, шт"
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              required
              fullWidth
              type="number"
              label="Цена продажи"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>

          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Количество на складе"
            name="current_quantity"
            value={formData.current_quantity}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Поставщик</InputLabel>
            <Select
              name="supplier_id"
              value={formData.supplier_id}
              label="Поставщик"
              onChange={handleChange}
              required
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button variant="outlined" onClick={() => navigate("/products")}>
              Отмена
            </Button>
            <Button type="submit" variant="contained">
              Сохранить изменения
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
