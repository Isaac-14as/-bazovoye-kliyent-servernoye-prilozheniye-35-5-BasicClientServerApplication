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
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAxios } from "../api/auth-axios";
import { roles } from "../helpers/roles";

export const UserList = ({}) => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await authAxios({
          url: "http://127.0.0.1:8000/users",
          method: "GET",
        });
        setUsers(response);
      } catch (e) {
        console.error(e);
      }
    };
    getUsers();
  }, []);

  if (!users)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <CircularProgress size={100} />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
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
        <Typography variant="h5" component="h1" textAlign="center" gutterBottom>
          Список пользователей
        </Typography>

        <TableContainer sx={{ flex: 1, overflow: "auto" }}>
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
                      to={`/update_user/${user.id}`}
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
