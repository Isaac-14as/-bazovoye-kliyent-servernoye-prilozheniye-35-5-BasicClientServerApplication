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
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { authAxios } from "../../api/auth-axios";
import { scrollSyles } from "../../helpers/styles";

export const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  useEffect(() => {
    const getPurchases = async () => {
      try {
        const response = await authAxios({
          url: `http://localhost:8000/purchases/`,
          method: "GET",
        });
        setPurchases(response);
      } catch (e) {
        console.error(e);
      }
    };
    getPurchases();
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
            Список закупок
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/purchases/create"
            startIcon={<AddIcon />}
          >
            Добавить закупку
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
                <TableCell>Менеджер по закупкам</TableCell>
                <TableCell>Общая сумма</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((purchase) => {
                let totalAmount = 0;
                for (let i = 0; i < purchase.items.length; i++) {
                  totalAmount +=
                    purchase.items[i].quantity * purchase.items[i].unit_price;
                }
                return (
                  <TableRow key={purchase.id} hover>
                    <TableCell>{purchase.id}</TableCell>
                    <TableCell>
                      {purchase.purchase_date.slice(0, 10)} (
                      {purchase.purchase_date.slice(11, 16)})
                    </TableCell>
                    <TableCell>{purchase["user_id.full_name"]}</TableCell>
                    <TableCell>{totalAmount} ₽</TableCell>
                    <TableCell>
                      <IconButton
                        component={Link}
                        to={`/purchases/view/${purchase.id}`}
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
