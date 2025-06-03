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
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAxios } from "../../api/auth-axios";
import { roles } from "../../helpers/roles";
import { scrollSyles } from "../../helpers/styles";

export const UserList = ({}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await authAxios({
          url: `http://localhost:8000/users/`,
          method: "GET",
        });
        setUsers(response);
      } catch (e) {
        console.error(e);
      }
    };
    getUsers();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: "100px",
        minHeight: "calc(100vh - 100px)",
        marginLeft: "240px", // Отступ для бокового меню
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" component="h1">
            Список пользователей
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/users/create"
            startIcon={<AddIcon />}
          >
            Добавить пользователя
          </Button>
        </Box>

        <TableContainer
          sx={{ overflowY: "auto", height: "72vh", ...scrollSyles }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Логин</TableCell>
                <TableCell>ФИО</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{roles[user.role]}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      to={`/users/update/${user.id}`}
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
