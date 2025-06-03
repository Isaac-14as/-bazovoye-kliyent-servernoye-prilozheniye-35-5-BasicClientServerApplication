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
  Divider,
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
import { showDefaultSnack } from "../../components/DefaultSnack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { authAxios } from "../../api/auth-axios";
import dayjs from "dayjs";

export const CreatePurchase = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState({
    purchase_date: dayjs().format("YYYY-MM-DD"),
  });
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product_id: "",
    quantity: 1,
    unit_price: 0,
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await authAxios({
          url: `http://127.0.0.1:8000/suppliers/`,
          method: "GET",
        });
        setSuppliers(response);
      } catch (e) {
        showDefaultSnack(
          enqueueSnackbar,
          e.response?.data?.detail || "Ошибка загрузки поставщиков",
          "error"
        );
        console.error(e);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await authAxios({
          url: `http://127.0.0.1:8000/products/`,
          method: "GET",
        });
        setProducts(response);
      } catch (e) {
        showDefaultSnack(
          enqueueSnackbar,
          e.response?.data?.detail || "Ошибка загрузки товаров",
          "error"
        );
        console.error(e);
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchaseDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Автоподстановка цены при выборе товара
    if (name === "product_id" && value) {
      const selectedProduct = products.find((p) => p.id === value);
      if (selectedProduct) {
        setCurrentItem((prev) => ({
          ...prev,
          unit_price: selectedProduct.selling_price,
        }));
      }
    }
  };

  const addItem = () => {
    if (
      !currentItem.product_id ||
      currentItem.quantity <= 0 ||
      currentItem.unit_price <= 0
    ) {
      showDefaultSnack(
        enqueueSnackbar,
        "Заполните все поля позиции корректно",
        "error"
      );
      return;
    }

    const product = products.find((p) => p.id === currentItem.product_id);
    const supplier = suppliers.find((s) => s.id === product.supplier_id);

    setItems((prev) => [
      ...prev,
      {
        ...currentItem,
        product_name: product?.name || "",
        unit: product?.unit || "",
        supplier_id: product?.supplier_id || "",
        supplier_name: supplier?.name || "",
        total: currentItem.quantity * currentItem.unit_price,
      },
    ]);
    setCurrentItem({
      product_id: "",
      quantity: 1,
      unit_price: 0,
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      showDefaultSnack(
        enqueueSnackbar,
        "Добавьте хотя бы одну позицию",
        "error"
      );
      return;
    }

    try {
      const payload = {
        purchase_date: purchaseDate.purchase_date,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
      };

      console.log(payload);

      const response = await authAxios({
        url: "http://127.0.0.1:8000/purchases/",
        method: "POST",
        data: payload,
      });
      showDefaultSnack(enqueueSnackbar, "Закупка успешно создана", "success");
      //   navigate("/purchases");
    } catch (error) {
      console.error("Error creating purchase:", error);
      showDefaultSnack(
        enqueueSnackbar,
        error.response?.data?.detail || "Ошибка при создании закупки",
        "error"
      );
    }
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : "Неизвестный поставщик";
  };

  return (
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
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Создание новой закупки
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              disabled
              label="Дата закупки"
              type="date"
              name="purchase_date"
              value={purchaseDate.purchase_date}
              onChange={handlePurchaseChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Позиции закупки
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 3 }}>
              <InputLabel>Товар *</InputLabel>
              <Select
                name="product_id"
                value={currentItem.product_id}
                label="Товар *"
                onChange={handleItemChange}
                required
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} ({product.unit}) - {product.selling_price} ₽
                    {product.supplier_id && (
                      <Chip
                        label={getSupplierName(product.supplier_id)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              sx={{ flex: 1 }}
              type="number"
              label="Количество *"
              name="quantity"
              value={currentItem.quantity}
              onChange={handleItemChange}
              inputProps={{ min: 1 }}
              required
            />

            <TextField
              sx={{ flex: 1 }}
              type="number"
              label="Цена за единицу *"
              name="unit_price"
              value={currentItem.unit_price}
              onChange={handleItemChange}
              inputProps={{ min: 0.01, step: 0.01 }}
              required
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addItem}
              sx={{ flex: 0.5 }}
            >
              Добавить
            </Button>
          </Box>

          {items.length > 0 && (
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell>Поставщик</TableCell>
                    <TableCell align="right">Кол-во</TableCell>
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
                      <TableCell>{item.supplier_name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit_price} ₽</TableCell>
                      <TableCell align="right">{item.total} ₽</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => removeItem(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      <strong>Итого:</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>
                        {items.reduce((sum, item) => sum + item.total, 0)} ₽
                      </strong>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/purchases")}>
              Отмена
            </Button>
            <Button
              onClick={() => handleSubmit()}
              variant="contained"
              disabled={items.length === 0}
            >
              Создать закупку
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
