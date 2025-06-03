import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { authAxios } from "../../api/auth-axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { showDefaultSnack } from "../../components/DefaultSnack";
import ruLocale from "date-fns/locale/ru";

export const CreateSale = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [clientName, setClientName] = useState("");
  const [saleDate, setSaleDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product_id: "",
    quantity: 1,
    price: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await authAxios({
          url: "http://127.0.0.1:8000/products/",
          method: "GET",
        });
        setProducts(response.filter((p) => p.current_quantity > 0));
      } catch (error) {
        showDefaultSnack(enqueueSnackbar, "Ошибка загрузки товаров", "error");
      }
    };
    fetchProducts();
  }, []);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "product_id" && value) {
      const product = products.find((p) => p.id === parseInt(value));
      if (product) {
        setCurrentItem((prev) => ({
          ...prev,
          price: product.selling_price,
        }));
      }
    }
  };

  const addItem = () => {
    const product = products.find(
      (p) => p.id === parseInt(currentItem.product_id)
    );
    if (!product) {
      showDefaultSnack(enqueueSnackbar, "Выберите товар", "error");
      return;
    }

    if (product.current_quantity < currentItem.quantity) {
      showDefaultSnack(
        enqueueSnackbar,
        `Недостаточно товара (доступно: ${product.current_quantity})`,
        "error"
      );
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        ...currentItem,
        product_id: parseInt(currentItem.product_id),
        product_name: product.name,
        unit: product.unit,
        available: product.current_quantity,
        total: currentItem.quantity * currentItem.price,
      },
    ]);

    setCurrentItem({
      product_id: "",
      quantity: 1,
      price: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      showDefaultSnack(enqueueSnackbar, "Добавьте хотя бы один товар", "error");
      return;
    }

    try {
      await authAxios({
        url: `http://127.0.0.1:8000/sales/`,
        method: "POST",
        data: {
          client_name: clientName,
          sale_date: saleDate.toISOString().split("T")[0],
          items: items.map((item) => ({
            product_id: item.product_id,
            quantity: parseInt(item.quantity),
          })),
        },
      });

      showDefaultSnack(enqueueSnackbar, "Продажа создана успешно", "success");
    } catch (error) {
      showDefaultSnack(
        enqueueSnackbar,
        error.response?.data?.detail || "Ошибка при создании продажи",
        "error"
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "100px",
          marginLeft: "240px",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Box sx={{ p: 3, width: "900px" }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Новая продажа
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                label="Клиент (необязательно)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                sx={{ flex: 2 }}
              />

              <DatePicker
                label="Дата продажи"
                disabled
                value={saleDate}
                onChange={(newValue) => setSaleDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} sx={{ flex: 1 }} />
                )}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Товары
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <FormControl sx={{ flex: 2 }}>
                <InputLabel>Товар *</InputLabel>
                <Select
                  value={currentItem.product_id}
                  onChange={handleItemChange}
                  name="product_id"
                  label="Товар *"
                  required
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} ({product.unit})
                      <Chip
                        label={`Доступно: ${product.current_quantity}`}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Количество"
                type="number"
                name="quantity"
                value={currentItem.quantity}
                onChange={handleItemChange}
                inputProps={{ min: 1 }}
                sx={{ flex: 1 }}
              />

              <TextField
                disabled
                label="Цена"
                type="number"
                name="price"
                value={currentItem.price}
                onChange={handleItemChange}
                inputProps={{ step: "0.01", min: "0.01" }}
                sx={{ flex: 1 }}
              />

              <Button
                variant="contained"
                onClick={addItem}
                startIcon={<AddIcon />}
                sx={{ flex: 0.5 }}
              >
                Добавить
              </Button>
            </Box>

            {items.length > 0 && (
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell>Количество</TableCell>
                      <TableCell align="right">Цена</TableCell>
                      <TableCell align="right">Сумма</TableCell>
                      <TableCell align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.product_name} ({item.unit})
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.price.toFixed(2)} ₽
                        </TableCell>
                        <TableCell align="right">
                          {item.total.toFixed(2)} ₽
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() =>
                              setItems(items.filter((_, i) => i !== index))
                            }
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/sales")}>
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={items.length === 0}
                onClick={handleSubmit}
              >
                Оформить продажу
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
