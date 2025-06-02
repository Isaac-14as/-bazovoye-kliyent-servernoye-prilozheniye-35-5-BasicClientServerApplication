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
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { showDefaultSnack } from "../components/DefaultSnack";

import { authAxios } from "../api/auth-axios";
import { scrollSyles } from "../helpers/styles";

export const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
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

    fetchSuppliers();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "100px",
        minHeight: "calc(100vh - 100px)",
        marginLeft: "240px", // Отступ для бокового меню
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h1">
            Список поставщиков
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/suppliers/create"
          >
            Добавить поставщика
          </Button>
        </Box>

        <TableContainer
          sx={{ overflowY: "auto", height: "72vh", ...scrollSyles }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название компании</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      to={`/suppliers/update/${supplier.id}`}
                      color="primary"
                      aria-label="edit"
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
