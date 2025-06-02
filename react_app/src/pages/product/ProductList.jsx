import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { authAxios } from "../api/auth-axios";
import { scrollSyles } from "../helpers/styles";

export const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await authAxios({
          url: "http://127.0.0.1:8000/products/",
          method: "GET",
        });
        setProducts(response);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "100px",
        minHeight: "calc(100vh - 100px)",
        bgcolor: "background.default",
        p: 3,
        marginLeft: "240px", // Отступ для бокового меню
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" component="h1">
            Список товаров
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products/create"
            startIcon={<AddIcon />}
          >
            Добавить товар
          </Button>
        </Box>

        <TableContainer
          sx={{
            overflowY: "auto",
            height: "72vh",
            ...scrollSyles,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Наименование</TableCell>
                <TableCell>Поставщик</TableCell>
                <TableCell>Ед. измерения</TableCell>
                <TableCell align="right">Цена закупки</TableCell>
                <TableCell align="right">Цена продажи</TableCell>
                <TableCell align="right">Остаток</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product["supplier_id.name"] || "-"}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell align="right">
                    {product.purchase_price} ₽
                  </TableCell>
                  <TableCell align="right">{product.selling_price} ₽</TableCell>
                  <TableCell align="right">
                    {product.current_quantity}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/products/update/${product.id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
