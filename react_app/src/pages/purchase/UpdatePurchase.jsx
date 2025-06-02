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

export const UpdatePurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    purchase_date: dayjs().format("YYYY-MM-DD"),
  });
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    product_id: "",
    quantity: 1,
    unit_price: 0,
  });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const getPurchase = async () => {
      try {
        const response = await authAxios({
          url: `http://127.0.0.1:8000/purchases/${id}`,
          method: "GET",
        });
        setPurchaseData({
          purchase_date: dayjs(response.purchase_date).format("YYYY-MM-DD"),
        });
        // Преобразуем данные из API в наш формат
        const formattedItems = response.items.map((item) => ({
          ...item,
          product_name: item["product_id.name"],
          unit: item["product_id.unit"],
          supplier_id: item["product_id.supplier_id"],
          total: item.quantity * item.unit_price,
        }));
        setItems(formattedItems);
      } catch (e) {
        console.error(e);
        showDefaultSnack(
          enqueueSnackbar,
          e.response?.data?.detail || "Ошибка загрузки закупки",
          "error"
        );
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await authAxios({
          url: `http://127.0.0.1:8000/suppliers/`,
          method: "GET",
        });
        setSuppliers(response);
      } catch (e) {
        showDefaultSnack(enqueueSnackbar, e.response.data.detail, "error");
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
        console.error(e);
        showDefaultSnack(
          enqueueSnackbar,
          e.response?.data?.detail || "Ошибка загрузки товаров",
          "error"
        );
      }
    };

    if (id) {
      getPurchase();
    }
    fetchSuppliers();
    fetchProducts();
  }, [id]);

  const handlePurchaseChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          maxWidth: "1200px",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Закупка {id}
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
              value={purchaseData.purchase_date}
              onChange={handlePurchaseChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Позиции закупки
          </Typography>

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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {item.product_name} ({item.unit})
                      </TableCell>
                      <TableCell>{getSupplierName(item.supplier_id)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit_price} ₽</TableCell>
                      <TableCell align="right">{item.total} ₽</TableCell>
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
              Назад
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
