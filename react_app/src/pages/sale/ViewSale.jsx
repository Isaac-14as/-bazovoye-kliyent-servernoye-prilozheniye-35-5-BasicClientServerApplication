import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import dayjs from "dayjs";

export const ViewSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [clientName, setClientName] = useState("");
  const [saleDate, setSaleDate] = useState(new Date());
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем список товаров
        const productsResponse = await authAxios({
          url: `http://localhost:8000/products/`,
          method: "GET",
        });

        console.log(productsResponse);

        setProducts(productsResponse);

        // Загружаем данные продажи, если это редактирование
        if (id) {
          const saleResponse = await authAxios({
            url: `http://localhost:8000/sales/${id}`,
            method: "GET",
          });
          console.log(saleResponse);

          // Предзаполняем форму данными из API
          setClientName(saleResponse.client_name || "");
          setSaleDate(new Date(saleResponse.sale_date));

          // Форматируем позиции для отображения
          const formattedItems = saleResponse.items.map((item) => ({
            ...item,
            product_id: item.product_id.id,
            product_name: item.product_id.name,
            unit: item.product_id.unit,
            price: item.price,
            total: item.quantity * item.price,
            available: item.product_id.current_quantity + item.quantity, // Возвращаем товар в доступные
          }));

          setItems(formattedItems);
        }
      } catch (error) {
        showDefaultSnack(
          enqueueSnackbar,
          error.response?.data?.detail || "Ошибка загрузки данных",
          "error"
        );
      }
    };

    fetchData();
  }, [id]);

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
              {id ? "Просмотр продажи" : "Новая продажа"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                label="Клиент"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                sx={{ flex: 2 }}
                disabled={!!id} // Блокируем редактирование при просмотре
              />

              <DatePicker
                label="Дата продажи"
                disabled
                value={saleDate}
                onChange={(newValue) => setSaleDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} sx={{ flex: 1 }} disabled={!!id} />
                )}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Товары
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Товар</TableCell>
                    <TableCell>Количество</TableCell>
                    <TableCell align="right">Цена</TableCell>
                    <TableCell align="right">Сумма</TableCell>
                    {!id && <TableCell align="right">Действия</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => {
                    const productItem = products.find(
                      (productItem) => productItem.id === item["product_id.id"]
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {productItem.name} ({productItem.unit})
                          {item["product_id.id"]}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item["product_id.selling_price"]} ₽
                        </TableCell>
                        <TableCell align="right">
                          {item["product_id.selling_price"] * item.quantity} ₽
                        </TableCell>
                        {!id && (
                          <TableCell align="right">
                            <IconButton
                              onClick={() =>
                                setItems(items.filter((_, i) => i !== index))
                              }
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {items.length > 0 && (
              <Typography variant="h6" align="right" sx={{ mb: 3 }}>
                Итого:{" "}
                {items.reduce(
                  (sum, item) =>
                    sum + item["product_id.selling_price"] * item.quantity,
                  0
                )}
                ₽
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/sales")}>
                Назад
              </Button>
              {!id && (
                <Button
                  variant="contained"
                  disabled={items.length === 0}
                  onClick={async () => {
                    try {
                      await authAxios.post(`http://localhost:8000/sales/`, {
                        client_name: clientName,
                        sale_date: dayjs(saleDate).format("YYYY-MM-DD"),
                        items: items.map((item) => ({
                          product_id: item.product_id,
                          quantity: item.quantity,
                          price: item.price,
                        })),
                      });
                      showDefaultSnack(
                        enqueueSnackbar,
                        "Продажа успешно создана",
                        "success"
                      );
                      navigate("/sales");
                    } catch (error) {
                      showDefaultSnack(
                        enqueueSnackbar,
                        error.response?.data?.detail ||
                          "Ошибка при создании продажи",
                        "error"
                      );
                    }
                  }}
                >
                  Сохранить
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
