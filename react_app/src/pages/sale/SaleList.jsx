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

import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { authAxios } from "../../api/auth-axios";
import { scrollSyles } from "../../helpers/styles";

export const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getSales = async () => {
      try {
        const response = await authAxios({
          url: `http://localhost:8000/sales/`,
          method: "GET",
        });
        setSales(response);
      } catch (e) {
        console.error(e);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await authAxios({
          url: `http://localhost:8000/products/`,
          method: "GET",
        });
        setProducts(response);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProducts();
    getSales();
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
            Список продаж
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/sales/create"
            startIcon={<AddIcon />}
          >
            Добавить продажу
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
                <TableCell>Дата/время</TableCell>
                <TableCell>Продавец</TableCell>
                <TableCell>Общая сумма</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => {
                let totalAmount = 0;
                for (let i = 0; i < sale.items.length; i++) {
                  totalAmount +=
                    sale.items[i].quantity *
                    products.find(
                      (item) => item.id === sale.items[i]["product_id.id"]
                    ).selling_price;
                }
                return (
                  <TableRow key={sale.id} hover>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>
                      {sale.sale_date.slice(0, 10)} (
                      {sale.sale_date.slice(11, 16)})
                    </TableCell>
                    <TableCell>{sale["user_id.full_name"]}</TableCell>
                    <TableCell>{totalAmount} ₽</TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/sales/view/${sale.id}`}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
